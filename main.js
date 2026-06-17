const API_URL = 'https://6a31d1b77bc5e1c612663273.mockapi.io/materias';

// ─── Elementos do DOM ────────────────────────────────
const inputNome       = document.getElementById('input-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnCadastrar    = document.getElementById('btn-cadastrar');
const btnRefresh      = document.getElementById('btn-refresh');
const tbody           = document.getElementById('tbody-materiais');
const msgFeedback     = document.getElementById('msg-feedback');

// ─── Feedback visual ─────────────────────────────────
function mostrarFeedback(mensagem, tipo) {
  msgFeedback.textContent = mensagem;
  msgFeedback.className = `feedback ${tipo}`;
  setTimeout(() => {
    msgFeedback.className = 'feedback hidden';
  }, 3500);
}

// ─── Renderizar tabela ───────────────────────────────
function renderizarMateriais(materiais) {
  tbody.innerHTML = '';

  if (materiais.length === 0) {
    tbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">Nenhum material cadastrado ainda.</td>
      </tr>`;
    return;
  }

  materiais.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome}</td>
      <td><span class="qty-badge">${item.quantidade}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── GET — Carregar materiais ────────────────────────
async function carregarMateriais() {
  tbody.innerHTML = `
    <tr class="loading-row">
      <td colspan="3">
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
        <td colspan="3">Erro ao carregar materiais. Verifique a conexão.</td>
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

// ─── Eventos ─────────────────────────────────────────
btnCadastrar.addEventListener('click', cadastrarMaterial);
btnRefresh.addEventListener('click', carregarMateriais);

// ─── Inicialização ───────────────────────────────────
carregarMateriais();