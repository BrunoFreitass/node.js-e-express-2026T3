# 🎓 Laboratório Prático 1: A Evolução de um Servidor HTTP no Node.js
> **Objetivo Didático:** Demonstrar na prática a progressão do código desde o servidor web nativo mais primitivo em Node.js puro até a necessidade inevitável de um framework como o **Express.js**.
> 
> 📺 **Vídeo de Apoio da Aula:** [Acompanhe a explicação em vídeo no YouTube](https://youtu.be/Cdu0WJhI-d8)

---

## 🗺️ Visão Geral da Progressão Pedagógica

Neste laboratório, não pulamos direto para os frameworks mágicos. Como futuros desenvolvedores backend, vocês precisam entender o que acontece **debaixo do capô**. 

Vamos percorrer 4 arquivos em sequência evolutiva:

```text
labNode1/
├── 1. index.js             # O servidor mais básico do mundo (Texto plano)
├── 2. index_json.js        # Falando a língua da web: Headers e JSON
├── 3. index_json_lista.js  # Dados estruturados: Coleções (Arrays de Objetos)
└── 4. index_json_rotas.js  # Roteamento manual com condicionais (e o limite do Node puro)
```

---

## 📍 Passo 1: O Servidor Mais Básico do Mundo (`index.js`)

Aqui criamos um servidor web utilizando estritamente os recursos nativos do Node.js, sem instalar nenhuma biblioteca externa.

### 📄 Código-Fonte:
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Servidor ligado");
});

server.listen(3000);
```

### 👨‍🏫 O que o professor está explicando aqui?
1. **`const http = require("http");`**
   * O Node.js já vem com módulos nativos pré-instalados. O módulo `http` é a base que sabe conversar com o protocolo HTTP da internet.
2. **`http.createServer((req, res) => { ... })`**
   * Criamos a instância do nosso servidor. 
   * Passamos uma função de retorno (**Callback**) com dois parâmetros vitais:
     * `req` (Request): representa a requisição de quem chamou o servidor.
     * `res` (Response): o objeto que usamos para responder ao cliente.
3. **`res.end("Servidor ligado");`**
   * O método `.end()` finaliza o ciclo da requisição e entrega a mensagem para o navegador. Se você esquecer o `.end()`, o navegador ficará carregando a página infinitamente!
4. **`server.listen(3000);`**
   * Abre uma "porta de atendimento" no computador. A partir de agora, qualquer requisição enviada para `http://localhost:3000` cairá nesse callback.

### 🧪 Como testar no terminal:
```bash
node index.js
```
Abra o navegador em `http://localhost:3000` e você verá: `Servidor ligado`.

### ⚠️ O Limite deste Passo:
* Estamos devolvendo **texto puro** (*plain text*).
* Nenhuma API moderna entrega texto solto. Frontends modernos (React, Vue, mobile) esperam dados estruturados.

---

## 📍 Passo 2: Falando a Língua das APIs — O Formato JSON (`index_json.js`)

Agora vamos transformar nosso servidor em uma API que responde dados estruturados no formato universal da web: **JSON**.

### 📄 Código-Fonte:
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        nome: "Janei",
        profissao: "Dev"
    }));
});

server.listen(3000);
```

### 👨‍🏫 O que mudou e por que essa estrutura?
1. **`res.setHeader("Content-Type", "application/json");`**
   * **A etiqueta do pacote:** Pense nos cabeçalhos HTTP (*Headers*) como a etiqueta de um pacote dos Correios. Antes de o cliente abrir a caixa, essa linha avisa: *"Atenção navegador/Postman, o que está dentro deste pacote não é HTML nem texto, é um dado no formato JSON!"*.
   * Sem esse cabeçalho, muitos clientes tratam a resposta como mero texto e não formatam os dados.
2. **`JSON.stringify({ nome: "Janei", profissao: "Dev" })`**
   * **A serialização obrigatória:** Na memória do computador, `{ nome: "Janei" }` é um objeto JavaScript vivo. Mas através de cabos de rede e da internet, você só pode trafegar **texto puro (strings) ou bytes**.
   * O método `JSON.stringify()` pega o objeto JavaScript e o "achata", convertendo-o na string formatada `'{"nome":"Janei","profissao":"Dev"}'`.

### 🧪 Como testar no terminal:
```bash
# Pare o servidor anterior com Ctrl + C
node index_json.js
```
Ao acessar `http://localhost:3000`, o navegador ou o Postman reconhecerá o JSON e fará o destaque de sintaxe colorido!

### ⚠️ O Limite deste Passo:
* Estamos enviando apenas um único objeto estático. Em sistemas reais, quase sempre lidamos com **listas de registros** (uma tabela de usuários, uma lista de produtos, etc.).

---

## 📍 Passo 3: Dados em Coleção — Arrays de Objetos (`index_json_lista.js`)

Neste passo, simulamos o retorno que viria de uma consulta ao banco de dados: uma coleção (Array) contendo múltiplos registros.

