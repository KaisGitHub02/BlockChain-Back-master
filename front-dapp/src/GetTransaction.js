// src/pages/GetTransaction.js
import React, { useState } from 'react';

function GetTransaction() {
  const [transactionID, setTransactionID] = useState('');
  const [transaction, setTransaction] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para consultar la transacción en el backend
    console.log('Consultando transacción con ID:', transactionID);
    // Simulación de datos recibidos
    setTransaction({
      id: transactionID,
      sender: 'Usuario Ejemplo',
      receiver: 'Usuario Receptor',
      amount: 100,
      timestamp: '2024-06-16T10:00:00'
    });
  };

  return (
    <div className="page-container">
      <h1>Consultar Transacción</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transactionID">ID de la Transacción</label>
          <input
            type="text"
            id="transactionID"
            value={transactionID}
            onChange={(e) => setTransactionID(e.target.value)}
          />
        </div>
        <button type="submit">Consultar Transacción</button>
      </form>
      {transaction && (
        <div className="transaction-details">
          <h2>Detalles de la Transacción</h2>
          <p>ID: {transaction.id}</p>
          <p>Remitente: {transaction.sender}</p>
          <p>Receptor: {transaction.receiver}</p>
          <p>Cantidad: {transaction.amount}</p>
          <p>Fecha y Hora: {transaction.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default GetTransaction;
