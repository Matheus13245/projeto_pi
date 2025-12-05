# projeto_pi
Estrutura do projeto do PI 

scripts my sql
 
DROP DATABASE projeto_pi;

CREATE DATABASE projeto_pi;

use projeto_pi;

SHOW TABLES;

select * from pedidos;

INSERT INTO cooperativa (nomecooperativa, cnpj)
VALUES ('Cooperativa Central do Agreste', '12.345.678/0001-99');

REQUISIÇÕES HTTP

POST
http://localhost:8080/api/pedidos

{
  "dataPedido": "2025-12-05",
  "status": "PENDENTE",
  "valorTotal": 150.90,
  "qtdSolicitada": 300,
  "clienteId": 1,
  "enderecoId": 1,
  "sementesIds": [1, 3]
}

GET por id

http://localhost:8080/api/pedidos/

PUT

http://localhost:8080/api/pedidos/2

{
  "status": "EM TRANSITO",
  "valorTotal": 199.99,
  "qtdSolicitada": 45,
  "clienteId": 1,
  "enderecoId": 1,
  "sementesIds": [1, 2]
}

DELETE

http://localhost:8080/api/pedidos/5
