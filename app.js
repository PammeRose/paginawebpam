const dashboardData = {
  projects: [
    { name: 'Studios PammeRose', area: 'STUDIO', status: 'En producción', progress: 62, target: '15 OCT', next: 'Definir identidad visual', priority: 'Alta', detail: 'El hogar de todo lo que viene.' },
    { name: 'Final Paradox', area: 'SERIES', status: 'En producción', progress: 45, target: '31 OCT', next: 'Editar episodio', priority: 'Alta', detail: '21 episodios grabados' },
    { name: 'Metroid Bounty Hunter', area: 'SERIES', status: 'En producción', progress: 38, target: '22 NOV', next: 'Grabar siguiente bloque', priority: 'Alta', detail: 'Una nueva cacería en marcha.' },
    { name: 'Los Gauchos', area: 'SERIES', status: 'Planificación', progress: 24, target: '12 DIC', next: 'Cerrar guion', priority: 'Media', detail: 'La próxima aventura toma forma.' },
    { name: 'Silencio', area: 'SERIES', status: 'Planificación', progress: 18, target: '05 DIC', next: 'Diseñar atmósfera', priority: 'Media', detail: 'Una historia en desarrollo.' },
    { name: 'Shorts / promoción', area: 'GROWTH', status: 'En producción', progress: 57, target: 'CONTINUO', next: 'Publicar próximo short', priority: 'Alta', detail: 'Pequeñas piezas, nuevas puertas.' },
    { name: 'Twitch', area: 'COMMUNITY', status: 'Activo', progress: 48, target: 'CONTINUO', next: 'Preparar próximo stream', priority: 'Media', detail: 'En vivo, construyendo comunidad.' },
    { name: 'Patreon', area: 'COMMUNITY', status: 'En producción', progress: 33, target: '30 OCT', next: 'Preparar recompensa', priority: 'Media', detail: 'Un espacio más cerca de la comunidad.' },
    { name: 'Especial 1000 suscriptores', area: 'MILESTONE', status: 'Planificación', progress: 72, target: '18 OCT', next: 'Terminar edición', priority: 'Alta', detail: 'Un hito construido entre todos.' },
    { name: 'Backlog de renders Flashback', area: 'BACKLOG', status: 'En producción', progress: 29, target: '28 NOV', next: 'Renderizar secuencia', priority: 'Baja', detail: 'Rescatando historias del archivo.' }
  ],
  metrics: { subscribers: 842, income: 340, milestones: 4 },
  growth: [
    { label: 'Suscriptores', display: '842', delta: '+18% este semestre', color: 'green', points: [28, 34, 31, 47, 54, 65, 61, 79, 88] },
    { label: 'Horas de reproducción', display: '3.16k', delta: '+24% este semestre', color: 'amber', points: [22, 26, 38, 32, 49, 58, 54, 73, 86] },
    { label: 'Videos publicados', display: '34', delta: '+8 desde abril', color: 'clay', points: [15, 24, 21, 34, 40, 39, 53, 65, 78] },
    { label: 'Episodios completados', display: '21', delta: 'Final Paradox', color: 'sky', points: [18, 21, 27, 31, 42, 49, 57, 70, 83] },
    { label: 'Twitch · horas en vivo', display: '28 h', delta: '+6 h este mes', color: 'sky', points: [20, 25, 19, 39, 33, 46, 58, 52, 74] },
    { label: 'Patreon · miembros', display: '18', delta: '+5 desde abril', color: 'amber', points: [10, 18, 15, 24, 31, 37, 43, 55, 68] },
    { label: 'Ingresos · mes', display: '$340', delta: '+12% vs. mes anterior', color: 'clay', points: [19, 22, 29, 24, 38, 47, 44, 59, 72] },
    { label: 'Alcance en redes', display: '12.4k', delta: '+31% este semestre', color: 'green', points: [17, 23, 21, 36, 43, 40, 58, 69, 89] }
  ],
  roadmap: [
    { month: 'SEP', items: [{ title: 'Publicación de shorts', date: 'EN CURSO' }, { title: 'Ritmo de Twitch', date: 'CONTINUO' }] },
    { month: 'OCT', items: [{ title: 'Especial 1000 suscriptores', date: '18 OCT' }, { title: 'Patreon · nueva recompensa', date: '30 OCT' }, { title: 'Final Paradox', date: '31 OCT' }] },
    { month: 'NOV', items: [{ title: 'Metroid Bounty Hunter', date: '22 NOV' }, { title: 'Backlog Flashback', date: '28 NOV' }] },
    { month: 'DIC', items: [{ title: 'Silencio', date: '05 DIC' }, { title: 'Los Gauchos', date: '12 DIC' }] }
  ],
  life: [
    { name: 'Body', icon: 'body', items: [{ label: 'Movimiento', progress: 68 }, { label: 'Alimentación', progress: 74 }, { label: 'Descanso', progress: 59 }, { label: 'Bienestar', progress: 82 }] },
    { name: 'Personal', icon: 'personal', items: [{ label: 'Tiempo para mí', progress: 57 }, { label: 'Creatividad libre', progress: 86 }, { label: 'Meditación', progress: 48 }, { label: 'Ocio', progress: 72 }] },
    { name: 'Family', icon: 'family', items: [{ label: 'Hijos', progress: 88 }, { label: 'Tiempo juntos', progress: 79 }, { label: 'Actividades', progress: 66 }] },
    { name: 'Home', icon: 'home', items: [{ label: 'Arreglos', progress: 42 }, { label: 'Organización', progress: 63 }, { label: 'Mejoras', progress: 37 }, { label: 'Proyectos de casa', progress: 51 }] }
  ]
};

