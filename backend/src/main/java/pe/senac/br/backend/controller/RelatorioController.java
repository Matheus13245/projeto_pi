package pe.senac.br.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import pe.senac.br.backend.dto.CreateRelatorioRequest;
import pe.senac.br.backend.model.Relatorio;
import pe.senac.br.backend.service.RelatorioService;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    // Criar relatório
    @PostMapping
    public ResponseEntity<?> criarRelatorio(@RequestBody CreateRelatorioRequest dto) {
        try {
            Relatorio novo = relatorioService.criarRelatorio(dto);
            return ResponseEntity.ok(novo);

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Erro ao criar relatório: " + e.getMessage());
        }
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Relatorio>> listarTodos() {
        return ResponseEntity.ok(relatorioService.listarTodos());
    }

    // Listar por autor (CopUsuario)
    @GetMapping("/autor/{autorId}")
    public ResponseEntity<?> listarPorAutor(@PathVariable Long autorId) {
        return ResponseEntity.ok(relatorioService.listarPorAutor(autorId));
    }

    // Listar por cooperativa
    @GetMapping("/cooperativa/{coopId}")
    public ResponseEntity<?> listarPorCooperativa(@PathVariable Long coopId) {
        return ResponseEntity.ok(relatorioService.listarPorCooperativa(coopId));
    }
}
