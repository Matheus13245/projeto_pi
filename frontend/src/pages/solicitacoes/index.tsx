import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Solicitacoes.module.css";
import { useRouter } from "next/router";

interface Semente {
  id: number;
  nomePopular: string;
  nomeCientifico: string;
  fabricante: string;
  dataValidade: string;
  quantidadeEstoque: number;
}

interface Pedido {
  id: number;
  status: string;
  dataPedido: string;
  qtdSolicitada: number;
  sementesIds: number[];
}

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Pedido[]>([]);
  const [sementes, setSementes] = useState<Semente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const router = useRouter();

  // 🔵 Carrega todas as sementes
  const carregarSementes = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/sementes");
      setSementes(data);
    } catch (e) {
      console.warn("Falha ao carregar sementes.");
    }
  };

  // 🔵 Carregar solicitações do cliente logado
  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      setErro("");

      const clienteStr = localStorage.getItem("clienteLogado");
      if (!clienteStr) {
        setErro("Não foi possível identificar o usuário logado.");
        setLoading(false);
        return;
      }

      const cliente = JSON.parse(clienteStr);

      const { data } = await axios.get(
        `http://localhost:8080/api/pedidos/cliente/${cliente.id}`
      );

      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      setErro("Erro ao carregar solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSementes();
    carregarSolicitacoes();
  }, []);

  // 🔵 Retorna o nome da semente pelo ID
  const nomeDaSemente = (id: number) => {
    const s = sementes.find((s) => s.id === id);
    return s ? s.nomePopular : `Semente #${id}`;
  };

  // 🟥 Excluir pedido
  const excluirPedido = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/pedidos/${id}`);
      alert("Pedido excluído com sucesso!");
      carregarSolicitacoes();
    } catch (err) {
      alert("Erro ao excluir pedido.");
    }
  };

  // 🟦 Editar pedido
  const editarPedido = (id: number) => {
    router.push(`/solicitacoes/editar/${id}`);
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1>Minhas Solicitações</h1>

      <button className={styles.btnVoltar} onClick={() => router.push("/welcome")}>
        Voltar
      </button>

      <button className={styles.btnAtualizar} onClick={carregarSolicitacoes}>
        Atualizar
      </button>

      {erro && <p className={styles.error}>{erro}</p>}

      {solicitacoes.length === 0 ? (
        <p className={styles.info}>Você ainda não fez nenhuma solicitação.</p>
      ) : (
        <div className={styles.lista}>
          {solicitacoes.map((p) => (
            <div key={p.id} className={styles.card}>
              <h3>Pedido #{p.id}</h3>

              <p>
                <strong>Status:</strong> {p.status}
              </p>

              <p>
                <strong>Quantidade solicitada:</strong> {p.qtdSolicitada}
              </p>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(p.dataPedido).toLocaleDateString("pt-BR")}
              </p>

              <p>
                <strong>Sementes:</strong>{" "}
                {p.sementesIds?.length > 0
                  ? p.sementesIds.map((id) => nomeDaSemente(id)).join(", ")
                  : "Nenhuma semente vinculada"}
              </p>

              {/* BOTÕES SOMENTE SE STATUS FOR EM_ANALISE */}
              {p.status === "EM ANALISE" && (
                <div className={styles.acoes}>
                  <button
                    className={styles.btnEditar}
                    onClick={() => editarPedido(p.id)}
                  >
                    Editar
                  </button>

                  <button
                    className={styles.btnExcluir}
                    onClick={() => excluirPedido(p.id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
