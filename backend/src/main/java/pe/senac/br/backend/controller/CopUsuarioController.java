package pe.senac.br.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.senac.br.backend.dto.CooperativaDTO;
import pe.senac.br.backend.dto.CopUsuarioDTO;
import pe.senac.br.backend.model.Cooperativa;
import pe.senac.br.backend.model.CopUsuario;
import pe.senac.br.backend.repository.CopUsuarioRepository;
import pe.senac.br.backend.repository.CooperativaRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/copusuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class CopUsuarioController {

    private final CopUsuarioRepository copUsuarioRepository;
    private final CooperativaRepository cooperativaRepository;

    public CopUsuarioController(CopUsuarioRepository copUsuarioRepository,
                                CooperativaRepository cooperativaRepository) {
        this.copUsuarioRepository = copUsuarioRepository;
        this.cooperativaRepository = cooperativaRepository;
    }

    // -------------------------
    // LISTAR TODOS
    // -------------------------
    @GetMapping
    public List<CopUsuarioDTO> listar() {
        return copUsuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/by-email/{email}")
    public ResponseEntity<CopUsuarioDTO> buscarPorEmail(@PathVariable String email) {
        return copUsuarioRepository.findByEmailCorporativo(email)
                .map(usuario -> ResponseEntity.ok(toDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------
    // BUSCAR POR ID
    // -------------------------
    @GetMapping("/{id}")
    public ResponseEntity<CopUsuarioDTO> buscarPorId(@PathVariable Long id) {
        return copUsuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(toDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------
    // CRIAR
    // -------------------------
    @PostMapping
    public ResponseEntity<CopUsuarioDTO> criar(@RequestBody CopUsuarioDTO dto) {
        CopUsuario usuario = fromDTO(dto);
        CopUsuario salvo = copUsuarioRepository.save(usuario);
        return ResponseEntity.ok(toDTO(salvo));
    }

    // -------------------------
    // ATUALIZAR
    // -------------------------
    @PutMapping("/{id}")
    public ResponseEntity<CopUsuarioDTO> atualizar(@PathVariable Long id,
                                                   @RequestBody CopUsuarioDTO dto) {
        return copUsuarioRepository.findById(id)
                .map(existente -> {

                    existente.setNome(dto.getNome());
                    existente.setCpf(dto.getCpf());
                    existente.setEmailCorporativo(dto.getEmailCorporativo());
                    existente.setSenha(dto.getSenha());

                    // Atualizar Cooperativa
                    if (dto.getCooperativa() != null) {
                        CooperativaDTO c = dto.getCooperativa();

                        Cooperativa coop = cooperativaRepository.findById(c.getId())
                                .orElse(null);

                        existente.setCooperativa(coop);
                    }

                    CopUsuario atualizado = copUsuarioRepository.save(existente);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------
    // EXCLUIR
    // -------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!copUsuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        copUsuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------
    // CONVERSORES ENTITY → DTO
    // ------------------------------------------------------
    private CopUsuarioDTO toDTO(CopUsuario usuario) {
        CopUsuarioDTO dto = new CopUsuarioDTO();

        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setCpf(usuario.getCpf());
        dto.setEmailCorporativo(usuario.getEmailCorporativo());
        dto.setSenha(usuario.getSenha());

        if (usuario.getCooperativa() != null) {
            Cooperativa coop = usuario.getCooperativa();
            CooperativaDTO c = new CooperativaDTO();

            c.setId(coop.getId());
            c.setNomeCooperativa(coop.getNomeCooperativa());
            c.setCnpj(coop.getCnpj());

            dto.setCooperativa(c);
        }

        return dto;
    }

    // ------------------------------------------------------
    // CONVERSORES DTO → ENTITY
    // ------------------------------------------------------
    private CopUsuario fromDTO(CopUsuarioDTO dto) {
        CopUsuario usuario = new CopUsuario();

        usuario.setNome(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmailCorporativo(dto.getEmailCorporativo());
        usuario.setSenha(dto.getSenha());

        // Busca a cooperativa pelo ID enviado
        if (dto.getCooperativa() != null && dto.getCooperativa().getId() != null) {
            Cooperativa coop = cooperativaRepository
                    .findById(dto.getCooperativa().getId())
                    .orElse(null);

            usuario.setCooperativa(coop);
        }

        return usuario;
    }
}
