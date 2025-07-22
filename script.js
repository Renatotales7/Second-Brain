document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE PERGUNTAS PARA REFLEXÃO ---
    const bancoDePerguntas = [
        "Pelo que você se sentiu mais grato(a) hoje?", "Qual foi o maior desafio que você superou hoje?",
        "O que você aprendeu de novo hoje?", "Quem te fez sorrir hoje e por quê?",
        "Qual pequeno passo você deu em direção a um grande objetivo?", "Como você demonstrou gentileza hoje (a si mesmo ou a outros)?",
        "Qual momento de paz você encontrou no seu dia?", "O que te deixou mais energizado(a) hoje?",
        "Se pudesse reviver um momento de hoje, qual seria?", "Qual decisão você tomou hoje que te deixou orgulhoso(a)?"
    ];

    // --- ESTADO DA APLICAÇÃO ---
    let rodaDaVidaChart;
    let rodaData = [];
    let reflexoes = [];
    let conquistas = [];
    let lembretes = [];
    let perguntaDoDia = { texto: '', data: '' };

    // --- FUNÇÕES DE INICIALIZAÇÃO E PERSISTÊNCIA ---
    const carregarDados = () => {
        const dataSalvaRoda = localStorage.getItem('rodaDaVidaData');
        rodaData = dataSalvaRoda ? JSON.parse(dataSalvaRoda) : [
            { label: 'Finanças', meta: 10, atual: 6 }, { label: 'Carreira', meta: 10, atual: 8 },
            { label: 'Saúde', meta: 10, atual: 7 }, { label: 'Relacionamentos', meta: 10, atual: 9 },
            { label: 'Lazer', meta: 10, atual: 5 }, { label: 'Crescimento', meta: 10, atual: 8 },
        ];
        reflexoes = JSON.parse(localStorage.getItem('historicoReflexoes')) || [];
        conquistas = JSON.parse(localStorage.getItem('historicoConquistas')) || [];
        lembretes = JSON.parse(localStorage.getItem('lembretes')) || [];
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
    const salvarRodaData = () => localStorage.setItem('rodaDaVidaData', JSON.stringify(rodaData));
    const salvarReflexoes = () => localStorage.setItem('historicoReflexoes', JSON.stringify(reflexoes));
    const salvarConquistas = () => localStorage.setItem('historicoConquistas', JSON.stringify(conquistas));
    const salvarLembretes = () => localStorage.setItem('lembretes', JSON.stringify(lembretes));

    // --- ELEMENTOS DO DOM ---
    const perguntaDoDiaEl = document.getElementById('perguntaDoDia');
    const reflexaoInput = document.getElementById('reflexaoInput');
    const salvarReflexaoBtn = document.getElementById('salvarReflexaoBtn');
    const conquistaInput = document.getElementById('conquistaInput');
    const salvarConquistaBtn = document.getElementById('salvarConquistaBtn');
    const lembreteInput = document.getElementById('lembreteInput');
    const adicionarLembreteBtn = document.getElementById('adicionarLembreteBtn');
    const lembretesLista = document.getElementById('lembretesLista');
    const limparListaBtn = document.getElementById('limparListaBtn');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderizarGraficoRoda = () => {
        const ctx = document.getElementById('rodaDaVidaChart').getContext('2d');
        const data = {
            labels: rodaData.map(d => d.label),
            datasets: [{
                label: 'Nível de Satisfação', data: rodaData.map(d => d.atual), fill: true,
                backgroundColor: 'rgba(193, 166, 255, 0.4)', borderColor: 'rgba(193, 166, 255, 1)',
                pointBackgroundColor: 'rgba(193, 166, 255, 1)', pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(193, 166, 255, 1)'
            }]
        };
        if (rodaDaVidaChart) rodaDaVidaChart.destroy();
        rodaDaVidaChart = new Chart(ctx, {
            type: 'radar', data: data,
            options: {
                responsive: true, maintainAspectRatio: true, elements: { line: { borderWidth: 3 } },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        pointLabels: { color: '#f0f0f0', font: { size: 12 } },
                        ticks: { color: '#f0f0f0', backdropColor: 'rgba(0, 0, 0, 0.5)', stepSize: 2 },
                        suggestedMin: 0, suggestedMax: 10
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    };
    const renderizarLembretes = () => {
        lembretesLista.innerHTML = '';
        lembretes.forEach((lembrete, index) => {
            const li = document.createElement('li');
            li.className = lembrete.completed ? 'completed' : '';
            li.innerHTML = `<input type="checkbox" id="task-${index}" ${lembrete.completed ? 'checked' : ''}><label for="task-${index}">${lembrete.text}</label><button class="delete-btn">&times;</button>`;
            li.querySelector('input').addEventListener('change', () => {
                lembretes[index].completed = !lembretes[index].completed;
                salvarLembretes(); renderizarLembretes();
            });
            li.querySelector('.delete-btn').addEventListener('click', () => {
                lembretes.splice(index, 1);
                salvarLembretes(); renderizarLembretes();
            });
            lembretesLista.appendChild(li);
        });
    };

    // --- LÓGICA PRINCIPAL ---
    perguntaDoDiaEl.textContent = perguntaDoDia.texto;
    salvarReflexaoBtn.addEventListener('click', () => {
        const texto = reflexaoInput.value.trim();
        if (texto) {
            reflexoes.unshift({ pergunta: perguntaDoDia.texto, resposta: texto, data: new Date().toISOString() });
            salvarReflexoes(); reflexaoInput.value = ''; alert('Reflexão salva!');
        }
    });
    salvarConquistaBtn.addEventListener('click', () => {
        const texto = conquistaInput.value.trim();
        if (texto) {
            conquistas.unshift({ resposta: texto, data: new Date().toISOString() });
            salvarConquistas(); conquistaInput.value = ''; alert('Conquista salva!');
        }
    });
    const adicionarLembrete = () => {
        const texto = lembreteInput.value.trim();
        if (texto) {
            lembretes.push({ text: texto, completed: false });
            lembreteInput.value = ''; salvarLembretes(); renderizarLembretes();
        }
    };
    adicionarLembreteBtn.addEventListener('click', adicionarLembrete);
    lembreteInput.addEventListener('keypress', (e) => e.key === 'Enter' && adicionarLembrete());
    limparListaBtn.addEventListener('click', () => {
        lembretes = []; salvarLembretes(); renderizarLembretes();
    });

    // --- LÓGICA DOS MODAIS ---
    const modals = {
        roda: { card: document.getElementById('rodaDaVidaCard'), modal: document.getElementById('gerenciarRodaModal'), render: renderizarListaPropriedades },
        reflexoes: { card: document.getElementById('reflexaoCard'), modal: document.getElementById('historicoReflexoesModal'), render: renderizarHistoricoReflexoes },
        conquistas: { card: document.getElementById('conquistaCard'), modal: document.getElementById('historicoConquistasModal'), render: renderizarHistoricoConquistas }
    };
    Object.values(modals).forEach(item => {
        item.card.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() !== 'textarea' && e.target.tagName.toLowerCase() !== 'button') {
                item.render(); item.modal.classList.remove('hidden');
            }
        });
        item.modal.addEventListener('click', (e) => {
            if (e.target === item.modal || e.target.classList.contains('close-btn')) {
                item.modal.classList.add('hidden');
            }
        });
    });

    // --- RODA DA VIDA: GERENCIAMENTO ---
    const listaPropriedadesRoda = document.getElementById('listaPropriedadesRoda');
    function renderizarListaPropriedades() {
        listaPropriedadesRoda.innerHTML = '';
        rodaData.forEach((prop, index) => {
            const percentual = prop.meta > 0 ? Math.round((prop.atual / prop.meta) * 100) : 0;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'prop-item';
            itemDiv.innerHTML = `
                <div class="prop-item-view">
                    <div class="prop-item-header"><h3>${prop.label}</h3><div class="prop-item-actions"><button class="btn btn-primary edit-btn" data-index="${index}">Editar</button><button class="btn btn-danger delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button></div></div>
                    <div class="prop-item-stats"><span><div class="dot meta"></div>Meta: ${prop.meta}</span><span><div class="dot atual"></div>Atual: ${prop.atual}</span><span><div class="dot percent"></div>${percentual}%</span></div>
                </div>
                <div class="prop-edit-form"></div>`;
            listaPropriedadesRoda.appendChild(itemDiv);
        });
    }
    listaPropriedadesRoda.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const index = button.dataset.index;
        if (button.classList.contains('delete-btn')) {
            if (confirm(`Tem certeza que deseja excluir "${rodaData[index].label}"?`)) {
                rodaData.splice(index, 1); salvarRodaData(); renderizarGraficoRoda(); renderizarListaPropriedades();
            }
        } else if (button.classList.contains('edit-btn')) {
            const itemView = button.closest('.prop-item').querySelector('.prop-item-view');
            const editForm = button.closest('.prop-item').querySelector('.prop-edit-form');
            const prop = rodaData[index];
            editForm.innerHTML = `<input type="text" class="edit-label" value="${prop.label}"><div class="input-group"><div><label>Meta</label><input type="number" class="edit-meta" value="${prop.meta}" min="1" max="10"></div><div><label>Atual</label><input type="number" class="edit-atual" value="${prop.atual}" min="0" max="10"></div></div><div class="prop-item-actions"><button class="btn btn-success save-btn" data-index="${index}">Salvar</button><button class="btn btn-tertiary cancel-btn">Cancelar</button></div>`;
            itemView.classList.add('hidden'); editForm.classList.add('visible');
        } else if (button.classList.contains('save-btn')) {
            const editForm = button.closest('.prop-edit-form');
            rodaData[index] = { label: editForm.querySelector('.edit-label').value, meta: parseInt(editForm.querySelector('.edit-meta').value), atual: parseInt(editForm.querySelector('.edit-atual').value) };
            salvarRodaData(); renderizarGraficoRoda(); renderizarListaPropriedades();
        } else if (button.classList.contains('cancel-btn')) {
            renderizarListaPropriedades();
        }
    });
    document.getElementById('adicionarPropriedadeBtn').addEventListener('click', () => {
        const nomeInput = document.getElementById('novaPropNome');
        const nome = nomeInput.value.trim();
        if (nome) {
            rodaData.push({ label: nome, meta: parseInt(document.getElementById('novaPropMeta').value), atual: parseInt(document.getElementById('novaPropAtual').value) });
            nomeInput.value = ''; salvarRodaData(); renderizarGraficoRoda(); renderizarListaPropriedades();
        }
    });

    // --- HISTÓRICOS: RENDERIZAÇÃO E DELEÇÃO ---
    const formatarData = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    function renderizarHistoricoReflexoes() {
        const container = document.getElementById('listaHistoricoReflexoes');
        container.innerHTML = reflexoes.length === 0 ? `<div class="empty-state"><i class="fa-regular fa-comment-dots"></i><p>Nenhuma reflexão encontrada</p></div>` : '';
        reflexoes.forEach((item, index) => {
            container.innerHTML += `<div class="historico-item"><div class="historico-header"><span>${formatarData(item.data)}</span><button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button></div><p class="historico-pergunta">${item.pergunta}</p><p class="historico-resposta">${item.resposta}</p></div>`;
        });
    }
    function renderizarHistoricoConquistas() {
        const container = document.getElementById('listaHistoricoCon