const average = values => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
const studioProgress = average(dashboardData.projects.map(project => project.progress));
const activeProjects = dashboardData.projects.filter(project => project.status !== 'Planificación').length;
const productionProjects = dashboardData.projects.filter(project => project.status === 'En producción').length;
const lifeProgress = average(dashboardData.life.flatMap(section => section.items.map(item => item.progress)));
const dateLabel = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();

document.getElementById('todayLabel').textContent = dateLabel;
document.getElementById('studioDate').textContent = `CORTE · ${dateLabel}`;
document.getElementById('lifeDate').textContent = `HOY · ${dateLabel}`;
document.getElementById('studioProgressText').textContent = `${studioProgress}%`;
document.getElementById('studioProgressRing').style.setProperty('--progress', `${studioProgress * 3.6}deg`);

const kpis = [
  { label: 'Progreso general', value: `${studioProgress}%`, foot: 'El universo sigue creciendo', accent: 'moss' },
  { label: 'Proyectos activos', value: activeProjects, foot: `de ${dashboardData.projects.length} en el estudio`, accent: 'copper' },
  { label: 'En producción', value: productionProjects, foot: 'Manos a la obra', accent: 'moss' },
  { label: 'Próximos hitos', value: dashboardData.metrics.milestones, foot: 'En los próximos 60 días', accent: 'copper' },
  { label: 'Suscriptores', value: dashboardData.metrics.subscribers.toLocaleString('es-AR'), foot: 'Cada persona cuenta', accent: 'moss' },
  { label: 'Ingresos', value: `$${dashboardData.metrics.income}`, foot: 'Este mes · USD', accent: 'copper' }
];

document.getElementById('kpiGrid').innerHTML = kpis.map((item, index) => `
  <article class="kpi kpi-${item.accent}" style="--i:${index}">
    <div class="kpi-label">${item.label}</div>
    <div class="kpi-value">${item.value}</div>
    <div class="kpi-foot">${item.foot}</div>
  </article>`).join('');

document.getElementById('projectCount').textContent = `${dashboardData.projects.length} PROYECTOS · VISIÓN EN MARCHA`;
document.getElementById('projectGrid').innerHTML = dashboardData.projects.map((project, index) => {
  const statusClass = project.status.toLowerCase().replaceAll(' ', '-');
  return `
    <article class="project-card" style="--i:${index}">
      <div class="project-top">
        <div><div class="project-title">${project.name}</div><div class="project-area">${project.area}</div></div>
        <span class="priority priority-${project.priority.toLowerCase()}">${project.priority}</span>
      </div>
      <div class="project-status"><span class="status-label status-${statusClass}"><i class="status-dot"></i>${project.status}</span><span>${project.target}</span></div>
      <div class="progress-row"><span>Progreso</span><span>${project.progress}%</span></div>
      <div class="progress-track"><div class="progress-fill" data-progress="${project.progress}%"></div></div>
      <div class="project-detail">${project.detail}</div>
      <div class="project-meta"><span class="project-target">OBJETIVO · ${project.target}</span><span class="project-next">Próximo → ${project.next}</span></div>
    </article>`;
}).join('');

