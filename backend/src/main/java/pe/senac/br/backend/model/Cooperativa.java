package pe.senac.br.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cooperativa")
public class Cooperativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomecooperativa;
    private String cnpj;

    // 1:N com CopUsuario
    @OneToMany(mappedBy = "cooperativa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CopUsuario> copusuarios = new ArrayList<>();

    public Cooperativa() {
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
