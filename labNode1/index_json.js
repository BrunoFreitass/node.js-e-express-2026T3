const http = require ("http");
const server = http.createServer((req,res) => {

res.setHeader("Content-Type","application/json");
res.end(JSON.stringify(
    
    {
        nome: "Janei",
        profissao: "Dev"
    }

))

});

server.listen(3000);

