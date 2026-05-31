// ============================================
// OVA Final — TGS · Tamid Felipe Viloria Vargas
// script.js — datos y lógica interactiva
// ============================================

const ovas = [
  {
    num: 1,
    topic: "Definiciones de Sistema",
    author: "Jhonatan Javier Acevedo Gelves",
    link: null,
    thumb: null
  },
  {
    num: 2,
    topic: "Clasificación general y características de los sistemas",
    author: "Eder Sahid Alvarado Peñaloza",
    link: null,
    thumb: null
  },
  {
    num: 3,
    topic: "Definiciones formales (entrada, proceso, salida y retroalimentación)",
    author: "Jhon Alexander Arévalo Ropero",
    link: "ovas/OVA_Jhon_Alexander/index.html",
    thumb: "thumbnails/ova3.jpg"
  },
  {
    num: 4,
    topic: "Tipos de sistemas (dinámicos, estáticos, adaptativos, etc.)",
    author: "Luis Alberto Balaguera Arango",
    link: null,
    thumb: null
  },
  {
    num: 5,
    topic: "Parámetros de los sistemas (homeostasis y equilibrio)",
    author: "Rafael Steven Estupiñán Cáceres",
    link: "https://rafasteve01.github.io/rafael/",
    thumb: "thumbnails/ova5.jpg"
  },
  {
    num: 6,
    topic: "Propiedades de los sistemas",
    author: "Sebastián Gelves Triana",
    link: null,
    thumb: null
  },
  {
    num: 7,
    topic: "Caos en los sistemas",
    author: "Samuel Andeyber Leal Pérez",
    link: "https://fiendiz.github.io/OVA-CAOS-EN-LOS-SISTEMAS/",
    thumb: "thumbnails/ova7.jpg"
  },
  {
    num: 8,
    topic: "Orígenes y principios de la TGS",
    author: "Jonathan David Melo Claro",
    link: "ovas/OVA_Jonathan_Melo/index.html",
    thumb: "thumbnails/ova8.jpg"
  },
  {
    num: 9,
    topic: "Conceptos de Teoría General de Sistemas (TGS)",
    author: "Anyelo Steven Oliveros Rivera",
    link: "https://github.com/Anyel01/OVA",
    thumb: null
  },
  {
    num: 10,
    topic: "El enfoque reduccionista",
    author: "Juan Carlos Parra Guzmán",
    link: "https://jcpg3197-afk.github.io/Ova_JuanC/",
    thumb: "thumbnails/ova10.jpg"
  },
  {
    num: 11,
    topic: "Enfoques para el estudio de la TGS",
    author: "Jaider Puertas Perdomo",
    link: null,
    thumb: null
  },
  {
    num: 12,
    topic: "El enfoque sistémico",
    author: "José Alejandro Rincón Cuadros",
    link: null,
    thumb: null
  },
  {
    num: 13,
    topic: "Teoría de comportamientos",
    author: "Álvaro José Rubio Roa",
    link: "https://mariobr1011.github.io/trabajo-tgs/",
    thumb: "thumbnails/ova13.jpg"
  },
  {
    num: 14,
    topic: "Teoría de la información",
    author: "Jesús David Sarmiento Ortiz",
    link: "https://syisus6.github.io",
    thumb: "thumbnails/ova14.jpg"
  },
  {
    num: 15,
    topic: "Teoría de colas y de juegos",
    author: "Miguel Ángel Tamayo Molina",
    link: "https://migueltamayosci-wq.github.io/OVA-CURSO-TEORIA-DE-SISTEMAS/",
    thumb: "thumbnails/ova15.jpg"
  },
  {
    num: 16,
    topic: "Teoría de la organización y cibernética",
    author: "Kevin Yesid Urbina García",
    link: "ovas/OVA_Kevin_Urbina/TGS_Cibernetica_Y_Organizacion.html",
    thumb: "thumbnails/ova16.jpg"
  },
  {
    num: 17,
    topic: "Disciplina y organizaciones inteligentes",
    author: "Dexly Jolianne Vargas Mantilla",
    link: "https://dexjolvarman13-art.github.io/OVA_Dexly/",
    thumb: "thumbnails/ova17.jpg"
  },
  {
    num: 18,
    topic: "Metodología para la creación de modelos en Dinámica de Sistemas",
    author: "Pedro José Velaides Marciales",
    link: "ovas/OVA_Pedro_Velaides/OVA18_Dinamica_Sistemas.html",
    thumb: "thumbnails/ova18.jpg"
  }
];

