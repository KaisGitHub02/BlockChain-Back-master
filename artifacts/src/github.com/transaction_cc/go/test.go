package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/common/flogging"
)

// DocumentContract provides functions for managing documents and P2P assets
type DocumentContract struct {
	contractapi.Contract
}

var logger = flogging.MustGetLogger("document_cc")

// Document describes basic details of a document/asset
type Document struct {
	ID        string  `json:"id"`
	TradeDate string  `json:"trade_date"`
	Buyer     string  `json:"buyer"`
	Seller    string  `json:"seller"`
	StockCode string  `json:"stock_code"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

// User describes basic details of a user
type User struct {
	Username  string `json:"username"`
	PublicKey string `json:"publicKey"`
}

// Transaction describes basic details of a transaction
type Transaction struct {
	ID        string `json:"id"`
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Amount    int    `json:"amount"`
	Timestamp uint64 `json:"timestamp"`
}

// CreateDocument issues a new document/asset to the world state with given details.
func (s *DocumentContract) CreateDocument(ctx contractapi.TransactionContextInterface, documentData string) (string, error) {
	if len(documentData) == 0 {
		return "", fmt.Errorf("Please pass the correct document data")
	}

	var document Document
	err := json.Unmarshal([]byte(documentData), &document)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshaling document. %s", err.Error())
	}

	documentAsBytes, err := json.Marshal(document)
	if err != nil {
		return "", fmt.Errorf("Failed while marshaling document. %s", err.Error())
	}

	err = ctx.GetStub().PutState(document.ID, documentAsBytes)
	if err != nil {
		return "", fmt.Errorf("Failed to put state. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), nil
}

// GetDocumentById returns the document/asset stored in the world state with given id.
func (s *DocumentContract) GetDocumentById(ctx contractapi.TransactionContextInterface, documentID string) (*Document, error) {
	if len(documentID) == 0 {
		return nil, fmt.Errorf("Please provide correct document ID")
	}

	documentAsBytes, err := ctx.GetStub().GetState(documentID)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if documentAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", documentID)
	}

	document := new(Document)
	err = json.Unmarshal(documentAsBytes, document)
	if err != nil {
		return nil, fmt.Errorf("Failed to unmarshal document. %s", err.Error())
	}

	return document, nil
}

// TransferDocument updates the owner field of document/asset with given id in world state.
func (s *DocumentContract) TransferDocument(ctx contractapi.TransactionContextInterface, documentID, newOwner string) error {
	document, err := s.GetDocumentById(ctx, documentID)
	if err != nil {
		return err
	}

	document.Seller = newOwner
	documentAsBytes, err := json.Marshal(document)
	if err != nil {
		return fmt.Errorf("Failed while marshaling document. %s", err.Error())
	}

	return ctx.GetStub().PutState(documentID, documentAsBytes)
}

// RegisterUser registers a new user in the network
func (s *DocumentContract) RegisterUser(ctx contractapi.TransactionContextInterface, username, publicKey string) error {
	user := User{Username: username, PublicKey: publicKey}
	userAsBytes, err := json.Marshal(user)
	if err != nil {
		return fmt.Errorf("Failed to marshal user: %s", err.Error())
	}
	return ctx.GetStub().PutState(username, userAsBytes)
}

// QueryTransaction queries a transaction by its ID
func (s *DocumentContract) QueryTransaction(ctx contractapi.TransactionContextInterface, transactionID string) (*Transaction, error) {
	if len(transactionID) == 0 {
		return nil, fmt.Errorf("Please provide correct transaction ID")
	}
	transactionAsBytes, err := ctx.GetStub().GetState(transactionID)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %s", err.Error())
	}
	if transactionAsBytes == nil {
		return nil, fmt.Errorf("Transaction %s does not exist", transactionID)
	}
	transaction := new(Transaction)
	err = json.Unmarshal(transactionAsBytes, transaction)
	if err != nil {
		return nil, fmt.Errorf("Failed to unmarshal transaction: %s", err.Error())
	}
	return transaction, nil
}

// CreateAssetWithBuyerAndSeller creates an asset with specified buyer and seller
func (s *DocumentContract) CreateAssetWithBuyerAndSeller(ctx contractapi.TransactionContextInterface, assetData, buyer, seller string) (string, error) {
	if len(assetData) == 0 || len(buyer) == 0 || len(seller) == 0 {
		return "", fmt.Errorf("Please provide correct asset data, buyer and seller")
	}

	var asset Document
	err := json.Unmarshal([]byte(assetData), &asset)
	if err != nil {
		return "", fmt.Errorf("Failed while unmarshaling asset. %s", err.Error())
	}

	asset.Seller = seller // Initially owned by the seller
	assetAsBytes, err := json.Marshal(asset)
	if err != nil {
		return "", fmt.Errorf("Failed while marshaling asset. %s", err.Error())
	}

	err = ctx.GetStub().PutState(asset.ID, assetAsBytes)
	if err != nil {
		return "", fmt.Errorf("Failed to put state. %s", err.Error())
	}

	return ctx.GetStub().GetTxID(), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(DocumentContract))
	if err != nil {
		fmt.Printf("Error creating document chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting document chaincode: %s", err.Error())
	}
}
