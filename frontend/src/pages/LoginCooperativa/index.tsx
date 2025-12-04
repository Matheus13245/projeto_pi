import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/Login.module.css";

export default function CopLogin() {
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Chamada ao backend para login do CopUsuario
      const { data } = await axios.post(
        "http://localhost:8080/api/copauth/login",
        { username: emailCorporativo, senha },
        { validateStatus: (status) => status < 500 }
      );

      if (data.sucesso) {
        // Salva info básica do usuário cop
        localStorage.setItem("copusuarioLogado", emailCorporativo);

        router.push(`/coperativa/dashboard`);
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
        <h1>Login - Cooperativa</h1>

        <input
          type="text"
          placeholder="Email corporativo"
          value={emailCorporativo}
          onChange={(e) => setEmailCorporativo(e.target.value)}
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
          onClick={() => router.push("/cadastroCooperativa")}
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}
