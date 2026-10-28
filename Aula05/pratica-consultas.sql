-- =====================================================================
-- ROTEIRO PRÁTICO DE CONSULTAS — AULA 05 (PostgreSQL / DBeaver)
-- Execute primeiro o arquivo Aula05/schema.sql no banco task_manager
-- =====================================================================

-- ---------------------------------------------------------------------
-- PARTE 1: CREATE (Inserindo novos usuários e tarefas)
-- ---------------------------------------------------------------------
INSERT INTO users (name, email, password)
VALUES ('Alice', 'alice@example.com', 'senha123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password)
VALUES ('Bob', 'bob@example.com', 'senha456')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (title, description, status, due_date, user_id)
SELECT 'Estudar SQL', 'Praticar INSERT, SELECT e JOINs no PostgreSQL', 'pendente', '2026-11-05', id
FROM users WHERE email = 'alice@example.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Estudar SQL');

INSERT INTO tasks (title, description, status, due_date, user_id)
SELECT 'Modelar DER no Draw.io', 'Criar diagrama das tabelas users e tasks', 'concluída', '2026-10-27', id
FROM users WHERE email = 'alice@example.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Modelar DER no Draw.io');


-- ---------------------------------------------------------------------
-- PARTE 2: READ (Consultando dados nas tabelas)
-- ---------------------------------------------------------------------
-- 2.1 Listar todos os usuários
SELECT id, name, username, email, created_at FROM users;

-- 2.2 Listar todas as tarefas
SELECT id, title, description, status, completed, due_date, user_id FROM tasks;

-- 2.3 Filtrar tarefas de um usuário específico
SELECT * FROM tasks
WHERE user_id = (SELECT id FROM users WHERE email = 'alice@example.com');


-- ---------------------------------------------------------------------
-- PARTE 3: PRATICANDO COM JOINs (Relacionando users e tasks)
-- ---------------------------------------------------------------------
-- 3.1 INNER JOIN: Retorna apenas tarefas e seus respectivos usuários
SELECT
    t.id AS task_id,
    t.title AS task_title,
    t.status,
    u.name AS user_name,
    u.email
FROM tasks t
INNER JOIN users u ON t.user_id = u.id
ORDER BY t.id;

-- 3.2 LEFT JOIN: Lista TODOS os usuários e suas tarefas (inclusive Bob, que não tem tarefas -> NULL)
SELECT
    u.id AS user_id,
    u.name AS user_name,
    t.title AS task_title,
    t.status
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
ORDER BY u.id;

-- 3.3 RIGHT JOIN: Lista todas as tarefas e seus respectivos usuários
SELECT
    t.title AS task_title,
    u.name AS user_name
FROM tasks t
RIGHT JOIN users u ON t.user_id = u.id;

-- 3.4 Filtrando com INNER JOIN: Apenas tarefas da usuária 'Alice'
SELECT
    t.title,
    t.description,
    t.status,
    t.due_date
FROM tasks t
INNER JOIN users u ON t.user_id = u.id
WHERE u.name = 'Alice';


-- ---------------------------------------------------------------------
-- PARTE 4: UPDATE e DELETE (Atualizando e Removendo Registros)
-- ---------------------------------------------------------------------
-- 4.1 Atualizar o status de uma tarefa para 'em andamento'
UPDATE tasks
SET status = 'em andamento'
WHERE title = 'Estudar SQL';

-- Verificar a atualização
SELECT id, title, status, completed FROM tasks WHERE title = 'Estudar SQL';

-- 4.2 Exemplo de DELETE (comentado para preservar os dados de estudo)
-- DELETE FROM tasks WHERE title = 'Estudar SQL';


-- ---------------------------------------------------------------------
-- PARTE 5: EVOLUINDO O BANCO COM ALTER TABLE (Exemplos da Aula 05)
-- ---------------------------------------------------------------------
-- 5.1 Adicionar coluna 'priority' com valor padrão 'baixa'
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'baixa';

-- 5.2 Adicionar restrição CHECK nos valores permitidos de status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_status'
    ) THEN
        ALTER TABLE tasks
        ADD CONSTRAINT check_status
        CHECK (status IN ('pendente', 'em andamento', 'concluída'));
    END IF;
END $$;
