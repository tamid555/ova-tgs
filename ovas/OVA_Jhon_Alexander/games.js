/* ==========================================================================
   LÓGICA DE JUEGOS Y EVALUACIÓN - TGS-OVA
   ========================================================================== */

// Variables globales para persistencia y estados de los juegos
let currentScenario = null;
let gameElements = [];
let gameScore = 0;
let gameAttempts = 0;
const MAX_ATTEMPTS = 4;

/* ==========================================================================
   JUEGO 1: ARCHITECT (DISEÑADOR DE SISTEMAS)
   ========================================================================== */

// Base de datos de escenarios del Juego 1
const scenariosData = {
    atm: {
        name: "Cajero Automático (ATM)",
        elements: [
            { id: "e1", text: "Tarjeta de Débito / Chip", type: "input", desc: "Entrega datos de identificación y acceso de la cuenta del usuario." },
            { id: "e2", text: "Teclado Numérico (NIP)", type: "input", desc: "Permite al cliente ingresar instrucciones y claves confidenciales." },
            { id: "e3", text: "Pantalla Táctil (Montos)", type: "input", desc: "Recibe las selecciones manuales del tipo y valor de transacción." },
            { id: "e4", text: "Verificar PIN de Seguridad", type: "process", desc: "El microprocesador valida la clave ingresada contra la base de datos central de seguridad." },
            { id: "e5", text: "Cálculo de Fondos Disponibles", type: "process", desc: "Compara el saldo de la cuenta con el monto solicitado para autorizar la transacción." },
            { id: "e6", text: "Actualización de Cuenta", type: "process", desc: "Resta el valor retirado del saldo contable total en tiempo real." },
            { id: "e7", text: "Dispensación de Billetes", type: "output", desc: "Salida física. Entrega de efectivo físico al cliente." },
            { id: "e8", text: "Recibo Impreso", type: "output", desc: "Salida física de información. Documento físico comprobante de la transacción." },
            { id: "e9", text: "Alerta de PIN Incorrecto", type: "feedback", desc: "Señal de control. Notifica fallo de acceso, detiene el proceso y pide reingresar datos." },
            { id: "e10", text: "Retención de Tarjeta", type: "feedback", desc: "Acción correctora severa. Traga el plástico tras reiterados errores para evitar fraudes." }
        ]
    },
    purifier: {
        name: "Planta Purificadora de Agua",
        elements: [
            { id: "p1", text: "Agua Dulce de Río", type: "input", desc: "Insumo físico crudo a purificar (materia)." },
            { id: "p2", text: "Bombas Eléctricas de Succión", type: "input", desc: "Fuerza mecánica motriz que capta los fluidos (energía)." },
            { id: "p3", text: "Inyección de Cloro / Desinfectantes", type: "input", desc: "Químicos agregados iniciales para tratamiento microbiológico." },
            { id: "p4", text: "Filtrado por Carbón Activo", type: "process", desc: "Retiene partículas finas, olores y sabores nocivos del agua." },
            { id: "p5", text: "Sedimentación en Piscinas", type: "process", desc: "Permite que los lodos y arenas gruesas se asienten por gravedad." },
            { id: "p6", text: "Irradiación con Luz Ultravioleta", type: "process", desc: "Destruye el ADN de patógenos y bacterias residuales." },
            { id: "p7", text: "Agua Mineral Embotellada", type: "output", desc: "Resultado útil y purificado listo para distribución comercial." },
            { id: "p8", text: "Lodos Acumulados y Salmueras", type: "output", desc: "Residuos concentrados de desecho (aumento de entropía ambiental)." },
            { id: "p9", text: "Sensor de Turbidez (Recircular)", type: "feedback", desc: "Si el sensor detecta turbidez alta en la salida, cierra la compuerta final y devuelve el agua al inicio." },
            { id: "p10", text: "Alarma de Filtro Tapado", type: "feedback", desc: "Lazo de control que detiene las bombas de entrada cuando la presión interna sube por obstrucciones." }
        ]
    }
};

// Iniciar Juego 1 con un escenario específico
function initArchitectGame(scenarioKey) {
    currentScenario = scenariosData[scenarioKey];
    if (!currentScenario) return;

    gameScore = 0;
    gameAttempts = 0;

    // Actualizar interfaz
    document.getElementById('architectIntroCard').classList.add('hidden');
    document.getElementById('architectGameBoard').classList.remove('hidden');
    document.getElementById('gameScenarioName').textContent = currentScenario.name;
    document.getElementById('gameScoreText').textContent = gameScore;
    document.getElementById('gameAttemptsText').textContent = gameAttempts;

    // Ocultar banner de feedback
    document.getElementById('gameFeedbackBanner').classList.add('hidden');

    // Limpiar slots de depósito en pantalla
    document.getElementById('zone-input').innerHTML = '';
    document.getElementById('zone-process').innerHTML = '';
    document.getElementById('zone-output').innerHTML = '';
    document.getElementById('zone-feedback').innerHTML = '';

    // Mezclar elementos y cargarlos
    gameElements = [...currentScenario.elements].sort(() => Math.random() - 0.5);
    renderScrambledElements();
}

