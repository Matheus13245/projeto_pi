package pe.senac.br.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;

import pe.senac.br.backend.dto.CreateRelatorioRequest;
import pe.senac.br.backend.model.Cooperativa;
import pe.senac.br.backend.model.CopUsuario;
import pe.senac.br.backend.model.Relatorio;
import pe.senac.br.backend.repository.CooperativaRepository;
import pe.senac.br.backend.repository.CopUsuarioRepository;
import pe.senac.br.backend.repository.RelatorioRepository;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final CooperativaRepository cooperativaRepository;
    private final CopUsuarioRepository copUsuarioRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            CooperativaRepository cooperativaRepository,
                            CopUsuarioRepository copUsuarioRepository) {
        this.relatorioRepository = relatorioRepository;
        this.cooperativaRepository = cooperativaRepository;
        this.copUsuarioRepository = copUsuarioRepository;
    }

    // Criar relatório
    public Relatorio criarRelatorio(CreateRelatorioRequest dto) {

        Relatorio r = new Relatorio();
        r.setTitulo(dto.getTitulo());
        r.setDescricao(dto.getDescricao());

        Cooperativa coop = cooperativaRepository.findById(dto.getCooperativaId())
                .orElseThrow(() -> new RuntimeException("Cooperativa não encontrada"));

        CopUsuario autor = copUsuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor (CopUsuario) não encontrado"));

        r.setCooperativa(coop);
        r.setAutor(autor);

        return relatorioRepository.save(r);
    }

    // Listar tudo
    public List<Relatorio> listarTodos() {
        return relatorioRepository.findAll();
    }

    // Filtro por autor
    public List<Relatorio> listarPorAutor(Long autorId) {
        return relatorioRepository.findByAutorId(autorId);
    }

    // Filtro por cooperativa
    public List<Relatorio> listarPorCooperativa(Long coopId) {
        return relatorioRepository.findByCooperativaId(coopId);
    }
}
