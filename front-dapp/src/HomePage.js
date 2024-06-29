import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page-container">
      <nav className="navbar">
        <ul>
          <li><Link to="/add-document">Add Document</Link></li>
          <li><Link to="/get-document">Get Transaction</Link></li>
          <li><Link to="/transfer-document">Transfer Document</Link></li>
          <li><Link to="/get-transfer-document">Get Transfer Document</Link></li>
          <li><Link to="/add-asset">Add Full Asset</Link></li>
        </ul>
      </nav>
      <div className="content">
        <h1>Bienvenido a la Página de Gestión de Activos en Blockchain</h1>
        <p>Esta aplicación te permite gestionar tus documentos digitales y transacciones de forma segura utilizando la tecnología blockchain.</p>
        <p>Usa la barra de navegación arriba para realizar diversas operaciones, incluyendo añadir, consultar y transferir documentos y activos, registrar usuarios y consultar transacciones.</p>
        <p>Después de añadir o actualizar un documento o activo, puedes verificar las actualizaciones en el sistema blockchain de inmediato.</p>
        <p>Si añades nuevos datos, la versión inicial se establece en 1.</p>
        <p>Cada actualización de datos existentes incrementará el número de versión en 1, asegurando un historial claro de cambios.</p>
      </div>

    </div>
  );
}

export default HomePage;
