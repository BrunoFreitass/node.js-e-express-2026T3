# A mesma API em Node.js, Java e C#

Este laboratório implementa a API de tarefas de [`NodeJS/src/server.js`](./NodeJS/src/server.js) em três tecnologias. O objetivo é comparar o código e o ecossistema mantendo os mesmos comportamentos HTTP — não declarar um vencedor universal.

## O que a API original faz

- Mantém tarefas em memória; reiniciar o processo restaura os dois exemplos iniciais.
- `GET /tarefas` é público e retorna a lista.
- `POST /tarefas`, `PUT /tarefas/:id` e `DELETE /tarefas/:id` exigem `x-token: 123456`.
- Registra método e URL de cada requisição.
- Cria tarefas com `201`, atualiza com `200`, responde `404` para IDs inexistentes e `204` ao excluir.
- O token fixo é apenas didático: não use esse mecanismo como autenticação real.

As versões Java e C# mantêm esses endpoints, os nomes dos campos em português, os dados iniciais, o token e os status HTTP. A implementação Java usa Spring Boot MVC; a C# usa ASP.NET Core Minimal APIs.

## Executar as três versões com Rancher Desktop

Com Rancher Desktop iniciado e o engine de contêineres habilitado:

```bash
cd labNode2
docker compose up --build
```

| Implementação | Endereço local |
| --- | --- |
| Node.js + Express | http://localhost:3000 |
| Java + Spring Boot | http://localhost:3001 |
| C# + ASP.NET Core | http://localhost:3002 |

Teste a listagem pública e a criação autenticada no PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/tarefas
Invoke-RestMethod http://localhost:3001/tarefas
Invoke-RestMethod http://localhost:3002/tarefas

$cabecalhos = @{ "x-token" = "123456" }
Invoke-RestMethod -Method Post -Uri http://localhost:3001/tarefas `
  -Headers $cabecalhos -ContentType "application/json" `
  -Body '{"descricao":"Comparar linguagens","concluida":false}'
```

Para testar as demais versões, troque a porta `3001` por `3000` ou `3002`. Os dados são independentes em cada processo. Encerre com `Ctrl+C`; para remover os containers, execute `docker compose down`.

## O que observar no código

### Node.js e Express

O fluxo fica concentrado em poucos elementos: `express.json()` interpreta o corpo, a função `autenticar` é middleware reutilizável e cada rota combina método, caminho e lógica. É direto para ensinar HTTP e montar uma API pequena, especialmente quando a equipe já trabalha com JavaScript. Node.js não é automaticamente mais rápido ou mais leve em todo cenário; isso depende da carga, das dependências e da forma de medir.

### Java e Spring Boot

O exemplo separa modelo, controller, interceptor de logging/autenticação e configuração MVC. Há mais estrutura e tipos explícitos, mas isso ajuda a organizar sistemas grandes, aplicar convenções consistentes, testar camadas e trabalhar com equipes e bibliotecas maduras. Spring Boot é comum em serviços corporativos Java; essa estrutura e o ecossistema acrescentam conceitos e arquivos para uma API pequena.

### C# e ASP.NET Core Minimal APIs

Os endpoints são declarados com `MapGet`, `MapPost`, `MapPut` e `MapDelete`; o filtro do grupo protege as operações de escrita. A API mínima reduz cerimônia para serviços pequenos, enquanto o ASP.NET Core também permite evoluir para controllers, injeção de dependência e camadas mais explícitas. É uma opção natural quando a equipe ou a organização já usa .NET, C# e ferramentas Microsoft.

## Quando considerar cada opção

- **Node.js:** aplicações HTTP e I/O, prototipagem rápida, compartilhamento de JavaScript/TypeScript com o frontend e equipes familiarizadas com npm. Planeje bem operações intensivas de CPU, que podem bloquear o event loop se forem executadas de forma síncrona.
- **Java:** serviços corporativos de longa duração, times com experiência JVM, integração com ecossistemas Java existentes e preferência por tipagem estática e convenções estruturadas.
- **C#:** aplicações e serviços .NET, equipes C#, integração com plataforma e ferramentas Microsoft, além de APIs que se beneficiam do ecossistema ASP.NET Core.

As três linguagens podem atender APIs web de produção. Compare requisitos, experiência do time, bibliotecas, operação, custo e medições do sistema real — não apenas a quantidade de linhas deste exemplo.
