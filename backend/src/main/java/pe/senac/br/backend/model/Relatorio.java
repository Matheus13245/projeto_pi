package pe.senac.br.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "relatorios")
public class Relatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT") // permite textos grandes
    private String descricao;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    // 🔥 Autor é um CopUsuario
    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private CopUsuario autor;

    // Cooperativa do relatório
    @ManyToOne
    @JoinColumn(name = "cooperativa_id", nullable = false)
    private Cooperativa cooperativa;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public CopUsuario getAutor() { return autor; }
    public void setAutor(CopUsuario autor) { this.autor = autor; }

    public Cooperativa getCooperativa() { return cooperativa; }
    public void setCooperativa(Cooperativa cooperativa) { this.cooperativa = cooperativa; }
}
