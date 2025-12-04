import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username: nomeUsuario, senha },
        { validateStatus: (status) => status < 500 }
      );

      if (data.sucesso) {
        localStorage.setItem("usernameLogado", nomeUsuario);

        try {
          const clientesResp = await axios.get("http://localhost:8080/api/clientes");
          const listaClientes: any[] = clientesResp.data;

          const cliente = listaClientes.find(
            (c) => c.usuario && c.usuario.username === nomeUsuario
          );

          if (cliente) {
            localStorage.setItem("clienteLogado", JSON.stringify(cliente));
          } else {
            localStorage.removeItem("clienteLogado");
          }
        } catch (err) {
          console.warn("Não foi possível buscar cliente após login:", err);
        }

        router.push(`/welcome?user=${encodeURIComponent(nomeUsuario)}`);
      } else {
        setError(data.mensagem || "Credenciais inválidas");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ mensagem: string }>;
        setError(axiosErr.response?.data?.mensagem || "Erro na conexão com o servidor");
      } else {
        setError("Erro inesperado");
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>

        <input
          type="text"
          placeholder="Usuário"
          value={nomeUsuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Entrar</button>


        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.push("/cadastro")}
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}