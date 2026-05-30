// ==========================================
// 1. LÓGICA DE INTERFAZ & SCROLL ANIMATIONS
// ==========================================

const bancoPreguntas = [
    { q: "¿Quién es el padre de la TGS?", a: "Bertalanffy" },
    { q: "¿Qué propiedad define que un sistema busca el equilibrio?", a: "Homeostasis" },
    { q: "¿Un sistema que no interactúa con el entorno es?", a: "Cerrado" },
    { q: "¿La tendencia natural al caos es?", a: "Entropía" },
    { q: "¿En Farmatodo, la gestión de inventario es un?", a: "Proceso" },
    { q: "¿Qué principio dice que el todo es más que la suma de sus partes?", a: "Sinergia" },
    { q: "¿La capacidad de lograr un fin por varios caminos es?", a: "Equifinalidad" },
    { q: "El feedback en un sistema se llama...", a: "Retroalimentación" },
    { q: "¿Es Farmatodo un sistema abierto? (Si/No)", a: "Si" },
    { q: "¿Los productos vendidos por Farmatodo son los?", a: "Outputs" }
];

function renderQuiz() {
    const contenedor = document.querySelector('.quiz-questions');
    if (!contenedor) return;
    
    contenedor.innerHTML = bancoPreguntas.map((item, i) => `
        <div class="q-block">
            <h4>${i + 1}. ${item.q}</h4>
            <input type="text" id="q${i}" class="quiz-input" placeholder="Escribe aquí...">
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", renderQuiz);

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Menú Móvil
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Scroll Reveal Effects (Aparición Animada)
const reveals = document.querySelectorAll('.reveal');

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

reveals.forEach(element => {
    scrollObserver.observe(element);
});

// ==========================================
// 2. LÓGICA JUEGO 1: DRAG & DROP
// ==========================================
const draggables = document.querySelectorAll('.draggable');
const dropTargets = document.querySelectorAll('.drop-target');
let dragElementId = null;
let correctMatches = 0;

draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        dragElementId = e.target.getAttribute('data-id');
        e.target.style.opacity = '0.5';
    });

    item.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
    });
});

dropTargets.forEach(target => {
    target.addEventListener('dragover', (e) => {
        e.preventDefault();
        target.classList.add('drag-over');
    });

    target.addEventListener('dragleave', () => {
        target.classList.remove('drag-over');
    });

    target.addEventListener('drop', (e) => {
        e.preventDefault();
        target.classList.remove('drag-over');

        const targetMatchId = target.getAttribute('data-match');

        if (dragElementId === targetMatchId) {
            target.style.borderColor = '#22c55e';
            target.style.background = 'rgba(34, 197, 94, 0.1)';

            const draggedNode = document.querySelector(`.draggable[data-id="${dragElementId}"]`);
            if (draggedNode) {
                draggedNode.style.display = 'none';
            }
            correctMatches++;
            validarVictoriaDrag();
        } else {
            target.style.borderColor = '#ef4444';
            setTimeout(() => {
                target.style.borderColor = 'var(--text-muted)';
            }, 800);
        }
    });
});

function validarVictoriaDrag() {
    const msgBox = document.getElementById('drag-msg');
    if (correctMatches === 2 && msgBox) {
        msgBox.textContent = "¡Excelente! Conceptos de la TGS emparejados correctamente.";
        msgBox.style.color = '#22c55e';
    }
}

// ==========================================
// 3. LÓGICA JUEGO 2: VERDADERO / FALSO
// ==========================================
function checkTF(isCorrect, btnElement) {
    const parent = btnElement.parentElement;
    const allBtns = parent.querySelectorAll('button');

    allBtns.forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary)';
        btn.style.borderColor = 'var(--primary)';
    });

    if (isCorrect) {
        btnElement.style.background = '#22c55e';
        btnElement.style.color = 'white';
        btnElement.style.borderColor = '#22c55e';
    } else {
        btnElement.style.background = '#ef4444';
        btnElement.style.color = 'white';
        btnElement.style.borderColor = '#ef4444';
    }
}

// ==========================================
// 4. LÓGICA EVALUACIÓN FORMATIVA CORREGIDA (TEXT INPUTS)
// ==========================================
function calcularQuiz() {
    let finalScore = 0;
    const totalQuestions = bancoPreguntas.length;
    let completado = true;

    // Validar que el usuario haya escrito en todas las cajas
    bancoPreguntas.forEach((_, i) => {
        const inputUser = document.getElementById(`q${i}`);
        if (!inputUser || inputUser.value.trim() === "") {
            completado = false;
        }
    });

    if (!completado) {
        alert("Atención: Por favor responde las 10 preguntas antes de calificar.");
        return;
    }

    // Verificar las respuestas de texto de manera flexible
    bancoPreguntas.forEach((item, i) => {
        const inputUser = document.getElementById(`q${i}`);
        const respuestaUsuario = inputUser.value.trim().toLowerCase();
        const respuestaCorrecta = item.a.toLowerCase();

        if (respuestaUsuario.includes(respuestaCorrecta) || respuestaCorrecta.includes(respuestaUsuario)) {
            finalScore++;
        }
    });

    // Actualizar la barra de progreso
    const percentage = (finalScore / totalQuestions) * 100;
    const bar = document.getElementById('quiz-bar');
    if (bar) bar.style.width = percentage + '%';

    // Desplegar feedback inmediato profesional
    const resultBox = document.getElementById('quiz-result');
    if (resultBox) {
        if (finalScore >= 7) {
            resultBox.textContent = `¡Aprobado! Puntaje: ${finalScore}/${totalQuestions}. ¡Dominas la metateoría y el modelo sistémico de Farmatodo!`;
            resultBox.style.color = '#22c55e';
        } else {
            resultBox.textContent = `Puntaje: ${finalScore}/${totalQuestions}. Te falta repasar la conceptualización para aprobar.`;
            resultBox.style.color = '#f59e0b';
        }
    }
}