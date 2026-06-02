// ============================================
// OVA Final — TGS · Tamid Felipe Viloria Vargas
// ============================================

// ─── CONFIGURACIÓN DE VOLUMEN (modifica aquí) ────────────────────────────────
const VOLUMEN_NORMAL = 0.4;   // música normal (0 = silencio, 1 = máximo)
const VOLUMEN_AIKU   = 0.5;   // música Aiku   (0 = silencio, 1 = máximo)
// ─────────────────────────────────────────────────────────────────────────────

const ovas = [
  { num: 1,  topic: "Definiciones de Sistema", author: "Jhonatan Javier Acevedo Gelves", link: null, thumb: null },
  { num: 2,  topic: "Clasificación general y características de los sistemas", author: "Eder Sahid Alvarado Peñaloza", link: null, thumb: null },
  { num: 3,  topic: "Definiciones formales (entrada, proceso, salida y retroalimentación)", author: "Jhon Alexander Arévalo Ropero", link: "ovas/OVA_Jhon_Alexander/index.html", thumb: "thumbnails/ova3.jpg" },
  { num: 4,  topic: "Tipos de sistemas (dinámicos, estáticos, adaptativos, etc.)", author: "Luis Alberto Balaguera Arango", link: "https://luis00187.github.io/OVA/", thumb: "thumbnails/ova4.jpg" },
  { num: 5,  topic: "Parámetros de los sistemas (homeostasis y equilibrio)", author: "Rafael Steven Estupiñán Cáceres", link: "https://rafasteve01.github.io/rafael/", thumb: "thumbnails/ova5.jpg" },
  { num: 6,  topic: "Propiedades de los sistemas", author: "Sebastián Gelves Triana", link: "https://ova-jjtt.onrender.com/", thumb: "thumbnails/ova6.jpg" },
  { num: 7,  topic: "Caos en los sistemas", author: "Samuel Andeyber Leal Pérez", link: "https://fiendiz.github.io/OVA-CAOS-EN-LOS-SISTEMAS/", thumb: "thumbnails/ova7.jpg" },
  { num: 8,  topic: "Orígenes y principios de la TGS", author: "Jonathan David Melo Claro", link: "ovas/OVA_Jonathan_Melo/index.html", thumb: "thumbnails/ova8.jpg" },
  { num: 9,  topic: "Conceptos de Teoría General de Sistemas (TGS)", author: "Anyelo Steven Oliveros Rivera", link: "https://anyel01.github.io/OVA/", thumb: "thumbnails/ova9.jpg" },
  { num: 10, topic: "El enfoque reduccionista", author: "Juan Carlos Parra Guzmán", link: "https://jcpg3197-afk.github.io/Ova_JuanC/", thumb: "thumbnails/ova10.jpg" },
  { num: 11, topic: "Enfoques para el estudio de la TGS", author: "Jaider Puertas Perdomo", link: "https://jaiderppp.github.io/ENFOQUE-DE-ESTUDIO-TGS/", thumb: "thumbnails/ova11.jpg" },
  { num: 12, topic: "El enfoque sistémico", author: "José Alejandro Rincón Cuadros", link: null, thumb: null },
  { num: 13, topic: "Teoría de comportamientos", author: "Álvaro José Rubio Roa", link: "https://mariobr1011.github.io/trabajo-tgs/", thumb: "thumbnails/ova13.jpg" },
  { num: 14, topic: "Teoría de la información", author: "Jesús David Sarmiento Ortiz", link: "https://syisus6.github.io", thumb: "thumbnails/ova14.jpg" },
  { num: 15, topic: "Teoría de colas y de juegos", author: "Miguel Ángel Tamayo Molina", link: "https://migueltamayosci-wq.github.io/OVA-CURSO-TEORIA-DE-SISTEMAS/", thumb: "thumbnails/ova15.jpg" },
  { num: 16, topic: "Teoría de la organización y cibernética", author: "Kevin Yesid Urbina García", link: "ovas/OVA_Kevin_Urbina/TGS_Cibernetica_Y_Organizacion.html", thumb: "thumbnails/ova16.jpg" },
  { num: 17, topic: "Disciplina y organizaciones inteligentes", author: "Dexly Jolianne Vargas Mantilla", link: "https://dexjolvarman13-art.github.io/OVA_Dexly/", thumb: "thumbnails/ova17.jpg" },
  { num: 18, topic: "Metodología para la creación de modelos en Dinámica de Sistemas", author: "Pedro José Velaides Marciales", link: "ovas/OVA_Pedro_Velaides/OVA18_Dinamica_Sistemas.html", thumb: "thumbnails/ova18.jpg" }
];

// ─── MÚSICA ───────────────────────────────────────────────────────────────────

var temaAiku = false;
var musicaIniciada = false;

var audioNormal = new Audio("sounds/poolside.mp3");
audioNormal.loop = true;
audioNormal.volume = VOLUMEN_NORMAL;

