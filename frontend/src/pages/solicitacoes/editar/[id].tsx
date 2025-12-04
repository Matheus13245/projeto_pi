import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../Solicitacoes.module.css";

interface Semente {
  id: number;
  nomePopular: string; // <-- NOME REAL DO SEU JSON
}

interface Pedido {
  id: number;
  status: string;
  dataPedido: string;
  qtdSolicitada: number;
  sementesIds: number[];
}

export default function EditarPedido() {
  const router = useRouter();
  const { id } = router.query;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [sementes, setSementes] = useState<Semente[]>([]);
  const [selectedSementes, setSelectedSementes] = useState<number[]>([]);
  const [qtdSolicitada, setQtdSolicitada] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Carrega TODAS as sementes
  const carregarSementes = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/sementes");
      setSementes(data);
    } catch (err) {
      console.warn("Falha ao carregar sementes.");
    }
  };

  // Carrega o pedido que será editado
  const carregarPedido = async (pedidoId: string) => {
    try {
      setLoading(true);
      setErro("");

      const { data } = await axios.get(
        `http://localhost:8080/api/pedidos/${pedidoId}`
      );

      setPedido(data);
      setQtdSolicitada(data.qtdSolicitada);
      setSelectedSementes(data.sementesIds || []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      carregarSementes();
      carregarPedido(id as string);
    }
  }, [id]);

  // Seleciona / desmarca sementes
  const toggleSemente = (sId: number) => {
    if (selectedSementes.includes(sId)) {
      setSelectedSementes(selectedSementes.filter((s) => s !== sId));
    } else {
      setSelectedSementes([...selectedSementes, sId]);
    }
  };

  // Envia atualização
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedido) return;

    if (pedido.status !== "EM ANALISE") {
      alert("Este pedido não pode ser editado.");
      return;
    }

    try {
      const clienteStr = localStorage.getItem("clienteLogado");
      if (!clienteStr) throw new Error("Usuário não identificado.");

      const cliente = JSON.parse(clienteStr);

      await axios.put(`http://localhost:8080/api/pedidos/${pedido.id}`, {
        qtdSolicitada,
        sementesIds: selectedSementes,
        clienteId: cliente.id,
        status: pedido.status, // mantém o status atual
      });

      setSucesso("Pedido atualizado com sucesso!");
      setTimeout(() => router.push("/solicitacoes"), 1500);
    } catch (err) {
      console.error(err);
      setErro("Erro ao atualizar pedido.");
    }
  };

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!pedido) return <p className={styles.error}>{erro || "Pedido não encontrado."}</p>;

  return (
    <div className={styles.container}>
      <h1>Editar Pedido #{pedido.id}</h1>

      <button
        className={styles.btnVoltar}
        onClick={() => router.push("/solicitacoes")}
      >
        Voltar
      </button>

      {pedido.status !== "EM ANALISE" && (
        <p className={styles.info}>
          Este pedido não pode ser editado (status: {pedido.status}).
        </p>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Quantidade:
          <input
            type="number"
            min={1}
            value={qtdSolicitada}
            onChange={(e) => setQtdSolicitada(Number(e.target.value))}
            disabled={pedido.status !== "EM ANALISE"}
            required
          />
        </label>

        <fieldset disabled={pedido.status !== "EM ANALISE"}>
          <legend>Sementes</legend>

          {sementes.map((s) => (
            <label key={s.id}>
              <input
                type="checkbox"
                checked={selectedSementes.includes(s.id)}
                onChange={() => toggleSemente(s.id)}
              />
              {s.nomePopular}
            </label>
          ))}
        </fieldset>

        {erro && <p className={styles.error}>{erro}</p>}
        {sucesso && <p className={styles.success}>{sucesso}</p>}

        {pedido.status === "EM ANALISE" && (
          <button type="submit">Salvar Alterações</button>
        )}
      </form>
    </div>
  );
}
