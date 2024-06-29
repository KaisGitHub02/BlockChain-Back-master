// src/pages/GetTransferDocument.js

import React, { useState } from 'react';
import axios from 'axios';
import './GetTransferDocument.css';

function GetTransferDocument({ token, currentUser }) {
  const [documentID, setDocumentID] = useState('');
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  const [id, setId] = useState('');
  const [tradeDate, setTradeDate] = useState('');
  const [buyer, setBuyer] = useState('');
  const [stockCode, setStockCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:4000/documents/${documentID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;
      setDocument(data);
      setError(null);

      // Populate the state with the document data
      setId(data.id || '');
      setTradeDate(data.tradeDate || '');
      setBuyer(data.buyer || '');
      setStockCode(data.stockCode || '');
    } catch (err) {
      console.error(err);
      setDocument(null);
      setError('No se encontró el documento.');
    }
  };

  return (
    <div className="page-container">
      <h1>Consultar Documento Transferido</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="documentID">ID del Documento</label>
          <input
            type="text"
            id="documentID"
            value={documentID}
            onChange={(e) => setDocumentID(e.target.value)}
            required
          />
        </div>
        <button type="submit">Consultar Documento</button>
      </form>
      {document && (
        <div className="document-details">
          <h2>Detalles del Documento</h2>
          <table className="result-table">
            <tbody>
              <tr>
                <td>ID:</td>
                <td>{id}</td>
              </tr>
              <tr>
                <td>Comprador:</td>
                <td>{buyer}</td>
              </tr>
              <tr>
                <td>Fecha de Añadido:</td>
                <td>{new Date(tradeDate).toLocaleDateString()}</td>
              </tr>
              {currentUser === buyer && (
                <>
                  <tr>
                    <td>Hash del Contenido (Stock Code):</td>
                    <td>{stockCode}</td>
                  </tr>
                  <tr>
                    <td>Imagen:</td>
                    <td><img src={`https://gateway.pinata.cloud/ipfs/${stockCode}`} alt="Documento Imagen" className="document-image" /></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default GetTransferDocument;
