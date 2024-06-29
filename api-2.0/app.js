'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const bodyParser = require('body-parser');
const http = require('http');
const util = require('util');
const express = require('express');
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const constants = require('./config/constants.json');

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;

const helper = require('./app/helper');
const invoke = require('./app/invoke');
const query = require('./app/query');

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
    secret: 'thisismysecret'
}).unless({
    path: ['/users/register', '/users/login']
}));
app.use(bearerToken());

logger.level = 'debug';

app.use((req, res, next) => {
    logger.debug('New req for %s', req.originalUrl);
    if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/users/login') >= 0 || req.originalUrl.indexOf('/register') >= 0) {
        return next();
    }
    var token = req.token;
    jwt.verify(token, app.get('secret'), (err, decoded) => {
        if (err) {
            console.log(`Error ================:${err}`);
            res.send({
                success: false,
                message: 'Failed to authenticate token. Make sure to include the ' +
                    'token returned from /users call in the authorization header ' +
                    ' as a Bearer token'
            });
            return;
        } else {
            req.username = decoded.username;
            req.orgname = decoded.orgName;
            logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
            return next();
        }
    });
});

var server = http.createServer(app).listen(port, function () { console.log(`Server started on ${port}`); });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

// Register and enroll user
app.post('/users/register', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    logger.debug('End point : /users/register');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, app.get('secret'));

    let response = await helper.getRegisteredUser(username, orgName, true);

    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        response.token = token;
        res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }

});

// Login and get jwt
app.post('/users/login', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    logger.debug('End point : /users/login');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName
    }, app.get('secret'));

    let isUserRegistered = await helper.isUserRegistered(username, orgName);

    if (isUserRegistered) {
        res.json({ success: true, message: { token: token } });

    } else {
        res.json({ success: false, message: `User with username ${username} is not registered with ${orgName}, Please register first.` });
    }
});

// Create document/asset
app.post('/documents', async function (req, res) {
    try {
        logger.debug('==================== CREATE DOCUMENT ==================');
        var documentData = req.body.documentData;
        var fcn = 'CreateDocument';
        let args = [documentData];
        
        let message = await invoke.invokeTransaction('mychannel', 'document_cc', fcn, args, req.username, req.orgname);
        logger.debug(`Transaction result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Get document by ID
app.get('/documents/:documentID', async function (req, res) {
    try {
        logger.debug('==================== GET DOCUMENT BY ID ==================');
        var documentID = req.params.documentID;
        var fcn = 'GetDocumentById';
        let args = [documentID];
        
        let message = await query.query('mychannel', 'document_cc', args, fcn, req.username, req.orgname);
        logger.debug(`Query result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Transfer document/asset
app.post('/documents/transfer', async function (req, res) {
    try {
        logger.debug('==================== TRANSFER DOCUMENT ==================');
        var documentID = req.body.documentID;
        var newOwner = req.body.newOwner;
        var fcn = 'TransferDocument';
        let args = [documentID, newOwner];
        
        let message = await invoke.invokeTransaction('mychannel', 'document_cc', fcn, args, req.username, req.orgname);
        logger.debug(`Transaction result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Register user
app.post('/users/register', async function (req, res) {
    try {
        logger.debug('==================== REGISTER USER ==================');
        var username = req.body.username;
        var publicKey = req.body.publicKey;
        var fcn = 'RegisterUser';
        let args = [username, publicKey];
        
        let message = await invoke.invokeTransaction('mychannel', 'document_cc', fcn, args, req.username, req.orgname);
        logger.debug(`Transaction result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Register transaction
app.post('/transactions', async function (req, res) {
    try {
        logger.debug('==================== REGISTER TRANSACTION ==================');
        var transactionID = req.body.transactionID;
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        var amount = req.body.amount;
        var timestamp = req.body.timestamp;
        var fcn = 'RegisterTransaction';
        let args = [transactionID, sender, receiver, amount, timestamp];
        
        let message = await invoke.invokeTransaction('mychannel', 'document_cc', fcn, args, req.username, req.orgname);
        logger.debug(`Transaction result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Query transaction by ID
app.get('/transactions/:transactionID', async function (req, res) {
    try {
        logger.debug('==================== QUERY TRANSACTION ==================');
        var transactionID = req.params.transactionID;
        var fcn = 'QueryTransaction';
        let args = [transactionID];
        
        let message = await query.query('mychannel', 'document_cc', args, fcn, req.username, req.orgname);
        logger.debug(`Query result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Create asset with buyer and seller
app.post('/assets', async function (req, res) {
    try {
        logger.debug('==================== CREATE ASSET WITH BUYER AND SELLER ==================');
        var assetData = req.body.assetData;
        var buyer = req.body.buyer;
        var seller = req.body.seller;
        var fcn = 'CreateAssetWithBuyerAndSeller';
        let args = [assetData, buyer, seller];
        
        let message = await invoke.invokeTransaction('mychannel', 'document_cc', fcn, args, req.username, req.orgname);
        logger.debug(`Transaction result: ${message}`);
        res.send({ success: true, message: message });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

app.get('/qscc/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        var channelName = req.params.channelName;
        var chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = req.query.args;
        let fcn = req.query.fcn;

        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn : ' + fcn);
        logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        console.log('args==========', args);
        args = args.replace(/'/g, '"');
        args = JSON.parse(args);
        logger.debug(args);

        let response_payload = await qscc.qscc(channelName, chaincodeName, args, fcn, req.username, req.orgname);

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload);
    }
});
