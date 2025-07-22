document.addEventListener("DOMContentLoaded", () => {
    // --- CONSTANTS ---
    const KEYS = {
        RODA_VIDA: 'segundoCerebroRodaVida',
        REFLEXOES: 'segundoCerebroReflexoes',
        CONQUISTAS: 'segundoCerebroConquistas',
        LEMBRETES: 'segundoCerebroLembretes',
        LAST_VISIT: 'segundoCerebroLastVisit'
    };

    const PERGUNTAS_DIARIAS = [
        "Qual foi o ponto alto do seu dia e por quê?",
        "O que você aprendeu de novo hoje?",
        "Pelo que você se sentiu grato(a) hoje?",
        "Qual desafio você superou hoje?",
        "Como você demonstrou bondade a si mesmo(a) ou a outra pessoa?",
        "O que te fez sorrir hoje?",
        "Qual pequena vitória você celebrou hoje?",
        "Se você pudesse mudar uma coisa sobre o seu dia, o que seria?",
        "O que te inspirou hoje?",
        "Qual foi a decisão mais difícil que você tomou hoje?",
        "Como você cuidou do seu bem-estar (físico, mental, emocional) hoje?",
        "Qual conversa significativa você teve hoje?",
        "O que você fez hoje para se aproximar de um dos seus objetivos?",
        "Qual foi o momento mais pacífico do seu dia?",
        "O que você adiou que poderia ter feito hoje?",
        "Como você usou sua criatividade hoje?",
        "Qual ato de generosidade (seu ou de outra pessoa) você testemunhou?",
        "O que te deixou com mais energia hoje?",
        "Qual obstáculo inesperado você encontrou?",
        "O que você está ansioso(a) para amanhã?",
        "Qual habilidade você gostaria de desenvolver a partir de uma experiência de hoje?"
    ];

    // --- DOM ELEMENTS ---
    const navLinks = document.querySelectorAll(".nav-link");
    const pages = document.querySelectorAll(".page");
    const perguntaDoDiaElements = document.querySelectorAll(".pergunta-do-dia");

    // --- STATE MANAGEMENT ---
    let state = {
        rodaVida: {},
        reflexoes: [],
        conquistas: [],
        lembretes: [],
        lastVisit: null
    };

    const loadStateFromLocalStorage = () => {
        try {
            const rodaVida = JSON.parse(localStorage.getItem(KEYS.RODA_VIDA)) || {};
            const reflexoes = JSON.parse(localStorage.getItem(KEYS.REFLEXOES)) || [];
            const conquistas = JSON.parse(localStorage.getItem(KEYS.CONQUISTAS)) || [];
            const lembretes = JSON.parse(localStorage.getItem(KEYS.LEMBRETES)) || [];
            const lastVisit = localStorage.getItem(KEYS.LAST_VISIT);

            state = { rodaVida, reflexoes, conquistas, lembretes, lastVisit };
        } catch (error) {
            console.error("Erro ao carregar o estado do localStorage:", error);
        }
    };

    const saveStateToLocalStorage = () => {
        try {
            localStorage.setItem(KEYS.RODA_VIDA, JSON.stringify(state.rodaVida));
            localStorage.setItem(KEYS.REFLEXOES, JSON.stringify(state.reflexoes));
            localStorage.setItem(KEYS.CONQUISTAS, JSON.stringify(state.conquistas));
            localStorage.setItem(KEYS.LEMBRETES, JSON.stringify(state.lembretes));
            localStorage.setItem(KEYS.LAST_VISIT, new Date().toISOString().slice(0, 10));
        } catch (error) {
            console.error("Erro ao salvar o estado no localStorage:", error);
        }
    };

    // --- UI LOGIC ---

    // SPA Navigation
    const handleNavClick = (e) => {
        e.preventDefault();
        const targetPageId = e.currentTarget.dataset.page;

        pages.forEach(page => {
            page.classList.toggle("active", page.id === targetPageId);
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.page === targetPageId);
        });
    };

    navLinks.forEach(link => link.addEventListener("click", handleNavClick));

    // Pergunta do Dia
    const getDayOfYear = (date) => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const setPerguntaDoDia = () => {
        // Usando UTC-3 (Brasília) como referência
        const now = new Date();
        const offset = -3 * 60; // -3 horas em minutos
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const brasiliaDate = new Date(utc + (offset * 60000));

        const dayOfYear = getDayOfYear(brasiliaDate);
        const perguntaIndex = dayOfYear % PERGUNTAS_DIARIAS.length;
        const pergunta = PERGUNTAS_DIARIAS[perguntaIndex];

        perguntaDoDiaElements.forEach(el => el.textContent = pergunta);
    };

    // --- INITIALIZATION ---
    const init = () => {
        loadStateFromLocalStorage();
        setPerguntaDoDia();
        // Outras funções de inicialização da UI virão aqui
    };

    init();
});



    // --- RODA DA VIDA --- 
    const rodaDaVidaChartCtx = document.getElementById("rodaDaVidaChart").getContext("2d");
    let rodaDaVidaChart;

    const renderRodaDaVidaChart = () => {
        if (rodaDaVidaChart) {
            rodaDaVidaChart.destroy();
        }

        const data = {
            labels: ["Carreira", "Finanças", "Saúde", "Família", "Relacionamentos", "Desenvolvimento Pessoal", "Lazer", "Espiritualidade"],
            datasets: [{
                label: "Nível",
                data: Object.values(state.rodaVida),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(83, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        };

        rodaDaVidaChart = new Chart(rodaDaVidaChartCtx, {
            type: "radar",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.3)' },
                        grid: { color: 'rgba(255, 255, 255, 0.3)' },
                        pointLabels: { color: 'white' },
                        ticks: { display: false, beginAtZero: true, max: 10 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Update progress bar
        const total = Object.values(state.rodaVida).reduce((sum, val) => sum + val, 0);
        const average = total / Object.keys(state.rodaVida).length || 0;
        document.querySelector(".progress-bar").style.width = `${average * 10}%`;
    };

    // --- REFLEXÃO/CONQUISTA --- 
    const setupSaveButton = (cardSelector, key, type) => {
        const card = document.querySelector(cardSelector);
        const textarea = card.querySelector("textarea");
        const saveButton = card.querySelector(".save-button");
        const streakText = card.querySelector(".streak-text");

        const updateStreak = () => {
            const today = new Date().toISOString().slice(0, 10);
            const records = state[key];
            let currentStreak = 0;
            let lastDate = null;

            for (let i = records.length - 1; i >= 0; i--) {
                const recordDate = records[i].date;
                if (lastDate === null) {
                    if (recordDate === today) {
                        currentStreak = 1;
                        lastDate = recordDate;
                    } else {
                        break;
                    }
                } else {
                    const prevDay = new Date(lastDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    if (prevDay.toISOString().slice(0, 10) === recordDate) {
                        currentStreak++;
                        lastDate = recordDate;
                    } else {
                        break;
                    }
                }
            }
            streakText.textContent = `${currentStreak} dias seguidos!`;
        };

        saveButton.addEventListener("click", () => {
            const text = textarea.value.trim();
            if (text) {
                const today = new Date().toISOString().slice(0, 10);
                const pergunta = card.querySelector(".pergunta-do-dia").textContent;

                state[key].push({ date: today, pergunta: pergunta, resposta: text });
                saveStateToLocalStorage();
                textarea.value = "";

                saveButton.classList.add("success");
                setTimeout(() => {
                    saveButton.classList.remove("success");
                }, 2000);
                updateStreak();
            }
        });
        updateStreak();
    };

    setupSaveButton(".reflexao", "reflexoes", "reflexao");
    setupSaveButton(".conquista", "conquistas", "conquista");

    // --- LEMBRETES --- 
    const lembretesList = document.querySelector(".lembretes-list");
    const addLembreteButton = document.querySelector(".card.lembretes .add-button");
    const emptyStateLembretes = document.querySelector(".card.lembretes .empty-state");

    const renderLembretes = () => {
        lembretesList.innerHTML = "";
        if (state.lembretes.length === 0) {
            emptyStateLembretes.classList.remove("hidden");
        } else {
            emptyStateLembretes.classList.add("hidden");
            state.lembretes.forEach((lembrete, index) => {
                const li = document.createElement("li");
                li.classList.add("lembrete-item");
                li.dataset.index = index;
                li.innerHTML = `
                    <span>${lembrete}</span>
                    <div class="lembrete-actions">
                        <button class="edit-button">Editar</button>
                        <button class="delete-button">Excluir</button>
                    </div>
                `;
                lembretesList.appendChild(li);
            });
        }
    };

    addLembreteButton.addEventListener("click", () => {
        const newLembrete = prompt("Digite o novo lembrete:");
        if (newLembrete) {
            state.lembretes.push(newLembrete);
            saveStateToLocalStorage();
            renderLembretes();
        }
    });

    lembretesList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-button")) {
            const li = e.target.closest(".lembrete-item");
            const index = parseInt(li.dataset.index);
            const deletedLembrete = state.lembretes[index];

            li.classList.add("removing");
            setTimeout(() => {
                state.lembretes.splice(index, 1);
                saveStateToLocalStorage();
                renderLembretes();
                showUndoNotification(deletedLembrete, index);
            }, 300);
        }

        if (e.target.classList.contains("edit-button")) {
            const li = e.target.closest(".lembrete-item");
            const span = li.querySelector("span");
            const oldText = span.textContent;
            const index = parseInt(li.dataset.index);

            const input = document.createElement("input");
            input.type = "text";
            input.value = oldText;
            input.classList.add("edit-input");

            span.replaceWith(input);
            input.focus();

            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText && newText !== oldText) {
                    state.lembretes[index] = newText;
                    saveStateToLocalStorage();
                }
                input.replaceWith(span);
                span.textContent = newText || oldText;
            };

            input.addEventListener("blur", saveEdit);
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    saveEdit();
                }
            });
        }
    });

    // --- UNDO NOTIFICATION --- 
    const undoNotification = document.getElementById("undoNotification");
    const undoButton = undoNotification.querySelector(".undo-button");
    let undoTimeout;

    const showUndoNotification = (deletedLembrete, originalIndex) => {
        undoNotification.classList.add("show");
        clearTimeout(undoTimeout);
        undoTimeout = setTimeout(() => {
            undoNotification.classList.remove("show");
        }, 5000);

        undoButton.onclick = () => {
            state.lembretes.splice(originalIndex, 0, deletedLembrete);
            saveStateToLocalStorage();
            renderLembretes();
            undoNotification.classList.remove("show");
        };
    };

    // --- INITIALIZATION (updated) ---
    const init = () => {
        loadStateFromLocalStorage();
        setPerguntaDoDia();
        renderRodaDaVidaChart();
        renderLembretes();
    };

    init();
});



    // --- MODAIS --- 
    const rodaDaVidaModal = document.getElementById("rodaDaVidaModal");
    const historicoReflexoesModal = document.getElementById("historicoReflexoesModal");
    const historicoConquistasModal = document.getElementById("historicoConquistasModal");

    const openModal = (modalElement) => {
        modalElement.classList.add("show");
        document.body.classList.add("modal-open");
        modalElement.focus(); // Foca no modal para acessibilidade
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".modal .close-button").forEach(button => {
        button.addEventListener("click", (e) => {
            closeModal(e.target.closest(".modal"));
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal.show").forEach(modal => {
                closeModal(modal);
            });
        }
    });

    // Event listener para abrir o modal da Roda da Vida
    document.querySelector(".card.roda-da-vida .icon-button").addEventListener("click", () => {
        openModal(rodaDaVidaModal);
    });

    // --- INITIALIZATION (final update) ---
    const finalInit = () => {
        loadStateFromLocalStorage();
        setPerguntaDoDia();
        renderRodaDaVidaChart();
        renderLembretes();
        // Adicionar aqui a lógica para carregar dados dos modais se necessário
    };

    finalInit();
});

