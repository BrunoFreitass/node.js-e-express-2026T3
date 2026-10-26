# Laboratório - Aula 03

Neste laboratório, você vai construir uma API RESTful completa para gerenciar uma lista de tarefas. As tarefas serão armazenadas em um array na memória do servidor (ou seja, elas serão perdidas se o servidor for reiniciado).

## Passo 1: Configuração do Projeto

1.  No terminal, navegue até a pasta `Aula03`.

    ```bash
    cd Aula03
    ```

2.  Inicie um novo projeto NPM e instale o Express.

    ```bash
    npm init -y
    npm install express
    ```

3.  Crie a pasta `src` e, dentro dela, o arquivo `server.js`.

## Passo 2: Estrutura Básica do Servidor

Adicione o seguinte código ao seu arquivo `src/server.js`. Este é o ponto de partida.

```javascript
// src/server.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Um array para simular nosso "banco de dados" em memória
let tarefas = [
  { id: 1, descricao: "Estudar Node.js", concluida: true },
  { id: 2, descricao: "Criar API com Express", concluida: false },
];

// Rota principal
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Tarefas!");
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

## Passo 3: Implementando as Rotas CRUD

Agora, adicione as rotas para Criar (Create), Ler (Read), Atualizar (Update) e Deletar (Delete) tarefas.

### Rota para Listar Todas as Tarefas (Read)

Adicione este código ao `server.js`:

```javascript
// GET /tarefas - Retorna todas as tarefas
app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});
```

### Rota para Criar uma Nova Tarefa (Create)

Adicione este código. Note o uso de `req.body` para pegar os dados enviados pelo cliente.

```javascript
// POST /tarefas - Cria uma nova tarefa
app.post("/tarefas", (req, res) => {
  const novaTarefa = {
    id: tarefas.length + 1, // Simples geração de ID
    descricao: req.body.descricao,
    concluida: false,
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa); // 201 significa "Created"
});
```

### Rota para Atualizar uma Tarefa (Update)

Adicione este código. Usamos `req.params.id` para saber qual tarefa atualizar.

```javascript
// PUT /tarefas/:id - Atualiza uma tarefa existente
app.put("/tarefas/:id", (req, res) => {
  const idTarefa = parseInt(req.params.id);
  const tarefa = tarefas.find((t) => t.id === idTarefa);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" }); // 404 Not Found
  }

  tarefa.descricao = req.body.descricao || tarefa.descricao;
  tarefa.concluida =
    req.body.concluida === undefined ? tarefa.concluida : req.body.concluida;

  res.json(tarefa);
});
```

### Rota para Deletar uma Tarefa (Delete)

Finalmente, adicione a rota para deletar.

```javascript
// DELETE /tarefas/:id - Deleta uma tarefa
app.delete("/tarefas/:id", (req, res) => {
  const idTarefa = parseInt(req.params.id);
  const index = tarefas.findIndex((t) => t.id === idTarefa);

  if (index === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  tarefas.splice(index, 1);
  res.status(204).send(); // 204 No Content
});
```

## Passo 4: Testando sua API

1.  **Inicie o servidor**:

    ```bash
    node src/server.js
    ```

    _Dica: use `node --watch src/server.js` para que o servidor reinicie automaticamente a cada alteração no código._

2.  **Use o Postman ou Insomnia para testar cada uma das rotas**:
    - **`GET http://localhost:3000/tarefas`**: Deve listar as tarefas iniciais.
    - **`POST http://localhost:3000/tarefas`**:
      - No corpo (`Body`) da requisição, selecione `JSON` e envie:
        ```json
        {
          "descricao": "Testar a API"
        }
        ```
      - Verifique se a nova tarefa é retornada com status `201`.
    - **`PUT http://localhost:3000/tarefas/2`**:
      - No corpo (`Body`), envie:
        ```json
        {
          "concluida": true
        }
        ```
      - Verifique se a tarefa 2 foi atualizada.
    - **`DELETE http://localhost:3000/tarefas/1`**:
      - Verifique se a resposta tem status `204`.
      - Faça um novo `GET /tarefas` para confirmar que a tarefa 1 foi removida.

**Parabéns! Você construiu sua primeira API RESTful com Express, cobrindo todas as operações básicas de um CRUD.**
