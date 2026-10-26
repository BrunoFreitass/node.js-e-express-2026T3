const express = require("express");
const app = express();
const port = 3000;

// 1. Middleware de parsing de JSON
app.use(express.json());

// 2. Middleware de Logging (global)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Middleware de Autenticação (função reutilizável)
function autenticar(req, res, next) {
  const token = req.headers["x-token"];

  if (token !== "123456") {
    return res.status(401).json({ erro: "Token inválido. Acesso negado." });
  }

  next();
}

// "Banco de dados" em memória
let tarefas = [
  { id: 1, descricao: "Estudar Node.js", concluida: true },
  { id: 2, descricao: "Criar API com Express", concluida: false },
];

// --- ROTAS ---

// Rota pública
app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});

// Rotas protegidas
app.post("/tarefas", autenticar, (req, res) => {
  const novaTarefa = {
    id: tarefas.length > 0 ? Math.max(...tarefas.map((t) => t.id)) + 1 : 1,
    descricao: req.body.descricao,
    concluida: req.body.concluida || false,
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", autenticar, (req, res) => {
  const idTarefa = parseInt(req.params.id);
  const tarefa = tarefas.find((t) => t.id === idTarefa);
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  tarefa.descricao = req.body.descricao || tarefa.descricao;
  if (req.body.concluida !== undefined) {
    tarefa.concluida = req.body.concluida;
  }
  res.json(tarefa);
});

app.delete("/tarefas/:id", autenticar, (req, res) => {
  const idTarefa = parseInt(req.params.id);
  const index = tarefas.findIndex((t) => t.id === idTarefa);
  if (index === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  tarefas.splice(index, 1);
  res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});