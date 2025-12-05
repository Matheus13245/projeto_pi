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
    const { data } = await axios.post(
      "http://localhost:8080/api/copauth/login",
      { username: emailCorporativo, senha },
      { validateStatus: (status) => status < 500 }
    );

    if (data.sucesso) {

      // --- BUSCA DADOS COMPLETOS DO USUÁRIO ---
      const usuarioResp = await axios.get(
        `http://localhost:8080/api/copusuarios/by-email/${emailCorporativo}`
      );

      // SALVA O OBJETO COMPLETO
      localStorage.setItem(
        "copusuarioLogado",
        JSON.stringify(usuarioResp.data)
      );

      router.push("/MainCooperativa");

    } else {
      setError(data.mensagem || "Credenciais inválidas");
    }
  } catch (err) {
    setError("Erro inesperado");
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
  