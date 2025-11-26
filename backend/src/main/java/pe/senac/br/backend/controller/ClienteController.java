package pe.senac.br.backend.controller;

import pe.senac.br.backend.dto.ClienteDTO;
import pe.senac.br.backend.dto.EnderecoDTO;
import pe.senac.br.backend.dto.UsuarioDTO;
import pe.senac.br.backend.model.Cliente;
import pe.senac.br.backend.model.Endereco;
import pe.senac.br.backend.model.Usuario;
import pe.senac.br.backend.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:3000")   // <— libera só esse front-end
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping
    public List<ClienteDTO> listar() {
        return clienteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> ResponseEntity.ok(toDTO(cliente)))
        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> criar(@RequestBody ClienteDTO dto) {
        Cliente cliente = fromDTO(dto);
        Cliente salvo = clienteRepository.save(cliente);
        return ResponseEntity.ok(toDTO(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> atualizar(@PathVariable Long id,
                                                @RequestBody ClienteDTO dto) {
        return clienteRepository.findById(id)
                .map(existente -> {
                    existente.setNome(dto.getNome());
                    existente.setCpf(dto.getCpf());
                    existente.setEmail(dto.getEmail());
                    existente.setTelefone(dto.getTelefone());

                    if (dto.getUsuario() != null) {
                        UsuarioDTO u = dto.getUsuario();
                        Usuario usuario = existente.getUsuario();
                        if (usuario == null) {
                            usuario = new Usuario();
                        }
                        usuario.setUsername(u.getUsername());
                        usuario.setSenha(u.getSenha());
                        existente.setUsuario(usuario);
                    }

                    if (dto.getEndereco() != null) {
                        EnderecoDTO e = dto.getEndereco();
                        Endereco endereco = existente.getEndereco();
                        if (endereco == null) {
                            endereco = new Endereco();
                        }
                        endereco.setRua(e.getRua());
                        endereco.setNumero(e.getNumero());
                        endereco.setComplemento(e.getComplemento());
                        endereco.setBairro(e.getBairro());
                        endereco.setCidade(e.getCidade());
                        endereco.setEstado(e.getEstado());
                        endereco.setCep(e.getCep());
                        existente.setEndereco(endereco);
                    }

                    Cliente atualizado = clienteRepository.save(existente);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
        .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!clienteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Conversões

    private ClienteDTO toDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setCpf(cliente.getCpf());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());

        if (cliente.getUsuario() != null) {
            UsuarioDTO u = new UsuarioDTO();
            u.setId(cliente.getUsuario().getId());
            u.setUsername(cliente.getUsuario().getUsername());
            u.setSenha(cliente.getUsuario().getSenha());
            dto.setUsuario(u);
        }

        if (cliente.getEndereco() != null) {
            EnderecoDTO e = new EnderecoDTO();
            e.setId(cliente.getEndereco().getId());
            e.setRua(cliente.getEndereco().getRua());
            e.setNumero(cliente.getEndereco().getNumero());
            e.setComplemento(cliente.getEndereco().getComplemento());
            e.setBairro(cliente.getEndereco().getBairro());
            e.setCidade(cliente.getEndereco().getCidade());
            e.setEstado(cliente.getEndereco().getEstado());
            e.setCep(cliente.getEndereco().getCep());
            dto.setEndereco(e);
        }

        return dto;
    }

    private Cliente fromDTO(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());

        if (dto.getUsuario() != null) {
            UsuarioDTO u = dto.getUsuario();
            Usuario usuario = new Usuario();
            usuario.setUsername(u.getUsername());
            usuario.setSenha(u.getSenha());
            cliente.setUsuario(usuario);
        }

        if (dto.getEndereco() != null) {
            EnderecoDTO e = dto.getEndereco();
            Endereco endereco = new Endereco();
            endereco.setRua(e.getRua());
            endereco.setNumero(e.getNumero());
            endereco.setComplemento(e.getComplemento());
            endereco.setBairro(e.getBairro());
            endereco.setCidade(e.getCidade());
            endereco.setEstado(e.getEstado());
            endereco.setCep(e.getCep());
            cliente.setEndereco(endereco);
        }

        return cliente;
    }
}

