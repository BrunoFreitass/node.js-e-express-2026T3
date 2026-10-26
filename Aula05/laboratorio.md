# Laboratório Aula 05: Criando seu primeiro Banco de Dados com PostgreSQL

## Objetivo

Neste laboratório, você irá instalar o PostgreSQL, criar um banco de dados para a nossa aplicação de tarefas e executar os scripts SQL para criar as tabelas `users` e `tasks` que modelamos na parte teórica.

## Ferramentas Necessárias

- **PostgreSQL**: O sistema de gerenciamento de banco de dados.
- **DBeaver** ou **pgAdmin**: Ferramentas gráficas (GUI) para administrar e interagir com o banco de dados. Facilitam muito a visualização de tabelas e a execução de scripts.
- **Draw.io** ou similar (opcional): Para desenhar o diagrama entidade-relacionamento.

## Passo a Passo

### Parte 1: Instalação e Configuração do Ambiente

#### 1. Instalar o PostgreSQL

Se você ainda não tem o PostgreSQL instalado, siga as instruções para o seu sistema operacional.

- **Windows/macOS**: Baixe o instalador no [site oficial da EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
  - Durante a instalação, você será solicitado a definir uma **senha** para o superusuário `postgres`. **Anote essa senha, pois você precisará dela!**
  - Mantenha as demais configurações padrão.

- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```
  Após a instalação, defina a senha para o usuário `postgres`:
  ```bash
  sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'sua-senha-aqui';"
  ```

#### 2. Instalar uma Ferramenta Gráfica (GUI)

Recomendamos o **DBeaver** por ser gratuito, de código aberto e compatível com diversos bancos de dados.

- Baixe o DBeaver no [site oficial](https://dbeaver.io/download/).
- Instale-o seguindo as instruções do instalador.

### Parte 2: Criando o Banco de Dados

#### 1. Conectar ao PostgreSQL no DBeaver

1.  Abra o DBeaver.
2.  Clique no ícone de "Nova Conexão" (um ícone de tomada).
3.  Selecione **PostgreSQL** e clique em "Próximo".
4.  Na aba "Principal", preencha os dados da conexão:
    - **Host**: `localhost`
    - **Porta**: `5432` (padrão)
    - **Banco de Dados**: `postgres` (usaremos este banco padrão apenas para conectar inicialmente)
    - **Nome de usuário**: `postgres`
    - **Senha**: A senha que você definiu durante a instalação do PostgreSQL.
5.  Clique em "Testar Conexão" para verificar se tudo está correto. Se funcionar, clique em "Finalizar".

#### 2. Criar o Banco de Dados `task_manager`

Agora que estamos conectados ao servidor PostgreSQL, vamos criar o banco de dados específico para nossa aplicação.

1.  No DBeaver, clique com o botão direito na sua conexão PostgreSQL (no painel "Navegador de Banco de Dados") e selecione **"Editor SQL" -> "Novo Editor SQL"**.
2.  Digite o seguinte comando SQL e execute-o (clicando no ícone de play laranja ou usando `Ctrl+Enter`):

    ```sql
    CREATE DATABASE task_manager;
    ```

3.  Após a execução, você pode precisar atualizar a lista de bancos de dados. Clique com o botão direito na conexão e selecione "Atualizar". O `task_manager` deve aparecer na lista.

### Parte 3: Criando as Tabelas `users` e `tasks`

Agora, vamos nos conectar ao novo banco de dados e criar nossas tabelas.

#### 1. Reconectar ao Banco `task_manager`

É uma boa prática criar uma nova conexão no DBeaver diretamente para o seu banco de dados de desenvolvimento.

1.  Crie uma nova conexão PostgreSQL como antes, mas desta vez, no campo **Banco de Dados**, digite `task_manager`.
2.  Isso garante que todos os scripts que você executar a partir de agora serão aplicados ao banco de dados correto.

#### 2. Executar o Script de Criação de Tabelas

1.  Abra um novo Editor SQL para a conexão com `task_manager`.
2.  Copie e cole o script SQL abaixo no editor. Este script cria as tabelas `users` e `tasks` com as colunas e relacionamentos que definimos.

    ```sql
    -- Tabela para armazenar os usuários
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela para armazenar as tarefas
    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pendente',
        due_date DATE,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        -- Define a chave estrangeira que relaciona a tarefa a um usuário
        CONSTRAINT fk_user
            FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE -- Se um usuário for deletado, suas tarefas também serão.
    );

    -- Adiciona um índice na coluna user_id para otimizar consultas
    CREATE INDEX idx_tasks_user_id ON tasks(user_id);
    ```

3.  Execute o script completo.

#### 3. Verificar a Criação das Tabelas

1.  No painel "Navegador de Banco de Dados", navegue pela sua conexão: `task_manager` -> `Schemas` -> `public` -> `Tabelas`.
2.  Você deve ver as tabelas `users` и `tasks` listadas.
3.  Clique duas vezes em cada tabela para ver suas colunas, tipos de dados e outras propriedades.

### Parte 4: Testando as Tabelas com Operações CRUD (Opcional)

Agora que suas tabelas estão criadas, você pode executar alguns comandos SQL básicos para praticar a manipulação de dados. Execute estes comandos no seu Editor SQL do DBeaver para ver como o CRUD funciona diretamente no banco.

#### 1. CREATE: Inserindo dados

```sql
-- Inserir um novo usuário
INSERT INTO users (name, email, password)
VALUES ('Alice', 'alice@example.com', 'senha123');

