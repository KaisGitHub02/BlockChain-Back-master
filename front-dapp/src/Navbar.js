// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/add-transaction">Add Transaction</Link></li>
        <li><Link to="/query-transaction">Query Transaction</Link></li>
        <li><Link to="/add-document">Add Document</Link></li>
        <li><Link to="/get-document">Get Document</Link></li>
        <li><Link to="/get-transfer-document">Get Transfer Document</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
