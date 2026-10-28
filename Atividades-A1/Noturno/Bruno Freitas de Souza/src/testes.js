// src/testes.js
// Script automatizado para testar todos os cenários da API (Sucesso, Erro 404, Erro 400 e Autenticação 401)
const app = require("./server");

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log("\n========================================================");
  console.log("🧪 INICIANDO BATERIA DE TESTES DA API DE PRODUTOS (JEDI)");
  console.log("========================================================\n");

  try {
    // 1. GET /produtos (Pública - 200 OK)
    let res = await fetch(`${baseUrl}/produtos`);
    let body = await res.json();
    console.log(`✅ [Teste 1] GET /produtos -> Status: ${res.status} | Total de itens: ${body.length}\n`);

    // 2. GET /produtos/2 (Pública com filtro por ID - 200 OK)
    res = await fetch(`${baseUrl}/produtos/2`);
    body = await res.json();
    console.log(`✅ [Teste 2] GET /produtos/2 -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 3. GET /produtos/999 (Filtro por ID inexistente - 404 Not Found)
    res = await fetch(`${baseUrl}/produtos/999`);
    body = await res.json();
    console.log(`✅ [Teste 3] GET /produtos/999 (Erro esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 4. POST /produtos SEM TOKEN (Bloqueado pelo Middleware - 401 Unauthorized)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Headset Gamer 7.1", preco: 299.9 })
    });
    body = await res.json();
    console.log(`✅ [Teste 4] POST /produtos (Sem Token - 401 esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 5. POST /produtos COM TOKEN INVÁLIDO (Bloqueado pelo Middleware - 401 Unauthorized)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-token": "token-invalido" },
      body: JSON.stringify({ nome: "Headset Gamer 7.1", preco: 299.9 })
    });
    body = await res.json();
    console.log(`✅ [Teste 5] POST /produtos (Token Inválido - 401 esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 6. POST /produtos COM TOKEN VÁLIDO (201 Created)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-token": "123456" },
      body: JSON.stringify({
        nome: "Headset Gamer 7.1",
        preco: 299.9,
        categoria: "Áudio",
        emEstoque: true
      })
    });
    body = await res.json();
    console.log(`✅ [Teste 6] POST /produtos (Token Válido - 201 esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 7. PUT /produtos/2 COM TOKEN VÁLIDO (200 OK)
    res = await fetch(`${baseUrl}/produtos/2`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-token": "123456" },
      body: JSON.stringify({ preco: 129.9, emEstoque: false })
    });
    body = await res.json();
    console.log(`✅ [Teste 7] PUT /produtos/2 (Token Válido - 200 esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    // 8. DELETE /produtos/1 COM TOKEN VÁLIDO (200 OK)
    res = await fetch(`${baseUrl}/produtos/1`, {
      method: "DELETE",
      headers: { "x-token": "123456" }
    });
    body = await res.json();
    console.log(`✅ [Teste 8] DELETE /produtos/1 (Token Válido - 200 esperado) -> Status: ${res.status} | Resposta: ${JSON.stringify(body)}\n`);

    console.log("========================================================");
    console.log("🎉 TODOS OS TESTES FORAM EXECUTADOS COM SUCESSO!");
    console.log("========================================================\n");
  } catch (err) {
    console.error("Erro durante os testes:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