-- Inserir uma tarefa para a usuária Alice (que tem id = 1)
INSERT INTO tasks (title, description, status, user_id)
VALUES ('Estudar SQL', 'Praticar INSERT e SELECT', 'pendente', 1);
```

#### 2. READ: Consultando dados

```sql
-- Listar todos os usuários
SELECT * FROM users;

-- Listar todas as tarefas
SELECT * FROM tasks;

-- Listar as tarefas de um usuário específico
SELECT * FROM tasks WHERE user_id = 1;
```

#### 3. Praticando com JOINs

Agora, vamos usar `JOIN` para combinar dados das duas tabelas.

```sql
-- INNER JOIN: Listar tarefas com os nomes dos seus respectivos usuários
-- Retornará apenas tarefas que têm um usuário associado.
SELECT
    tasks.title AS task_title,
    tasks.status,
    users.name AS user_name,
    users.email
FROM
    tasks
INNER JOIN
    users ON tasks.user_id = users.id;

-- LEFT JOIN: Listar todos os usuários e suas tarefas
-- Incluirá usuários que não têm nenhuma tarefa.
INSERT INTO users (name, email, password) VALUES ('Bob', 'bob@example.com', 'senha456');

SELECT
    users.name AS user_name,
    tasks.title AS task_title
FROM
    users
LEFT JOIN
    tasks ON users.id = tasks.user_id;

-- RIGHT JOIN: Listar todas as tarefas e seus usuários
-- Em nosso modelo, toda tarefa deve ter um usuário, então o resultado
-- será igual ao do INNER JOIN. Mas é bom para praticar a sintaxe.
SELECT
    tasks.title AS task_title,
    users.name AS user_name
FROM
    tasks
RIGHT JOIN
    users ON tasks.user_id = users.id;

-- Filtrando com JOIN: Listar apenas as tarefas de 'Alice'
SELECT
    tasks.title,
    tasks.status
FROM
    tasks
INNER JOIN
    users ON tasks.user_id = users.id
WHERE
    users.name = 'Alice';
```

#### 4. UPDATE: Atualizando dados

```sql
-- Atualizar o status de uma tarefa
UPDATE tasks
SET status = 'em andamento'
WHERE id = 1;

-- Verificar a atualização
SELECT * FROM tasks WHERE id = 1;
```

#### 4. DELETE: Removendo dados

```sql
-- Deletar uma tarefa específica
DELETE FROM tasks WHERE id = 1;

