import React, { useState } from 'react';
import axios from 'axios';

function AddAsset() {
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
    const assetData = {
      id,
      tradeDate,
      buyer,
      seller,
      stockCode,
      quantity,
      price
    };

    axios.post('http://localhost:4000/assets', assetData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      alert(`Transaction added successfully! _id: ${response.data.id}`);
    })
    .catch(error => {
      console.error(error);
      alert('Error adding transaction');
    });
  };

  return (
    <div className="page-container">
      <h1>Añadir Activo</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID del Activo</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tradeDate">Fecha de Tradeo</label>
          <input
            type="date"
            id="tradeDate"
            value={tradeDate}
            onChange={(e) => setTradeDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyer">Nombre del Comprador</label>
          <input
            type="text"
            id="buyer"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller">Nombre del Vendedor</label>
          <input
            type="text"
            id="seller"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stockCode">Código del Activo</label>
          <input
            type="text"
            id="stockCode"
            value={stockCode}
            onChange={(e) => setStockCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Cantidad</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Añadir Activo</button>
      </form>
    </div>
  );
}

export default AddAsset;
