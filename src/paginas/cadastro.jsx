import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Página de Cadastro</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="CPF" />
        <input type="text" placeholder="Nome de Usuário" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />
        <button type="button">Cadastrar</button>
      </form>
      <button type="button" onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}

export default Cadastro;
