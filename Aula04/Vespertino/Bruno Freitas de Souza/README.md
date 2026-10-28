# Aula 04 — Laboratório: Middlewares de Log e Autenticação

**Aluno:** Bruno Freitas de Souza — Vespertino

## O que foi feito

Partindo da API de tarefas da Aula 03, foram adicionados dois middlewares:

- **Logging (global):** registrado logo após `express.json()`, mostra no terminal a data, o método e a URL de cada requisição.
- **Autenticação (por rota):** a função `autenticar` exige o cabeçalho `x-token: 123456` e responde `401` quando o token falta ou está errado.

| Método | Rota | Protegida? | Resposta |
|---|---|:---:|---|
| `GET` | `/tarefas` | Não | `200` lista de tarefas |
| `POST` | `/tarefas` | Sim | `201` criada, ou `401` |
| `PUT` | `/tarefas/:id` | Sim | `200` atualizada, `404`, ou `401` |
| `DELETE` | `/tarefas/:id` | Sim | `204` sem corpo, `404`, ou `401` |

Ajustes em relação ao código do laboratório: `req.body || {}` no `POST` e no `PUT` (Express 5) e porta configurável por `PORT` (padrão `3000`).

## Como rodar

```bash
npm install
npm start        # ou: node src/server.js
```

Exemplo de requisição protegida:

```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" -H "x-token: 123456" \
  -d '{"descricao":"Testar a API"}'
```
