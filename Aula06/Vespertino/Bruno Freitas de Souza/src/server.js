// src/server.js
const express = require("express");
const db = require("./db"); // Importa nosso módulo de conexão
const app = express();
const port = process.env.PORT || 3000;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Middleware de Logging (Aula 04)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware de Autenticação (Aula 04): mantido como referência, não aplicado nas rotas (como na versão do professor)
function autenticar(req, res, next) {
  const token = req.headers["x-token"];

  if (token !== "123456") {
    return res.status(401).json({ erro: "Token inválido. Acesso negado." });
  }

  next();
}

// Rota principal
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Tarefas com PostgreSQL!");
});

// GET /tasks - Lista todas as tarefas
app.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// GET /tasks/:id - Busca uma tarefa por ID
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Tarefa não encontrada.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// POST /tasks - Cria uma tarefa (RETURNING * devolve a tarefa criada)
app.post("/tasks", async (req, res) => {
  // Express 5: req.body fica undefined quando a requisição vem sem corpo
  const { title, description, status, user_id } = req.body || {};

  // Validação simples
  if (!title || !user_id) {
    return res.status(400).send("Título e user_id são obrigatórios.");
  }

  const query = `
    INSERT INTO tasks (title, description, status, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, description || null, status || "pendente", user_id];

  try {
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// PUT /tasks/:id - Atualiza uma tarefa
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  // Busca a tarefa atual primeiro e depois monta o UPDATE com os valores novos ou atuais
  try {
    const currentTaskResult = await db.query(
      "SELECT * FROM tasks WHERE id = $1",
      [id],
    );
    if (currentTaskResult.rows.length === 0) {
      return res.status(404).send("Tarefa não encontrada.");
    }

    const currentTask = currentTaskResult.rows[0];

    const newTitle = title || currentTask.title;
    const newDescription = description || currentTask.description;
    const newStatus = status || currentTask.status;

    const updateQuery = `
      UPDATE tasks
      SET title = $1, description = $2, status = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [newTitle, newDescription, newStatus, id];

    const result = await db.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// DELETE /tasks/:id - Remove uma tarefa
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Tarefa não encontrada.");
    }

    res.status(204).send(); // 204 No Content é a resposta padrão para um DELETE bem-sucedido
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
