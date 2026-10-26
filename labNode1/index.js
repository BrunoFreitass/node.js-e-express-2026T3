const http = require ("http");
const server = http.createServer((req,res) => {

res.end("Servidor ligado");

});

server.listen(3000);

