package pe.senac.br.backend.dto;

import java.time.LocalDateTime;

public class RelatorioResponse {

    private Long id;
    private LocalDateTime dataCriacao;
    private String titulo;
    private String descricao;
    private Long autorId;

    public RelatorioResponse() {}

    public RelatorioResponse(Long id, LocalDateTime dataCriacao, String titulo,
                             String descricao, Long autorId) {
        this.id = id;
        this.dataCriacao = dataCriacao;
        this.titulo = titulo;
        this.descricao = descricao;
        this.autorId = autorId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getAutorId() { return autorId; }
    public void setAutorId(Long autorId) { this.autorId = autorId; }
}
