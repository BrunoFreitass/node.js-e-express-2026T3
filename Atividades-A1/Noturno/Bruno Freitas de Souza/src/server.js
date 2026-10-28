// src/server.js
const express = require("express");
const colors = require("colors");
const loggerMiddleware = require("./middlewares/logger");
const { autenticar } = require("./middlewares/autenticar");
const produtosService = require("./modules/produtosService");

const app = express();
const port = process.env.PORT || 3000;

// Middleware nativo para interpretar corpo da requisição em formato JSON
app.use(express.json());

// Middleware global de logging com destaque de status codes por cores
app.use(loggerMiddleware);

// Rota inicial explicativa da API
app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Bem-vindo à API de Produtos (Atividade A1 - Nível Jedi)!",
    aluno: "Bruno Freitas de Souza",
    turno: "Noturno",
    endpoints: {
      listarTodos: "GET /produtos",
      buscarPorId: "GET /produtos/:id",
      criarProduto: "POST /produtos (Requer header x-token: 123456)",
      atualizarProduto: "PUT /produtos/:id (Requer header x-token: 123456)",
      removerProduto: "DELETE /produtos/:id (Requer header x-token: 123456)"
    }
  });
});

// GET /produtos - Lista todos os produtos em memória (Rota Pública)
app.get("/produtos", (req, res) => {
  const produtos = produtosService.listarProdutos();
  res.status(200).json(produtos);
});

// GET /produtos/:id - Busca um produto específico por ID (Rota Pública - Nível 3)
app.get("/produtos/:id", (req, res) => {
  const parametroRecebido = req.params.id;
  const id = parseInt(parametroRecebido, 10);

  console.log(colors.cyan(`🔎 Parâmetro de rota recebido em GET /produtos/:id -> id = ${parametroRecebido}`));

  const produto = produtosService.buscarProdutoPorId(id);

  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado.",
      parametroRecebido
    });
  }

  res.status(200).json({
    parametroRecebido,
    produto
  });
});

// POST /produtos - Adiciona um novo produto em memória (Rota Protegida - Nível Jedi)
app.post("/produtos", autenticar, (req, res) => {
  const { nome, preco, categoria, emEstoque } = req.body || {};

  if (!nome || preco === undefined || isNaN(Number(preco)) || Number(preco) <= 0) {
    return res.status(400).json({
      erro: "Os campos 'nome' e 'preco' (número maior que 0) são obrigatórios."
    });
  }

  const novoProduto = produtosService.adicionarProduto({
    nome,
    preco,
    categoria,
    emEstoque
  });

  res.status(201).json(novoProduto);
});

// PUT /produtos/:id - Atualiza um produto existente pelo ID (Rota Protegida - Nível Jedi)
app.put("/produtos/:id", autenticar, (req, res) => {
  const parametroRecebido = req.params.id;
  const id = parseInt(parametroRecebido, 10);

  console.log(colors.cyan(`✏️  Parâmetro de rota recebido em PUT /produtos/:id -> id = ${parametroRecebido}`));

  const dados = req.body || {};
  const { nome, preco } = dados;

  // Valida apenas os campos enviados: nome não pode ser vazio e preco deve ser número maior que 0
  const nomeInvalido = nome !== undefined && (typeof nome !== "string" || nome.trim() === "");
  const precoInvalido = preco !== undefined && (isNaN(Number(preco)) || Number(preco) <= 0);

  if (nomeInvalido || precoInvalido) {
    return res.status(400).json({
      erro: "Os campos 'nome' e 'preco' (número maior que 0) são obrigatórios."
    });
  }

  const produtoAtualizado = produtosService.atualizarProduto(id, dados);

  if (!produtoAtualizado) {
    return res.status(404).json({
      erro: "Produto não encontrado para atualização.",
      parametroRecebido
    });
  }

  res.status(200).json(produtoAtualizado);
});

// DELETE /produtos/:id - Remove um produto pelo ID (Rota Protegida - Nível Jedi)
app.delete("/produtos/:id", autenticar, (req, res) => {
  const parametroRecebido = req.params.id;
  const id = parseInt(parametroRecebido, 10);

  console.log(colors.cyan(`🗑️  Parâmetro de rota recebido em DELETE /produtos/:id -> id = ${parametroRecebido}`));

  const produtoRemovido = produtosService.removerProduto(id);

  if (!produtoRemovido) {
    return res.status(404).json({
      erro: "Produto não encontrado para exclusão.",
      parametroRecebido
    });
  }

  res.status(200).json({
    mensagem: "Produto removido com sucesso!",
    produtoRemovido
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(colors.green.bold(`🚀 Servidor rodando em http://localhost:${port}`));
  });
}

module.exports = app;
