// src/server.js
// Laboratório 07: API de tarefas refatorada para o padrão RESTful
// Antes: /getTasks, /getTaskById?id=, POST /createTask, POST /updateTask, GET /deleteTask?id=
// Agora: substantivos no plural, id na rota, método HTTP define a ação e status semânticos
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// "Banco de dados" em memória
let tasks = [
  { id: 1, title: "Aprender Node.js", completed: false },
  { id: 2, title: "Criar uma API", completed: true },
];
let nextId = 3;

// Refatoração 1: GET /getTasks -> GET /tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// Refatoração 2: GET /getTaskById?id=1 -> GET /tasks/:id (404 se não existir)
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).send("Tarefa não encontrada");
  }
});

// Refatoração 3: POST /createTask -> POST /tasks (201 com a tarefa criada)
app.post("/tasks", (req, res) => {
  // Express 5: req.body fica undefined quando a requisição vem sem corpo
  const { title, completed = false } = req.body || {};

  if (!title) {
    return res.status(400).send("O título da tarefa é obrigatório.");
  }

  const newTask = {
    id: nextId++,
    title,
    completed,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Refatoração 4: POST /updateTask -> PUT /tasks/:id (substitui o recurso inteiro)
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).send("Tarefa não encontrada");
  }

  const { title, completed } = req.body || {};
  if (!title || typeof completed !== "boolean") {
    return res.status(400).send("Dados incompletos para atualização.");
  }

  tasks[taskIndex] = { id, title, completed };
  res.status(200).json(tasks[taskIndex]);
});

// Refatoração 5: GET /deleteTask?id=1 -> DELETE /tasks/:id (204 sem corpo)
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).send("Tarefa não encontrada");
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send(); // 204 No Content
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
