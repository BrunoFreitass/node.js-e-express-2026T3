# Guia: Como Sincronizar Alterações com o Repositório Remoto (GitHub)

Este guia explica o processo para baixar as atualizações do repositório no GitHub sem perder as alterações que você fez localmente no seu computador.

## O Cenário

- Você fez alterações em alguns arquivos do projeto no seu computador.
- Outras pessoas (ou você mesmo, em outro computador) enviaram atualizações para o repositório no GitHub.
- Você quer juntar as duas coisas: manter suas alterações e baixar as novidades.

## O Processo Correto (3 Passos)

Siga os passos abaixo na ordem correta para evitar conflitos e perda de trabalho.

### Passo 1: Salve suas alterações locais

Antes de tudo, você precisa "empacotar" suas alterações locais em um commit. Isso é como tirar uma foto do seu trabalho atual e salvá-la no seu histórico local.

Abra o terminal na pasta do projeto e execute os dois comandos abaixo:

```bash
# 1. Adiciona todos os arquivos modificados à "área de preparação"
git add .

# 2. Cria um commit (um "pacote") com suas alterações
#    (Você pode alterar a mensagem do commit para algo que descreva o que você fez)
git commit -m "feat: minhas alterações locais"
```

Com isso, seu trabalho local está salvo e seguro.

### Passo 2: Baixe as alterações do repositório remoto

Agora que seu trabalho está salvo, você pode baixar as atualizações do GitHub. O Git tentará mesclar (juntar) o que veio da nuvem com os seus commits locais.

```bash
# Baixa as atualizações do branch 'main' do repositório remoto 'origin' (GitHub)
git pull origin main
```

Na maioria das vezes, o Git consegue fazer a junção automaticamente. Se houver um conflito (por exemplo, se você e outra pessoa alteraram a mesma linha no mesmo arquivo), o Git avisará, e você precisará resolver o conflito antes de continuar.

### Passo 3 (Opcional): Envie suas alterações para a nuvem

Depois de baixar e mesclar as atualizações remotas, seu ambiente local está sincronizado. Agora, se você quiser compartilhar os commits que você criou no Passo 1, basta enviá-los para o GitHub.

```bash
# Envia seus commits locais para o branch 'main' no GitHub
git push origin main
```

---

## Resumo dos Comandos

```bash
# 1. Salvar trabalho local
git add .
git commit -m "Minha mensagem descritiva"

# 2. Baixar e mesclar trabalho remoto
git pull origin main

# 3. Enviar tudo para o GitHub (opcional)
git push origin main
```

Seguindo este fluxo, você mantém seu histórico de trabalho organizado e evita a perda de código.