// Renderizar elementos desordenados y configurar Drag and Drop
function renderScrambledElements() {
    const pool = document.getElementById('elementsPool');
    pool.innerHTML = '';

    if (gameElements.length === 0) {
        checkArchitectVictory();
        return;
    }

    gameElements.forEach(elem => {
        const item = document.createElement('div');
        item.className = 'draggable-element';
        item.id = elem.id;
        item.draggable = true;
        item.textContent = elem.text;

        // Soporte para clicks directos (Facilidad móvil)
        item.addEventListener('click', () => {
            handleElementSelection(elem, item);
        });

        // Eventos Drag and Drop estándar
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', elem.id);
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });

        pool.appendChild(item);
    });
}

// Configurar los Dropzones de la interfaz al cargar
function setupDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const elemId = e.dataTransfer.getData('text/plain');
            const targetZone = zone.getAttribute('data-zone');
            
            processPlacement(elemId, targetZone);
        });
    });
}

// Soporte de selección rápida interactiva (sin arrastrar, haciendo clic)
let selectedElemForClick = null;
let selectedDomNode = null;

function handleElementSelection(elem, node) {
    // Remover selección previa
    document.querySelectorAll('.draggable-element').forEach(el => el.classList.remove('selected'));
    
    if (selectedElemForClick === elem) {
        selectedElemForClick = null;
        selectedDomNode = null;
        return;
    }

    selectedElemForClick = elem;
    selectedDomNode = node;
    node.classList.add('selected');

    // Pedirle al usuario de forma amigable que haga clic en una zona
    showTemporaryFeedback("info", `Seleccionado: "${elem.text}". Ahora haz clic sobre la caja de destino correspondiente (Entradas, Procesos, Salidas o Retroalimentación).`);
}

// Agregar listeners a las zonas para soportar el flujo de clic móvil
function setupMobileClickZones() {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('click', () => {
            if (selectedElemForClick && selectedDomNode) {
                const targetZone = zone.getAttribute('data-zone');
                processPlacement(selectedElemForClick.id, targetZone);
                
                // Limpiar selección
                selectedElemForClick = null;
                selectedDomNode = null;
            }
        });
    });
}

// Procesamiento central del depósito/asignación de elementos
function processPlacement(elemId, targetZone) {
    const elem = currentScenario.elements.find(e => e.id === elemId);
    if (!elem) return;

    const banner = document.getElementById('gameFeedbackBanner');
    const title = document.getElementById('gameFeedbackTitle');
    const msg = document.getElementById('gameFeedbackMsg');
    const icon = document.getElementById('gameFeedbackIcon');

    // Remover estado de selección visual
    const domNode = document.getElementById(elemId);
    if (domNode) domNode.classList.remove('selected');

    // Validar coincidencia
    if (elem.type === targetZone) {
        // Acierto
        gameScore += 10;
        
        // Quitar de la lista de pendientes
        gameElements = gameElements.filter(e => e.id !== elemId);
        
        // Colocar visualmente en el contenedor de destino
        const zoneSlots = document.getElementById(`zone-${targetZone}`);
        const placedNode = document.createElement('div');
        placedNode.className = 'draggable-element correctly-placed';
        
        // Variables CSS personalizadas según la zona para un glow neón temático
        if (targetZone === 'input') {
            placedNode.style.setProperty('--border-color-placed', 'var(--cyan)');
            placedNode.style.setProperty('--bg-color-placed', 'var(--cyan-dark)');
            placedNode.style.setProperty('--text-color-placed', 'var(--cyan)');
        } else if (targetZone === 'process') {
            placedNode.style.setProperty('--border-color-placed', 'var(--purple)');
            placedNode.style.setProperty('--bg-color-placed', 'var(--purple-dark)');
            placedNode.style.setProperty('--text-color-placed', 'var(--purple)');
        } else if (targetZone === 'output') {
            placedNode.style.setProperty('--border-color-placed', 'var(--green)');
            placedNode.style.setProperty('--bg-color-placed', 'var(--green-dark)');
            placedNode.style.setProperty('--text-color-placed', 'var(--green)');
        } else if (targetZone === 'feedback') {
            placedNode.style.setProperty('--border-color-placed', 'var(--coral)');
            placedNode.style.setProperty('--bg-color-placed', 'var(--coral-dark)');
            placedNode.style.setProperty('--text-color-placed', 'var(--coral)');
        }

        placedNode.innerHTML = `<strong>${elem.text}</strong><br><small style="color:var(--text-secondary); font-size:0.75rem;">${elem.desc}</small>`;
        zoneSlots.appendChild(placedNode);

        // Renderizar de nuevo la alberca flotante
        renderScrambledElements();

        // Mostrar feedback de éxito
        banner.className = "game-feedback-banner";
        title.textContent = "¡Correcto!";
        title.style.color = "var(--green)";
        msg.textContent = `${elem.text}: ${elem.desc}`;
        icon.textContent = "✅";
        banner.classList.remove('hidden');

        document.getElementById('gameScoreText').textContent = gameScore;
    } else {
        // Fallo
        gameAttempts++;
        document.getElementById('gameAttemptsText').textContent = gameAttempts;

        // Feedback de error
        banner.className = "game-feedback-banner error";
        title.textContent = "Ubicación Incorrecta";
        title.style.color = "var(--coral)";
        msg.textContent = `Piénsalo bien. ¿Realmente "${elem.text}" es un(a) ${getZoneNameEs(targetZone)}? Inténtalo de nuevo.`;
        icon.textContent = "❌";
        banner.classList.remove('hidden');

        // Vibración visual leve de error
        if (domNode) {
            domNode.classList.add('error-shake');
            setTimeout(() => domNode.classList.remove('error-shake'), 500);
        }

        // Validar derrota por intentos superados
        if (gameAttempts >= MAX_ATTEMPTS) {
            triggerArchitectGameOver(false);
        }
    }
}

