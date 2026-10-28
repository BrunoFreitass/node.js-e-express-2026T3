// src/middlewares/autenticar.js
// Middleware de Autenticação Básica via Token Fixo no Header

const TOKEN_SECRETO = "123456";

function autenticar(req, res, next) {
  // Aceita o header "x-token" (padrão do laboratório da Aula 04),
  // "x-access-token" (exemplo do README da Aula 04) ou "Authorization: Bearer 123456"
  let token = req.headers["x-token"] || req.headers["x-access-token"];

  if (!token && req.headers["authorization"]) {
    const parts = req.headers["authorization"].split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    } else {
      token = req.headers["authorization"];
    }
  }

  if (!token) {
    return res.status(401).json({
      erro: "Token não fornecido. Envie o cabeçalho 'x-token: 123456' para acessar esta rota."
    });
  }

  if (token !== TOKEN_SECRETO) {
    return res.status(401).json({
      erro: "Token inválido. Acesso negado."
    });
  }

  next();
}

module.exports = {
  autenticar,
  TOKEN_SECRETO
};
