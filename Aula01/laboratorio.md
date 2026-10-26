# Laboratório - Aula 01

Este laboratório tem um objetivo simples: garantir que seu ambiente de desenvolvimento está pronto e que você consegue executar um script Node.js.

## Passo 1: Instalação do Node.js

Se você ainda não tem o Node.js instalado, siga os passos abaixo.

1.  **Acesse o site oficial**: [https://nodejs.org/](https://nodejs.org/)
2.  **Baixe a versão LTS**: LTS significa "Long Term Support" (Suporte de Longo Prazo). É a versão mais estável e recomendada para a maioria dos usuários.
3.  **Instale o pacote**: Siga as instruções do instalador para o seu sistema operacional (Windows, macOS ou Linux).

## Passo 2: Verificação da Instalação

Abra um terminal (Prompt de Comando, PowerShell, ou Terminal) e execute os seguintes comandos para verificar se a instalação foi bem-sucedida.

1.  **Verifique a versão do Node.js**:

    ```bash
    node -v
    ```

    Você deve ver uma saída como `v20.11.1` (a versão pode variar).

2.  **Verifique a versão do NPM**: O NPM (Node Package Manager) é instalado junto com o Node.js.
    ```bash
    npm -v
    ```
    Você deve ver uma saída como `10.2.4`.

Se ambos os comandos funcionaram, seu ambiente está pronto!

## Passo 3: Executando seu Primeiro Script

Agora, vamos executar o script de exemplo que está neste projeto.

1.  **Navegue até a pasta da aula no terminal**:

    ```bash
    cd Aula01
    ```

2.  **Execute o script**: Use o comando `node` seguido do caminho para o arquivo.
    ```bash
    node src/primeiro-script.js
    ```

## Resultado Esperado

Se tudo deu certo, você verá a seguinte mensagem no seu terminal:

```
Olá, ITEAM! Este é meu primeiro script rodando no Node.js!
```

**Parabéns! Você configurou seu ambiente e executou seu primeiro código no lado do servidor com Node.js.**
