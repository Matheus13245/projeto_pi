import { useEffect, useState } from "react";
import axios from "axios";

interface Semente {
  id: number;
  nomePopular: string; // ⬅ AQUI É O NOME CERTO QUE SUA API RETORNA
}

interface ClienteBackend {
  id: number;
  nome: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  usuario?: { id?: number; username?: string };
  endereco?: {
    id?: number;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

export default function Solicitacao() {
  const [sementes, setSementes] = useState<Semente[]>([]);
  const [cliente, setCliente] = useState<ClienteBackend | null>(null);
  const [mensagem, setMensagem] = useState<string>("");

  const [sementeId, setSementeId] = useState<number | null>(null);
  const [qtdSolicitada, setQtdSolicitada] = useState<number | "">("");
  const [usarLocalizacao, setUsarLocalizacao] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        // CARREGA AS SEMENTES
        const sResp = await axios.get("http://localhost:8080/api/sementes");

        // Corrige qualquer variação, ex: nomePopular vs nome
        const sementesCorrigidas = sResp.data.map((s: any) => ({
          id: s.id,
          nomePopular: s.nomePopular ?? s.nome ?? "Sem nome",
        }));

        setSementes(sementesCorrigidas);
      } catch (err) {
        console.error("Erro ao buscar sementes:", err);
      }

      const clienteStr = localStorage.getItem("clienteLogado");
      const usernameSaved = localStorage.getItem("usernameLogado");

      if (clienteStr) {
        try {
          const cli = JSON.parse(clienteStr);
          setCliente(cli);
          return;
        } catch (e) {
          console.warn("clienteLogado inválido no localStorage", e);
          localStorage.removeItem("clienteLogado");
        }
      }

      if (usernameSaved) {
        try {
          const cResp = await axios.get("http://localhost:8080/api/clientes");
          const lista: ClienteBackend[] = cResp.data;
          const encontrado = lista.find(
            (c) => c.usuario && c.usuario.username === usernameSaved
          );
          if (encontrado) {
            setCliente(encontrado);
            localStorage.setItem("clienteLogado", JSON.stringify(encontrado));
          }
        } catch (err) {
          console.error("Erro ao buscar clientes:", err);
        }
      }
    }

    carregar();
  }, []);

  const pegarLocalizacao = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      (err) => {
        alert("Não foi possível obter localização.");
        setUsarLocalizacao(false);
      }
    );
  };

  const enviarPedido = async () => {
    setMensagem("");

    if (!cliente || !cliente.id) {
      setMensagem("Erro: cliente não identificado.");
      return;
    }
    if (!sementeId) {
      setMensagem("Selecione uma semente.");
      return;
    }
    if (qtdSolicitada === "" || Number(qtdSolicitada) <= 0) {
      setMensagem("Informe a quantidade.");
      return;
    }

    try {
      const payload = {
        dataPedido: new Date().toISOString(),
        status: "EM ANALISE",
        valorTotal: 0,
        clienteId: cliente.id,
        enderecoId: cliente.endereco?.id ?? null,
        usarLocalizacao,
        latitude: usarLocalizacao ? latitude : null,
        longitude: usarLocalizacao ? longitude : null,
        sementesIds: [sementeId],
        qtdSolicitada: Number(qtdSolicitada),
      };

      const resp = await axios.post("http://localhost:8080/api/pedidos", payload);

      setMensagem(`Pedido criado! ID: ${resp.data.id}`);
      setSementeId(null);
      setQtdSolicitada("");
      setUsarLocalizacao(false);
      setLatitude(null);
      setLongitude(null);
    } catch (err: any) {
      console.error("Erro ao criar pedido:", err);
      setMensagem("Erro ao criar pedido.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Solicitar Pedido de Sementes</h1>

      {cliente ? (
        <div style={{ marginBottom: 12 }}>
          <strong>Cliente:</strong> {cliente.nome}
          <br />
          {cliente.endereco ? (
            <span>
              <strong>Endereço:</strong> {cliente.endereco.rua}, {cliente.endereco.numero}
            </span>
          ) : (
            <span style={{ color: "orange" }}>
              Nenhum endereço cadastrado.
            </span>
          )}
        </div>
      ) : (
        <p style={{ color: "orange" }}>Cliente não carregado.</p>
      )}

      <div style={{ marginTop: 12 }}>
        <label>
          <strong>Semente:</strong>
        </label>
        <br />
        <select
          value={sementeId ?? ""}
          onChange={(e) => setSementeId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Selecione</option>
          {sementes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nomePopular}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <strong>Quantidade (kg):</strong>
        </label>
        <br />
        <input
          type="number"
          min="0"
          value={qtdSolicitada}
          onChange={(e) =>
            setQtdSolicitada(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={usarLocalizacao}
            onChange={(e) => {
              setUsarLocalizacao(e.target.checked);
              if (e.target.checked) pegarLocalizacao();
            }}
          />
          Usar minha localização atual
        </label>
      </div>

      <button style={{ marginTop: 16 }} onClick={enviarPedido}>
        Enviar Pedido
      </button>

      {mensagem && (
        <p style={{ marginTop: 12, whiteSpace: "pre-line" }}>{mensagem}</p>
      )}
    </div>
  );
}
