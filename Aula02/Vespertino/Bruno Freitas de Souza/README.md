# Aula 02 — Laboratório: Módulos e NPM

**Aluno:** Bruno Freitas de Souza — Vespertino

## O que foi feito

- Projeto criado com `npm init -y`.
- Módulo local `src/operacoes.js` com as funções `somar` e `subtrair`, exportadas com `module.exports`.
- `src/index.js` importa o módulo local com `require` e usa o pacote externo `date-fns` para mostrar a data atual formatada.

## Como rodar

```bash
npm install
npm start        # ou: node src/index.js
```

## Resultado esperado

```
Resultado da soma: 15
Resultado da subtração: 5
Data atual: 28/10/2026 09:30:00   (data e hora do momento da execução)
```
