# Solução de Problemas (Troubleshooting) - Pull Requests Fechados

## O que aconteceu?

Recentemente, o histórico de commits do repositório principal (`oMaestro174/node.js-e-express`) precisou ser reescrito. Essa é uma ação drástica, mas foi necessária para remover completamente alguns arquivos que foram enviados por engano.

Quando o histórico de uma branch é reescrito (usando `git push --force`), os commits antigos são substituídos por novos. Os Pull Requests (PRs) que vocês haviam criado estavam baseados nesses commits antigos, que "deixaram de existir".

O GitHub detectou que a base dos seus PRs era inválida e, como medida de segurança para proteger o repositório, fechou-os automaticamente.

Pedimos desculpas pelo transtorno. A boa notícia é que seu código não foi perdido e o processo para reenviá-lo é simples.

---

## Guia para Alunos: Como Corrigir e Reenviar seu Pull Request

Para reenviar sua atividade de forma simples e segura, por favor, sigam estes passos:

**Passo 1: Salve sua atividade**

- Encontre a pasta com o seu nome que contém sua atividade (ex: `Atividades-A1/Noturno/Seu Nome Completo`).
- **Copie essa pasta** para um local seguro fora do repositório (por exemplo, para a sua Área de Trabalho).

**Passo 2: Apague o repositório antigo**

- Delete a pasta `node.js-e-express` do seu computador.

**Passo 3: Sincronize seu Fork no GitHub (Importante!)**

Antes de clonar novamente, precisamos garantir que o seu repositório online (o seu Fork) esteja atualizado.

1.  Vá para a página do **seu fork** no GitHub (ex: `https://github.com/SEU-USUARIO/node.js-e-express`).
2.  Clique no link **"Sync fork"** e depois no botão **"Update branch"**.

![Sync Fork](https://docs.github.com/assets/cb-130233/images/help/pull-requests/sync-fork-update-branch-button.png)

**Passo 4: Clone o repositório novamente**

- Agora, clone o **seu fork** atualizado para o seu computador.

```bash
git clone https://github.com/SEU-USUARIO/node.js-e-express.git
cd node.js-e-express
```

**Passo 5: Restaure sua atividade e envie**

1.  Copie a pasta da sua atividade (que você salvou no Passo 1) de volta para o lugar certo dentro da pasta `node.js-e-express` que você acabou de clonar.
2.  Crie sua branch, adicione os arquivos, faça o commit e envie para o seu fork.

```bash
# Crie sua branch novamente
git checkout -b "seu-nome-completo"

# Adicione todos os arquivos
git add .

# Faça o commit
git commit -m "A1: Reenviando atividade de [Seu Nome Completo]"

# Envie para o seu fork
git push origin "seu-nome-completo"
```

**Passo 6: Abra um novo Pull Request**

- Volte para a página do seu fork no GitHub e crie um novo Pull Request.
