package pe.senac.br.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "CopUsuarios")
public class CopUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String emailCorporativo;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "cooperativa_id")
    private Cooperativa cooperativa;


    public CopUsuario() {
    }

    // getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmailCorporativo() { return emailCorporativo; }
    public void setEmailCorporativo(String emailCorporativo) { this.emailCorporativo = emailCorporativo; }
    
    public Cooperativa getCooperativa() {
    	return cooperativa;
    }
    
    public void setCooperativa(Cooperativa cooperativa) {
    	this.cooperativa = cooperativa; 
    }
    
    public String getSenha() {
        return senha;
    }
    

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