function makeChart(points, index) {
  const width = 240;
  const height = 82;
  const step = width / (points.length - 1);
  const coords = points.map((point, pointIndex) => [pointIndex * step, height - (point / 100) * (height - 12) - 5]);
  const path = coords.map(([x, y], pointIndex) => `${pointIndex ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [lastX, lastY] = coords.at(-1);
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="chart-wash-${index}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".19"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="${path} L${width} ${height} L0 ${height} Z" fill="url(#chart-wash-${index})"/><path class="chart-line" d="${path}"/><circle class="chart-point" cx="${lastX}" cy="${lastY}" r="3.5"/></svg>`;
}

document.getElementById('growthGrid').innerHTML = dashboardData.growth.map((metric, index) => `
  <article class="chart-card chart-${metric.color}" style="--i:${index}">
    <div class="chart-head"><div><div class="chart-title">${metric.label}</div><div class="chart-current">${metric.display}</div></div><div class="chart-delta">${metric.delta}</div></div>
    ${makeChart(metric.points, index)}
    <div class="chart-labels"><span>ABR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AGO</span><span>SEP</span></div>
  </article>`).join('');

document.getElementById('roadmap').innerHTML = `
  <div class="roadmap-track" aria-hidden="true"></div>
  <div class="roadmap-grid">${dashboardData.roadmap.map((month, index) => `
    <section class="roadmap-month" style="--i:${index}">
      <div class="month-head"><i class="month-dot"></i><span class="month-name">${month.month}</span></div>
      <ul class="month-items">${month.items.map(item => `<li>${item.title}<time>${item.date}</time></li>`).join('')}</ul>
    </section>`).join('')}
  </div>`;

const icons = {
  body: '<path d="M12 3v3m0 0a3 3 0 1 0 0-6m0 6v4m-5 9 1.5-6 3.5-2 3.5 2L17 19m-5-8-3-2-3 1m11 9-1.5-6"/>',
  personal: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M9 12h6"/>',
  family: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-1a6 6 0 0 1 12 0v1m1-5a5 5 0 0 1 5 5"/>',
  home: '<path d="m3 11 9-7 9 7v9h-6v-6H9v6H3z"/><path d="M7 10h.01M17 10h.01"/>'
};

document.getElementById('lifeBanner').innerHTML = `
  <div class="life-number">${lifeProgress}<small>%</small></div>
  <div class="life-copy"><strong>LIFE PROGRESS</strong><span>Avanzar también es cuidarme en el camino.</span><div class="life-progress"><span data-progress="${lifeProgress}%"></span></div></div>
  <div class="life-caption">${dashboardData.life.length} ÁREAS<br>DE VIDA</div>`;

document.getElementById('lifeGrid').innerHTML = dashboardData.life.map((section, index) => {
  const sectionProgress = average(section.items.map(item => item.progress));
  return `
    <article class="life-card" style="--i:${index}">
      <div class="life-card-head"><div class="life-title-wrap"><span class="life-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[section.icon]}</svg></span><span class="life-title">${section.name}</span></div><span class="life-percent">${sectionProgress}%</span></div>
      <div class="life-items">${section.items.map(item => `<div class="life-item"><div class="life-item-top"><span>${item.label}</span><span>${item.progress}%</span></div><div class="life-item-track"><span data-progress="${item.progress}%"></span></div></div>`).join('')}</div>
    </article>`;
}).join('');

requestAnimationFrame(() => {
  document.querySelectorAll('[data-progress]').forEach(bar => { bar.style.width = bar.dataset.progress; });
});

const tabs = [...document.querySelectorAll('.tab-button')];
function activateTab(tab, moveFocus = false) {
  tabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
  document.querySelectorAll('.view').forEach(view => { view.hidden = view.id !== tab.getAttribute('aria-controls'); });
  const theme = tab.id === 'tab-life' ? 'lifestyle' : 'studio';
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    activateTab(tabs[nextIndex], true);
  });
});