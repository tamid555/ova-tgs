/* ==========================================================================
   LÓGICA PRINCIPAL Y GESTIÓN DE TABS - TGS-OVA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. GESTIÓN DE PESTAÑAS (NAVEGACIÓN)
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');

    function switchTab(tabId) {
        // Remover clases activas de la navegación
        navItems.forEach(item => item.classList.remove('active'));
        // Agregar clase activa al botón presionado
        const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Ocultar todos los paneles de pestañas
        tabContents.forEach(content => content.classList.remove('active'));
        // Mostrar la pestaña activa
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Si el menú móvil estaba abierto, cerrarlo
        if (sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    }

    // Eventos de click en el menú
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
            // Actualizar el hash de la URL
            window.location.hash = tabId;
        });
    });

    // Soporte para navegación con botones Atrás/Adelante del navegador e inicio directo mediante Hash
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchTab(hash);
        }
    });

    // Leer el hash inicial si existe
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        switchTab(initialHash);
    }

    // Toggle de Menú Móvil
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Cerrar sidebar si se hace clic fuera en móvil
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggleBtn.contains(e.target) && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });


    // 2. DIAGRAMA INTERACTIVO DE BIENVENIDA
    const nodeInput = document.getElementById('nodeInput');
    const nodeProcess = document.getElementById('nodeProcess');
    const nodeOutput = document.getElementById('nodeOutput');
    const diagramDetailCard = document.getElementById('diagramDetailCard');
    const closeDetailCardBtn = document.getElementById('closeDetailCardBtn');
    const detailTitle = document.getElementById('detailTitle');
    const detailDescription = document.getElementById('detailDescription');
    const detailTags = document.getElementById('detailTags');

    const nodeData = {
        input: {
            title: "ENTRADA (Input)",
            desc: "Representa el punto de partida de todo sistema dinámico. Es la importación de materia, energía o información provenientes del entorno exterior. Sin entradas, el sistema experimenta muerte o inactividad inmediata por falta de combustible operativo.",
            tags: ["Materia Prima", "Energía", "Datos", "Negentropía"],
            color: "hsl(180, 100%, 50%)"
        },
        process: {
            title: "PROCESO (Transformación)",
            desc: "Es la 'Caja Negra' donde ocurre la magia de la sinergia. Aquí, los componentes internos combinan sus esfuerzos mediante relaciones funcionales para procesar los insumos recibidos. El proceso altera la naturaleza de las entradas para convertirlas en algo completamente diferente.",
            tags: ["Caja Negra", "Conversión", "Sinergia", "Subsistemas"],
            color: "hsl(270, 90%, 65%)"
        },
        output: {
            title: "SALIDA (Output)",
            desc: "Es el resultado neto del proceso de transformación, exportado nuevamente al entorno. Cumple el propósito u objetivo para el cual el sistema fue estructurado. Incluye tanto los bienes finales útiles como los residuos, calor e información devueltos al ambiente.",
            tags: ["Resultados", "Bienes/Servicios", "Entropía Exportada", "Residuos"],
            color: "hsl(145, 80%, 50%)"
        },
        feedback: {
            title: "RETROALIMENTACIÓN (Feedback)",
            desc: "Es el lazo de comunicación y control fundamental. Sensoriza la salida e inyecta esa información de retorno en la entrada para corregir discrepancias o acelerar tendencias. Es la base de la homeostasis, la cibernética y la estabilidad evolutiva del sistema.",
            tags: ["Homeostasis", "Lazo Cerrado", "Norbert Wiener", "Estabilización"],
            color: "hsl(20, 95%, 55%)"
        }
    };

    function showDetail(key) {
        const data = nodeData[key];
        if (!data) return;

        detailTitle.textContent = data.title;
        detailTitle.style.color = data.color;
        detailDescription.textContent = data.desc;
        
        // Renderizar tags
        detailTags.innerHTML = '';
        data.tags.forEach(tag => {
            const pill = document.createElement('span');
            pill.className = 'detail-pill';
            pill.textContent = tag;
            pill.style.backgroundColor = data.color;
            detailTags.appendChild(pill);
        });

        // Mostrar la tarjeta quitando la clase oculta
        diagramDetailCard.classList.remove('id-card-hidden');
    }

    if (nodeInput) nodeInput.addEventListener('click', () => showDetail('input'));
    if (nodeProcess) nodeProcess.addEventListener('click', () => showDetail('process'));
    if (nodeOutput) nodeOutput.addEventListener('click', () => showDetail('output'));
    
    // El texto interactivo de Retroalimentación en el SVG también responde
    const feedbackTextEl = document.querySelector('.node-feedback-text');
    if (feedbackTextEl) {
        feedbackTextEl.parentNode.style.cursor = 'pointer';
        feedbackTextEl.parentNode.addEventListener('click', () => showDetail('feedback'));
    }

    if (closeDetailCardBtn) {
        closeDetailCardBtn.addEventListener('click', () => {
            diagramDetailCard.classList.add('id-card-hidden');
        });
    }


    // 3. TABS DE CONCEPTOS (SECCIÓN MARCO TEÓRICO)
    const cTabBtns = document.querySelectorAll('.c-tab-btn');
    const conceptPanels = document.querySelectorAll('.concept-panel');

    cTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const conceptKey = btn.getAttribute('data-concept');
            conceptPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `c-${conceptKey}`) {
                    panel.classList.add('active');
                }
            });
        });
    });


    // 4. CASOS PRÁCTICOS DE ESTUDIO
    const caseBtns = document.querySelectorAll('.case-select-btn');
    const casePanes = document.querySelectorAll('.case-pane');

    caseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            caseBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const caseId = btn.getAttribute('data-case');
            casePanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `case-${caseId}`) {
                    pane.classList.add('active');
                    resetCaseExpl(caseId); // Restablecer a estado inicial al cambiar
                }
            });
        });
    });

    // Mapeos de explicación para cada flujo de cada caso
    const caseData = {
        solar: {
            'solar-input': {
                title: "Entrada del Calentador Solar",
                text: "• <strong>Agua Fría de la Red:</strong> Insumo de materia proveniente del acueducto que entra al colector y tanque.<br>• <strong>Radiación Solar:</strong> Insumo energético. Fotones y ondas térmicas directas del sol que inciden sobre las aletas absorbedoras del colector.",
                color: "hsl(180, 100%, 50%)",
                bg: "rgba(0, 242, 254, 0.05)"
            },
            'solar-process': {
                title: "Proceso de Calentamiento",
                text: "• <strong>Efecto Invernadero:</strong> La cubierta de vidrio del colector atrapa el calor.<br>• <strong>Conducción y Convección:</strong> El calor de las aletas de cobre se transfiere por conducción al agua.<br>• <strong>Termosifón:</strong> El agua caliente, al volverse menos densa, sube de manera natural hacia el termotanque, mientras que el agua fría desciende para ocupar su lugar, creando un flujo auto-inducido.",
                color: "hsl(270, 90%, 65%)",
                bg: "rgba(186, 104, 200, 0.05)"
            },
            'solar-output': {
                title: "Salida del Sistema",
                text: "• <strong>Agua Caliente Sanitaria (ACS):</strong> Fluido a alta temperatura (generalmente entre 45°C y 65°C) apto para duchas, calefacción o lavado.<br>• <strong>Calor Disipado (Pérdidas):</strong> Energía térmica inevitablemente irradiada hacia el ambiente frío por fallas menores de aislamiento (aumento de entropía).",
                color: "hsl(145, 80%, 50%)",
                bg: "rgba(16, 185, 129, 0.05)"
            },
            'solar-feedback': {
                title: "Retroalimentación Térmica",
                text: "• <strong>Lazo Negativo (Válvula Termostática Mezcladora):</strong> Si el agua caliente del tanque sale a una temperatura peligrosamente alta (ej. 75°C), la válvula mezcla automáticamente agua fría de entrada para regular el output final a una temperatura estable y confortable de 38°C, evitando quemaduras al usuario.",
                color: "hsl(20, 95%, 55%)",
                bg: "rgba(255, 110, 64, 0.05)"
            }
        },
        biologico: {
            'bio-input': {
                title: "Entrada del Sistema Biológico",
                text: "• <strong>Estímulo Térmico Ambiental:</strong> Información sobre la temperatura exterior extrema (calor del desierto o frío ártico).<br>• <strong>Metabolismo:</strong> Energía química en forma de calorías ingeridas a través de alimentos, que el cuerpo quemará para producir energía térmica interna.",
                color: "hsl(180, 100%, 50%)",
                bg: "rgba(0, 242, 254, 0.05)"
            },
            'bio-process': {
                title: "Proceso Metabólico y Neurológico",
                text: "• <strong>Procesamiento en el Hipotálamo:</strong> El sensor central del cerebro compara la temperatura sanguínea real contra el punto de consigna ideal de 37°C.<br>• <strong>Señales Eferentes:</strong> El sistema nervioso autónomo desencadena contracciones musculares o dilataciones capilares según sea necesario.",
                color: "hsl(270, 90%, 65%)",
                bg: "rgba(186, 104, 200, 0.05)"
            },
            'bio-output': {
                title: "Salida Biológica",
                text: "• <strong>Sudoración (Enfriamiento):</strong> Evaporación de agua sobre la piel para liberar energía térmica excedente.<br>• <strong>Escalofríos (Calentamiento):</strong> Contracciones musculares involuntarias ultra-rápidas para generar calor de fricción.<br>• <strong>Estado Estable:</strong> Regreso seguro a la homeostasis celular óptima.",
                color: "hsl(145, 80%, 50%)",
                bg: "rgba(16, 185, 129, 0.05)"
            },
            'bio-feedback': {
                title: "Lazo Homeostático",
                text: "• <strong>Lazo de Retroalimentación Negativa:</strong> Tan pronto como las glándulas sudoríparas (salida) logran disipar el calor suficiente y la temperatura interna vuelve a 37°C, los termo-receptores envían señales de reducción al hipotálamo, apagando la producción de sudor para evitar deshidratación e hipotermia.",
                color: "hsl(20, 95%, 55%)",
                bg: "rgba(255, 110, 64, 0.05)"
            }
        },
        startup: {
            'startup-input': {
                title: "Entrada Organizacional",
                text: "• <strong>Capital Financiero:</strong> Inversiones de capital de riesgo, préstamos o facturación.<br>• <strong>Talento Humano:</strong> Desarrolladores, diseñadores, personal de ventas.<br>• <strong>Datos del Mercado:</strong> Requerimientos, necesidades e insatisfacciones de clientes potenciales.",
                color: "hsl(180, 100%, 50%)",
                bg: "rgba(0, 242, 254, 0.05)"
            },
            'startup-process': {
                title: "Proceso de Desarrollo y Operaciones",
                text: "• <strong>Ciclos de Scrum/Agile:</strong> Programación, estructuración de arquitectura, diseño de interfaces, mercadeo y cierre de ventas.<br>• <strong>Coordinación Sinergética:</strong> Integración de habilidades humanas y plataformas en la nube para codificar soluciones de valor.",
                color: "hsl(270, 90%, 65%)",
                bg: "rgba(186, 104, 200, 0.05)"
            },
            'startup-output': {
                title: "Salida del Sistema Organizacional",
                text: "• <strong>SaaS (Software as a Service):</strong> Funcionalidades entregadas, APIs estables, solución al problema del cliente.<br>• <strong>Facturación / Ingresos:</strong> Rentabilidad y tracción comercial.<br>• <strong>Entropía (Desperdicios):</strong> Pérdida de capital en campañas fallidas, fuga de cerebros o código obsoleto redundante.",
                color: "hsl(145, 80%, 50%)",
                bg: "rgba(16, 185, 129, 0.05)"
            },
            'startup-feedback': {
                title: "Retroalimentación Empresarial",
                text: "• <strong>Métricas de Control (NPS y Churn Rate):</strong> Si el índice de satisfacción (NPS) disminuye o la deserción de clientes (Churn) aumenta, estos datos (Feedback) viajan a la mesa directiva (Entrada) para forzar una re-priorización del backlog de desarrollo (Proceso) y arreglar los fallos del software, estabilizando la empresa.",
                color: "hsl(20, 95%, 55%)",
                bg: "rgba(255, 110, 64, 0.05)"
            }
        }
    };

    function resetCaseExpl(caseId) {
        const box = document.getElementById(`${caseId}ExplanationBox`);
        if (box) {
            box.innerHTML = `<p class="explanation-placeholder">Selecciona un flujo de la izquierda para ver su detalle en el sistema.</p>`;
        }
        // Limpiar botones activos
        document.querySelectorAll(`#case-${caseId} .flow-pill`).forEach(p => p.classList.remove('active'));
    }

    // Configurar controladores de eventos para los botones de flujo en Casos
    document.querySelectorAll('.flow-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const flowId = pill.getAttribute('data-flow');
            const parentPaneId = pill.closest('.case-pane').id;
            const caseId = parentPaneId.replace('case-', '');
            
            // Remover activos del mismo contenedor
            document.querySelectorAll(`#${parentPaneId} .flow-pill`).forEach(p => p.classList.remove('active'));
            
            const itemData = caseData[caseId][flowId];
            if (itemData) {
                // Aplicar estilo dinámico de píldora activa
                pill.style.setProperty('--pill-color', itemData.color);
                pill.style.setProperty('--pill-bg', itemData.bg);
                pill.classList.add('active');

                // Actualizar la caja de texto
                const box = document.getElementById(`${caseId}ExplanationBox`);
                if (box) {
                    box.style.borderColor = itemData.color;
                    box.innerHTML = `
                        <div style="width:100%; animation: fadeIn 0.3s ease;">
                            <h4 style="color: ${itemData.color}; font-weight: 700; margin-bottom: 0.5rem; font-family: var(--font-heading);">${itemData.title}</h4>
                            <p style="color: var(--text-primary); line-height: 1.6;">${itemData.text}</p>
                        </div>
                    `;
                }
            }
        });
    });
});
