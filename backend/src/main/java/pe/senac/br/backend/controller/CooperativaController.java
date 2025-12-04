package pe.senac.br.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.senac.br.backend.dto.CooperativaDTO;
import pe.senac.br.backend.service.CooperativaService;

@RestController
@RequestMapping("/api/cooperativas")
@CrossOrigin(origins = "*")
public class CooperativaController {

    @Autowired
    private CooperativaService service;

    @PostMapping
    public ResponseEntity<CooperativaDTO> criar(@RequestBody CooperativaDTO dto) {
        return ResponseEntity.ok(service.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<CooperativaDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CooperativaDTO> buscar(@PathVariable Long id) {
        CooperativaDTO dto = service.buscarPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
