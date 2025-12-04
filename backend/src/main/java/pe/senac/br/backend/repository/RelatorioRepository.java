package pe.senac.br.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import pe.senac.br.backend.model.Relatorio;

public interface RelatorioRepository extends JpaRepository<Relatorio, Long> {

    List<Relatorio> findByAutorId(Long autorId);

    List<Relatorio> findByCooperativaId(Long cooperativaId);
}
