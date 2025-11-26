package pe.senac.br.backend.controller;

import pe.senac.br.backend.dto.SementeDTO;
import pe.senac.br.backend.model.Semente;
import pe.senac.br.backend.repository.SementeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sementes")
@CrossOrigin(origins = "http://localhost:3000")   // <— libera só esse front-end
public class SementeController {

    private final SementeRepository sementeRepository;

    public SementeController(SementeRepository sementeRepository) {
        this.sementeRepository = sementeRepository;
    }

    @GetMapping
    public List<SementeDTO> listar() {
        return sementeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SementeDTO> buscarPorId(@PathVariable Long id) {
        return sementeRepository.findById(id)
                .map(semente -> ResponseEntity.ok(toDTO(semente)))
        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SementeDTO> criar(@RequestBody SementeDTO dto) {
        Semente semente = fromDTO(dto);
        Semente salvo = sementeRepository.save(semente);
        return ResponseEntity.ok(toDTO(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SementeDTO> atualizar(@PathVariable Long id,
                                                @RequestBody SementeDTO dto) {
        return sementeRepository.findById(id)
                .map(existente -> {
                    existente.setNomePopular(dto.getNomePopular());
                    existente.setNomeCientifico(dto.getNomeCientifico());
                    existente.setFabricante(dto.getFabricante());
                    existente.setDataValidade(dto.getDataValidade());
                    existente.setQuantidadeEstoque(dto.getQuantidadeEstoque());
                    Semente atualizado = sementeRepository.save(existente);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
        .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!sementeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sementeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private SementeDTO toDTO(Semente semente) {
        SementeDTO dto = new SementeDTO();
        dto.setId(semente.getId());
        dto.setNomePopular(semente.getNomePopular());
        dto.setNomeCientifico(semente.getNomeCientifico());
        dto.setFabricante(semente.getFabricante());
        dto.setDataValidade(semente.getDataValidade());
        dto.setQuantidadeEstoque(semente.getQuantidadeEstoque());
        return dto;
    }

    private Semente fromDTO(SementeDTO dto) {
        Semente semente = new Semente();
        semente.setNomePopular(dto.getNomePopular());
        semente.setNomeCientifico(dto.getNomeCientifico());
        semente.setFabricante(dto.getFabricante());
        semente.setDataValidade(dto.getDataValidade());
        semente.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        return semente;
    }
}