function getZoneNameEs(zone) {
    const names = { input: "Entrada", process: "Proceso", output: "Salida", feedback: "Retroalimentación" };
    return names[zone] || zone;
}

function showTemporaryFeedback(type, text) {
    const banner = document.getElementById('gameFeedbackBanner');
    const title = document.getElementById('gameFeedbackTitle');
    const msg = document.getElementById('gameFeedbackMsg');
    const icon = document.getElementById('gameFeedbackIcon');

    banner.className = `game-feedback-banner ${type === 'info' ? 'info' : 'error'}`;
    title.textContent = "Instrucciones de Selección";
    title.style.color = "var(--cyan)";
    msg.textContent = text;
    icon.textContent = "ℹ️";
    banner.classList.remove('hidden');
}

// Comprobación de final de juego exitoso
function checkArchitectVictory() {
    triggerArchitectGameOver(true);
}

// Lanzar pantalla de derrota o victoria
function triggerArchitectGameOver(isVictory) {
    const overlay = document.getElementById('architectResultOverlay');
    const emoji = document.getElementById('architectResultEmoji');
    const title = document.getElementById('architectResultTitle');
    const desc = document.getElementById('architectResultDesc');
    const score = document.getElementById('architectResultScore');

    if (isVictory) {
        emoji.textContent = "🏆";
        title.textContent = "¡Arquitecto de Sistemas Consumado!";
        desc.textContent = `Increíble. Has estructurado todos los flujos de "${currentScenario.name}" sin sobrepasar los límites del sistema. Tu comprensión conceptual es sobresaliente.`;
        // Bonificación por intentos no usados
        const bonus = (MAX_ATTEMPTS - gameAttempts) * 15;
        score.textContent = gameScore + bonus;
    } else {
        emoji.textContent = "💥";
        title.textContent = "¡Colapso del Sistema!";
        desc.textContent = `Has alcanzado el límite de fallos y entropía permitidos (${MAX_ATTEMPTS} fallos). El sistema se ha vuelto inestable. ¡No te rindas, analiza los conceptos y reintenta!`;
        score.textContent = gameScore;
    }

    overlay.classList.remove('hidden');
}

// Salir del tablero y regresar a la selección de escenarios
function resetArchitectGame() {
    document.getElementById('architectResultOverlay').classList.add('hidden');
    document.getElementById('architectGameBoard').classList.add('hidden');
    document.getElementById('architectIntroCard').classList.remove('hidden');
    currentScenario = null;
}


/* ==========================================================================
   JUEGO 2: LAB CONTROL (SIMULADOR DE STABILIDAD)
   ========================================================================== */

let simInterval = null;
let simIsActive = false;
let simMode = "open"; // open, closed-neg, closed-pos
let currentIntTemp = 22.0;
let currentExtTemp = 20.0;
let actuatorVal = 0; // -100 (máximo frío) a 100 (máximo calor)
let cropHealth = 100;
let simTime = 0;

// Historial para graficar
let intTempHistory = [];
let extTempHistory = [];
const MAX_HISTORY_POINTS = 50;

// Configurar sliders del simulador
const tempPerturbSlider = document.getElementById('tempPerturbSlider');
const tempExtText = document.getElementById('tempExtText');
const actuatorSlider = document.getElementById('actuatorSlider');
const manualActuatorGroup = document.getElementById('manualActuatorGroup');

if (tempPerturbSlider) {
    tempPerturbSlider.addEventListener('input', (e) => {
        currentExtTemp = parseFloat(e.target.value);
        if (tempExtText) tempExtText.textContent = `${currentExtTemp.toFixed(0)}°C`;
    });
}

