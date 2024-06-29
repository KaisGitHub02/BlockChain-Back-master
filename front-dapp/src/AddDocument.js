import React, { useState } from 'react';
import axios from 'axios';
import './AddDocument.css';

function AddDocument({ token }) {
  const [documentData, setDocumentData] = useState({
    id: '',
    name: '',
    addedAt: '',
    url: '',
    contentHash: '',
    owner: '',
    detail: ''
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
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data);
      alert(`Documento añadido con éxito! _id: ${response.data.id}`);
    })
    .catch(error => {
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
            value={documentData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={documentData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="addedAt">Fecha de Añadido</label>
          <input
            type="date"
            id="addedAt"
            name="addedAt"
            value={documentData.addedAt}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            name="url"
            value={documentData.url}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contentHash">Hash del Contenido</label>
          <input
            type="text"
            id="contentHash"
            name="contentHash"
            value={documentData.contentHash}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="owner">Propietario</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={documentData.owner}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="detail">Detalle</label>
          <input
            type="text"
            id="detail"
            name="detail"
            value={documentData.detail}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Añadir Documento</button>
      </form>
    </div>
  );
}

export default AddDocument;
