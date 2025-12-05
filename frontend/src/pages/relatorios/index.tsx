import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Relatorios.module.css";

type Relatorio = {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  autor: {
    id: number;
    nome: string;
  };
  cooperativa: {
    id: number;
    nomeCooperativa: string;
  };
};

export default function GerenciarRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarRelatorios = async () => {
    setLoading(true);
    setErro("");

    try {
      const response = await axios.get("http://localhost:8080/api/relatorios");
      setRelatorios(response.data);
    } catch (err: any) {
      setErro("Erro ao carregar relatórios.");
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarRelatorios();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciamento de Relatórios</h1>

      <button onClick={carregarRelatorios} className={styles.reloadButton}>
        Recarregar
      </button>

      {loading && <p className={styles.loading}>Carregando relatórios...</p>}

      {erro && <p className={styles.error}>{erro}</p>}

      {!loading && relatorios.length === 0 && (
        <p className={styles.empty}>Nenhum relatório encontrado.</p>
      )}

      <div className={styles.list}>
        {relatorios.map((r) => (
          <div key={r.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{r.titulo}</h2>

            <p><strong>Autor:</strong> {r.autor?.nome}</p>
            <p><strong>Cooperativa:</strong> {r.cooperativa?.nomeCooperativa}</p>
            <p><strong>Data:</strong> {new Date(r.dataCriacao).toLocaleString()}</p>

            <details className={styles.details}>
              <summary>Ver descrição</summary>
              <p className={styles.descricao}>{r.descricao}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
