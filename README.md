# 🏥 Almoxarifado SENAC — Sistema de Controle de Materiais

🔗 **Projeto no ar:** [https://universidade-cesumar.github.io/prova-2bi-ads-esoft-3sem-BrunoStainski/](https://universidade-cesumar.github.io/prova-2bi-ads-esoft-3sem-BrunoStainski/)

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

## ✅ Funcionalidades — Sprint 3 (Final)

- **Barra de pesquisa:** campo `#input-busca` filtra a lista de materiais em tempo real pelo nome, sem precisar de nova chamada à API
- **Dashboard:** elemento `#total-itens` exibe a quantidade total de materiais cadastrados no estoque
- **Alerta de estoque crítico:** itens com menos de 10 unidades recebem automaticamente a classe `.estoque-critico` via JavaScript, destacando a linha em vermelho e exibindo um selo de aviso
- **Tratamento de erros de rede:** todas as requisições (`GET`, `POST`, `PUT`, `DELETE`) possuem blocos `try/catch`, distinguindo falhas de conexão (sem internet) de erros retornados pelo servidor
- **Deploy:** projeto publicado via GitHub Pages

## 📁 Estrutura de Arquivos

```
/
├── index.html   # Página principal (formulário + tabela + modal)
├── style.css    # Estilização
├── main.js      # Lógica JavaScript, validações e integração com a API
└── README.md    # Documentação
```

## ▶️ Como Rodar

Recomenda-se abrir o projeto com a extensão **Live Server** do VS Code (botão direito em `index.html` → "Open with Live Server"), para evitar bloqueios de CORS do navegador.

> A aplicação consome a API hospedada no MockAPI.io — é necessário ter conexão com a internet.

## 🔗 API

- **Base URL:** `https://6a31d1b77bc5e1c612663273.mockapi.io/materiais`
- **Recurso:** `materiais`
- **Métodos utilizados:** `GET` (listar), `POST` (cadastrar), `PUT` (atualizar/baixar estoque), `DELETE` (excluir)

## 🌐 Deploy (GitHub Pages)

1. No repositório do GitHub, vá em **Settings → Pages**
2. Em **Build and deployment → Source**, selecione **Deploy from a branch**
3. Em **Branch**, selecione **master** (ou **main**) e a pasta **/ (root)**
4. Clique em **Save**
5. Aguarde alguns minutos e o link será exibido no topo da própria página de Settings → Pages
6. Copie esse link e cole no topo deste README, substituindo o link de exemplo

## 👨‍💻 Desenvolvedor

Bruno Stainski — ADS 3º Semestre