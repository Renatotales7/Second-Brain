document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE PERGUNTAS ---
    const bancoDePerguntas = [
        "Pelo que você se sentiu mais grato(a) hoje?", "Qual foi o maior desafio que você superou hoje?",
        "O que você aprendeu de novo hoje?", "Quem te fez sorrir hoje e por quê?",
        "Qual pequeno passo você deu em direção a um grande objetivo?", "Como você demonstrou gentileza hoje?",
        "Qual momento de paz você encontrou no seu dia?", "O que te deixou mais energizado(a) hoje?",
        "Se pudesse reviver um momento de hoje, qual seria?", "Qual decisão você tomou hoje que te deixou orgulhoso(a)?"
    ];

    // --- ESTADO DA APLICAÇÃO ---
    let rodaDaVidaChart;
    let rodaData, reflexoes, conquistas, lembretes, perguntaDoDia;

    // --- FUNÇÕES DE PERSISTÊNCIA (LocalStorage) ---
    const carregarDados = () => {
        rodaData = JSON.parse(localStorage.getItem('rodaDaVidaData')) || [
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

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderizarGraficoRoda = () => {
        const canvas = document.getElementById('rodaDaVidaChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (rodaDaVidaChart) rodaDaVidaChart.destroy();
        rodaDaVidaChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: rodaData.map(d => d.label),
                datasets: [{
                    label: 'Nível de Satisfação', data: rodaData.map(d => d.atual), fill: true,
                    backgroundColor: 'rgba(193, 166, 255, 0.4)', borderColor: 'rgba(193, 166, 255, 1)',
                    pointBackgroundColor: 'rgba(193, 166, 255, 1)', pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(193, 166, 255, 1)'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true, elements: { line: { borderWidth: 3 } },
                scales: { r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' },
                    pointLabels: { color: '#f5f5f7', font: { size: 12, family: 'Inter' } },
                    ticks: { color: '#f5f5f7', backdropColor: 'rgba(0, 0, 0, 0.5)', stepSize: 2 },
                    suggestedMin: 0, suggestedMax: 10
                }},
                plugins: { legend: { display: false } }
            }
        });
    };

    const renderizarLembretes = () => {
        const lista = document.getElementById('lembretesLista');
        if (!lista) return;
        lista.innerHTML = '';
        lembretes.forEach((lembrete, index) => {
            const li = document.createElement('li');
            li.className = lembrete.completed ? 'completed' : '';
            li.dataset.index = index;
            li.innerHTML = `<input type="checkbox" id="task-${index}" ${lembrete.completed ? 'checked' : ''}><label for="task-${index}">${lembrete.text}</label><button class="delete-btn">&times;</button>`;
            lista.appendChild(li);
        });
    };

    const atualizarPerguntaDoDia = () => {
        const el = document.getElementById('perguntaDoDia');
        if (el) el.textContent = perguntaDoDia.texto;
    };

    // --- MODAIS ---
    const abrirModal = (modalId, conteudo) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.innerHTML = `<div class="modal-content">${conteudo}</div>`;
        modal.classList.remove('hidden');
        
        // Adiciona listener para fechar o modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close-btn')) {
                modal.classList.add('hidden');
            }
        });
    };

    const formatarData = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    const init = () => {
        carregarDados();
        renderizarGraficoRoda();
        renderizarLembretes();
        atualizarPerguntaDoDia();

        // --- Event Listeners dos Cards Principais ---
        document.getElementById('salvarReflexaoBtn')?.addEventListener('click', () => {
            const input = document.getElementById('reflexaoInput');
            if (input.value.trim()) {
                reflexoes.unshift({ pergunta: perguntaDoDia.texto, resposta: input.value.trim(), data: new Date().toISOString() });
                salvarReflexoes(); input.value = ''; alert('Reflexão salva!');
            }
        });

        document.getElementById('salvarConquistaBtn')?.addEventListener('click', () => {
            const input = document.getElementById('conquistaInput');
            if (input.value.trim()) {
                conquistas.unshift({ resposta: input.value.trim(), data: new Date().toISOString() });
                salvarConquistas(); input.value = ''; alert('Conquista salva!');
            }
        });

        document.getElementById('adicionarLembreteBtn')?.addEventListener('click', () => {
            const input = document.getElementById('lembreteInput');
            if (input.value.trim()) {
                lembretes.push({ text: input.value.trim(), completed: false });
                salvarLembretes(); renderizarLembretes(); input.value = '';
            }
        });

        document.getElementById('limparListaBtn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar todos os lembretes?')) {
                lembretes = []; salvarLembretes(); renderizarLembretes();
            }
        });

        document.getElementById('lembretesLista')?.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            const index = li.dataset.index;
            if (e.target.matches('.delete-btn')) {
                lembretes.splice(index, 1);
            } else {
                lembretes[index].completed = !lembretes[index].completed;
            }
            salvarLembretes(); renderizarLembretes();
        });

        // --- Event Listeners para abrir Modais ---
        document.getElementById('rodaDaVidaCard')?.addEventListener('click', (e) => {
            if (e.target.closest('canvas')) return;
            let itemsHtml = rodaData.map((prop, index) => {
                const percentual = prop.meta > 0 ? Math.round((prop.atual / prop.meta) * 100) : 0;
                return `<div class="prop-item" data-index="${index}">
                    <h3>${prop.label}</h3>
                    <div class="prop-item-stats"><span>Meta: ${prop.meta}</span><span>Atual: ${prop.atual}</span><span>${percentual}%</span></div>
                </div>`;
            }).join('');
            const modalContent = `
                <div class="modal-header"><h2>Gerenciar Roda da Vida</h2><button class="close-btn">&times;</button></div>
                <div class="propriedades-container">${itemsHtml}</div>
            `;
            abrirModal('gerenciarRodaModal', modalContent);
        });

        document.getElementById('reflexaoCard')?.addEventListener('click', (e) => {
            if (e.target.closest('textarea, button')) return;
            let itemsHtml = reflexoes.length > 0 ? reflexoes.map((item, index) => `
                <div class="historico-item" data-index="${index}">
                    <div class="historico-header"><span>${formatarData(item.data)}</span><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></div>
                    <p class="historico-pergunta">${item.pergunta}</p><p class="historico-resposta">${item.resposta}</p>
                </div>`).join('') : `<div class="empty-state"><i class="fa-regular fa-comment-dots"></i><p>Nenhuma reflexão encontrada</p></div>`;
            const modalContent = `<div class="modal-header"><h2>Histórico de Reflexões</h2><button class="close-btn">&times;</button></div><div class="historico-container">${itemsHtml}</div>`;
            abrirModal('historicoReflexoesModal', modalContent);
        });
        
        document.getElementById('conquistaCard')?.addEventListener('click', (e) => {
            if (e.target.closest('textarea, button')) return;
            let itemsHtml = conquistas.length > 0 ? conquistas.map((item, index) => `
                <div class="historico-item" data-index="${index}">
                    <div class="historico-header"><span>${formatarData(item.data)}</span><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></div>
                    <p class="historico-resposta">${item.resposta}</p>
                </div>`).join('') : `<div class="empty-state"><i class="fa-solid fa-trophy"></i><p>Nenhuma conquista encontrada</p></div>`;
            const modalContent = `<div class="modal-header"><h2>Histórico de Conquistas</h2><button class="close-btn">&times;</button></div><div class="historico-container">${itemsHtml}</div>`;
            abrirModal('historicoConquistasModal', modalContent);
        });
    };

    // Inicia a aplicação
    init();
});
