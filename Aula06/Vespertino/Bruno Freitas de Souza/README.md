# Aula 06 — Laboratório: API de Tarefas com PostgreSQL

**Aluno:** Bruno Freitas de Souza — Vespertino

## O que foi feito

Partindo da API da Aula 04 (middleware de log), o array em memória foi trocado por consultas ao PostgreSQL no banco `task_manager` (criado com `Aula05/schema.sql`). Os dados agora persistem depois de reiniciar o servidor.

- `src/db.js`: módulo de conexão com `Pool` do `pg`. As credenciais vêm do `.env` (lido com `dotenv`), nunca do código.
- `src/server.js`: CRUD de `/tasks` com `async/await` e `try...catch`.
- Todas as queries são parametrizadas (`$1`, `$2`, ...). `POST`, `PUT` e `DELETE` usam `RETURNING *`.
- `.gitignore` da pasta ignora `node_modules/` e `.env`. O `.env.example` mostra as variáveis sem a senha.

| Método | Rota | Body (JSON) | Resposta |
|---|---|---|---|
| `GET` | `/tasks` | — | `200` lista |
| `GET` | `/tasks/:id` | — | `200` ou `404` |
| `POST` | `/tasks` | `{ "title": "Estudar SQL", "user_id": 1 }` | `201` ou `400` (sem `title`/`user_id`) |
| `PUT` | `/tasks/:id` | `{ "status": "concluída" }` | `200` ou `404` |
| `DELETE` | `/tasks/:id` | — | `204` ou `404` |

Seguindo a versão do professor, nenhuma rota exige token: a função `autenticar` (Aula 04) continua no arquivo, mas não é aplicada. O `PUT` busca a tarefa atual e só troca os campos enviados (`title || atual.title`, etc.). `user_id` precisa existir na tabela `users`.

## Como rodar

1. Crie o banco com `Aula05/schema.sql` (se ainda não criou).
2. Copie `.env.example` para `.env` e preencha `DB_PASSWORD`.
3. Instale e rode:

```bash
npm install
npm start        # ou: node src/server.js
```

Ao subir, o terminal mostra "Conexão com o banco de dados estabelecida com sucesso!" na primeira consulta.
