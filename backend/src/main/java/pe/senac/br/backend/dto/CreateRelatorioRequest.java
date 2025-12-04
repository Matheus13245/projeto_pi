package pe.senac.br.backend.dto;

public class CreateRelatorioRequest {

    private String titulo;
    private String descricao;

    private Long cooperativaId;
    private Long autorId; // CopUsuario.id

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getCooperativaId() { return cooperativaId; }
    public void setCooperativaId(Long cooperativaId) { this.cooperativaId = cooperativaId; }

    public Long getAutorId() { return autorId; }
    public void setAutorId(Long autorId) { this.autorId = autorId; }
}
