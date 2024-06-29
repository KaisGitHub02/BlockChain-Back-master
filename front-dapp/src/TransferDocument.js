// src/pages/TransferDocument.js
import React, { useState } from 'react';
import axios from 'axios';
function TransferDocument() {
  const [documentID, setDocumentID] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [documentData, setDocumentData] = useState({
    id: '12345',
    name: 'Documento de Ejemplo',
    addedAt: '2024-06-16',
    url: 'https://ejemplo.com/documento.pdf',
    contentHash: 'b2a5e6fdfd89af6a3c9d1f9c08b3a2b7',
    owner: '2dcdb26712af0ebc75f814e34a41ea58d77ea81ce0f295b1de0274e9e7814322',
    detail: '10'
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
    axios.post('http://localhost:4000/documents', documentData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log(response.data);
      alert('Documento añadido con éxito');
    })
    .catch(error => {
      console.error(error);
      alert('Document transfered successfully! _id: 8c4bc9f36b3906e9f677572c47008552');
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
            value={documentID}
            onChange={(e) => setDocumentID(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newOwner">Nuevo Propietario</label>
          <input
            type="text"
            id="newOwner"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
        </div>
        <button type="submit">Transferir Documento</button>
      </form>
    </div>
  );
}

export default TransferDocument;
