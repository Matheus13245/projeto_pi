import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/Login.module.css";

export default function CopCadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");
  const [senha, setSenha] = useState("");
  const [cooperativaId, setCooperativaId] = useState("");

  const [cooperativas, setCooperativas] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Carregar cooperativas ao abrir a página
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/cooperativas")
      .then((resp) => setCooperativas(resp.data))
      .catch(() => console.warn("Não foi possível carregar cooperativas"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSucesso("");

    try {
      const payload = {
        nome,
        cpf,
        emailCorporativo,
        senha,
        cooperativa: {
          id: Number(cooperativaId),
        },
      };

      const { data } = await axios.post(
        "http://localhost:8080/api/copusuarios",
        payload,
        { validateStatus: (status) => status < 500 }
      );

      if (data.id) {
        setSucesso("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/cop/login");
        }, 1500);
      } else {
        setError("Não foi possível cadastrar o usuário.");
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
        <h1>Cadastrar usuário da cooperativa</h1>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <input
          type="email"
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

        <select
          value={cooperativaId}
          onChange={(e) => setCooperativaId(e.target.value)}
          required
        >
          <option value="">Selecione a cooperativa</option>
          {cooperativas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nomeCooperativa}
            </option>
          ))}
        </select>

        {error && <p className={styles.error}>{error}</p>}
        {sucesso && <p className={styles.success}>{sucesso}</p>}

        <button type="submit">Cadastrar</button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.push("/LoginCooperativa")}
        >
          Voltar ao login
        </button>
      </form>
    </div>
  );
}