if (actuatorSlider) {
    actuatorSlider.addEventListener('input', (e) => {
        if (simMode === 'open') {
            actuatorVal = parseInt(e.target.value);
        }
    });
}

// Cambiar modos del simulador
function setSimMode(mode) {
    simMode = mode;
    
    // Actualizar botones visuales
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        }
    });

    // Controlar visibilidad del actuador manual
    if (mode === 'open') {
        manualActuatorGroup.classList.remove('hidden');
    } else {
        manualActuatorGroup.classList.add('hidden');
        if (actuatorSlider) actuatorSlider.value = 0;
        actuatorVal = 0;
    }

    const sensorBox = document.getElementById('feedbackSensorBox');
    const sensorVal = document.getElementById('metricFeedback');
    if (sensorBox && sensorVal) {
        if (mode === 'open') {
            sensorVal.textContent = "INACTIVO";
            sensorVal.style.color = "var(--text-muted)";
            sensorBox.style.borderColor = "var(--border-light)";
        } else if (mode === 'closed-neg') {
            sensorVal.textContent = "NEGATIVO (ON)";
            sensorVal.style.color = "var(--green)";
            sensorBox.style.borderColor = "var(--green)";
        } else if (mode === 'closed-pos') {
            sensorVal.textContent = "POSITIVO (ON)";
            sensorVal.style.color = "var(--coral)";
            sensorBox.style.borderColor = "var(--coral)";
        }
    }
}

// Iniciar/Pausar simulación
function toggleSim() {
    const btn = document.getElementById('startSimBtn');
    const statusDot = document.querySelector('#sysStatusIndicator .status-dot');
    const statusLabel = document.querySelector('#sysStatusIndicator .status-label');

    if (simIsActive) {
        // Pausar
        clearInterval(simInterval);
        simInterval = null;
        simIsActive = false;
        btn.textContent = "Iniciar Simulación";
        btn.className = "btn btn-primary";

        statusDot.className = "status-dot status-inactive";
        statusLabel.textContent = "APAGADO";
    } else {
        // Iniciar
        simIsActive = true;
        btn.textContent = "Pausar Simulación";
        btn.className = "btn btn-outline";

        statusDot.className = "status-dot status-active";
        statusLabel.textContent = "FUNCIONANDO";

        simInterval = setInterval(updateSimulationStep, 150);
    }
}

