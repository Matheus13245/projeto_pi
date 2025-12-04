import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Solicitacoes.module.css";

interface Solicitacao {
  id: number;
  dataPedido: string;
  status: string;
  valorTotal: number;
  qtdSolicitada: number;
  clienteId: number;
  enderecoId: number;
  sementesIds: number[];
}

interface Cliente {
  id: number;
  nome: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

interface Semente {
  id: number;
  nomePopular: string;
  nomeCientifico: string;
  fabricante: string;
}

export default function SolicitacoesAdmin() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [clientes, setClientes] = useState<Record<number, Cliente>>({});
  const [sementes, setSementes] = useState<Record<number, Semente>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const respPedidos = await axios.get("http://localhost:8080/api/pedidos");
      const pedidos: Solicitacao[] = respPedidos.data;

      setSolicitacoes(pedidos);

      // -------- BUSCAR CLIENTES --------
      const clienteIds = [...new Set(pedidos.map((p) => p.clienteId))];
      const clientesMap: Record<number, Cliente> = {};

      await Promise.all(
        clienteIds.map(async (id) => {
          const resp = await axios.get(`http://localhost:8080/api/clientes/${id}`);
          clientesMap[id] = resp.data;
        })
      );

      setClientes(clientesMap);

      // -------- BUSCAR SEMENTES --------
      const todasSementesIds = [
        ...new Set(pedidos.flatMap((p) => p.sementesIds)),
      ];

      const sementesMap: Record<number, Semente> = {};

      await Promise.all(
        todasSementesIds.map(async (id) => {
          const resp = await axios.get(`http://localhost:8080/api/sementes/${id}`);
          sementesMap[id] = resp.data;
        })
      );

      setSementes(sementesMap);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const alterarStatus = async (id: number, novoStatus: string) => {
    try {
      await axios.put(`http://localhost:8080/api/pedidos/${id}/status`, {
        status: novoStatus,
      });

      setSolicitacoes((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: novoStatus } : s
        )
      );
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar status.");
    }
  };

  if (loading) return <p>Carregando solicitações...</p>;

  return (
    <div className={styles.container}>
      <h1>Gerenciar Solicitações</h1>

      {solicitacoes.length === 0 ? (
        <p>Nenhuma solicitação encontrada.</p>
      ) : (
        solicitacoes.map((sol) => {
          const cliente = clientes[sol.clienteId];

          return (
            <div key={sol.id} className={styles.card}>
              <h2>Pedido #{sol.id}</h2>

              {/* Cliente */}
              <p>
                <strong>Cliente:</strong>{" "}
                {cliente ? cliente.nome : "Carregando..."}
              </p>

              {/* Endereço */}
              <p>
                <strong>Endereço:</strong>{" "}
                {cliente
                  ? `${cliente.endereco.rua}, ${cliente.endereco.numero}, ${cliente.endereco.bairro} - ${cliente.endereco.cidade}/${cliente.endereco.estado}`
                  : "Carregando..."}
              </p>

              {/* Data do pedido */}
              <p>
                <strong>Data:</strong>{" "}
                {new Date(sol.dataPedido).toLocaleString()}
              </p>

              {/* Quantidade */}
              <p>
                <strong>Quantidade Solicitada:</strong>{" "}
                {sol.qtdSolicitada}
              </p>

              {/* Sementes com nome popular */}
              <p>
                <strong>Sementes:</strong>{" "}
                {sol.sementesIds
                  .map((id) =>
                    sementes[id] ? sementes[id].nomePopular : `ID ${id}`
                  )
                  .join(", ")}
              </p>

              {/* Valor Total */}
              <p>
                <strong>Valor Total:</strong>{" "}
                R$ {sol.valorTotal.toFixed(2)}
              </p>

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    sol.status === "EM ANALISE"
                      ? styles.statusAnalise
                      : sol.status === "EM TRANSITO"
                      ? styles.statusTransito
                      : sol.status === "ENTREGUE"
                      ? styles.statusSucesso
                      : styles.statusErro
                  }
                >
                  {sol.status}
                </span>
              </p>

              {/* Ações */}
              {sol.status === "EM ANALISE" && (
                <div className={styles.botoes}>
                  <button
                    className={styles.aceitar}
                    onClick={() => alterarStatus(sol.id, "EM TRANSITO")}
                  >
                    Aceitar
                  </button>

                  <button
                    className={styles.recusar}
                    onClick={() => alterarStatus(sol.id, "RECUSADO")}
                  >
                    Recusar
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
