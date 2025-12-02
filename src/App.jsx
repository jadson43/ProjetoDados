import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Cadastro from './paginas/cadastro'
import Login from './paginas/login'
import PainelCliente from './paginas/painelCliente'
import PainelAdmin from './paginas/PainelAdmin'

function Navigation() {
  const navigate = useNavigate();

  return (
    <main className="hero">
      <div className="hero-content">
        <h1 className="hero-title reveal">Bem-vindo ao Rustic Cut</h1>
        <p className="hero-lead reveal" data-revealdelay="80ms">Agende serviços, gerencie clientes e organize o dia a dia com velocidade e simplicidade.</p>

        <div className="cta-group reveal" data-revealdelay="160ms">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn btn-primary" onClick={() => navigate('/cadastro')}>Criar conta</button>
        </div>
      </div>
    </main>
  );
}

function RevealObserver() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting) {
          const delay = el.getAttribute('data-revealdelay') || '0ms';
          el.style.transitionDelay = delay;
          el.classList.add('reveal--visible');
          observer.unobserve(el);
        }
      }
    }, {
      threshold: 0.08,
    });
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => observer.observe(el));
    };
    observeAll();
    const t = setTimeout(observeAll, 60);

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <RevealObserver />
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/painel" element={<PainelCliente />} />
        <Route path="/painel-admin" element={<PainelAdmin />} />
      </Routes>
    </Router>
  );
}

export default App