// Paso a paso del ciclo físico-cibernético del invernadero (150ms por iteración)
function updateSimulationStep() {
    simTime++;

    // 1. Lógica Cibernética (Retroalimentación)
    const targetTemp = 21.5; // Consigna de temperatura ideal
    
    if (simMode === 'closed-neg') {
        // Retroalimentación Negativa (Estabilización Homeostática)
        // El sensor mide el error y actúa en sentido opuesto
        const error = currentIntTemp - targetTemp;
        
        // P-Controller simple: el actuador responde proporcionalmente al error
        // Si hace calor (error > 0), enfriamos (actuatorVal negativo). Si hace frío (error < 0), calentamos.
        actuatorVal = -error * 18; 
        
        // Limitar potencia a [-100, 100]
        actuatorVal = Math.max(-100, Math.min(100, actuatorVal));
    } 
    else if (simMode === 'closed-pos') {
        // Retroalimentación Positiva (Bucle Fuera de Control / Caótico)
        // El sensor mide la desviación y la amplifica en la misma dirección
        const deviation = currentIntTemp - targetTemp;
        
        if (Math.abs(deviation) > 0.3) {
            // Amplificación desmedida del calor o frío inicial
            actuatorVal = deviation * 25;
            actuatorVal = Math.max(-100, Math.min(100, actuatorVal));
        } else {
            // Pequeña perturbación aleatoria para iniciar la espiral de caos si está centrado
            actuatorVal = (Math.random() - 0.5) * 20;
        }
    }

    // 2. Modelo Físico Térmico (Transformación en el Proceso)
    // Coeficiente de pérdida térmica pasiva del invernadero
    const thermalLossK = 0.08; 
    // Coeficiente de efectividad térmica del calentador/enfriador
    const actuatorK = 0.06; 

    // Cambio de temperatura interna por pérdida/ganancia hacia el exterior
    let deltaTemp = (currentExtTemp - currentIntTemp) * thermalLossK;
    // Cambio por potencia del actuador
    deltaTemp += (actuatorVal / 100) * 8.0 * actuatorK;
    
    // Ruido térmico ambiental sutil
    deltaTemp += (Math.random() - 0.5) * 0.08;

    // Aplicar cambio
    currentIntTemp += deltaTemp;

    // Limites de temperatura física posibles
    currentIntTemp = Math.max(0, Math.min(50, currentIntTemp));

    // 3. Daño biológico al cultivo (Entropía por desviación térmica)
    // El rango óptimo es [18°C, 25°C]
    if (currentIntTemp < 18.0 || currentIntTemp > 25.0) {
        // Cuanto más alejado, más daño por segundo
        const deviation = Math.min(
            Math.abs(currentIntTemp - 18.0),
            Math.abs(currentIntTemp - 25.0)
        );
        cropHealth -= deviation * 0.4;
    } else {
        // Curación biológica lenta si regresa al rango óptimo
        if (cropHealth < 100) {
            cropHealth += 0.25;
        }
    }

    // Limites de Salud
    cropHealth = Math.max(0, Math.min(100, cropHealth));

    // 4. Actualizar Métricas en Interfaz
    document.getElementById('metricExtTemp').textContent = `${currentExtTemp.toFixed(1)} °C`;
    document.getElementById('metricIntTemp').textContent = `${currentIntTemp.toFixed(1)} °C`;
    document.getElementById('metricPower').textContent = `${Math.abs(actuatorVal).toFixed(0)} % (${actuatorVal >= 0 ? 'Calor' : 'Frío'})`;

    // Cambiar color del valor de temperatura según estabilidad
    const intTempDisplay = document.getElementById('metricIntTemp');
    if (currentIntTemp >= 18.0 && currentIntTemp <= 25.0) {
        intTempDisplay.style.color = "var(--green)";
    } else {
        intTempDisplay.style.color = "var(--coral)";
    }

    // Actualizar estado del sensor / actuador en el panel
    const systemStatusIndicator = document.getElementById('sysStatusIndicator');
    const systemStatusLabel = document.querySelector('#sysStatusIndicator .status-label');
    const systemStatusDot = document.querySelector('#sysStatusIndicator .status-dot');

    if (cropHealth <= 0) {
        systemStatusDot.className = "status-dot status-alert";
        systemStatusLabel.textContent = "COLAPSO BIOLÓGICO";
        clearInterval(simInterval);
        simIsActive = false;
        document.getElementById('startSimBtn').textContent = "Iniciar Simulación";
        document.getElementById('startSimBtn').className = "btn btn-primary";
    }

    updateCropHealthBar();

    // 5. Registrar Historial y Redibujar Gráfico SVG
    intTempHistory.push(currentIntTemp);
    extTempHistory.push(currentExtTemp);

    if (intTempHistory.length > MAX_HISTORY_POINTS) intTempHistory.shift();
    if (extTempHistory.length > MAX_HISTORY_POINTS) extTempHistory.shift();

    drawRealtimeGraph();
}

// Actualizar barra de vida de las plantas
function updateCropHealthBar() {
    const bar = document.getElementById('healthBar');
    const text = document.getElementById('healthPctText');
    const desc = document.getElementById('healthDescText');

    text.textContent = `${cropHealth.toFixed(0)}%`;
    bar.style.width = `${cropHealth}%`;

    if (cropHealth > 80) {
        bar.className = "health-bar bg-green";
        desc.textContent = "Las plantas se encuentran en condiciones térmicas ideales. Cosecha perfecta.";
        desc.style.color = "var(--text-secondary)";
    } else if (cropHealth > 40) {
        bar.className = "health-bar bg-coral";
        desc.textContent = "¡Advertencia! Desviación térmica detectada. Las hojas se están marchitando por estrés físico.";
        desc.style.color = "var(--coral)";
    } else if (cropHealth > 0) {
        bar.className = "health-bar bg-coral";
        desc.textContent = "¡ESTADO CRÍTICO! Las raíces están muriendo. Estabiliza el sistema inmediatamente.";
        desc.style.color = "var(--coral)";
    } else {
        bar.className = "health-bar";
        bar.style.backgroundColor = "#718096";
        desc.textContent = "Pérdida Total. Las plantas han perecido por congelamiento o deshidratación térmica extrema (Muerte por Entropía).";
        desc.style.color = "#718096";
    }
}

// Dibujar la curva SVG dinámica en el osciloscopio virtual
function drawRealtimeGraph() {
    const tempPath = document.getElementById('tempPath');
    const extTempPath = document.getElementById('extTempPath');
    if (!tempPath || !extTempPath) return;

    if (intTempHistory.length < 2) return;

    const width = 500;
    const height = 150;
    
    // Mapeo físico de temperaturas [0°C, 45°C] a coordenadas Y de SVG [130, 20]
    function mapTempToY(temp) {
        const minTemp = 0;
        const maxTemp = 45;
        const minY = 130;
        const maxY = 20;
        
        // Interpolación lineal simple
        return minY + ((temp - minTemp) / (maxTemp - minTemp)) * (maxY - minY);
    }

    // Calcular paso X según los puntos que tenemos
    const stepX = width / (MAX_HISTORY_POINTS - 1);

    // Dibujar trayectoria de temperatura interna (Línea Violeta)
    let dInt = "";
    intTempHistory.forEach((temp, idx) => {
        const x = idx * stepX;
        const y = mapTempToY(temp);
        if (idx === 0) {
            dInt = `M ${x} ${y}`;
        } else {
            dInt += ` L ${x} ${y}`;
        }
    });
    tempPath.setAttribute('d', dInt);

    // Dibujar trayectoria de temperatura externa/perturbación (Línea Cian segmentada)
    let dExt = "";
    extTempHistory.forEach((temp, idx) => {
        const x = idx * stepX;
        const y = mapTempToY(temp);
        if (idx === 0) {
            dExt = `M ${x} ${y}`;
        } else {
            dExt += ` L ${x} ${y}`;
        }
    });
    extTempPath.setAttribute('d', dExt);
}

