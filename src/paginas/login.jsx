import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Página de Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Usuário" />
        <input type="password" placeholder="Senha" />
        <button type="button" onClick={() => navigate('/painel')}>Entrar</button>
      </form>
      <button type="button" onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}

export default Login;
