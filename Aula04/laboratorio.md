# Laboratório - Aula 04

Neste laboratório, você vai adicionar middlewares de logging e autenticação à API de tarefas criada na aula anterior.

## Pré-requisito

Copie o código final do `server.js` da **Aula 03** para a pasta `src` da **Aula 04**. Se não o tiver, pode usar o código do gabarito da aula anterior como ponto de partida.

## Passo 1: Middleware de Logging

Vamos criar um middleware que registra no console cada requisição que o servidor recebe.

1.  No seu arquivo `src/server.js`, logo após a linha `app.use(express.json());`, adicione o seguinte código:

    ```javascript
    // Middleware de Logging
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next(); // Essencial para passar para o próximo middleware ou rota!
    });
    ```

2.  **Teste**: Reinicie seu servidor e faça qualquer requisição (ex: `GET /tarefas`) com o Postman. Você deve ver o log aparecer no seu terminal. A ordem é importante: este middleware deve vir **antes** das suas rotas para que ele possa interceptar todas as requisições.

## Passo 2: Middleware de Autenticação Simples

Agora, vamos criar uma camada de segurança. Apenas requisições que contiverem um "token" secreto no cabeçalho poderão modificar os dados (criar, atualizar ou deletar tarefas).

1.  Ainda no `src/server.js`, adicione a função do middleware de autenticação:

    ```javascript
    // Middleware de Autenticação
    function autenticar(req, res, next) {
      const token = req.headers["x-token"]; // O cliente deve enviar o token neste cabeçalho

      if (token !== "123456") {
        // Se o token não for válido, bloqueamos a requisição com erro 401
        return res.status(401).json({ erro: "Token inválido. Acesso negado." });
      }

      // Se o token for válido, continuamos para a rota
      next();
    }
    ```

## Passo 3: Protegendo as Rotas

Não queremos proteger todas as rotas. A listagem de tarefas (`GET /tarefas`) pode continuar pública, mas as operações de escrita devem ser protegidas.

Para aplicar um middleware a uma rota específica, nós o passamos como um argumento antes da função da rota.

1.  **Modifique a rota `POST /tarefas`**:

    ```javascript
    // Antes: app.post('/tarefas', (req, res) => { ... });
    // Depois:
    app.post("/tarefas", autenticar, (req, res) => {
      // ... o resto da função continua igual
    });
    ```

2.  **Modifique a rota `PUT /tarefas/:id`**:

    ```javascript
    // Antes: app.put('/tarefas/:id', (req, res) => { ... });
    // Depois:
    app.put("/tarefas/:id", autenticar, (req, res) => {
      // ... o resto da função continua igual
    });
    ```

3.  **Modifique a rota `DELETE /tarefas/:id`**:

    ```javascript
    // Antes: app.delete('/tarefas/:id', (req, res) => { ... });
    // Depois:
    app.delete("/tarefas/:id", autenticar, (req, res) => {
      // ... o resto da função continua igual
    });
    ```

## Passo 4: Testando a Segurança

Reinicie o servidor e use o Postman para testar todos os cenários.

1.  **Teste de Rota Pública**:
    - `GET http://localhost:3000/tarefas`
    - **Resultado Esperado**: Sucesso (Status 200), mesmo sem enviar token.

2.  **Teste de Rota Protegida (Sem Token)**:
    - `POST http://localhost:3000/tarefas` com um corpo JSON.
    - **Resultado Esperado**: Falha (Status 401 - Unauthorized) com a mensagem de erro.

3.  **Teste de Rota Protegida (Com Token Inválido)**:
    - `POST http://localhost:3000/tarefas` com um corpo JSON.
    - Adicione um cabeçalho (`Header`): `x-token` com o valor `senha-errada`.
    - **Resultado Esperado**: Falha (Status 401).

4.  **Teste de Rota Protegida (Com Token Correto)**:
    - `POST http://localhost:3000/tarefas` com um corpo JSON.
    - Adicione um cabeçalho (`Header`): `x-token` com o valor `123456`.
    - **Resultado Esperado**: Sucesso (Status 201), a tarefa é criada.

Repita os testes de token para as rotas `PUT` e `DELETE`.

**Parabéns! Você implementou com sucesso middlewares para logging e autenticação, tornando sua API mais robusta e segura.**
