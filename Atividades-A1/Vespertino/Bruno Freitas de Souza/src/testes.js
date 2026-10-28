// src/testes.js
// Script automatizado para testar todos os cenários da API (Sucesso, Erro 404, Erro 400 e Autenticação 401)
const app = require("./server");

let falhas = 0;

// Compara o status recebido com o esperado e mostra ✅ ou ❌
function verificar(numero, descricao, res, body, statusEsperado) {
  const passou = res.status === statusEsperado;
  if (!passou) falhas++;

  const icone = passou ? "✅" : "❌";
  console.log(
    `${icone} [Teste ${numero}] ${descricao} -> Esperado: ${statusEsperado} | Recebido: ${res.status} | Resposta: ${JSON.stringify(body)}\n`
  );
}

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  const headersComToken = { "Content-Type": "application/json", "x-token": "123456" };

  console.log("\n========================================================");
  console.log("🧪 INICIANDO BATERIA DE TESTES DA API DE PRODUTOS (JEDI)");
  console.log("========================================================\n");

  try {
    // 1. GET /produtos (Pública - 200 OK)
    let res = await fetch(`${baseUrl}/produtos`);
    let body = await res.json();
    verificar(1, `GET /produtos (Total de itens: ${body.length})`, res, body, 200);

    // 2. GET /produtos/2 (Pública com filtro por ID - 200 OK)
    res = await fetch(`${baseUrl}/produtos/2`);
    body = await res.json();
    verificar(2, "GET /produtos/2", res, body, 200);

    // 3. GET /produtos/999 (Filtro por ID inexistente - 404 Not Found)
    res = await fetch(`${baseUrl}/produtos/999`);
    body = await res.json();
    verificar(3, "GET /produtos/999 (ID inexistente)", res, body, 404);

    // 4. POST /produtos SEM TOKEN (Bloqueado pelo Middleware - 401 Unauthorized)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Headset Gamer 7.1", preco: 299.9 })
    });
    body = await res.json();
    verificar(4, "POST /produtos (Sem Token)", res, body, 401);

    // 5. POST /produtos COM TOKEN INVÁLIDO (Bloqueado pelo Middleware - 401 Unauthorized)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-token": "token-invalido" },
      body: JSON.stringify({ nome: "Headset Gamer 7.1", preco: 299.9 })
    });
    body = await res.json();
    verificar(5, "POST /produtos (Token Inválido)", res, body, 401);

    // 6. POST /produtos COM TOKEN VÁLIDO (201 Created)
    res = await fetch(`${baseUrl}/produtos`, {
      method: "POST",
      headers: headersComToken,
      body: JSON.stringify({
        nome: "Headset Gamer 7.1",
        preco: 299.9,
        categoria: "Áudio",
        emEstoque: true
      })
    });
    body = await res.json();
    verificar(6, "POST /produtos (Token Válido)", res, body, 201);

    // 7. PUT /produtos/2 COM TOKEN VÁLIDO (200 OK)
    res = await fetch(`${baseUrl}/produtos/2`, {
      method: "PUT",
      headers: headersComToken,
      body: JSON.stringify({ preco: 129.9, emEstoque: false })
    });
    body = await res.json();
    verificar(7, "PUT /produtos/2 (Token Válido)", res, body, 200);

    // 8. DELETE /produtos/1 COM TOKEN VÁLIDO (200 OK)
    res = await fetch(`${baseUrl}/produtos/1`, {
      method: "DELETE",
      headers: { "x-token": "123456" }
    });
    body = await res.json();
    verificar(8, "DELETE /produtos/1 (Token Válido)", res, body, 200);

    // 9. PUT /produtos/3 COM PREÇO NEGATIVO (Validação - 400 Bad Request)
    res = await fetch(`${baseUrl}/produtos/3`, {
      method: "PUT",
      headers: headersComToken,
      body: JSON.stringify({ preco: -5 })
    });
    body = await res.json();
    verificar(9, "PUT /produtos/3 (preco -5)", res, body, 400);

    // 10. PUT /produtos/3 COM PREÇO EM TEXTO (Validação - 400 Bad Request)
    res = await fetch(`${baseUrl}/produtos/3`, {
      method: "PUT",
      headers: headersComToken,
      body: JSON.stringify({ preco: "abc" })
    });
    body = await res.json();
    verificar(10, "PUT /produtos/3 (preco \"abc\")", res, body, 400);

    // 11. PUT /produtos/3 COM NOME VAZIO (Validação - 400 Bad Request)
    res = await fetch(`${baseUrl}/produtos/3`, {
      method: "PUT",
      headers: headersComToken,
      body: JSON.stringify({ nome: "" })
    });
    body = await res.json();
    verificar(11, "PUT /produtos/3 (nome vazio)", res, body, 400);

    console.log("========================================================");
    if (falhas === 0) {
      console.log("🎉 TODOS OS TESTES PASSARAM!");
    } else {
      console.log(`💥 ${falhas} TESTE(S) FALHARAM.`);
      process.exitCode = 1;
    }
    console.log("========================================================\n");
  } catch (err) {
    console.error("Erro durante os testes:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
