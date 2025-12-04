package pe.senac.br.backend.service;

import java.util.List;
import pe.senac.br.backend.dto.CooperativaDTO;

public interface CooperativaService {

    CooperativaDTO salvar(CooperativaDTO dto);

    List<CooperativaDTO> listarTodas();

    CooperativaDTO buscarPorId(Long id);

    void deletar(Long id);
}
