import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Cadastro from './paginas/cadastro'
import Login from './paginas/login'

function Navigation() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Bem vindo ao nosso sistema de barbearias</h2>
      <button onClick={() => navigate('/login')}>Login</button><br />
      <button onClick={() => navigate('/cadastro')}>Cadastrar</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
}


export default App
