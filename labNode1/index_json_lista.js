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
