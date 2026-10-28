# Minha API RESTful — Produtos

**Aula 07 · Atividade RESTful**
**Aluno:** Bruno Freitas de Souza · **Turma:** Vespertino

Refatoração da API de produtos da Aula 07 para seguir os princípios REST: URIs com substantivos no plural, métodos HTTP com significado, dados em `params`/`body` e códigos de status semânticos.

---

## Como executar

```bash
npm install
npm start
```

O servidor sobe em `http://localhost:3000`.

---

## O que foi corrigido

| # | Antes (não-RESTful) | Depois (RESTful) | Problemas corrigidos |
|---|---|---|---|
| 1 | `GET /listarProdutos` | `GET /produtos` | Verbo na URI |
| 2 | `POST /buscarProduto` (id no body) | `GET /produtos/:id` | Verbo na URI, método errado (POST para leitura), id no body, 200 com texto quando não achava → agora **404** |
| 3 | `GET /adicionarProduto?nome=...` | `POST /produtos` | Verbo na URI, GET alterando dados, dados na query, sem validação, 200 com texto → agora **201** com o produto criado; id gerado com `length + 1` (duplicava após remoções) → agora usa um contador |
| 4 | `GET /modificarProduto/:id?nome=...` | `PUT /produtos/:id` e `PATCH /produtos/:id` | Verbo na URI, GET alterando dados, dados na query (chegavam como texto e podiam sobrescrever o `id`), 200 quando não achava → agora **404** |
| 5 | `POST /removerProduto` (id no body) | `DELETE /produtos/:id` | Verbo na URI, método errado, id no body, sempre "sucesso" mesmo se não existisse → agora **204** ou **404** |

### Extras

- **Validação:** `nome` obrigatório (texto não vazio) e `preco` numérico maior que 0. `estoque` (inteiro ≥ 0) e `categoria` (texto) são opcionais e validados quando enviados.
- **`req.body || {}`:** no Express 5, `req.body` fica `undefined` quando a requisição vem sem corpo. Assim a API responde 400 em vez de quebrar.
- **Middleware de log:** registra método, rota, status e tempo de cada requisição no terminal.
- **JSON mal formatado:** retorna 400 em JSON.
- **Rota inexistente:** retorna 404 em JSON.

---

## Modelo do recurso `produto`

```json
{
  "id": 1,
  "nome": "Notebook Gamer",
  "preco": 7500,
  "estoque": 30,
  "categoria": "Eletrônicos"
}
```

| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `id` | número | gerado pela API | não pode ser alterado |
| `nome` | texto | sim (POST/PUT) | não vazio |
| `preco` | número | sim (POST/PUT) | maior que 0 |
| `estoque` | número inteiro | não (padrão `0`) | maior ou igual a 0 |
| `categoria` | texto | não (padrão `"Sem categoria"`) | — |

Todas as respostas de erro seguem o formato:

```json
{ "erro": "Mensagem explicando o problema." }
```

---

## Endpoints

### `GET /produtos` — listar todos

**Body:** nenhum

| Status | Quando | Resposta |
|---|---|---|
| 200 OK | sempre | lista de produtos |

```json
[
  { "id": 1, "nome": "Notebook Gamer", "preco": 7500, "estoque": 30, "categoria": "Eletrônicos" },
  { "id": 2, "nome": "Cadeira de Escritório", "preco": 1200, "estoque": 50, "categoria": "Móveis" }
]
```

---

### `GET /produtos/:id` — buscar um produto

**Body:** nenhum

| Status | Quando | Resposta |
|---|---|---|
| 200 OK | produto encontrado | o produto |
| 400 Bad Request | `:id` não é inteiro positivo (ex.: `/produtos/abc`) | `{ "erro": "O id deve ser um número inteiro positivo." }` |
| 404 Not Found | produto não existe | `{ "erro": "Produto não encontrado." }` |

---

### `POST /produtos` — criar produto

**Body (JSON):**

```json
{
  "nome": "Monitor 27\"",
  "preco": 1899.9,
  "estoque": 15,
  "categoria": "Eletrônicos"
}
```

| Status | Quando | Resposta |
|---|---|---|
| 201 Created | produto criado | o produto criado, com o header `Location: /produtos/{id}` |
| 400 Bad Request | sem `nome`, `preco` ausente/≤ 0/não numérico, `estoque` inválido, sem corpo ou JSON mal formatado | `{ "erro": "..." }` |

---

### `PUT /produtos/:id` — atualizar por completo

Substitui o produto inteiro. Campos opcionais que não forem enviados voltam ao valor padrão.

**Body (JSON):**

```json
{
  "nome": "Notebook Gamer Pro",
  "preco": 8200,
  "estoque": 25,
  "categoria": "Eletrônicos"
}
```

| Status | Quando | Resposta |
|---|---|---|
| 200 OK | produto atualizado | o produto atualizado |
| 400 Bad Request | `:id` inválido ou body inválido (mesmas regras do POST) | `{ "erro": "..." }` |
| 404 Not Found | produto não existe | `{ "erro": "Produto não encontrado." }` |

---

### `PATCH /produtos/:id` — atualizar parcialmente (bônus)

Altera só os campos enviados. Os outros continuam como estão.

**Body (JSON):**

```json
{ "preco": 6999 }
```

| Status | Quando | Resposta |
|---|---|---|
| 200 OK | produto atualizado | o produto com as alterações |
| 400 Bad Request | `:id` inválido, body vazio/sem campos válidos, ou campo enviado inválido (ex.: `preco: -5`) | `{ "erro": "..." }` |
| 404 Not Found | produto não existe | `{ "erro": "Produto não encontrado." }` |

---

### `DELETE /produtos/:id` — remover produto

**Body:** nenhum

| Status | Quando | Resposta |
|---|---|---|
| 204 No Content | produto removido | **sem corpo** |
| 400 Bad Request | `:id` inválido | `{ "erro": "O id deve ser um número inteiro positivo." }` |
| 404 Not Found | produto não existe | `{ "erro": "Produto não encontrado." }` |

---

## Testes no Postman

Os prints dos testes estão na pasta [`screenshots-postman/`](screenshots-postman/).

| Cenário | Esperado |
|---|---|
| `GET /produtos` | 200 + lista |
| `GET /produtos/1` | 200 + produto |
| `GET /produtos/999` | 404 |
| `POST /produtos` (dados válidos) | 201 + produto criado |
| `POST /produtos` (sem nome) | 400 |
| `POST /produtos` (preço ≤ 0) | 400 |
| `PUT /produtos/1` | 200 + atualizado |
| `PUT /produtos/999` | 404 |
| `PATCH /produtos/2` | 200 + atualizado parcialmente |
| `DELETE /produtos/1` | 204 sem corpo |
| `DELETE /produtos/999` | 404 |
