package pe.senac.br.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.senac.br.backend.dto.CooperativaDTO;
import pe.senac.br.backend.model.Cooperativa;
import pe.senac.br.backend.repository.CooperativaRepository;

@Service
public class CooperativaServiceImpl implements CooperativaService {

    @Autowired
    private CooperativaRepository repository;

    private CooperativaDTO toDTO(Cooperativa cooperativa) {
        CooperativaDTO dto = new CooperativaDTO();
        dto.setId(cooperativa.getId());
        dto.setNomeCooperativa(cooperativa.getNomeCooperativa());
        dto.setCnpj(cooperativa.getCnpj());
        return dto;
    }

    private Cooperativa toEntity(CooperativaDTO dto) {
        Cooperativa cooperativa = new Cooperativa();
        cooperativa.setId(dto.getId());
        cooperativa.setNomeCooperativa(dto.getNomeCooperativa());
        cooperativa.setCnpj(dto.getCnpj());
        return cooperativa;
    }

    @Override
    public CooperativaDTO salvar(CooperativaDTO dto) {
        Cooperativa entity = toEntity(dto);
        Cooperativa salvo = repository.save(entity);
        return toDTO(salvo);
    }

    @Override
    public List<CooperativaDTO> listarTodas() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CooperativaDTO buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
