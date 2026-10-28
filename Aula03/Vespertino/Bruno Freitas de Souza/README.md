# Aula 03 — Laboratório: API de Tarefas com Express

**Aluno:** Bruno Freitas de Souza — Vespertino

## O que foi feito

API RESTful de tarefas com Express, com os dados em um array na memória (são perdidos ao reiniciar o servidor).

| Método | Rota | Body (JSON) | Resposta |
|---|---|---|---|
| `GET` | `/` | — | `200` mensagem de boas-vindas |
| `GET` | `/tarefas` | — | `200` lista de tarefas |
| `POST` | `/tarefas` | `{ "descricao": "Testar a API" }` | `201` tarefa criada |
| `PUT` | `/tarefas/:id` | `{ "concluida": true }` | `200` tarefa atualizada ou `404` |
| `DELETE` | `/tarefas/:id` | — | `204` sem corpo ou `404` |

Ajustes em relação ao código do laboratório:

- `req.body || {}` no `POST` e no `PUT`: no Express 5, `req.body` fica `undefined` quando a requisição vem sem corpo.
- Porta configurável por `PORT` (padrão `3000`).

## Como rodar

```bash
npm install
npm start        # ou: node src/server.js
```

O servidor sobe em `http://localhost:3000`.
