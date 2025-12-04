import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Cadastro() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    usuario: {
      username: "",
      senha: ""
    },
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

function handleChange(e: any) {
  const { name, value } = e.target;

  // campo simples
  if (!name.includes(".")) {
    setForm((prev) => ({ ...prev, [name]: value }));
    return;
  }

  // campos aninhados
  const [grupo, campo] = name.split(".");

  setForm((prev: any) => ({
    ...prev,
    [grupo]: {
      ...prev[grupo],
      [campo]: value,
    },
  }));
}


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/clientes",
        form,
        { validateStatus: s => s < 500 }
      );

      if (response.status === 200) {
        setSucesso("Cadastro realizado com sucesso!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setErro("Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      setErro("Não foi possível conectar ao servidor.");
    }

    setLoading(false);
  };

  return (
    <div>
      <form  onSubmit={handleSubmit}>
        <h1>Cadastro de Cliente</h1>

        <h2>Dados Pessoais</h2>
        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
        <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required />
        <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} required />

        <h2>Dados de Login</h2>
        <input type="text" name="usuario.username" placeholder="Usuário" onChange={handleChange} required />
        <input type="password" name="usuario.senha" placeholder="Senha" onChange={handleChange} required />

        <h2>Endereço</h2>
        <input type="text" name="endereco.rua" placeholder="Rua" onChange={handleChange} required />
        <input type="text" name="endereco.numero" placeholder="Número" onChange={handleChange} required />
        <input type="text" name="endereco.complemento" placeholder="Complemento" onChange={handleChange} />
        <input type="text" name="endereco.bairro" placeholder="Bairro" onChange={handleChange} required />
        <input type="text" name="endereco.cidade" placeholder="Cidade" onChange={handleChange} required />
        <input type="text" name="endereco.estado" placeholder="Estado" onChange={handleChange} required />
        <input type="text" name="endereco.cep" placeholder="CEP" onChange={handleChange} required />

        {erro && <p>{erro}</p>}
        {sucesso && <p>{sucesso}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
