# Backend PI – Sistema de Clientes, Sementes e Pedidos

Este projeto é um backend em Spring Boot para demonstrar relacionamentos entre entidades.

Ele expõe APIs REST para:

- Autenticação
- Cadastro de clientes
- Cadastro de sementes
- Cadastro de pedidos


## Tecnologias utilizadas

- Java 17 ou superior
- Spring Boot
- Spring Web
- Spring Data JPA
- Banco de dados relacional (MySQL ou outro compatível com JPA)
- Maven
- Sprint Tools (https://spring.io/tools) -> https://cdn.spring.io/spring-tools/release/STS4/4.32.2.RELEASE/dist/e4.37/spring-tools-for-eclipse-4.32.2.RELEASE-e4.37.0-win32.win32.x86_64.zip
- Insomnia (https://insomnia.rest/download)



## Estrutura do projeto

Principais pacotes:

- `pe.senac.br.backend.controller`  
  Controladores REST com os endpoints do sistema.

- `pe.senac.br.backend.model`  
  Entidades JPA que representam as tabelas do banco.

- `pe.senac.br.backend.dto`  
  Objetos de transferência de dados usados pelas APIs.

- `pe.senac.br.backend.repository`  
  Interfaces `JpaRepository` usadas para acesso ao banco.


## Endpoints principais

### 1. Autenticação

`AuthController`

- `POST /api/auth/login`
  
Corpo esperado:

```json
{
  "username": "admin",
  "senha": "admin123"
}
````

Resposta em caso de sucesso:

```json
{
  "sucesso": true,
  "mensagem": "Login bem-sucedido"
}
```

Resposta em caso de erro:

```json
{
  "sucesso": false,
  "mensagem": "Credenciais inválidas"
}
```


### 2. Sementes

`SementeController`

* `GET /api/sementes`
  Lista todas as sementes.

* `GET /api/sementes/{id}`
  Busca uma semente pelo id.

* `POST /api/sementes`
  Cria o cadastro de uma nova semente.

  Exemplo de corpo:

  ```json
  {
    "nomePopular": "Feijão carioca",
    "nomeCientifico": "Phaseolus vulgaris",
    "fabricante": "Cooperativa X",
    "dataValidade": "2026-12-31",
    "quantidadeEstoque": 500
  }
  ```

* `PUT /api/sementes/{id}`
  Atualiza uma semente existente.

* `DELETE /api/sementes/{id}`
  Remove uma semente pelo id.


### 3. Outros recursos

Caso o projeto inclua controladores adicionais, por exemplo:

* `ClienteController` em `/api/clientes`
* `PedidoController` em `/api/pedidos`

eles seguem o mesmo padrão de CRUD:

* `GET /api/...` para listar
* `GET /api/.../{id}` para buscar por id
* `POST /api/...` para criar
* `PUT /api/.../{id}` para atualizar
* `DELETE /api/.../{id}` para remover

---

## Configuração do banco de dados

No arquivo `application.properties` (ou `application.yml`), configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nome_do_banco?useSSL=false&serverTimezone=UTC
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Ajuste `nome_do_banco`, usuário e senha de acordo com o seu ambiente.


## Como executar o backend

1. Certifique-se de que o banco de dados está em execução e configurado.
3. Abra o projeto no Spring Tools (caso não esteja aberto).
4. Clique com o botão direito no nome do projeto -> `Maven` -> `Update Project...` e confirme (apenas na vez em que o projeto do backend é aberto no Spring Tools ou se mudar as dependencias do projeto).
5. Selecionar o projeto do backend no painel 'Boot Dashboard', local -> selecionar o projeto  e depois clicar em 'Start ou restart'.
6. O backend deve subir em `http://localhost:8080`.


## Testando a API

Você pode usar ferramentas como Insomnia ou Postman.

Exemplo de teste de login:

* Método: `POST`
* URL: `http://localhost:8080/api/auth/login`
* Body JSON:

  ```json
  {
    "username": "admin",
    "senha": "admin123"
  }
  ```

Exemplo de teste da lista de sementes:

* Método: `GET`
* URL: `http://localhost:8080/api/sementes`


## Resolução de problemas

Se aparentemente estiver tudo certo com o código, mas ao enviar uma requisição o backend estiver gerando exceção estranha ou comportamento inesperado, tente limpar o cache do projeto seguindo os passos abaixo no Spring Tools:

1. Parar o backend se ele estiver em execução.
2. No menu: `Project` -> `Clean...` e confirmar a limpeza do projeto.
3. Clique com o botão direito no nome do projeto -> `Maven` -> `Update Project...` e confirme.
4. Subir o backend novamente.

Esses passos costumam resolver problemas de cache, classes desatualizadas ou inconsistências de build.

## Licença

Este projeto pode ser utilizado livremente para fins educacionais e acadêmicos.