// Reiniciar valores del simulador
function resetSim() {
    if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
    }
    simIsActive = false;
    simTime = 0;
    currentIntTemp = 22.0;
    currentExtTemp = 20.0;
    actuatorVal = 0;
    cropHealth = 100;
    intTempHistory = [];
    extTempHistory = [];

    // Restablecer interfaz
    document.getElementById('startSimBtn').textContent = "Iniciar Simulación";
    document.getElementById('startSimBtn').className = "btn btn-primary";
    
    const statusDot = document.querySelector('#sysStatusIndicator .status-dot');
    const statusLabel = document.querySelector('#sysStatusIndicator .status-label');
    statusDot.className = "status-dot status-inactive";
    statusLabel.textContent = "APAGADO";

    if (tempPerturbSlider) {
        tempPerturbSlider.value = 20;
        tempExtText.textContent = "20°C";
    }
    if (actuatorSlider) actuatorSlider.value = 0;

    setSimMode(simMode);
    updateCropHealthBar();

    // Limpiar canvas de dibujo
    const tempPath = document.getElementById('tempPath');
    const extTempPath = document.getElementById('extTempPath');
    if (tempPath) tempPath.setAttribute('d', 'M 0 65');
    if (extTempPath) extTempPath.setAttribute('d', 'M 0 65');
}


/* ==========================================================================
   QUIZ E INTELIGENCIA EVALUATIVA (CUESTIONARIO Y DIPLOMA)
   ========================================================================== */

