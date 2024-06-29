// src/pages/TransferDocument.js
import React, { useState } from 'react';
import axios from 'axios';

function TransferDocument({ token }) {
  const [documentID, setDocumentID] = useState('');
  const [buyer, setBuyer] = useState('');
  const [id, setId] = useState('');
  const [tradeDate, setTradeDate] = useState('');
  const [seller, setSeller] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [documentData, setDocumentData] = useState({
    id: '',
    tradeDate: '',
    buyer: '',
    seller: '',
    stockCode: '',
    quantity: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocumentData({
      ...documentData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transferData = {
      ...documentData,
      id: documentID,
      buyer: buyer
    };

    axios.post('http://localhost:4000/documents/transfer', transferData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      alert('Documento transferido con éxito');
    })
    .catch(error => {
      console.error(error);
      alert('Error al transferir el documento');
    });
  };

  return (
    <div className="page-container">
      <h1>Transferir Documento</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="documentID">ID del Documento</label>
          <input
            type="text"
            id="documentID"
            name="id"
            value={documentID}
            onChange={(e) => setDocumentID(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyer">Nuevo Propietario</label>
          <input
            type="text"
            id="buyer"
            name="buyer"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
          />
        </div>
        <button type="submit">Transferir Documento</button>
      </form>
    </div>
  );
}

export default TransferDocument;