### 📄 Código-Fonte:
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    const usuarios = [
        {
            id: 2,
            nome: "Maria",
        },
        {
            id: 3,
            nome: "Pedro",
        },
    ];

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(usuarios));
});

server.listen(3000);
```

### 👨‍🏫 O que o professor está demonstrando?
1. **A estrutura de dados real:**
   * Um array de objetos `[ { ... }, { ... } ]` é a representação típica de linhas de uma tabela `users` do banco relacional.
2. **O poder do `JSON.stringify()`:**
   * O `JSON.stringify()` não serve apenas para um objeto isolado; ele é recursivo. Ele converte todo o array, mantendo colchetes, vírgulas e chaves no padrão rigoroso do JSON.

### ⚠️ O Grande Problema / Limite deste Passo:
* Teste acessar:
  * `http://localhost:3000/`
  * `http://localhost:3000/usuarios`
  * `http://localhost:3000/qualquer-coisa`
* **Percebeu?** Não importa a URL que o usuário digite, o servidor responde SEMPRE a mesma lista de usuários! 
* Ele não tem capacidade de discernir qual página ou recurso o usuário solicitou. Falta o **Roteamento**.

---

## 📍 Passo 4: Roteamento Manual com Condicionais (`index_json_rotas.js`)

Aqui ensinamos nosso servidor a tomar decisões baseadas no endereço solicitado pelo usuário.

### 📄 Código-Fonte:
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    const usuarios = [
        {
            id: 2,
            nome: "Maria"
        },
        {
            id: 3,
            nome: "Pedro"
        }
    ];

    // Rota Raiz (Home)
    if (req.url === "/") {
        res.end("Bem vindo a essa bagaca");
    }

    // Rota de Usuários (API)
    if (req.url === "/usuarios") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(usuarios));
    }
});

server.listen(3000);
```

### 👨‍🏫 O que o professor está ensinando aqui?
1. **Inspecionando `req.url`:**
   * O parâmetro `req` não está ali à toa. Ele carrega as informações do pedido do cliente. `req.url` nos diz exatamente o que foi digitado após a porta (ex: `/` ou `/usuarios`).
2. **Desvio de fluxo com `if`:**
   * Se for a página inicial (`/`), devolve uma mensagem de boas-vindas.
   * Se for o endpoint `/usuarios`, configura a resposta como JSON e entrega a lista.

---

## 💥 A Grande Moral da Aula: Por Que o Express Foi Inventado?

Observe com muita atenção o código do **Passo 4**. Parece simples porque temos apenas 2 rotas. Mas imagine uma aplicação comercial de verdade:

### 🚨 O Drama do Node.js Nativo em Projetos Maiores:

1. **E se tivermos 50 rotas?**
   * Você teria 50 blocos `if (req.url === ...)` encadeados em um único arquivo gigante!
2. **E os Métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`)?**
   * O cliente quer cadastrar um usuário via `POST /usuarios` ou apenas listar via `GET /usuarios`?
   * No Node nativo, você teria que fazer:
     ```javascript
     if (req.url === "/usuarios" && req.method === "GET") { ... }
     if (req.url === "/usuarios" && req.method === "POST") { ... }
     ```
3. **E para capturar o corpo da requisição (`body`) no POST?**
   * No Node puro, você precisa lidar manualmente com buffers binários e eventos de stream:
     ```javascript
     let body = "";
     req.on("data", chunk => body += chunk);
     req.on("end", () => { const dados = JSON.parse(body); ... });
     ```
4. **Tratamento de 404 (Rota Não Encontrada):**
   * Se o usuário digitar `/contato` que não existe, o servidor simplesmente trava e nunca responde, a menos que você controle variáveis de controle manualmente.

---

## 🚀 A Solução Elegante: Compare com o Express.js!

Veja como exatamente a mesma lógica do **Passo 4** é escrita utilizando o **Express** (que estudaremos na sequência):

### ⚖️ Comparativo Lado a Lado:

```javascript
// ==========================================
// MODO NATIVO (Node puro - Passo 4)
// ==========================================
const http = require("http");
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.end("Bem-vindo!");
    }
    if (req.url === "/usuarios") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(usuarios));
    }
});
server.listen(3000);
```

```javascript
// ==========================================
// MODO EXPRESS (Moderno e Produtivo)
// ==========================================
const express = require("express");
const app = express();

// Rotas declarativas e separadas por método HTTP
app.get("/", (req, res) => {
    res.send("Bem-vindo!");
});

app.get("/usuarios", (req, res) => {
    // O res.json() já define o header e faz o stringify sozinho!
    res.json(usuarios);
});

app.listen(3000, () => {
    console.log("Servidor rodando com Express na porta 3000!");
});
```

### 🎯 Conclusão:
O **Express** não faz mágica; ele apenas automatiza e organiza com maestria tudo isso que acabamos de construir manualmente com o módulo `http`. Entender esses 4 passos faz você deixar de ser um mero "copiador de código" e passar a ser um desenvolvedor que realmente compreende como a web funciona!