-- Verificar se a tarefa foi removida
SELECT * FROM tasks;

-- Se você deletar um usuário, as tarefas dele também serão removidas
-- por causa da configuração "ON DELETE CASCADE" na chave estrangeira.
-- CUIDADO: Este comando é destrutivo!
-- DELETE FROM users WHERE id = 1;
```

## Atividade Complementar (0.5h)

1.  **Desenhe o Diagrama**: Usando o [Draw.io](https://app.diagrams.net/) ou outra ferramenta de sua preferência, crie um Diagrama Entidade-Relacionamento (DER) que represente as tabelas `users` e `tasks` e seu relacionamento.
2.  **Entregue o Diagrama**: Salve o diagrama como uma imagem (`.png` ou `.jpg`) ou em seu formato nativo e adicione-o à pasta `Aula05` do seu repositório.

## O que será observado

- A criação bem-sucedida do banco de dados `task_manager`.
- A correta criação das tabelas `users` e `tasks` com todas as colunas, tipos e restrições (chaves primárias e estrangeiras).
- O diagrama de modelagem entregue como parte da atividade complementar.

Parabéns! Você acaba de criar a fundação do banco de dados para a sua aplicação. Na próxima aula, aprenderemos a conectar nossa API Node.js a este banco para manipular os dados.

---

## 5. Evoluindo o Banco de Dados com `ALTER TABLE`

No desenvolvimento de software, é muito comum que os requisitos mudem e que precisemos alterar a estrutura de tabelas que já existem. O comando `ALTER TABLE` é a ferramenta para isso.

Vamos ver alguns exemplos práticos baseados em nosso projeto.

### Exemplo 1: Adicionar uma coluna de prioridade às tarefas

Imagine que agora precisamos definir uma prioridade (ex: 'baixa', 'média', 'alta') para nossas tarefas.

```sql
ALTER TABLE tasks
ADD COLUMN priority VARCHAR(20);
```

Após executar este comando, se você consultar a tabela `tasks`, verá a nova coluna `priority` preenchida com `NULL` para os registros existentes.

Podemos definir um valor padrão para essa nova coluna:

```sql
-- Define um valor padrão para a coluna
ALTER TABLE tasks
ALTER COLUMN priority SET DEFAULT 'baixa';

-- Agora, novas tarefas inseridas sem especificar a prioridade receberão 'baixa'
INSERT INTO tasks (title, user_id) VALUES ('Nova tarefa sem prioridade', 1);
```

### Exemplo 2: Renomear uma coluna

Suponha que decidimos que `name` na tabela `users` deveria se chamar `full_name` para ser mais descritivo.

```sql
ALTER TABLE users
RENAME COLUMN name TO full_name;
```

### Exemplo 3: Adicionar uma restrição `CHECK`

Queremos garantir que o `status` de uma tarefa só possa ser 'pendente', 'em andamento' ou 'concluída'. Podemos adicionar uma restrição `CHECK`.

```sql
ALTER TABLE tasks
ADD CONSTRAINT check_status
CHECK (status IN ('pendente', 'em andamento', 'concluída'));
```

Agora, se você tentar inserir ou atualizar uma tarefa com um status diferente, o PostgreSQL retornará um erro.

```sql
-- Este comando irá falhar
UPDATE tasks SET status = 'atrasada' WHERE id = 1;
-- ERROR:  new row for relation "tasks" violates check constraint "check_status"
```

### Exemplo 4: Remover uma coluna

Se a coluna `due_date` não for mais necessária, podemos removê-la. **Cuidado, esta ação é destrutiva e remove todos os dados da coluna.**

```sql
ALTER TABLE tasks
DROP COLUMN due_date;
```

Esses são apenas alguns exemplos do poder do `ALTER TABLE`. Ele permite que seu esquema de banco de dados evolua junto com sua aplicação.
