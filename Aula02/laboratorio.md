# Laboratório - Aula 02

Neste laboratório, você vai criar um projeto Node.js do zero, organizá-lo em módulos e usar um pacote externo para formatar datas.

## Passo 1: Criando e Inicializando o Projeto

1.  No terminal, navegue até a pasta `Aula02`.

    ```bash
    cd Aula02
    ```

2.  Inicie um novo projeto NPM. O comando `-y` aceita todas as opções padrão.
    ```bash
    npm init -y
    ```
    Observe que um arquivo `package.json` foi criado na pasta `Aula02`.

## Passo 2: Criando Módulos Locais

Vamos criar um utilitário simples que realiza operações matemáticas.

1.  Dentro da pasta `Aula02`, crie uma pasta `src`.
2.  Dentro de `src`, crie um arquivo chamado `operacoes.js`.
3.  Adicione o seguinte código a `operacoes.js`:

    ```javascript
    // src/operacoes.js
    function somar(a, b) {
      return a + b;
    }

    function subtrair(a, b) {
      return a - b;
    }

    // Exporta as funções para que possam ser usadas em outros arquivos
    module.exports = {
      somar,
      subtrair,
    };
    ```

4.  Agora, crie o arquivo principal `index.js` dentro de `src`.
5.  Adicione o seguinte código a `index.js`:

    ```javascript
    // src/index.js

    // Importa o módulo de operações
    const operacoes = require("./operacoes.js");

    const resultadoSoma = operacoes.somar(10, 5);
    const resultadoSubtracao = operacoes.subtrair(10, 5);

    console.log("Resultado da soma:", resultadoSoma);
    console.log("Resultado da subtração:", resultadoSubtracao);
    ```

## Passo 3: Executando o Código com Módulos

No terminal, a partir da pasta `Aula02`, execute o arquivo `index.js`:

```bash
node src/index.js
```

**Resultado Esperado:**

```
Resultado da soma: 15
Resultado da subtração: 5
```

## Passo 4: Usando um Pacote Externo

Agora, vamos instalar e usar um pacote da comunidade para formatar datas. Usaremos o `date-fns`.

1.  No terminal (ainda na pasta `Aula02`), instale o pacote:

    ```bash
    npm install date-fns
    ```

    Repare que uma pasta `node_modules` e um arquivo `package-lock.json` foram criados. O `package.json` também foi atualizado com a nova dependência.

2.  Modifique o arquivo `src/index.js` para usar o pacote `date-fns`:

    ```javascript
    // src/index.js

    // Importa o módulo local
    const operacoes = require("./operacoes.js");
    // Importa o pacote externo
    const { format } = require("date-fns");

    const resultadoSoma = operacoes.somar(10, 5);
    const resultadoSubtracao = operacoes.subtrair(10, 5);

    console.log("Resultado da soma:", resultadoSoma);
    console.log("Resultado da subtração:", resultadoSubtracao);

    // Usa a função do pacote date-fns
    const dataAtualFormatada = format(new Date(), "dd/MM/yyyy HH:mm:ss");
    console.log("Data atual:", dataAtualFormatada);
    ```

## Passo 5: Executando a Versão Final

Execute o script novamente:

```bash
node src/index.js
```

**Resultado Esperado:**

```
Resultado da soma: 15
Resultado da subtração: 5
Data atual: 09/04/2026 14:30:00 // A data e hora serão as do momento da execução
```

**Parabéns! Você criou um projeto Node.js, organizou o código em módulos e utilizou um pacote externo gerenciado pelo NPM.**
