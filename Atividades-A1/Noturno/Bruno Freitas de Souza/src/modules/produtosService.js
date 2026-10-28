// src/modules/produtosService.js
// Módulo próprio responsável pelo armazenamento em memória e regras de negócio de Produtos

let produtos = [
  { id: 1, nome: "Notebook Gamer", preco: 5499.9, categoria: "Informática", emEstoque: true },
  { id: 2, nome: "Mouse Sem Fio", preco: 149.9, categoria: "Periféricos", emEstoque: true },
  { id: 3, nome: "Teclado Mecânico RGB", preco: 329.9, categoria: "Periféricos", emEstoque: true },
  { id: 4, nome: "Monitor 27 Polegadas 144Hz", preco: 1399.0, categoria: "Monitores", emEstoque: false }
];

let proximoId = 5;

function listarProdutos() {
  return produtos;
}

function buscarProdutoPorId(id) {
  return produtos.find((produto) => produto.id === id);
}

function adicionarProduto({ nome, preco, categoria, emEstoque }) {
  const novoProduto = {
    id: proximoId++,
    nome,
    preco: Number(preco),
    categoria: categoria || "Geral",
    emEstoque: emEstoque !== undefined ? Boolean(emEstoque) : true
  };

  produtos.push(novoProduto);
  return novoProduto;
}

function atualizarProduto(id, dadosAtualizados) {
  const produto = buscarProdutoPorId(id);

  if (!produto) {
    return null;
  }

  if (dadosAtualizados.nome !== undefined) {
    produto.nome = dadosAtualizados.nome;
  }
  if (dadosAtualizados.preco !== undefined) {
    produto.preco = Number(dadosAtualizados.preco);
  }
  if (dadosAtualizados.categoria !== undefined) {
    produto.categoria = dadosAtualizados.categoria;
  }
  if (dadosAtualizados.emEstoque !== undefined) {
    produto.emEstoque = Boolean(dadosAtualizados.emEstoque);
  }

  return produto;
}

function removerProduto(id) {
  const index = produtos.findIndex((produto) => produto.id === id);

  if (index === -1) {
    return null;
  }

  const [removido] = produtos.splice(index, 1);
  return removido;
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  adicionarProduto,
  atualizarProduto,
  removerProduto
};