// ─── RENDERIZAR TARJETAS ──────────────────────────────────────────────────────

function renderCards(list) {
  const grid = document.getElementById("ova-grid");
  const empty = document.getElementById("empty-state");
  const visibleCount = document.getElementById("visible-count");

  grid.innerHTML = "";

  if (list.length === 0) {
    empty.style.display = "block";
    visibleCount.textContent = "0";
    return;
  }

  empty.style.display = "none";
  visibleCount.textContent = list.length;

  list.forEach((ova, index) => {
    const hasLink = ova.link && ova.link.trim() !== "";
    const hasThumb = ova.thumb && ova.thumb.trim() !== "";
    const card = document.createElement("div");
    card.className = "ova-card" + (hasLink ? " has-link" : "");
    card.style.animationDelay = `${index * 0.03}s`;

    card.innerHTML = `
      ${hasThumb ? `
        <div class="ova-thumb">
          <img src="${ova.thumb}" alt="Vista previa OVA ${ova.num}" loading="lazy" />
          <div class="ova-thumb-overlay">
            <span class="ova-thumb-num">#${ova.num}</span>
          </div>
        </div>
      ` : `
        <div class="ova-thumb ova-thumb-placeholder">
          <span class="placeholder-icon">📄</span>
          <span class="placeholder-text">Vista previa no disponible</span>
          <div class="ova-thumb-overlay">
            <span class="ova-thumb-num">#${ova.num}</span>
          </div>
        </div>
      `}
      <div class="ova-card-body">
        <div class="ova-card-top">
          <div class="ova-num">${ova.num}</div>
          <div class="ova-topic">${ova.topic}</div>
        </div>
        <div class="ova-author">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          ${ova.author}
        </div>
        ${hasLink
          ? `<a href="${ova.link}" target="_blank" rel="noopener noreferrer" class="ova-link-btn active">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                 <polyline points="15 3 21 3 21 9"/>
                 <line x1="10" y1="14" x2="21" y2="3"/>
               </svg>
               Ver OVA
             </a>`
          : `<div class="ova-link-btn pending">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                 <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                 <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
               </svg>
               Link pendiente
               <span class="pending-pill">Por agregar</span>
             </div>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

// ─── CONTAR LINKS DISPONIBLES ─────────────────────────────────────────────────

function updateStats() {
  const available = ovas.filter(o => o.link && o.link.trim() !== "").length;
  const el = document.getElementById("available-count");
  if (el) el.textContent = available;
}

// ─── BÚSQUEDA Y FILTROS ───────────────────────────────────────────────────────

let currentFilter = "all";
let currentSearch = "";

function getFiltered() {
  return ovas.filter(ova => {
    const matchSearch =
      currentSearch === "" ||
      ova.topic.toLowerCase().includes(currentSearch) ||
      ova.author.toLowerCase().includes(currentSearch) ||
      String(ova.num).includes(currentSearch);

    const hasLink = ova.link && ova.link.trim() !== "";
    const matchFilter =
      currentFilter === "all" ||
      (currentFilter === "available" && hasLink) ||
      (currentFilter === "pending" && !hasLink);

    return matchSearch && matchFilter;
  });
}

document.getElementById("search-input").addEventListener("input", function () {
  currentSearch = this.value.toLowerCase().trim();
  renderCards(getFiltered());
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderCards(getFiltered());
  });
});

// ─── INICIO ───────────────────────────────────────────────────────────────────

updateStats();
renderCards(ovas);