// Base de preguntas conceptuales del Quiz
const quizQuestions = [
    {
        q: "¿Cuál de los siguientes describe mejor el concepto de 'Entrada' en un sistema abierto?",
        options: [
            "El estado interno de equilibrio inalterable del sistema.",
            "La importación de materia, energía o información desde el exterior.",
            "Los residuos inútiles arrojados hacia el medio ambiente.",
            "El proceso en el cual el sistema duplica sus subsistemas."
        ],
        answer: 1,
        explanation: "La entrada representa la captación inicial o importación de insumos requeridos (materia, energía, datos) desde el medio para que la maquinaria del sistema comience a funcionar."
    },
    {
        q: "En TGS, ¿por qué se le denomina a veces 'Caja Negra' al Proceso de transformación?",
        options: [
            "Porque consume únicamente combustibles fósiles y emite hollín.",
            "Porque absorbe toda la luz exterior sin reflejar salidas analíticas.",
            "Porque el observador se concentra en las entradas y salidas, sin necesidad de detallar los complejos engranajes internos.",
            "Porque está completamente descompuesto y no tiene retroalimentación."
        ],
        answer: 2,
        explanation: "El enfoque de Caja Negra es un recurso metodológico que permite omitir los detalles internos de un subsistema cuando el análisis de causa-efecto (Entradas vs. Salidas) es suficiente para modelarlo."
    },
    {
        q: "Si una empresa manufacturera entrega vehículos terminados y libera dióxido de carbono al ambiente, ¿qué representan estos elementos?",
        options: [
            "Ambos son entradas industriales secundarias.",
            "El vehículo es un proceso de sinergia y el gas es retroalimentación.",
            "Ambos corresponden a salidas del sistema (uno útil y el otro un residuo).",
            "Representan lazo de homeostasis regulatoria."
        ],
        answer: 3,
        explanation: "Las salidas de un sistema no solo se limitan al producto útil o deseado; también incluyen todas las exportaciones físicas adicionales como subproductos, residuos y calor disipado (que aumentan la entropía ambiental)."
    },
    {
        q: "¿Qué función cumple la retroalimentación negativa (balancing loop) en los sistemas complejos?",
        options: [
            "Destruye sistemáticamente la estructura de control para forzar el caos.",
            "Reduce y corrige las desviaciones respecto a una meta u objetivo, promoviendo la estabilidad o homeostasis.",
            "Duplica exponencialmente los desequilibrios térmicos para forzar el calentamiento.",
            "Anula las entradas del sistema para cerrarlo por completo."
        ],
        answer: 1,
        explanation: "La retroalimentación negativa actúa como un mecanismo estabilizador o autorregulador que frena las perturbaciones y mantiene el sistema dentro de límites seguros de supervivencia (ej. homeostasis, termostatos)."
    },
    {
        q: "El efecto de acople ensordecedor que ocurre cuando un micrófono recibe su propio audio amplificado por un parlante es un ejemplo de:",
        options: [
            "Entrada libre de entropía negativa.",
            "Retroalimentación Negativa estabilizadora.",
            "Caja negra sin salidas de energía.",
            "Retroalimentación Positiva (amplificadora / desestabilizadora)."
        ],
        answer: 3,
        explanation: "Este es un ejemplo clásico de retroalimentación positiva: la salida se suma a la entrada en la misma dirección, amplificando el fenómeno de forma exponencial hasta saturar o colapsar el sistema acústico."
    },
    {
        q: "¿Quién acuñó formalmente las bases cibernéticas y el análisis de la retroalimentación en la ciencia moderna?",
        options: [
            "Norbert Wiener.",
            "Karl Ludwig von Bertalanffy.",
            "Albert Einstein.",
            "Isaac Newton."
        ],
        answer: 0,
        explanation: "Norbert Wiener, matemático del MIT, fundó la Cibernética a mediados del siglo XX como la ciencia del control y la comunicación tanto en animales como en máquinas, basándose en la retroalimentación."
    },
    {
        q: "Si cortamos repentinamente todas las 'entradas' a un sistema abierto (como alimento a un animal o combustible a un motor), el sistema:",
        options: [
            "Logra autogenerar energía infinita por sinergia.",
            "Se estabiliza por retroalimentación positiva.",
            "Entra en un estado de degradación acelerada y colapso por Entropía.",
            "Se transforma de inmediato en un lazo cerrado perfecto."
        ],
        answer: 2,
        explanation: "Los sistemas abiertos necesitan importar orden continuamente del exterior para combatir la ley universal de la Entropía. Sin entradas, el orden interno se degrada inevitablemente hasta el cese total."
    },
    {
        q: "¿Cuál de las siguientes es una descripción aplicada de retroalimentación en una organización empresarial?",
        options: [
            "Las campañas de publicidad en revistas de circulación masiva.",
            "La encuesta de satisfacción del cliente (NPS) que impulsa mejoras en el producto de software.",
            "El inventario físico estático en los almacenes centrales.",
            "La contratación de más personal técnico de soporte."
        ],
        answer: 1,
        explanation: "La encuesta de satisfacción toma datos del resultado final (la experiencia del cliente con el software) y redirige esa información hacia el equipo de desarrollo (entrada/proceso) para corregir fallas estructurales."
    },
    {
        q: "Un termostato de calefacción configurado para apagar la caldera cuando la casa llega a 22°C representa un sistema de:",
        options: [
            "Lazo abierto.",
            "Lazo cerrado con retroalimentación negativa.",
            "Lazo cerrado con retroalimentación positiva.",
            "Sistemas mecánicos sin entropía."
        ],
        answer: 1,
        explanation: "Es lazo cerrado con retroalimentación negativa porque la lectura de salida (temperatura ambiental) genera una acción correctiva que se opone a la tendencia (apaga la caldera para evitar sobrecalentamiento y mantener estabilidad)."
    },
    {
        q: "¿Qué postula la propiedad de 'Sinergia' de los sistemas complejos en su proceso?",
        options: [
            "Que las entradas siempre superan el valor de las salidas por pérdidas de calor.",
            "Que la retroalimentación positiva es el único lazo de supervivencia.",
            "Que el todo es más que la suma algebraica de sus partes individuales.",
            "Que los subsistemas operan aislados unos de otros de forma independiente."
        ],
        answer: 2,
        explanation: "La sinergia establece que el proceso coordinado e integrado de los elementos produce un resultado conjunto superior al que lograrían operando de manera aislada o separada."
    }
];

let quizCurrentIndex = 0;
let quizScore = 0;
let userAnswers = [];

// Iniciar Cuestionario
function startQuiz() {
    document.getElementById('quizStartCard').classList.add('hidden');
    document.getElementById('quizActivePanel').classList.remove('hidden');
    document.getElementById('quizResultPanel').classList.add('hidden');

    quizCurrentIndex = 0;
    quizScore = 0;
    userAnswers = [];

    showQuizQuestion();
}

// Mostrar Pregunta Activa
function showQuizQuestion() {
    const qData = quizQuestions[quizCurrentIndex];
    if (!qData) return;

    // Actualizar Header
    document.getElementById('currentQuestionNum').textContent = quizCurrentIndex + 1;
    const progressPct = ((quizCurrentIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progressPct}%`;

    // Renderizar Pregunta
    document.getElementById('questionText').textContent = qData.q;

    // Renderizar Opciones de Respuesta
    const optionsContainer = document.getElementById('quizOptionsList');
    optionsContainer.innerHTML = '';

    // Ocultar caja de retroalimentación de pregunta anterior
    const feedbackBox = document.getElementById('questionFeedbackBox');
    feedbackBox.classList.add('hidden');

    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)})</strong> ${opt}`;
        
        btn.addEventListener('click', () => {
            handleAnswerSelection(idx, btn);
        });

        optionsContainer.appendChild(btn);
    });
}

