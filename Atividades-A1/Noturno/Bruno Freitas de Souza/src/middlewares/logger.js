// src/middlewares/logger.js
// Middleware de Logging com destaque de Status Codes por cores usando o pacote "colors"
const colors = require("colors");

function colorirStatusCode(statusCode) {
  const statusStr = String(statusCode);

  if (statusCode >= 500) {
    return colors.red.bold(statusStr);
  }
  if (statusCode >= 400) {
    return colors.yellow.bold(statusStr);
  }
  if (statusCode >= 300) {
    return colors.cyan.bold(statusStr);
  }
  if (statusCode >= 200) {
    return colors.green.bold(statusStr);
  }
  return colors.white(statusStr);
}

function colorirMetodo(method) {
  switch (method) {
    case "GET":
      return colors.blue.bold(method);
    case "POST":
      return colors.green.bold(method);
    case "PUT":
      return colors.yellow.bold(method);
    case "DELETE":
      return colors.red.bold(method);
    default:
      return colors.white.bold(method);
  }
}

function loggerMiddleware(req, res, next) {
  const inicio = Date.now();
  const horario = new Date().toISOString();

  console.log(
    colors.gray(`[${horario}]`) +
      ` ➡️  Requisição recebida no middleware: ${colorirMetodo(req.method)} ${colors.white(req.originalUrl)}`
  );

  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    const statusColorido = colorirStatusCode(res.statusCode);
    const metodoColorido = colorirMetodo(req.method);

    console.log(
      colors.gray(`[${new Date().toISOString()}]`) +
        ` ⬅️  ${metodoColorido} ${colors.white(req.originalUrl)} - Status: ${statusColorido} ${colors.gray(`(${duracao}ms)`)}`
    );
  });

  next();
}

module.exports = loggerMiddleware;
