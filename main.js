const API_URL = 'https://6a31d1b77bc5e1c612663273.mockapi.io/materias';

// ─── Elementos do DOM ────────────────────────────────
const inputNome       = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar    = document.getElementById('btn-cadastrar');
const btnRefresh      = document.getElementById('btn-refresh');
const tbody           = document.getElementById('tbody-materiais');
const msgFeedback     = document.getElementById('msg-feedback');

const modalOverlay    = document.getElementById('modal-confirmar');
const modalItemNome   = document.getElementById('modal-item-nome');
const modalCancelar   = document.getElementById('modal-cancelar');
const modalConfirmar  = document.getElementById('modal-confirmar-btn');

// Guarda em memória os materiais carregados, e qual item está marcado para exclusão
let materiaisAtuais = [];
let idParaExcluir   = null;

// ─── Feedback visual ─────────────────────────────────
function mostrarFeedback(mensagem, tipo) {
  msgFeedback.textContent = mensagem;
  msgFeedback.className = `feedback ${tipo}`;
  setTimeout(() => {
    msgFeedback.className = 'feedback hidden';
  }, 3500);
}

/**
 * Valida se uma operação de retirada de estoque pode ser executada.
 *
 * Regras de negócio:
 *  - A quantidade a retirar não pode ser negativa, zero ou não numérica.
 *  - A quantidade a retirar não pode ser maior que o estoque atual.
 *
 * @param {number} estoqueAtual       Quantidade disponível no momento.
 * @param {number} quantidadeRetirada Quantidade que se deseja retirar.
 * @returns {boolean} true se a retirada é válida, false caso contrário.
 */
function validarRetirada(estoqueAtual, quantidadeRetirada) {
  if (typeof estoqueAtual !== 'number' || typeof quantidadeRetirada !== 'number') return false;
  if (Number.isNaN(estoqueAtual) || Number.isNaN(quantidadeRetirada)) return false;
  if (quantidadeRetirada <= 0) return false;
  if (quantidadeRetirada > estoqueAtual) return false;
  return true;
}

// ─── Renderizar tabela ───────────────────────────────
function renderizarMateriais(materiais) {
  materiaisAtuais = materiais;
  tbody.innerHTML = '';

  if (materiais.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">Nenhum material cadastrado ainda.</td>
      </tr>`;
    return;
  }

  materiais.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome}</td>
      <td><span class="qty-badge">${item.quantidade}</span></td>
      <td>
        <input
          type="number"
          class="input-retirada-row input-retirada"
          id="input-retirada-${item.id}"
          min="1"
          placeholder="Qtd"
        />
      </td>
      <td class="td-acoes">
        <button class="btn-baixar" data-id="${item.id}" title="Confirmar baixa">↓ Baixar</button>
        <button class="btn-excluir" data-id="${item.id}" title="Excluir material">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Liga os eventos de cada botão de baixar / excluir recém-criado
  document.querySelectorAll('.btn-baixar').forEach(btn => {
    btn.addEventListener('click', () => baixarEstoque(btn.dataset.id));
  });
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', () => abrirModalExclusao(btn.dataset.id));
  });
}

// ─── GET — Carregar materiais ────────────────────────
async function carregarMateriais() {
  tbody.innerHTML = `
    <tr class="loading-row">
      <td colspan="5">
        <span class="loading-spinner"></span>
        Carregando materiais...
      </td>
    </tr>`;

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const materiais = await response.json();
    renderizarMateriais(materiais);

  } catch (erro) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">Erro ao carregar materiais. Verifique a conexão.</td>
      </tr>`;
    console.error('Erro no GET:', erro);
  }
}

