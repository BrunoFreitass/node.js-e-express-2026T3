// src/db.js
const path = require("path");
const { Pool } = require("pg");

// Carrega as variáveis do arquivo .env da raiz do projeto (a senha nunca fica no código)
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // O nome do nosso banco de dados (task_manager)
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Mensagem para verificar se a conexão foi bem-sucedida
pool.on("connect", () => {
  console.log("Conexão com o banco de dados estabelecida com sucesso!");
});

// Exportamos um objeto com um método 'query' que encapsula a execução de consultas
module.exports = {
  query: (text, params) => pool.query(text, params),
};
