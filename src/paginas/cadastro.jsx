import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Página de Cadastro</h2>
      <form>
        <input type="text" placeholder="CPF" /><br />
        <input type="text" placeholder="Nome de Usuário" /><br />
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Senha" /><br />
        <button type="submit">Cadastrar</button>
      </form>
      <button onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}

export default Cadastro;
