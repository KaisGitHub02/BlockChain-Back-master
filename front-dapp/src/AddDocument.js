import React, { useState } from 'react';
import axios from 'axios';
import './AddDocument.css';

function AddDocument({ token }) {
  const [id, setId] = useState('');
  const [tradeDate, setTradeDate] = useState('');
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [txid, setTxid] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !tradeDate || !stockCode || !seller || !price) {
      alert('Please fill in all fields.');
      return;
    }
    const data = {
      id: id,
      tradeDate: tradeDate,
      url: url,
      stockCode: stockCode,
      seller: seller,
      price: parseFloat(price),
    };
    axios.post('http://localhost:4000/documents', {
      fcn: 'CreateDocument',
      chaincodeName: 'document_cc',
      channelName: 'mychannel',
      args: [JSON.stringify(data)],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((response) => {
      console.log(response);
      alert('Documento añadido con éxito! TxID: ' + response.data.result.result.txid);
      setId('');
      setTradeDate('');
      setStockCode('');
      setSeller('');
      setQuantity(1);
      setSeller('');
      setPrice('');
    })
    .catch((error) => {
      console.error(error);
      alert('Error al añadir el documento');
    });
  };

  return (
    <div className="page-container">
      <h1>Añadir Documento</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID del Documento</label>
          <input
            type="text"
            id="id"
            name="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tradeDate">Fecha de Añadido</label>
          <input
            type="date"
            id="tradeDate"
            name="tradeDate"
            value={tradeDate}
            onChange={(e) => setTradeDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stockCode">Hash del Contenido</label>
          <input
            type="text"
            id="stockCode"
            name="stockCode"
            value={stockCode}
            onChange={(e) => setStockCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller">Propietario</label>
          <input
            type="text"
            id="seller"
            name="seller"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Añadir Documento</button>
      </form>
    </div>
  );
}

export default AddDocument;
