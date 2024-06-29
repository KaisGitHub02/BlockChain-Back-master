import React, { useState } from 'react';
import axios from 'axios';

function GetDocument({ token }) {
  const [documentID, setDocumentID] = useState('');
  const [document, setDocument] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:4000/documents/${documentID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setDocument(response.data);
        alert(`Transaction found: \nTxID: ${response.data._id}\nTrade Date: ${response.data.trade_date}\nBuyer: ${response.data.buyer}\nSeller: ${response.data.seller}\nAsset Code: ${response.data.asset_code}\nQuantity: ${response.data.quantity}\nPrice: ${response.data.price}`);
      } else {
        setDocument(null);
        alert('Transaction does not exist');
      }
    } catch (err) {
      setDocument(null);
      alert('Transaction does not exist');
    }
  };

  return (
    <div className="query-transaction-container">
      <form onSubmit={handleSubmit}>
        <h1>Query Transaction</h1>
        <div className="form-group">
          <label htmlFor="id">Transaction ID</label>
          <input
            type="text"
            id="id"
            value={documentID}
            onChange={(e) => setDocumentID(e.target.value)}
            required
          />
        </div>
        <button type="submit">Query</button>
      </form>
    </div>
  );
}

export default GetDocument;
