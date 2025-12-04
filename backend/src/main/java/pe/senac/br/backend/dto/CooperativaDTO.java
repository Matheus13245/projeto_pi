package pe.senac.br.backend.dto;


public class CooperativaDTO {

    private Long id;

    private String nomecooperativa;
    private String cnpj;

    
    public CooperativaDTO() {
    }

    // getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCooperativa() {
        return nomecooperativa;
    }

    public void setNomeCooperativa(String nomecooperativa) {
        this.nomecooperativa = nomecooperativa;
    }
    
    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }


}
