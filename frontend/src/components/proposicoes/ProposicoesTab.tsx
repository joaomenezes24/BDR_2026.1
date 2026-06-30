"use client";
import React, { useState, useEffect } from 'react';
import './ProposicoesTab.css';
import ProposicaoDetalhes from './ProposicaoDetalhes';
import ResumoVotacao from './ResumoVotacao'; 
import GraficoCamaraInterativo from '@/src/components/perfil-parlamentar/GraficoCamaraInterativo'; 

import { ProposicoesService } from '@/src/services/proposicoesServices';
import { analyticsService } from '@/src/services/analyticsService'; 
import { ProposicaoResponse, ProposicaoVotosResponse} from '@/src/types/proposicoes'; 
import { Tema } from '@/src/types/analytics'; 

export default function ProposicoesTab() {
  const [temaSelecionado, setTemaSelecionado] = useState<string>(''); 
  const [offset, setOffset] = useState<number>(0);
  
  const [temasDisponiveis, setTemasDisponiveis] = useState<Tema[]>([]);
  const [proposicao, setProposicao] = useState<ProposicaoResponse | null>(null);
  const [votos, setVotos] = useState<ProposicaoVotosResponse>({ votos_sim: [], votos_nao: [], votos_outros: [] });
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para gerenciar os 513 deputados no gráfico
  const [dadosDeputadosBase, setDadosDeputadosBase] = useState<any[]>([]); 
  const [deputadosComVoto, setDeputadosComVoto] = useState<any[]>([]); 

  // Efeito 1: Busca a lista de temas do analyticsService
  useEffect(() => {
    const carregarTemas = async () => {
      try {
        const data = await analyticsService.getTemas();
        setTemasDisponiveis(data);
        if (data.length > 0) {
          setTemaSelecionado(data[0].tema); 
        }
      } catch (error) {
        console.error("Erro ao carregar os temas:", error);
      }
    };
    carregarTemas();
  }, []);

  // Efeito 2: Carrega a base fixa dos 513 deputados (apenas uma vez na montagem)
  useEffect(() => {
    fetch('/mockdados/deputados_plenario_preciso.json')
      .then(res => res.json())
      .then(data => setDadosDeputadosBase(data))
      .catch(err => console.error("Erro ao carregar deputados base:", err));
  }, []);

  console.log("Dados dos deputados base:", dadosDeputadosBase[0]); // Log do primeiro deputado para verificação

  // Efeito 3: Busca a Proposição através do Service
  useEffect(() => {
    if (!temaSelecionado) return; 

    const carregarProposicao = async () => {
      setLoading(true);
      try {
        const data = await ProposicoesService.getProposicoesPorTema(temaSelecionado, offset);
        setProposicao(data[0] || null); 
      } catch (error) {
        console.error(error);
        setProposicao(null);
      } finally {
        setLoading(false);
      }
    };
    
    carregarProposicao();
  }, [temaSelecionado, offset]);

  // Efeito 4: Busca os Votos sempre que a proposição mudar
  useEffect(() => {
    if (proposicao?.proposicao_id) {
      const carregarVotos = async () => {
        try {
          const dadosVotos = await ProposicoesService.getVotos(proposicao.proposicao_id);
          setVotos(dadosVotos);
        } catch (error) {
          console.error(error);
        }
      };
      
      carregarVotos();
    } else {
      setVotos({ votos_sim: [], votos_nao: [], votos_outros: [] });
    }
  }, [proposicao]);

  // Efeito 5: O MERGE -> Pinta os 513 deputados com os votos da API
  useEffect(() => {
    if (dadosDeputadosBase.length > 0 && (votos.votos_sim.length > 0 || votos.votos_nao.length > 0)) {
      const deputadosAtualizados = dadosDeputadosBase.map(dep => {
        
        // Blindagem 1: Garante que estamos comparando Texto com Texto (String)
        const idDeputadoJson = String(dep.deputado_id);

        // Blindagem 2: Tenta ler 'id' ou 'deputado_id' da resposta da API
        const votouSim = votos.votos_sim.find(v => String(v.deputado_id) === String(idDeputadoJson)); 
        const votouNao = votos.votos_nao.find(v => String(v.deputado_id) === String(idDeputadoJson));
        const votouAbs = votos.votos_outros?.find(v => String(v.deputado_id) === String(idDeputadoJson)); 

        let statusVoto = 'Sem informação';
        if (votouSim) statusVoto = 'SIM';
        else if (votouNao) statusVoto = 'NÃO';
        else if (votouAbs) statusVoto = 'ABSTENÇÃO';

        // Cria a propriedade "votoAtual" dinamicamente
        return { ...dep, votoAtual: statusVoto };
      });

      setDeputadosComVoto(deputadosAtualizados);
    } else {
      // Se a proposição não tiver votos, reseta todos para "Sem informação"
      const deputadosResetados = dadosDeputadosBase.map(dep => ({ ...dep, votoAtual: 'Sem informação' }));
      setDeputadosComVoto(deputadosResetados);
    }
  }, [votos, dadosDeputadosBase]);

  console.log("Deputados com votos atualizados:", deputadosComVoto[0]); // Log do primeiro deputado atualizado para verificação

  const handleTemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemaSelecionado(e.target.value);
    setOffset(0); 
  };

  return (
    <div className="proposicoes-tab">
      
      {/* Barra de Controles Interna */}
      <div className="controles-bar">
        <div className="controles-grupo">
          <div className="box-pilula">Proposições</div>
          <select 
            className="box-pilula" 
            value={temaSelecionado} 
            onChange={handleTemaChange}
            disabled={temasDisponiveis.length === 0}
          >
            {temasDisponiveis.map((t, index) => (
              <option key={index} value={t.tema}>
                Escolha um eixo: {t.tema}
              </option>
            ))}
          </select>
        </div>
        <button className="box-pilula">Buscar Deputado</button>
      </div>

      {/* Grid de Conteúdo condicional */}
      {loading ? (
        <div className="aviso-carregando">Consultando a base de dados...</div>
      ) : proposicao ? (
        <div className="conteudo-grid">
          
          <div className="coluna-esquerda">
            <ProposicaoDetalhes proposicao={proposicao} />
            <div className="paginacao">
              <button 
                className="box-pilula" 
                onClick={() => setOffset(prev => Math.max(0, prev - 1))}
                disabled={offset === 0}
              >
                &larr; Anterior
              </button>
              <button 
                className="box-pilula" 
                onClick={() => setOffset(prev => prev + 1)}
              >
                Próxima &rarr;
              </button>
            </div>
          </div>

          <div className="coluna-direita">
            <GraficoCamaraInterativo 
               deputados={deputadosComVoto} 
               criterioAtual="votoAtual" 
            />
            
            
            <ResumoVotacao 
               totalSim={votos.votos_sim.length} 
               totalNao={votos.votos_nao.length} 
            />
          </div>

        </div>
      ) : (
        <div className="aviso-carregando">
          {temaSelecionado ? "Nenhuma proposição encontrada para este tema." : "Carregando temas..."}
        </div>
      )}
    </div>
  );
}