// Procesar selección de respuesta en Quiz
function handleAnswerSelection(selectedIdx, selectedBtn) {
    const qData = quizQuestions[quizCurrentIndex];
    const optionsContainer = document.getElementById('quizOptionsList');
    
    // Desactivar clicks en los otros botones para evitar doble envío
    const buttons = optionsContainer.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'default';
    });

    const feedbackBox = document.getElementById('questionFeedbackBox');
    const fTitle = document.getElementById('questionFeedbackTitle');
    const fDesc = document.getElementById('questionFeedbackDesc');

    // Validar acierto
    const isCorrect = (selectedIdx === qData.answer);
    userAnswers.push({ selected: selectedIdx, correct: isCorrect });

    if (isCorrect) {
        quizScore++;
        selectedBtn.classList.add('correct');
        feedbackBox.className = "question-feedback-box correct";
        fTitle.textContent = "¡CORRECTO! 🎯";
        fDesc.innerHTML = qData.explanation;
    } else {
        selectedBtn.classList.add('incorrect');
        // Mostrar también cuál era la correcta
        const correctBtn = buttons[qData.answer];
        if (correctBtn) correctBtn.classList.add('correct');

        feedbackBox.className = "question-feedback-box incorrect";
        fTitle.textContent = "RESPUESTA INCORRECTA ❌";
        fDesc.innerHTML = `La respuesta correcta era la opción <strong>${String.fromCharCode(65 + qData.answer)}</strong>.<br><br>${qData.explanation}`;
    }

    feedbackBox.classList.remove('hidden');
}

// Avanzar a la siguiente pregunta del Quiz o finalizar
function nextQuestion() {
    quizCurrentIndex++;

    if (quizCurrentIndex < quizQuestions.length) {
        showQuizQuestion();
    } else {
        finishQuizAndCalculate();
    }
}

// Mostrar resultados finales de la evaluación
function finishQuizAndCalculate() {
    document.getElementById('quizActivePanel').classList.add('hidden');
    const resultPanel = document.getElementById('quizResultPanel');
    resultPanel.classList.remove('hidden');

    const scorePct = (quizScore / quizQuestions.length) * 100;
    
    document.getElementById('resultScoreText').textContent = `${quizScore}/${quizQuestions.length}`;
    
    const verdictTitle = document.getElementById('quizVerdictTitle');
    const verdictDesc = document.getElementById('quizVerdictDesc');
    const certBox = document.getElementById('certificateBox');

    if (scorePct >= 80) {
        // Aprobado (Mayor o igual a 80%)
        verdictTitle.textContent = "¡Felicidades, Aprobado con Éxito! 🎉";
        verdictTitle.style.color = "var(--green)";
        verdictDesc.textContent = `Has acreditado el quiz interactivo de la OVA demostrando un amplio dominio sobre los fundamentos conceptuales de la Teoría General de Sistemas con una nota de ${scorePct.toFixed(0)}%.`;
        
        // Cargar datos en el Diploma
        document.getElementById('certScoreText').textContent = `${scorePct.toFixed(0)}%`;
        
        // Fecha actual adaptada
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        document.getElementById('certDateText').textContent = today.toLocaleDateString('es-ES', options);

        certBox.classList.remove('hidden');
    } else {
        // Reprobado
        verdictTitle.textContent = "Evaluación No Acreditada";
        verdictTitle.style.color = "var(--coral)";
        verdictDesc.textContent = `Has obtenido una puntuación de ${scorePct.toFixed(0)}% (${quizScore} aciertos). Para desbloquear tu certificado digital, se requiere acreditar al menos con el 80% (8 aciertos). ¡Revisa nuevamente el marco conceptual y los simuladores y vuelve a intentarlo!`;
        
        certBox.classList.add('hidden');
    }
}

// Limpiar y reiniciar el cuestionario
function resetQuiz() {
    document.getElementById('quizStartCard').classList.remove('hidden');
    document.getElementById('quizActivePanel').classList.add('hidden');
    document.getElementById('quizResultPanel').classList.add('hidden');
}

// Lanzar ventana de impresión del navegador para el certificado
function printCertificate() {
    const nameInput = document.getElementById('studentCertName');
    if (!nameInput.value.trim()) {
        alert("Por favor, ingresa tu Nombre Completo en el diploma antes de descargarlo o imprimirlo.");
        nameInput.focus();
        return;
    }
    
    window.print();
}

// Ejecutar configuraciones de soporte interactivo al cargar
window.addEventListener('DOMContentLoaded', () => {
    setupDropZones();
    setupMobileClickZones();
});
