package pe.senac.br.backend.repository;

import pe.senac.br.backend.model.Semente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SementeRepository extends JpaRepository<Semente, Long> {
}