var audioAiku = new Audio("sounds/u20.mp3");
audioAiku.loop = true;
audioAiku.volume = VOLUMEN_AIKU;

function iniciarMusica() {
  if (!musicaIniciada) {
    audioNormal.play().catch(function() {});
    musicaIniciada = true;
  }
}

// Intenta iniciar al cargar, si el navegador lo permite
window.addEventListener("load", function() {
  audioNormal.play().then(function() {
    musicaIniciada = true;
  }).catch(function() {
    // El navegador bloqueó el autoplay, espera primer clic
  });
});

document.addEventListener("click", iniciarMusica, { once: true });
document.addEventListener("keydown", iniciarMusica, { once: true });

window.toggleMusica = function() {
  var btn = document.getElementById("btn-musica");
  var audio = temaAiku ? audioAiku : audioNormal;
  if (audio.paused) {
    audio.play().catch(function() {});
    btn.classList.remove("pausado");
    btn.title = "Pausar música";
  } else {
    audio.pause();
    btn.classList.add("pausado");
    btn.title = "Reproducir música";
  }
};

window.activarTemaAiku = function() {
  temaAiku = !temaAiku;
  var body = document.body;
  var btn = document.getElementById("btn-aiku");
  var btnMusica = document.getElementById("btn-musica");

  if (temaAiku) {
    body.classList.add("tema-aiku");
    btn.textContent = "🔴 Tema Normal";
    audioNormal.pause();
    audioAiku.currentTime = 0;
    audioAiku.volume = VOLUMEN_AIKU;
    audioAiku.play().catch(function() {});
    musicaIniciada = true;
    btnMusica.classList.remove("pausado");
  } else {
    body.classList.remove("tema-aiku");
    btn.textContent = "⚽";
    audioAiku.pause();
    audioNormal.currentTime = 0;
    audioNormal.volume = VOLUMEN_NORMAL;
    audioNormal.play().catch(function() {});
    musicaIniciada = true;
    btnMusica.classList.remove("pausado");
  }
};

// ─── RENDERIZAR TARJETAS ──────────────────────────────────────────────────────

function renderCards(list) {
  var grid = document.getElementById("ova-grid");
  var empty = document.getElementById("empty-state");
  var visibleCount = document.getElementById("visible-count");

  grid.innerHTML = "";

  if (list.length === 0) {
    empty.style.display = "block";
    visibleCount.textContent = "0";
    return;
  }

  empty.style.display = "none";
  visibleCount.textContent = list.length;

  list.forEach(function(ova, index) {
    var hasLink = ova.link && ova.link.trim() !== "";
    var hasThumb = ova.thumb && ova.thumb.trim() !== "";
    var card = document.createElement("div");
    card.className = "ova-card" + (hasLink ? " has-link" : "");
    card.style.animationDelay = (index * 0.03) + "s";

    var thumbHTML = hasThumb
      ? '<div class="ova-thumb"><img src="' + ova.thumb + '" alt="Vista previa OVA ' + ova.num + '" loading="lazy" /></div>'
      : '<div class="ova-thumb ova-thumb-placeholder"><span class="placeholder-icon">📄</span><span class="placeholder-text">Vista previa no disponible</span></div>';

    var btnHTML = hasLink
      ? '<a href="' + ova.link + '" target="_blank" rel="noopener noreferrer" class="ova-link-btn active">Ver OVA</a>'
      : '<div class="ova-link-btn pending">Link pendiente <span class="pending-pill">Por agregar</span></div>';

    card.innerHTML = thumbHTML + '<div class="ova-card-body"><div class="ova-card-top"><div class="ova-num">' + ova.num + '</div><div class="ova-topic">' + ova.topic + '</div></div><div class="ova-author">' + ova.author + '</div>' + btnHTML + '</div>';

    grid.appendChild(card);
  });
}

function updateStats() {
  var available = ovas.filter(function(o) { return o.link && o.link.trim() !== ""; }).length;
  var el = document.getElementById("available-count");
  if (el) el.textContent = available;
}

var currentFilter = "all";
var currentSearch = "";

function getFiltered() {
  return ovas.filter(function(ova) {
    var matchSearch = currentSearch === "" ||
      ova.topic.toLowerCase().includes(currentSearch) ||
      ova.author.toLowerCase().includes(currentSearch) ||
      String(ova.num).includes(currentSearch);

    var hasLink = ova.link && ova.link.trim() !== "";
    var matchFilter = currentFilter === "all" ||
      (currentFilter === "available" && hasLink) ||
      (currentFilter === "pending" && !hasLink);

    return matchSearch && matchFilter;
  });
}

document.getElementById("search-input").addEventListener("input", function() {
  currentSearch = this.value.toLowerCase().trim();
  renderCards(getFiltered());
});

document.querySelectorAll(".filter-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderCards(getFiltered());
  });
});

updateStats();
renderCards(ovas);
