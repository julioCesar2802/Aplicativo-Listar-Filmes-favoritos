// --- VARIÁVEIS GLOBAIS ---
const form = document.getElementById('filmeForm');
const listaFilmes = document.getElementById('listaFilmes');
const KEY_DB = 'meusFilmesDB'; // Nome da chave no LocalStorage

// --- FUNÇÕES DE BANCO DE DADOS (LOCALSTORAGE) ---

// Ler dados (Retrieve)
function getBanco() {
    return JSON.parse(localStorage.getItem(KEY_DB)) || [];
}

// Salvar dados
function setBanco(banco) {
    localStorage.setItem(KEY_DB, JSON.stringify(banco));
}

// --- FUNÇÕES DE RENDERIZAÇÃO (HTML DINÂMICO) ---

function atualizarTela() {
    const banco = getBanco();
    listaFilmes.innerHTML = ''; // Limpa a lista antes de renderizar de novo

    banco.forEach((filme, index) => {
        // Criação do Card usando Template String
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${filme.poster}" alt="${filme.titulo}" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
            <div class="card-info">
                <h3>${filme.titulo}</h3>
                <p>${filme.genero} • ${filme.ano}</p>
            </div>
            <div class="card-actions">
                <button class="secondary" onclick="editarFilme(${index})">✏️</button>
                <button class="secondary" onclick="deletarFilme(${index})">🗑️</button>
            </div>
        `;
        listaFilmes.appendChild(card);
    });
}

// --- FUNÇÕES CRUD (CREATE, UPDATE, DELETE) ---

// Adicionar ou Atualizar Filme
function salvarFilme(evento) {
    evento.preventDefault(); // Evita que a página recarregue

    const id = document.getElementById('filmeId').value;
    const titulo = document.getElementById('titulo').value;
    const ano = document.getElementById('ano').value;
    const genero = document.getElementById('genero').value;
    const poster = document.getElementById('poster').value;

    const banco = getBanco();

    if (id === "") {
        // CREATE (Criar novo)
        banco.push({ titulo, ano, genero, poster });
    } else {
        // UPDATE (Atualizar existente)
        banco[id] = { titulo, ano, genero, poster };
        document.getElementById('filmeId').value = ""; // Limpa o ID
        document.getElementById('btnSalvar').innerText = "Adicionar Filme";
        document.getElementById('btnCancelar').classList.add('hidden');
    }

    setBanco(banco);
    atualizarTela();
    form.reset();
}

// Preparar para Editar (Leva os dados para o formulário)
function editarFilme(index) {
    const banco = getBanco();
    const filme = banco[index];

    document.getElementById('titulo').value = filme.titulo;
    document.getElementById('ano').value = filme.ano;
    document.getElementById('genero').value = filme.genero;
    document.getElementById('poster').value = filme.poster;
    document.getElementById('filmeId').value = index;

    // Muda o visual do botão
    document.getElementById('btnSalvar').innerText = "Atualizar";
    document.getElementById('btnCancelar').classList.remove('hidden');
    
    // Rola a página para cima
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Deletar Filme
function deletarFilme(index) {
    if(confirm("Tem certeza que deseja excluir este filme?")) {
        const banco = getBanco();
        banco.splice(index, 1); // Remove 1 item na posição index
        setBanco(banco);
        atualizarTela();
    }
}

// Cancelar Edição
function limparFormulario() {
    form.reset();
    document.getElementById('filmeId').value = "";
    document.getElementById('btnSalvar').innerText = "Adicionar Filme";
    document.getElementById('btnCancelar').classList.add('hidden');
}

// --- INICIALIZAÇÃO ---
form.addEventListener('submit', salvarFilme);
document.addEventListener('DOMContentLoaded', atualizarTela);