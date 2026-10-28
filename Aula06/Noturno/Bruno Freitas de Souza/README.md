# Aula 06 — Laboratório: API de Tarefas com PostgreSQL

**Aluno:** Bruno Freitas de Souza — Noturno

## O que foi feito

Partindo da API da Aula 04 (middlewares de log e de autenticação), o array em memória foi trocado por consultas ao PostgreSQL no banco `task_manager` (criado com `Aula05/schema.sql`). Os dados agora persistem depois de reiniciar o servidor.

- `src/db.js`: módulo de conexão com `Pool` do `pg`. As credenciais vêm do `.env` (lido com `dotenv`), nunca do código.
- `src/server.js`: CRUD de `/tasks` com `async/await` e `try...catch`.
- Todas as queries são parametrizadas (`$1`, `$2`, ...). `POST`, `PUT` e `DELETE` usam `RETURNING *`.
- `.gitignore` da pasta ignora `node_modules/` e `.env`. O `.env.example` mostra as variáveis sem a senha.

| Método | Rota | Protegida? | Body (JSON) | Resposta |
|---|---|:---:|---|---|
| `GET` | `/tasks` | Não | — | `200` lista |
| `GET` | `/tasks/:id` | Não | — | `200` ou `404` |
| `POST` | `/tasks` | Sim | `{ "title": "Estudar SQL", "user_id": 1 }` | `201`, `400` (sem `title`/`user_id`) ou `401` |
| `PUT` | `/tasks/:id` | Sim | `{ "status": "concluída" }` | `200`, `404` ou `401` |
| `DELETE` | `/tasks/:id` | Sim | — | `204`, `404` ou `401` |

As rotas protegidas exigem o cabeçalho `x-token: 123456` (middleware da Aula 04). `user_id` precisa existir na tabela `users`.

## Como rodar

1. Crie o banco com `Aula05/schema.sql` (se ainda não criou).
2. Copie `.env.example` para `.env` e preencha `DB_PASSWORD`.
3. Instale e rode:

```bash
npm install
npm start        # ou: node src/server.js
```

Ao subir, o terminal mostra "Conexão com o banco de dados estabelecida com sucesso!" na primeira consulta.
