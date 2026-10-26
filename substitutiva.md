# 📝 Atividade Prática Substitutiva - Aula 3: Reforço de JavaScript e Node.js

**Instruções:**

* Esta atividade substitui a nossa aula remota de hoje. O objetivo é fortalecer a sua lógica em **JavaScript** e a familiaridade com o ambiente **Node.js** antes de avançarmos para os frameworks.


* **Prazo de entrega:** Envie a solução (repositório no GitHub ou arquivo compactado) até o final do dia de hoje.

---

## Parte 1: Lógica e Manipulação de Dados em JavaScript Puro

Crie um arquivo chamado `index.js` em um diretório do seu projeto e resolva os seguintes desafios utilizando recursos modernos do JavaScript (ES6+):

1. **Catálogo de Filmes ou Jogos (Arrays e Objetos):**
* Crie um array de objetos chamado `catalogo`. Cada item deve conter: `id`, `titulo`, `genero`, `ano` e `assistido` (booleano: `true` ou `false`).


2. **Filtrando por Status:**
* Crie uma função (utilizando *Arrow Function*) que receba o array `catalogo` e retorne apenas os itens que **não** foram assistidos (`assistido: false`) utilizando o método `.filter()`.


3. **Mapeando os Títulos:**
* Crie uma função que utilize o método `.map()` para retornar apenas um array com os títulos em letras maiúsculas de todos os itens cadastrados.


4. **Buscando por ID:**
* Crie uma função que receba um `id` como parâmetro e utilize o método `.find()` para retornar o objeto correspondente àquele item.



---

## Parte 2: Modularização no Node.js (CommonJS)

Para treinar a divisão de código que vimos na Aula 2:

1. **Separando as Funções:**
* Retire as funções que você criou na *Parte 1* e coloque-as em um novo arquivo chamado `funcoes.js`.
* Exporte essas funções utilizando o padrão **CommonJS** (`module.exports`).




2. **Importando e Executando:**
* No seu arquivo principal (`index.js`), importe o módulo criado utilizando o `require()`.


* Chame as funções passando dados de teste e exiba os resultados no terminal utilizando `console.log()`.



---

## Parte 3: Gerenciamento de Projeto com NPM

1. **Manifesto do Projeto:**
* No terminal, dentro da pasta do seu projeto, inicialize o projeto Node.js gerando o arquivo `package.json` de forma automatizada:


```bash
npm init -y

```




2. **Script de Execução:**
* Abra o seu `package.json` e adicione um script personalizado na seção `"scripts"` chamado `"start"`, configurado para rodar o seu arquivo principal usando o modo vigia nativo do Node:


```json
"scripts": {
  "start": "node --watch index.js"
}

```


* Teste rodando o projeto no terminal através do comando:


```bash
npm run start

```





---

### Critérios de Avaliação:

* Uso correto dos métodos modernos de array (`filter`, `map`, `find`) e *Arrow Functions*.
* Implementação correta da exportação e importação de módulos (`module.exports` e `require`).


* Estrutura correta do `package.json` e funcionamento do script de execução.