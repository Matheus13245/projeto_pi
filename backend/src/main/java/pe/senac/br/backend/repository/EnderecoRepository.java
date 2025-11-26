package pe.senac.br.backend.repository;

import pe.senac.br.backend.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}
