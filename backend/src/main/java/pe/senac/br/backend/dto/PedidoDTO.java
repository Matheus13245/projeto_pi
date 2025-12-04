package pe.senac.br.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoDTO {

    private Long id;
    private LocalDateTime dataPedido;
    private String status;
    private BigDecimal valorTotal;
    private Double qtdSolicitada;

    private Long clienteId;
    private Long enderecoId;
    private List<Long> sementesIds;

    public PedidoDTO() {
    }

    // getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
    
    public Double getQtdSolicitada () {
    	return qtdSolicitada; 
    }
    
    public void setQtdSolicitada (Double qtdSolicitada) {
    	this.qtdSolicitada = qtdSolicitada;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
    
    public Long getEnderecoId() {
    	return enderecoId;
    }
    
    public void setEnderecoId (Long enderecoId) {
    	this.enderecoId = enderecoId;
    }

    public List<Long> getSementesIds() {
        return sementesIds;
    }

    public void setSementesIds(List<Long> sementesIds) {
        this.sementesIds = sementesIds;
    }
}

