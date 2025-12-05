import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateRelatorio.module.css";

type UsuarioTipagem = {
  id?: number;
  nome?: string;
  cooperativa?: {
    id?: number;
    nomeCooperativa?: string;
  };
};

export default function CriarRelatorio() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [usuario, setUsuario] = useState<UsuarioTipagem | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  const [resultado, setResultado] = useState<any>(null);
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("copusuarioLogado");
      if (!raw) {
        setLoadingUsuario(false);
        return;
      }

      const obj = JSON.parse(raw);
      setUsuario(obj);
    } catch {
      setUsuario(null);
    }

    setLoadingUsuario(false);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    if (!usuario || !usuario.id || !usuario.cooperativa?.id) {
      setErro("Não foi possível encontrar ID do usuário ou da cooperativa.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/relatorios", {
        titulo,
        descricao,
        autorId: usuario.id,
        cooperativaId: usuario.cooperativa.id
      });

      setSucesso("Relatório enviado com sucesso!");
      setResultado(null);
      setTitulo("");
      setDescricao("");
    } catch (err: any) {
      setErro(err.response?.data || "Erro ao salvar relatório");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Relatório</h1>

      {loadingUsuario ? (
        <p className={styles.loading}>Carregando usuário...</p>
      ) : usuario ? (
        <div className={styles.successMessage}>
          <p><strong>Autor:</strong> {usuario.nome}</p>
          <p><strong>Cooperativa:</strong> {usuario.cooperativa?.nomeCooperativa}</p>
        </div>
      ) : (
        <p className={styles.errorMessage}>Usuário não encontrado.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading || loadingUsuario}
        >
          {loading ? "Enviando..." : "Criar Relatório"}
        </button>
      </form>

      {erro && <p className={styles.errorMessage}>{erro}</p>}
      {sucesso && <p className={styles.successMessage}>{sucesso}</p>}
    </div>
  );
}
