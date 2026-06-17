[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/B74p-HKt)

# 🏥 Almoxarifado SENAC — Sistema de Controle de Materiais

Sistema web desenvolvido como projeto final da disciplina de Engenharia de Software (ADS 3º Semestre — UniCesumar / SENAC Zona Norte).

## 📋 Sobre o Projeto

A enfermeira Camila é responsável pelo almoxarifado do curso técnico de Enfermagem do SENAC Zona Norte. O controle de materiais (seringas, luvas, gazes etc.) era feito manualmente em planilha. Este sistema moderniza essa rotina com uma interface web conectada a uma API em nuvem.

## 🚀 Tecnologias Utilizadas

- **HTML5** — estrutura da interface
- **CSS3** — estilização responsiva
- **JavaScript (ES6+)** — lógica e requisições assíncronas (`fetch` / `async await`)
- **MockAPI.io** — back-end simulado com API RESTful em nuvem

## ✅ Funcionalidades — Sprint 1

- Cadastro de materiais via formulário (POST)
- Listagem dinâmica de todos os materiais ao carregar a página (GET)
- Feedback visual de sucesso e erro nas operações
- Botão de atualização manual da lista
- Interface responsiva (desktop e mobile)

## ✅ Funcionalidades — Sprint 2

- **Retirada de estoque (baixa):** cada item da lista possui um campo para informar a quantidade a retirar e um botão `.btn-baixar`, que envia um `PUT` atualizando o saldo no MockAPI
- **Validação de regras de negócio:** função `validarRetirada(estoqueAtual, quantidadeRetirada)` bloqueia retiradas negativas, zeradas ou maiores que o saldo disponível, evitando estoque negativo
- **Exclusão de materiais:** botão `.btn-excluir` abre um modal de confirmação antes de remover o item via `DELETE`, evitando exclusões acidentais
- Feedback visual específico para cada erro de validação (quantidade inválida, estoque insuficiente)

## 📁 Estrutura de Arquivos

```
/
├── index.html   # Página principal (formulário + tabela + modal)
├── style.css    # Estilização
├── main.js      # Lógica JavaScript, validações e integração com a API
└── README.md    # Documentação
```

![alt text](image.png)

## ▶️ Como Rodar

Recomenda-se abrir o projeto com a extensão **Live Server** do VS Code (botão direito em `index.html` → "Open with Live Server"), para evitar bloqueios de CORS do navegador.

> A aplicação consome a API hospedada no MockAPI.io — é necessário ter conexão com a internet.

## 🔗 API

- **Base URL:** `https://6a31d1b77bc5e1c612663273.mockapi.io/materiais`
- **Recurso:** `materiais`
- **Métodos utilizados:** `GET` (listar), `POST` (cadastrar), `PUT` (atualizar/baixar estoque), `DELETE` (excluir)

## 👨‍💻 Desenvolvedor

Bruno Stainski — ADS 3º Semestre