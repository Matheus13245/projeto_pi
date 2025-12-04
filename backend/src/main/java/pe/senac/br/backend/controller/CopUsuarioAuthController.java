package pe.senac.br.backend.controller;

import org.springframework.web.bind.annotation.*;
import pe.senac.br.backend.dto.LoginRequest;
import pe.senac.br.backend.dto.LoginResponse;
import pe.senac.br.backend.service.CopUsuarioAuthService;

@RestController
@RequestMapping("/api/copauth")
@CrossOrigin(origins = "http://localhost:3000")
public class CopUsuarioAuthController {

    private final CopUsuarioAuthService authService;

    public CopUsuarioAuthController(CopUsuarioAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
