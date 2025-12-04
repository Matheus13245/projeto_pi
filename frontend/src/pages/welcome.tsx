import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Welcome() {
  const router = useRouter();
  const { user } = router.query;
  const [username, setUsername] = useState("");

  useEffect(() => {
    // prefere username da query, senão tenta pegar do localStorage
    if (typeof user === "string") {
      setUsername(user);
      localStorage.setItem("usernameLogado", user);
    } else {
      const saved = localStorage.getItem("usernameLogado");
      if (saved) setUsername(saved);
    }
  }, [user]);

  if (!username) return null;

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Bem-vindo, {username}!</h1>
        <p>Login realizado com sucesso.</p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        <Link href="/sementes">
          <button>Gerenciar sementes</button>
        </Link>

        <Link href="/solicitacao">
          <button>Solicitar Semente</button>
        </Link>

        <Link href="/solicitacoes">
          <button>Minhas Solicitações</button>
        </Link>
      </div>
    </>
  );
}
