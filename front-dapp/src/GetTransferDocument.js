// src/pages/GetTransferDocument.js

import React, { useState } from 'react';
import axios from 'axios';
import './GetTransferDocument.css';

function GetTransferDocument() {
  const [documentID, setDocumentID] = useState('');
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:4000/documents/${documentID}`);

      setDocument(response.data);
      setError(null);
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
                <td>{document._id}</td>
              </tr>
              <tr>
                <td>Propietario:</td>
                <td>{document.owner}</td>
              </tr>
              <tr>
                <td>Fecha de Añadido:</td>
                <td>{new Date(document.addedAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Hash del Contenido:</td>
                <td>{document.contentHash}</td>
              </tr>
              <tr>
                <td>Imagen:</td>
                <td><img src={`https://gateway.pinata.cloud/ipfs/${document.contentHash}`} alt="Documento Imagen" className="document-image" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default GetTransferDocument;
