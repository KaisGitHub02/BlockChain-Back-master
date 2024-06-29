import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import HomePage from './HomePage';
import AddTransaction from './AddTransaction';
import QueryTransaction from './QueryTransaction';
import AddDocument from './AddDocument';
import GetDocument from './GetDocument';
import TransferDocument from './TransferDocument';
import RegisterUser from './RegisterUser';
import RegisterTransaction from './RegisterTransaction';
import GetTransaction from './GetTransaction';
import AddAsset from './AddAsset';
import Register from './Register';
import Navbar from './Navbar';
import GetTransferDocument from './GetTransferDocument';
import React, { useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  const handleLogin = (username, orgName) => {
    axios.post('http://localhost:4000/users/login', {
      username: username,
      orgName: orgName,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      setToken(response.data.message.token);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/add-document" element={<AddDocument token={token} />} />
        <Route path="/get-document" element={<GetDocument token={token} />} />
        <Route path="/transfer-document" element={<TransferDocument token={token} />} />
        <Route path="/get-transfer-document" element={<GetTransferDocument token={token} />} />
        <Route path="/add-asset" element={<AddAsset token={token} />} />
        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
}

export default App;
