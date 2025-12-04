DROP DATABASE projeto_pi;

CREATE DATABASE projeto_pi;

use projeto_pi;

SHOW TABLES;

--- ANTES DE EXECUTAR O BACKEND PELA PRIMEIRA VEZ EXECUTAR OS COMANDOS ACIMA


--- DEPOIS DE RODAR O BACKEND PELA PRIMEIRA VEZ, EXECUTAR OS COMANDOS ABAIXO

-- Usuários (para login e vínculo 1:1 com Cliente)
INSERT INTO usuarios (id, username, senha) VALUES
(1, 'admin',    'admin123'),
(2, 'joao',     '123456'),
(3, 'maria',    'senha001'),
(4, 'carlos',   'abc123'),
(5, 'ana',      'teste789');

-- Endereços (1:1 com Cliente)
INSERT INTO enderecos (id, rua, numero, complemento, bairro, cidade, estado, cep) VALUES
(1, 'Rua das Flores',      '100', 'Apto 101', 'Centro',        'Caruaru',   'PE', '55000-000'),
(2, 'Av. Brasil',          '200', 'Casa',     'Boa Vista',     'Caruaru',   'PE', '55010-000'),
(3, 'Rua Projetada 1',     '50',  NULL,       'São José',      'Caruaru',   'PE', '55020-000'),
(4, 'Rua das Sementes',    '300', 'Fundos',   'Universitário', 'Caruaru',   'PE', '55030-000'),
(5, 'Av. Principal',       '500', 'Loja 01',  'Centro',        'Caruaru',   'PE', '55040-000');

-- Clientes (1:1 com Usuario e 1:1 com Endereco)
INSERT INTO clientes (id, nome, cpf, email, telefone, usuario_id, endereco_id) VALUES
(1, 'João da Silva',      '123.456.789-00', 'joao@exemplo.com',    '(81) 99999-0001', 2, 1),
(2, 'Maria Oliveira',     '987.654.321-00', 'maria@exemplo.com',   '(81) 99999-0002', 3, 2),
(3, 'Carlos Pereira',     '111.222.333-44', 'carlos@exemplo.com',  '(81) 99999-0003', 4, 3),
(4, 'Ana Souza',          '555.666.777-88', 'ana@exemplo.com',     '(81) 99999-0004', 5, 4),
(5, 'Cliente Teste',      '000.111.222-33', 'teste@exemplo.com',   '(81) 99999-0005', 1, 5);

-- Sementes
INSERT INTO sementes (id, nome_popular, nome_cientifico, fabricante, data_validade, quantidade_estoque) VALUES
(1, 'Feijão carioca',     'Phaseolus vulgaris', 'Cooperativa A', '2026-12-31', 500),
(2, 'Milho híbrido',      'Zea mays',           'Cooperativa B', '2027-03-15', 800),
(3, 'Arroz branco',       'Oryza sativa',       'Cooperativa C', '2026-08-20', 600),
(4, 'Soja precoce',       'Glycine max',        'Cooperativa D', '2027-01-10', 400),
(5, 'Trigo duro',         'Triticum durum',     'Cooperativa E', '2026-11-05', 300);

-- Pedidos (muitos pedidos para um cliente)
INSERT INTO pedidos (id, data_pedido, status, valor_total, cliente_id) VALUES
(1, '2025-03-01 10:30:00', 'ABERTO',   150.75, 1),
(2, '2025-03-02 15:00:00', 'FECHADO',  200.00, 1),
(3, '2025-03-03 09:15:00', 'ABERTO',   120.50, 2),
(4, '2025-03-04 14:45:00', 'FECHADO',  300.90, 3),
(5, '2025-03-05 11:20:00', 'ABERTO',    80.00, 4);

-- Relação muitos para muitos entre pedidos e sementes (pedido_semente)
-- Pedido 1 com sementes 1, 2 e 3
INSERT INTO pedido_semente (pedido_id, semente_id) VALUES
(1, 1),
(1, 2),
(1, 3),

-- Pedido 2 com sementes 2 e 4
(2, 2),
(2, 4),

-- Pedido 3 com sementes 1, 3 e 5
(3, 1),
(3, 3),
(3, 5),

-- Pedido 4 com sementes 2, 3, 4 e 5
(4, 2),
(4, 3),
(4, 4),
(4, 5),

-- Pedido 5 com sementes 1 e 5
(5, 1),
(5, 5);
