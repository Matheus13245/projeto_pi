package pe.senac.br.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.senac.br.backend.model.CopUsuario;

import java.util.Optional;

public interface CopUsuarioRepository extends JpaRepository<CopUsuario, Long> {

	Optional<CopUsuario> findByEmailCorporativo(String email);
}