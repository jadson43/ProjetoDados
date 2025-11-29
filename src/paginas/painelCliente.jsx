import React, { useState, useEffect, useRef } from 'react'
import { api } from '../../server/api'

const PAGE_SIZE = 5;

function ShopsList({ onView }) {
  const [shops, setShops] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false); // Previne múltiplas chamadas simultâneas

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !loadingRef.current && hasMore) {
          loadPage(page + 1);
        }
      }
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    
    io.observe(el);
    return () => io.disconnect();
  }, [page, hasMore, loading]);

  async function loadPage(nextPage) {
    // Previne carregamentos duplicados
    if (loadingRef.current || loading || !hasMore) {
      console.log('⚠️ Carregamento ignorado - loading:', loading, 'hasMore:', hasMore);
      return;
    }
    
    // Previne carregar a mesma página duas vezes
    if (nextPage <= page && page !== 0) {
      console.log('⚠️ Página já carregada:', nextPage);
      return;
    }
    
    console.log(`🔵 Carregando página ${nextPage}...`);
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      let data = await api.getEstablishments(nextPage, PAGE_SIZE);
      console.log('✅ Dados recebidos:', data);

      if (!data || data.length === 0) {
        console.log('⚠️ Nenhum dado retornado - fim da lista');
        setHasMore(false);
        return;
      }

      // Mapeia os dados
      data = data.map(shop => ({
        ...shop,
        name: shop.name ?? shop.nome ?? "Sem nome",
        address: shop.address ?? shop.cidade ?? "Sem endereço",
        rating: shop.rating ?? shop.rating_avg ?? 0,
        ratingCount: shop.ratingCount ?? shop.rating_count ?? 0,
        fullAddress: {
          rua: shop.fullAddress?.rua ?? shop.rua ?? "",
          cidade: shop.fullAddress?.cidade ?? shop.cidade ?? "",
          estado: shop.fullAddress?.estado ?? shop.stado ?? "",
          cep: shop.fullAddress?.cep ?? shop.cep ?? ""
        }
      }));

      console.log('✅ Dados processados:', data);
      
      // Previne adicionar estabelecimentos duplicados
      setShops(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const newShops = data.filter(s => !existingIds.has(s.id));
        
        if (newShops.length === 0) {
          console.log('⚠️ Todos os estabelecimentos já existem - fim da lista');
          setHasMore(false);
          return prev;
        }
        
        console.log(`🔧 Adicionando ${newShops.length} novos estabelecimentos`);
        return [...prev, ...newShops];
      });
      
      setPage(nextPage);
      
      // Se retornou menos que PAGE_SIZE, não há mais páginas
      if (data.length < PAGE_SIZE) {
        console.log('⚠️ Menos dados que PAGE_SIZE, sem mais páginas');
        setHasMore(false);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar barbearias:', err);
      setError(`Erro ao carregar: ${err.message}`);
      setHasMore(false); // Para de tentar carregar em caso de erro
    } finally {
      setLoading(false);
      loadingRef.current = false;
      console.log('✅ Carregamento finalizado');
    }
  }

  return (
    <section className="shops-section">
      <h3 className="shops-title">Barbearias disponíveis</h3>
      
      {error && <div className="loader error">{error}</div>}
      
      <div className="shops-list" role="list">
        {shops.length === 0 && !loading && !error && (
          <div className="loader">Nenhuma barbearia encontrada</div>
        )}
        
        {shops.map((s) => (
          <div key={s.id}>
            <article
              className="shop-card"
              role="listitem"
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              aria-expanded={expandedId === s.id}
            >
              <div className="shop-info">
                <h4 className="shop-name">{s.name}</h4>
                <p className="shop-address">{s.address}</p>
              </div>
              <div className="shop-meta">
                <div className="shop-rating">
                  ⭐ {Number(s.rating).toFixed(1)} 
                  {s.ratingCount > 0 && (
                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      {' '}({s.ratingCount})
                    </span>
                  )}
                </div>
              </div>
            </article>

            <div className={`shop-details ${expandedId === s.id ? 'open' : ''}`}>
              <div className="shop-details-inner">
                <div className="shop-photos">
                  <div className="photo-placeholder" />
                </div>
                <div className="shop-desc">
                  {s.description ? (
                    <p><strong>Sobre:</strong> {s.description}</p>
                  ) : (
                    <p><strong>Sobre:</strong> Barbearia de qualidade com profissionais experientes.</p>
                  )}
                  {s.phone && (
                    <p><strong>Telefone:</strong> {s.phone}</p>
                  )}
                  {s.fullAddress && (
                    <p>
                      <strong>Endereço completo:</strong> {s.fullAddress.rua}, {s.fullAddress.cidade} - {s.fullAddress.estado}, CEP: {s.fullAddress.cep}
                    </p>
                  )}
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '0.5rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(s);
                    }}
                  >
                    Ver mais detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Sentinel só aparece quando há mais itens */}
        {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
      </div>
      
      {loading && <div className="loader">Carregando...</div>}
    </section>
  );
}

function PainelCliente() {
  function handleView(shop) {
    alert(`Abrindo detalhes de: ${shop.name}\n\nEndereço: ${shop.address}\nAvaliação: ${shop.rating}`);
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Painel do Cliente</h2>
      <ShopsList onView={handleView} />
    </main>
  );
}

export default PainelCliente;