package pe.senac.br.backend.service;

import org.springframework.stereotype.Service;
import pe.senac.br.backend.dto.LoginRequest;
import pe.senac.br.backend.dto.LoginResponse;
import pe.senac.br.backend.model.CopUsuario;
import pe.senac.br.backend.repository.CopUsuarioRepository;

@Service
public class CopUsuarioAuthService {

    private final CopUsuarioRepository copUsuarioRepository;

    public CopUsuarioAuthService(CopUsuarioRepository copUsuarioRepository) {
        this.copUsuarioRepository = copUsuarioRepository;
    }

    public LoginResponse login(LoginRequest request) {

        // Buscar por emailCorporativo
        CopUsuario usuario = copUsuarioRepository
                .findByEmailCorporativo(request.getUsername())
                .orElse(null);

        if (usuario == null) {
            return new LoginResponse(false, "Usuário não encontrado");
        }

        if (!usuario.getSenha().equals(request.getSenha())) {
            return new LoginResponse(false, "Senha incorreta");
        }

        return new LoginResponse(true, "Login realizado com sucesso!");
    }
}
