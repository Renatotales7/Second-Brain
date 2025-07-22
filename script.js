document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE PERGUNTAS PARA REFLEXÃO ---
    const bancoDePerguntas = [
        "Pelo que você se sentiu mais grato(a) hoje?",
        "Qual foi o maior desafio que você superou hoje?",
        "O que você aprendeu de novo hoje?",
        "Quem te fez sorrir hoje e por quê?",
        "Qual pequeno passo você deu em direção a um grande objetivo?",
        "Como você demonstrou gentileza hoje (a si mesmo ou a outros)?",
        "Qual momento de paz você encontrou no seu dia?",
        "O que te deixou mais energizado(a) hoje?",
        "Se pudesse reviver um momento de hoje, qual seria?",
        "Qual decisão você tomou hoje que te deixou orgulhoso(a)?"
    ];

    // --- ESTADO DA APLICAÇÃO ---
    let rodaData = []; // (código da Roda da Vida inalterado)
    let reflexoes = [];
    let conquistas = [];
    let perguntaDoDia = { texto: '', data: '' };

    // --- FUNÇÕES DE INICIALIZAÇÃO E PERSISTÊNCIA ---
    const carregarDados = () => {
        // Roda da Vida
        const dataSalvaRoda = localStorage.getItem('rodaDaVidaData');
        rodaData = dataSalvaRoda ? JSON.parse(dataSalvaRoda) : [
            { label: 'Finanças', meta: 10, atual: 6 }, { label: 'Carreira', meta: 10, atual: 8 },
            { label: 'Saúde', meta: 10, atual: 7 }, { label: 'Relacionamentos', meta: 10, atual: 9 },
            { label: 'Lazer', meta: 10, atual: 5 }, { label: 'Crescimento', meta: 10, atual: 8 },
        ];

        // Históricos
        reflexoes = JSON.parse(localStorage.getItem('historicoReflexoes')) || [];
        conquistas = JSON.parse(localStorage.getItem('historicoConquistas')) || [];
        
        // Pergunta do Dia
        const perguntaSalva = JSON.parse(localStorage.getItem('perguntaDoDia'));
        const hoje = new Date().toDateString();
        if (perguntaSalva && perguntaSalva.data === hoje) {
            perguntaDoDia = perguntaSalva;
        } else {
            const novaPergunta = bancoDePerguntas[Math.floor(Math.random() * bancoDePerguntas.length)];
            perguntaDoDia = { texto: novaPergunta, data: hoje };
            localStorage.setItem('perguntaDoDia', JSON.stringify(perguntaDoDia));
        }
    };

    const salvarReflexoes = () => localStorage.setItem('historicoReflexoes', JSON.stringify(reflexoes));
    const salvarConquistas = () => localStorage.setItem('historicoConquistas', JSON.stringify(conquistas));

    // --- ELEMENTOS DO DOM ---
    const perguntaDoDiaEl = document.getElementById('perguntaDoDia');
    const reflexaoInput = document.getElementById('reflexaoInput');
    const salvarReflexaoBtn = document.getElementById('salvarReflexaoBtn');
    const conquistaInput = document.getElementById('conquistaInput');
    const salvarConquistaBtn = document.getElementById('salvarConquistaBtn');

    // --- LÓGICA DE REFLEXÕES E CONQUISTAS ---
    perguntaDoDiaEl.textContent = perguntaDoDia.texto;

    salvarReflexaoBtn.addEventListener('click', () => {
        const texto = reflexaoInput.value.trim();
        if (texto) {
            reflexoes.unshift({
                pergunta: perguntaDoDia.texto,
                resposta: texto,
                data: new Date().toISOString()
            });
            salvarReflexoes();
            reflexaoInput.value = '';
            alert('Reflexão salva com sucesso!');
        }
    });

    salvarConquistaBtn.addEventListener('click', () => {
        const texto = conquistaInput.value.trim();
        if (texto) {
            conquistas.unshift({
                resposta: texto,
                data: new Date().toISOString()
            });
            salvarConquistas();
            conquistaInput.value = '';
            alert('Conquista salva com sucesso!');
        }
    });

    // --- LÓGICA DOS MODAIS DE HISTÓRICO ---
    const reflexaoCard = document.getElementById('reflexaoCard');
    const conquistaCard = document.getElementById('conquistaCard');
    const historicoReflexoesModal = document.getElementById('historicoReflexoesModal');
    const historicoConquistasModal = document.getElementById('historicoConquistasModal');
    const listaHistoricoReflexoes = document.getElementById('listaHistoricoReflexoes');
    const listaHistoricoConquistas = document.getElementById('listaHistoricoConquistas');

    const formatarData = (isoString) => new Date(isoString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const renderizarHistoricoReflexoes = () => {
        listaHistoricoReflexoes.innerHTML = '';
        if (reflexoes.length === 0) {
            listaHistoricoReflexoes.innerHTML = `<div class="empty-state"><i class="fa-regular fa-comment-dots"></i><p>Nenhuma reflexão encontrada</p></div>`;
            return;
        }
        reflexoes.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'historico-item';
            div.innerHTML = `
                <div class="historico-header">
                    <span>${formatarData(item.data)}</span>
                    <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
                <p class="historico-pergunta">${item.pergunta}</p>
                <p class="historico-resposta">${item.resposta}</p>
            `;
            listaHistoricoReflexoes.appendChild(div);
        });
    };

    const renderizarHistoricoConquistas = () => {
        listaHistoricoConquistas.innerHTML = '';
        if (conquistas.length === 0) {
            listaHistoricoConquistas.innerHTML = `<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Nenhuma conquista encontrada</p></div>`;
            return;
        }
        conquistas.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'historico-item';
            div.innerHTML = `
                <div class="historico-header">
                    <span>${formatarData(item.data)}</span>
                    <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </div>
                <p class="historico-resposta">${item.resposta}</p>
            `;
            listaHistoricoConquistas.appendChild(div);
        });
    };

    // Abrir modais (com delegação de evento para não abrir ao clicar no textarea)
    reflexaoCard.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() !== 'textarea' && e.target.tagName.toLowerCase() !== 'button') {
            renderizarHistoricoReflexoes();
            historicoReflexoesModal.classList.remove('hidden');
        }
    });
    conquistaCard.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() !== 'textarea' && e.target.tagName.toLowerCase() !== 'button') {
            renderizarHistoricoConquistas();
            historicoConquistasModal.classList.remove('hidden');
        }
    });

    // Fechar modais
    document.querySelectorAll('.modal-overlay .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => e.target.closest('.modal-overlay').classList.add('hidden'));
    });
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

    // Deletar itens do histórico
    listaHistoricoReflexoes.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.delete-btn').dataset.index;
            reflexoes.splice(index, 1);
            salvarReflexoes();
            renderizarHistoricoReflexoes();
        }
    });
    listaHistoricoConquistas.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.delete-btn').dataset.index;
            conquistas.splice(index, 1);
            salvarConquistas();
            renderizarHistoricoConquistas();
        }
    });

    // --- INICIALIZAÇÃO GERAL ---
    carregarDados();
    // (Restante do código da Roda da Vida e Lembretes permanece aqui, sem alterações)
    // ...
});
