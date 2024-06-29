const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require("path");
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util');

const helper = require('./helper');
const { blockListener, contractListener } = require('./Listeners');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        const ccp = await helper.getCCP(org_name);
        console.log("==================", channelName, chaincodeName, fcn, args, username, org_name);

        const walletPath = await helper.getWalletPath(org_name);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true);
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        };

        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        let result;
        let message;

        switch (fcn) {
            case "CreateDocument":
                result = await contract.submitTransaction('DocumentContract:' + fcn, args[0]);
                console.log(result.toString());
                result = { txid: result.toString() };
                break;
            case "TransferDocument":
                result = await contract.submitTransaction('DocumentContract:' + fcn, args[0], args[1]);
                console.log(result.toString());
                result = { txid: result.toString() };
                break;
            case "RegisterUser":
                result = await contract.submitTransaction('DocumentContract:' + fcn, args[0], args[1]);
                console.log(result.toString());
                result = { txid: result.toString() };
                break;
            case "RegisterTransaction":
                result = await contract.submitTransaction('DocumentContract:' + fcn, args[0], args[1], args[2], args[3], args[4]);
                console.log(result.toString());
                result = { txid: result.toString() };
                break;
            case "CreateAssetWithBuyerAndSeller":
                result = await contract.submitTransaction('DocumentContract:' + fcn, args[0], args[1], args[2]);
                console.log(result.toString());
                result = { txid: result.toString() };
                break;
            default:
                throw new Error(`Function ${fcn} not defined in the chaincode`);
        }

        await gateway.disconnect();

        let response = {
            message: message,
            result
        };

        return response;

    } catch (error) {
        console.log(`Getting error: ${error}`);
        return error.message;
    }
}

exports.invokeTransaction = invokeTransaction;