// ─── POST — Cadastrar material ───────────────────────
async function cadastrarMaterial() {
  const nome       = inputNome.value.trim();
  const quantidade = inputQuantidade.value.trim();

  if (!nome || quantidade === '') {
    mostrarFeedback('Preencha o nome e a quantidade antes de cadastrar.', 'error');
    return;
  }

  if (Number(quantidade) < 0) {
    mostrarFeedback('A quantidade não pode ser negativa.', 'error');
    return;
  }

  btnCadastrar.disabled = true;
  btnCadastrar.textContent = 'Cadastrando...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nome, quantidade: Number(quantidade) })
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    inputNome.value       = '';
    inputQuantidade.value = '';

    mostrarFeedback(`Material "${nome}" cadastrado com sucesso!`, 'success');
    await carregarMateriais();

  } catch (erro) {
    mostrarFeedback('Erro ao cadastrar. Tente novamente.', 'error');
    console.error('Erro no POST:', erro);
  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.innerHTML = '<span class="btn-icon">＋</span> Cadastrar';
  }
}

// ─── PUT — Baixar estoque (retirada de material) ─────
async function baixarEstoque(id) {
  const item = materiaisAtuais.find(m => String(m.id) === String(id));
  if (!item) {
    mostrarFeedback('Material não encontrado na lista.', 'error');
    return;
  }

  const inputRetirada = document.getElementById(`input-retirada-${id}`);
  const quantidadeRetirada = Number(inputRetirada.value);
  const estoqueAtual = Number(item.quantidade);

  // Usa a função obrigatória de validação antes de qualquer chamada à API
  if (!validarRetirada(estoqueAtual, quantidadeRetirada)) {
    if (quantidadeRetirada <= 0 || Number.isNaN(quantidadeRetirada)) {
      mostrarFeedback('Informe uma quantidade válida (maior que zero) para retirar.', 'error');
    } else if (quantidadeRetirada > estoqueAtual) {
      mostrarFeedback(`Estoque insuficiente: há apenas ${estoqueAtual} unidade(s) de "${item.nome}".`, 'error');
    } else {
      mostrarFeedback('Quantidade de retirada inválida.', 'error');
    }
    return;
  }

  const novaQuantidade = estoqueAtual - quantidadeRetirada;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ quantidade: novaQuantidade })
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    mostrarFeedback(`Baixa de ${quantidadeRetirada} unidade(s) de "${item.nome}" realizada com sucesso!`, 'success');
    await carregarMateriais();

  } catch (erro) {
    mostrarFeedback('Erro ao atualizar o estoque. Tente novamente.', 'error');
    console.error('Erro no PUT:', erro);
  }
}

// ─── DELETE — Excluir material (com modal de confirmação) ─
function abrirModalExclusao(id) {
  const item = materiaisAtuais.find(m => String(m.id) === String(id));
  if (!item) return;

  idParaExcluir = id;
  modalItemNome.textContent = item.nome;
  modalOverlay.classList.remove('hidden');
}

function fecharModal() {
  modalOverlay.classList.add('hidden');
  idParaExcluir = null;
}

async function excluirMaterial() {
  if (!idParaExcluir) return;

  const id = idParaExcluir;
  const item = materiaisAtuais.find(m => String(m.id) === String(id));

  modalConfirmar.disabled = true;
  modalConfirmar.textContent = 'Excluindo...';

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    mostrarFeedback(`Material "${item ? item.nome : ''}" excluído com sucesso.`, 'success');
    fecharModal();
    await carregarMateriais();

  } catch (erro) {
    mostrarFeedback('Erro ao excluir o material. Tente novamente.', 'error');
    console.error('Erro no DELETE:', erro);
  } finally {
    modalConfirmar.disabled = false;
    modalConfirmar.textContent = 'Excluir';
  }
}

// ─── Eventos ─────────────────────────────────────────
btnCadastrar.addEventListener('click', cadastrarMaterial);
btnRefresh.addEventListener('click', carregarMateriais);
modalCancelar.addEventListener('click', fecharModal);
modalConfirmar.addEventListener('click', excluirMaterial);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) fecharModal();
});

// ─── Inicialização ───────────────────────────────────
carregarMateriais();