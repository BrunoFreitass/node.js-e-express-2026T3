# Aula 07 — Laboratório: Refatorando a API de Tarefas para REST

**Aluno:** Bruno Freitas de Souza — Noturno

Laboratório da Aula 07 (API de tarefas). A atividade avaliativa de produtos está na pasta acima ([`../README.md`](../README.md)).

## O que foi feito

As cinco rotas do código-base foram refatoradas seguindo o `laboratorio.md`:

| # | Antes | Depois | Status |
|---|---|---|---|
| 1 | `GET /getTasks` | `GET /tasks` | `200` |
| 2 | `GET /getTaskById?id=1` | `GET /tasks/:id` | `200` ou `404` |
| 3 | `POST /createTask` | `POST /tasks` | `201` ou `400` (sem `title`) |
| 4 | `POST /updateTask` | `PUT /tasks/:id` | `200`, `400` (dados incompletos) ou `404` |
| 5 | `GET /deleteTask?id=1` | `DELETE /tasks/:id` | `204` ou `404` |

Ajustes em relação ao código do laboratório: `req.body || {}` no `POST` e no `PUT` (Express 5) e porta configurável por `PORT` (padrão `3000`).

## Como rodar

```bash
npm install
npm start        # ou: node src/server.js
```

Exemplos de body:

- `POST /tasks` → `{ "title": "Estudar REST" }`
- `PUT /tasks/1` → `{ "title": "Aprender Node.js", "completed": true }` (o `PUT` exige `title` e `completed` booleano)
