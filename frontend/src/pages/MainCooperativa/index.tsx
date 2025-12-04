import { useEffect, useState } from "react";
import styles from "../../styles/Cooperativas.module.css";

export default function MainPageCooperativa() {
  const [usuario, setUsuario] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("usernameLogado");
    if (user) setUsuario(user);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Bem-vindo, {usuario}!</h1>

      <div className={styles.botoesContainer}>

        <button
          className={styles.botao}
          onClick={() => (window.location.href = "/relatorios/criar")}
        >
          Criar Relatório
        </button>

        <button
          className={styles.botao}
          onClick={() => (window.location.href = "/relatorios")}
        >
          Gerenciar Relatórios
        </button>

        <button
          className={styles.botao}
          onClick={() => (window.location.href = "/GerenciarSolicitacoes")}
        >
          Gerenciar Solicitações
        </button>

      </div>
    </div>
  );
}
