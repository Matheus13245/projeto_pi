import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NovaSemente() {
  const [nomePopular, setNomePopular] = useState('')
  const [nomeCientifico, setNomeCientifico] = useState('')
  const [fabricante, setFabricante] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number | ''>('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await axios.post('http://localhost:8080/api/sementes', {
        nomePopular,
        nomeCientifico,
        fabricante,
        dataValidade,       // formato yyyy-MM-dd vindo do input type="date"
        quantidadeEstoque: quantidadeEstoque === '' ? 0 : quantidadeEstoque
      })

      alert('Semente cadastrada com sucesso')
      router.push('/sementes')
    } catch (e) {
      alert('Erro ao cadastrar semente')
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Cadastrar nova semente</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>Nome popular</label>
          <input
            type="text"
            value={nomePopular}
            onChange={e => setNomePopular(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Nome científico</label>
          <input
            type="text"
            value={nomeCientifico}
            onChange={e => setNomeCientifico(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Fabricante</label>
          <input
            type="text"
            value={fabricante}
            onChange={e => setFabricante(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Data de validade</label>
          <input
            type="date"
            value={dataValidade}
            onChange={e => setDataValidade(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Quantidade em estoque</label>
          <input
            type="number"
            value={quantidadeEstoque}
            onChange={e =>
              setQuantidadeEstoque(e.target.value === '' ? '' : Number(e.target.value))
            }
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
