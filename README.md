# Curso: Desenvolvimento de APIs com Node.js e Express
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)


Bem-vindo ao repositório oficial do curso de desenvolvimento de APIs com Node.js! Este espaço contém todo o material, códigos, laboratórios e gabaritos que utilizamos ao longo das aulas. O objetivo é fornecer um guia completo para você estudar, praticar e aprofundar seus conhecimentos.

## 🚀 Visão Geral do Curso

Neste curso, você aprenderá a construir APIs RESTful robustas, seguras e profissionais do zero. Partimos dos conceitos fundamentais do Node.js e do Express, e evoluímos para tópicos avançados como autenticação com JWT, integração com bancos de dados PostgreSQL, e documentação de APIs com Swagger.

## 🛠️ Ferramentas e Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

- **[Node.js](https://nodejs.org/) (versão LTS recomendada):** O ambiente de execução para nosso código JavaScript no backend.
- **[Git](https://git-scm.com/):** Para controle de versão e para clonar este repositório.
- **[Visual Studio Code](https://code.visualstudio.com/):** Nosso editor de código principal.
- **[Postman](https://www.postman.com/downloads/):** Ferramenta essencial para testar os endpoints da nossa API.
- **[PostgreSQL](https://www.postgresql.org/download/) e [DBeaver](https://dbeaver.io/download/) (ou outro cliente SQL):** Para gerenciar nosso banco de dados.

## 📂 Estrutura do Repositório

Este repositório está organizado da seguinte forma para facilitar seus estudos:

- **`AulaXX/`**: Contém o `README.md` com a teoria e os slides de cada aula, além de exemplos de código específicos daquele tópico.
- **`database/schema.sql`**: Script SQL oficial unificado para criar todas as tabelas (`users`, `tasks`, `produtos`) e dados de teste no PostgreSQL/DBeaver.
- **`docs/`**: Guias conceituais complementares (JavaScript moderno, [Pool de Conexões](./docs/pool.md), [Desenvolvimento vs. Produção](./docs/desenvolvimento-vs-producao.md) e [Termos Essenciais de APIs: URI, URL, Payload](./docs/termos-essenciais-apis.md)).
- **`Tests/`**: Contém os projetos práticos e laboratórios que desenvolvemos juntos. É aqui que a "mão na massa" acontece.
- **`gabaritos/`**: Contém as soluções completas para os laboratórios e desafios propostos. Use como referência após tentar resolver os problemas por conta própria!
- **`Tests/ROTEIRO.md`**: Um guia de estudo detalhado que mostra a evolução da nossa API, desde a versão simples até a final. **Leitura recomendada!**

## 🗺️ Roteiro de Aulas

Navegue diretamente para o conteúdo de cada aula usando os links abaixo.

| Aula   | Tópico Principal                          | Link para o Conteúdo                   |
| :----- | :---------------------------------------- | :------------------------------------- |
| **01** | Introdução ao Node.js e Primeiro Script   | [Aula01/README.md](./Aula01/README.md) |
| **02** | Módulos, `require` e `npm`                | [Aula02/README.md](./Aula02/README.md) |
| **03** | Introdução ao Express e Primeiro Servidor | [Aula03/README.md](./Aula03/README.md) |
| **04** | Rotas, `req` e `res` no Express           | [Aula04/README.md](./Aula04/README.md) |
| **05** | Middlewares no Express                    | [Aula05/README.md](./Aula05/README.md) |
| **06** | Conexão com Banco de Dados (PostgreSQL)   | [Aula06/README.md](./Aula06/README.md) |
| **07** | CRUD Completo com Express e PostgreSQL    | [Aula07/README.md](./Aula07/README.md) |
| **08** | Autenticação com JWT (JSON Web Tokens)    | [Aula08/README.md](./Aula08/README.md) |
| **09** | Estrutura de Projetos (MVC) e Refatoração | [Aula09/README.md](./Aula09/README.md) |
| **10** | Documentação de APIs com Swagger          | [Aula10/README.md](./Aula10/README.md) |

## 💡 Como Usar este Repositório

1.  **Clone o projeto:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd node.js-e-express
    ```

2.  **Navegue até um projeto:**
    Cada laboratório ou gabarito é um projeto Node.js independente. Para rodar um deles, primeiro entre na pasta desejada.

    ```bash
    cd Tests/Aula09
    ```

3.  **Instale as dependências:**
    Dentro da pasta do projeto, instale as dependências listadas no `package.json`.

    ```bash
    npm install
    ```

4.  **Configure o ambiente:**
    A maioria dos projetos a partir da Aula 06 precisa de um arquivo `.env` para as credenciais do banco de dados. Procure por um arquivo `.env.example` ou siga as instruções no `README.md` da respectiva aula para criar o seu.

5.  **Inicie o servidor:**
    Use o comando definido no `package.json` para iniciar o projeto.
    ```bash
    npm start
    # ou, se disponível
    npm run dev
    ```

## ✨ Guia de Estudo Final

Para consolidar todo o aprendizado, recomendamos fortemente que você siga o **[Guia de Estudo: A Evolução da Nossa API de Tarefas](./Tests/ROTEIRO.md)**. Ele conecta todos os pontos que vimos e mostra a jornada completa de desenvolvimento da nossa API.

---

Bons estudos e feliz codificação!

---

# Licença

Este projeto está licenciado sob **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY‑NC‑SA 4.0)**.

## O que você PODE fazer
- ✔ Usar o conteúdo do projeto
- ✔ Modificar, remixar e adaptar
- ✔ Compartilhar com outras pessoas
- ✔ Criar derivados

## O que você NÃO PODE fazer
- ❌ Usar para fins comerciais  
  (qualquer uso que gere dinheiro direta ou indiretamente)
- ❌ Distribuir versões modificadas com outra licença
- ❌ Remover a atribuição ao autor original

## Condições obrigatórias
- **Atribuição:** você deve creditar o autor original.
- **Não Comercial:** uso apenas para fins não comerciais.
- **Compartilha Igual:** obras derivadas devem usar a mesma licença.

## Link da licença
https://creativecommons.org/licenses/by-nc-sa/4.0/

