package pe.senac.br.backend.controller;

import pe.senac.br.backend.dto.PedidoDTO;
import pe.senac.br.backend.model.Cliente;
import pe.senac.br.backend.model.Endereco;
import pe.senac.br.backend.model.Pedido;
import pe.senac.br.backend.model.Semente;
import pe.senac.br.backend.repository.ClienteRepository;
import pe.senac.br.backend.repository.EnderecoRepository;
import pe.senac.br.backend.repository.PedidoRepository;
import pe.senac.br.backend.repository.SementeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final SementeRepository sementeRepository;
    private final EnderecoRepository enderecoRepository;

    public PedidoController(PedidoRepository pedidoRepository,
                            ClienteRepository clienteRepository,
                            SementeRepository sementeRepository,
                            EnderecoRepository enderecoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.sementeRepository = sementeRepository;
        this.enderecoRepository = enderecoRepository;
    }

    @GetMapping
    public List<PedidoDTO> listar() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/cliente/{clienteId}")
    public List<PedidoDTO> listarPorCliente(@PathVariable Long clienteId) {
        return pedidoRepository.findAll().stream()
                .filter(p -> p.getCliente() != null && p.getCliente().getId().equals(clienteId))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> buscarPorId(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(pedido -> ResponseEntity.ok(toDTO(pedido)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> criar(@RequestBody PedidoDTO dto) {
        Pedido pedido = fromDTO(dto);
        Pedido salvo = pedidoRepository.save(pedido);
        return ResponseEntity.ok(toDTO(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> atualizar(@PathVariable Long id,
                                               @RequestBody PedidoDTO dto) {
        return pedidoRepository.findById(id)
                .map(existente -> {

                    existente.setDataPedido(dto.getDataPedido());
                    existente.setStatus(dto.getStatus());
                    existente.setValorTotal(dto.getValorTotal());
                    existente.setQtdSolicitada(dto.getQtdSolicitada());

                    // cliente
                    if (dto.getClienteId() != null) {
                        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                                .orElseThrow(() -> new RuntimeException("Cliente nao encontrado"));
                        existente.setCliente(cliente);
                    }

                    // endereço
                    if (dto.getEnderecoId() != null) {
                        Endereco endereco = enderecoRepository.findById(dto.getEnderecoId())
                                .orElseThrow(() -> new RuntimeException("Endereco nao encontrado"));
                        existente.setEndereco(endereco);
                    }

                    // sementes
                    if (dto.getSementesIds() != null) {
                        existente.setSementes(new HashSet<>());
                        for (Long sementeId : dto.getSementesIds()) {
                            Semente semente = sementeRepository.findById(sementeId)
                                    .orElseThrow(() -> new RuntimeException("Semente nao encontrada"));
                            existente.getSementes().add(semente);
                        }
                    }

                    Pedido atualizado = pedidoRepository.save(existente);
                    return ResponseEntity.ok(toDTO(atualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        if (!pedidoRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Registro não encontrado");
        }
        pedidoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setDataPedido(pedido.getDataPedido());
        dto.setStatus(pedido.getStatus());
        dto.setValorTotal(pedido.getValorTotal());
        dto.setQtdSolicitada(pedido.getQtdSolicitada());

        if (pedido.getCliente() != null)
            dto.setClienteId(pedido.getCliente().getId());

        if (pedido.getEndereco() != null)
            dto.setEnderecoId(pedido.getEndereco().getId());

        if (pedido.getSementes() != null && !pedido.getSementes().isEmpty()) {
            dto.setSementesIds(
                    pedido.getSementes().stream()
                            .map(Semente::getId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private Pedido fromDTO(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setDataPedido(dto.getDataPedido());
        pedido.setStatus(dto.getStatus());
        pedido.setValorTotal(dto.getValorTotal());
        pedido.setQtdSolicitada(dto.getQtdSolicitada());  // >>> CORRIGIDO <<<

        // cliente
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente nao encontrado"));
            pedido.setCliente(cliente);
        }

        // endereço
        if (dto.getEnderecoId() != null) {
            Endereco endereco = enderecoRepository.findById(dto.getEnderecoId())
                    .orElseThrow(() -> new RuntimeException("Endereco nao encontrado"));
            pedido.setEndereco(endereco);
        }

        // sementes
        if (dto.getSementesIds() != null && !dto.getSementesIds().isEmpty()) {
            pedido.setSementes(new HashSet<>());
            for (Long sementeId : dto.getSementesIds()) {
                Semente semente = sementeRepository.findById(sementeId)
                        .orElseThrow(() -> new RuntimeException("Semente nao encontrada"));
                pedido.getSementes().add(semente);
            }
        }

        return pedido;
    }
}