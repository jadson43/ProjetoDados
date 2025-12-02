import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserBar from './UserBar';
import { api } from '../../server/api';

function PainelAdmin() {
  const navigate = useNavigate();
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [barbeariaAtual, setBarbeariaAtual] = useState(null);
  
  // Verificar se o usuário é admin
  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      navigate('/login');
      return;
    }
    
    const usuario = JSON.parse(usuarioStr);
    if (usuario.role !== 'ADM_Estabelecimento') {
      alert('Acesso negado! Apenas administradores podem acessar esta página.');
      navigate('/painel');
      return;
    }
    
    carregarBarbearias(usuario.id);
  }, [navigate]);
  
  const carregarBarbearias = async (donoId) => {
    setLoading(true);
    setErro('');
    
    try {
      // Buscar todas as barbearias
      const todas = await api.getEstablishments(1, 100);
      
      // Filtrar apenas as barbearias do usuário logado
      const minhas = todas.filter(b => b.dono_id === donoId);
      setBarbearias(minhas);
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
      setErro('Erro ao carregar suas barbearias');
    } finally {
      setLoading(false);
    }
  };
  
  const abrirModalNovo = () => {
    setBarbeariaAtual({
      nome: '',
      description: '',
      rua: '',
      cidade: '',
      stado: '',
      pais: 'Brasil',
      cep: '',
      phone: '',
      mei: ''
    });
    setModoEdicao(false);
    setModalAberto(true);
  };
  
  const abrirModalEdicao = (barbearia) => {
    setBarbeariaAtual({
      id: barbearia.id,
      nome: barbearia.name || barbearia.nome || '',
      description: barbearia.description || '',
      rua: barbearia.fullAddress?.rua || barbearia.rua || '',
      cidade: barbearia.fullAddress?.cidade || barbearia.cidade || '',
      stado: barbearia.fullAddress?.estado || barbearia.stado || '',
      pais: barbearia.fullAddress?.pais || barbearia.pais || 'Brasil',
      cep: barbearia.fullAddress?.cep || barbearia.cep || '',
      phone: barbearia.phone || '',
      mei: barbearia.mei || ''
    });
    setModoEdicao(true);
    setModalAberto(true);
  };
  
  const fecharModal = () => {
    setModalAberto(false);
    setBarbeariaAtual(null);
    setModoEdicao(false);
  };
  
  const handleChange = (e) => {
    setBarbeariaAtual({
      ...barbeariaAtual,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      const usuarioStr = localStorage.getItem('usuario');
      const usuario = JSON.parse(usuarioStr);
      
      if (modoEdicao) {
        // Atualizar barbearia existente
        await api.updateEstablishment(barbeariaAtual.id, barbeariaAtual);
        alert('Barbearia atualizada com sucesso!');
      } else {
        // Criar nova barbearia
        await api.createEstablishment({
          ...barbeariaAtual,
          dono_id: usuario.id
        });
        alert('Barbearia criada com sucesso!');
      }
      
      fecharModal();
      carregarBarbearias(usuario.id);
    } catch (error) {
      console.error('Erro ao salvar barbearia:', error);
      setErro(error.message || 'Erro ao salvar barbearia');
    }
  };
  
  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta barbearia?')) {
      return;
    }
    
    try {
      await api.deleteEstablishment(id);
      alert('Barbearia excluída com sucesso!');
      
      const usuarioStr = localStorage.getItem('usuario');
      const usuario = JSON.parse(usuarioStr);
      carregarBarbearias(usuario.id);
    } catch (error) {
      console.error('Erro ao excluir barbearia:', error);
      alert('Erro ao excluir barbearia: ' + error.message);
    }
  };

  return (
    <>
      <UserBar />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>
            Minhas Barbearias
          </h2>
          <button 
            className="btn btn-primary"
            onClick={abrirModalNovo}
          >
            + Nova Barbearia
          </button>
        </div>

        {erro && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {erro}
          </div>
        )}

        {loading ? (
          <div className="loader">Carregando suas barbearias...</div>
        ) : barbearias.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid rgba(15,23,36,0.06)'
          }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              Você ainda não cadastrou nenhuma barbearia.
            </p>
            <button 
              className="btn btn-primary"
              onClick={abrirModalNovo}
            >
              Cadastrar primeira barbearia
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
          }}>
            {barbearias.map((barbearia) => (
              <div 
                key={barbearia.id}
                className="shop-card"
                style={{ 
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '1rem',
                  cursor: 'default'
                }}
              >
                <div className="shop-info">
                  <h4 className="shop-name">
                    {barbearia.name || barbearia.nome}
                  </h4>
                  <p className="shop-address">
                    {barbearia.address || barbearia.cidade}
                  </p>
                  {barbearia.phone && (
                    <p style={{ 
                      margin: '0.5rem 0 0 0', 
                      fontSize: '0.9rem',
                      color: 'var(--muted)'
                    }}>
                      📞 {barbearia.phone}
                    </p>
                  )}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  marginTop: 'auto'
                }}>
                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => abrirModalEdicao(barbearia)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn"
                    style={{ 
                      flex: 1,
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca'
                    }}
                    onClick={() => handleExcluir(barbearia.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalAberto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ 
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2>{modoEdicao ? 'Editar Barbearia' : 'Nova Barbearia'}</h2>
              
              {erro && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#fee2e2', 
                  color: '#b91c1c',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {erro}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <label>Nome da Barbearia *</label>
                <input 
                  type="text"
                  name="nome"
                  value={barbeariaAtual?.nome || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Barbearia Central"
                />

                <label>Descrição</label>
                <textarea 
                  name="description"
                  value={barbeariaAtual?.description || ''}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Descreva sua barbearia..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    margin: '0.45rem 0',
                    borderRadius: '8px',
                    border: '1px solid #e6eef2',
                    background: '#ffffff',
                    color: 'var(--text)',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />

                <label>Rua/Avenida *</label>
                <input 
                  type="text"
                  name="rua"
                  value={barbeariaAtual?.rua || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Rua das Flores, 123"
                />

                <label>Cidade *</label>
                <input 
                  type="text"
                  name="cidade"
                  value={barbeariaAtual?.cidade || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ex: São Paulo"
                />

                <label>Estado *</label>
                <input 
                  type="text"
                  name="stado"
                  value={barbeariaAtual?.stado || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ex: SP"
                  maxLength="2"
                />

                <label>CEP *</label>
                <input 
                  type="text"
                  name="cep"
                  value={barbeariaAtual?.cep || ''}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 12345-678"
                />

                <label>Telefone</label>
                <input 
                  type="tel"
                  name="phone"
                  value={barbeariaAtual?.phone || ''}
                  onChange={handleChange}
                  placeholder="Ex: (11) 98765-4321"
                />

                <label>MEI (CNPJ)</label>
                <input 
                  type="text"
                  name="mei"
                  value={barbeariaAtual?.mei || ''}
                  onChange={handleChange}
                  placeholder="Ex: 12.345.678/0001-90"
                />

                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {modoEdicao ? 'Salvar Alterações' : 'Criar Barbearia'}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                    onClick={fecharModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default PainelAdmin;