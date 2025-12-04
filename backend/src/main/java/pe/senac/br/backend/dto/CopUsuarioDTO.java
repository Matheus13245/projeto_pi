package pe.senac.br.backend.dto;



public class CopUsuarioDTO {


    private Long id;

    private String nome;
    private String cpf;
    private String emailCorporativo;
    private String senha;

    private CooperativaDTO cooperativa;


    public CopUsuarioDTO() {
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
  
    public CooperativaDTO getCooperativa() {
    	return cooperativa;
    }
    
    public void setCooperativa(CooperativaDTO cooperativa) {
    	this.cooperativa = cooperativa; 
    }
    
    public String getSenha() {
        return senha;
    }
    

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
