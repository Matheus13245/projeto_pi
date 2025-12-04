import { useState, useEffect } from "react";
import axios from "axios";

type UsuarioTipagem = {
  id?: number;
  nome?: string;
  cooperativaId?: number;
  // caso seu objeto use outro nome para coop id, coloque aqui
};

export default function CriarRelatorio() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [usuario, setUsuario] = useState<UsuarioTipagem | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // chaves possíveis que seu projeto pode ter usado ao salvar o usuário
  const POSSIVEIS_CHAVES = [
    "usuario",
    "copusuarioLogado",
    "clienteLogado",
    "usernameLogado",
    "copusuario",
    "user",
  ];

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        // percorre as chaves, pega a primeira que exista
        for (const key of POSSIVEIS_CHAVES) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;

          console.debug("[CriarRelatorio] achou localStorage key:", key, raw);

          // tenta parsear JSON; se falhar, trata como string simples
          try {
            const parsed = JSON.parse(raw);
            // se for um objeto com id, retornamos
            if (parsed && typeof parsed === "object") {
              setUsuario({
                id: parsed.id ?? parsed.usuario?.id ?? parsed?.usuario?.id,
                nome:
                  parsed.nome ??
                  parsed.usuario?.nome ??
                  parsed.usuario?.username ??
                  parsed.username,
                cooperativaId:
                  parsed.cooperativaId ??
                  parsed.cooperativa?.id ??
                  parsed.usuario?.cooperativa?.id,
              });
              setLoadingUsuario(false);
              return;
            }
          } catch (e) {
            // não é JSON: pode ser apenas um username/email string
            console.debug("[CriarRelatorio] valor não-JSON em", key, raw);
            // Nesse caso o backend precisa de autorId/cooperativaId — impossível inferir
            // Mas colocamos um usuário parcial com 'nome' apenas (sem id).
            setUsuario({ nome: raw });
            setLoadingUsuario(false);
            return;
          }
        }

        // se nenhuma chave encontrada, define null e encerra loading
        console.debug("[CriarRelatorio] nenhuma chave encontrada no localStorage");
        setUsuario(null);
        setLoadingUsuario(false);
      } catch (err) {
        console.error("[CriarRelatorio] erro ao carregar usuário:", err);
        setUsuario(null);
        setLoadingUsuario(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    // se não houver id do usuário, impede e informa
    const autorId = (usuario && (usuario.id ?? null)) as number | null;
    const cooperativaId = (usuario && (usuario.cooperativaId ?? null)) as number | null;

    if (!autorId || !cooperativaId) {
      setErro(
        "Não foi possível determinar autor/cooperativa. Verifique se o usuário está logado corretamente."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/relatorios", {
        titulo,
        descricao,
        autorId,
        cooperativaId,
      });

      setResultado(response.data);
    } catch (err: any) {
      setErro(err.response?.data || "Erro ao salvar relatório");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Criar Relatório</h1>

      {loadingUsuario ? (
        <p>Carregando usuário...</p>
      ) : usuario ? (
        <div style={{ marginBottom: 12 }}>
          <p><strong>Autor:</strong> {usuario.nome ?? "—"}</p>
          <p><strong>AutorId:</strong> {usuario.id ?? "não disponível"}</p>
          <p><strong>CooperativaId:</strong> {usuario.cooperativaId ?? "não disponível"}</p>
        </div>
      ) : (
        <div style={{ color: "darkorange", marginBottom: 12 }}>
          <p>Usuário não encontrado no localStorage. Faça login para que autor/cooperativa sejam preenchidos automaticamente.</p>
          <p>Se precisar testar rapidamente, cole no Console:</p>
          <pre style={{ background: "#f0f0f0", padding: 8 }}>
{`localStorage.setItem("usuario", JSON.stringify({id:1,nome:"João",cooperativaId:1}))`}
          </pre>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Título</label>
        <input
          type="text"
          style={styles.input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <label style={styles.label}>Descrição</label>
        <textarea
          style={styles.textarea}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading || loadingUsuario}
        >
          {loading ? "Enviando..." : "Criar Relatório"}
        </button>
      </form>

      {erro && <p style={styles.erro}>{erro}</p>}

      {resultado && (
        <div style={styles.resultBox}>
          <h3>Relatório Criado:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: { maxWidth: 700, margin: "0 auto", padding: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontWeight: "bold" },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  textarea: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    height: 140,
  },
  button: {
    marginTop: 20,
    padding: "12px 20px",
    background: "#008000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
    fontSize: 16,
  },
  resultBox: {
    marginTop: 30,
    padding: 15,
    background: "#f4f4f4",
    borderRadius: 6,
  },
  erro: {
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
  },
};
