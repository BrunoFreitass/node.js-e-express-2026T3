// ============================================================
// Aula 07 - Atividade RESTful
// API de produtos refatorada para seguir as convenções REST:
//   - URIs com substantivos no plural (sem verbos)
//   - Método HTTP define a ação (GET, POST, PUT, PATCH, DELETE)
//   - id na rota (params) e dados no corpo (body), nunca em query
//   - Códigos de status semânticos (200, 201, 204, 400, 404)
// ============================================================

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Converte o corpo JSON das requisições em objeto (req.body)
app.use(express.json());

// ------------------------------------------------------------
// BÔNUS: middleware de log
// Registra método, rota, status e tempo de cada requisição.
// ------------------------------------------------------------
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duracao}ms)`
    );
  });
  next();
});

// ------------------------------------------------------------
// "Banco de dados" em memória
// ------------------------------------------------------------
let produtos = [
  { id: 1, nome: "Notebook Gamer", preco: 7500, estoque: 30, categoria: "Eletrônicos" },
  { id: 2, nome: "Cadeira de Escritório", preco: 1200, estoque: 50, categoria: "Móveis" },
];

// Contador de ids: evita ids repetidos após remoções
// (o código original usava produtos.length + 1, que gera duplicatas)
let proximoId = 3;

// ------------------------------------------------------------
// Funções auxiliares
// ------------------------------------------------------------

// Converte o :id da rota em número; retorna null se não for um inteiro positivo
function lerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Valida os campos do produto.
// parcial = true (PATCH): só valida os campos que vieram no corpo.
// parcial = false (POST/PUT): nome e preço são obrigatórios.
// Retorna a mensagem de erro, ou null se estiver tudo certo.
function validarProduto(dados, parcial = false) {
  const { nome, preco, estoque, categoria } = dados;

  if (!parcial || nome !== undefined) {
    if (typeof nome !== "string" || nome.trim() === "") {
      return "O campo 'nome' é obrigatório e deve ser um texto não vazio.";
    }
  }

  if (!parcial || preco !== undefined) {
    if (typeof preco !== "number" || !Number.isFinite(preco) || preco <= 0) {
      return "O campo 'preco' é obrigatório e deve ser um número maior que 0.";
    }
  }

  if (estoque !== undefined && (!Number.isInteger(estoque) || estoque < 0)) {
    return "O campo 'estoque' deve ser um número inteiro maior ou igual a 0.";
  }

  if (categoria !== undefined && typeof categoria !== "string") {
    return "O campo 'categoria' deve ser um texto.";
  }

  return null;
}

// ------------------------------------------------------------
// 1. Listar todos os produtos
// Antes: GET /listarProdutos  ->  Agora: GET /produtos
// ------------------------------------------------------------
app.get("/produtos", (req, res) => {
  res.status(200).json(produtos);
});

// ------------------------------------------------------------
// 2. Buscar um produto pelo id
// Antes: POST /buscarProduto (id no body, 200 com texto se não achasse)
// Agora: GET /produtos/:id (id na rota, 404 se não existir)
// ------------------------------------------------------------
app.get("/produtos/:id", (req, res) => {
  const id = lerId(req);
  if (id === null) {
    return res.status(400).json({ erro: "O id deve ser um número inteiro positivo." });
  }

  const produto = produtos.find((p) => p.id === id);
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  res.status(200).json(produto);
});

// ------------------------------------------------------------
// 3. Criar um novo produto
// Antes: GET /adicionarProduto (dados na query, 200 com texto)
// Agora: POST /produtos (dados no body, 201 com o produto criado)
// ------------------------------------------------------------
app.post("/produtos", (req, res) => {
  // Express 5: req.body é undefined quando não há corpo JSON
  const dados = req.body || {};

  const erro = validarProduto(dados);
  if (erro) {
    return res.status(400).json({ erro });
  }

  const novoProduto = {
    id: proximoId++,
    nome: dados.nome.trim(),
    preco: dados.preco,
    estoque: dados.estoque ?? 0,
    categoria: dados.categoria ?? "Sem categoria",
  };
  produtos.push(novoProduto);

  // Header Location aponta para o recurso recém-criado
  res.status(201).location(`/produtos/${novoProduto.id}`).json(novoProduto);
});

// ------------------------------------------------------------
// 4a. Atualizar um produto por completo
// Antes: GET /modificarProduto/:id (dados na query)
// Agora: PUT /produtos/:id (recurso inteiro no body, 200 ou 404)
// ------------------------------------------------------------
app.put("/produtos/:id", (req, res) => {
  const id = lerId(req);
  if (id === null) {
    return res.status(400).json({ erro: "O id deve ser um número inteiro positivo." });
  }

  const index = produtos.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  const dados = req.body || {};
  const erro = validarProduto(dados);
  if (erro) {
    return res.status(400).json({ erro });
  }

  // PUT substitui o recurso inteiro (o id não muda)
  produtos[index] = {
    id,
    nome: dados.nome.trim(),
    preco: dados.preco,
    estoque: dados.estoque ?? 0,
    categoria: dados.categoria ?? "Sem categoria",
  };

  res.status(200).json(produtos[index]);
});

// ------------------------------------------------------------
// 4b. BÔNUS: atualizar um produto parcialmente
// PATCH /produtos/:id (só os campos enviados, 200 ou 404)
// ------------------------------------------------------------
app.patch("/produtos/:id", (req, res) => {
  const id = lerId(req);
  if (id === null) {
    return res.status(400).json({ erro: "O id deve ser um número inteiro positivo." });
  }

  const index = produtos.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  const dados = req.body || {};

  // Aceita apenas os campos conhecidos (ignora "id" e campos extras)
  const camposPermitidos = ["nome", "preco", "estoque", "categoria"];
  const alteracoes = {};
  for (const campo of camposPermitidos) {
    if (dados[campo] !== undefined) alteracoes[campo] = dados[campo];
  }

  if (Object.keys(alteracoes).length === 0) {
    return res.status(400).json({
      erro: "Envie ao menos um campo para atualizar: nome, preco, estoque ou categoria.",
    });
  }

  const erro = validarProduto(alteracoes, true);
  if (erro) {
    return res.status(400).json({ erro });
  }

  if (alteracoes.nome) alteracoes.nome = alteracoes.nome.trim();
  produtos[index] = { ...produtos[index], ...alteracoes };

  res.status(200).json(produtos[index]);
});

// ------------------------------------------------------------
// 5. Remover um produto
// Antes: POST /removerProduto (id no body, sempre "sucesso")
// Agora: DELETE /produtos/:id (204 sem corpo, ou 404)
// ------------------------------------------------------------
app.delete("/produtos/:id", (req, res) => {
  const id = lerId(req);
  if (id === null) {
    return res.status(400).json({ erro: "O id deve ser um número inteiro positivo." });
  }

  const index = produtos.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  produtos.splice(index, 1);
  res.status(204).send();
});

// ------------------------------------------------------------
// Rota inexistente -> 404 em JSON (padrão do Express é HTML)
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.originalUrl} não encontrada.` });
});

// ------------------------------------------------------------
// Tratamento de erros: JSON mal formatado -> 400; demais -> 500
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON mal formatado no corpo da requisição." });
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
