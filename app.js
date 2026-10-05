const STORAGE_KEY = 'pammerose-dashboard-v1';

const MONTHS_ES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
const MONTHS_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const WEEKDAYS_SHORT = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MILESTONE_VALUES = [1000, 1009, 1486, 1986, 2020, 2026, 3126, 4000, 5000];
const MILESTONE_POSITIONS = ['8%', '18%', '30%', '41%', '52%', '64%', '74%', '86%', '94%'];

const defaultDashboardData = {
  currentSubscribers: 916,
  goalSubscribers: 1000,
  videos: 244,
  series: 10,
  completedProjects: 8,
  activeProjects: 2,
  mapsCreated: 0,
  videosCalendar: {},
  streamsCalendar: {},
  productionProjects: [
    { name: 'Studios PammeRose', created: '5 de marzo 2026', state: 'En Producción', progress: 64 },
    { name: 'Final Paradox', created: '5 de agosto 2026', state: 'En Producción', progress: 29 },
    { name: 'Los Gauchos', created: '5 de mayo 2026', state: 'En Edición', progress: 87 },
    { name: 'Hitos Patreon', created: '5 de mayo 2026', state: 'En Producción', progress: 64 },
    { name: 'Nuevo Proyecto', created: 'introducir fecha', state: 'En Producción', progress: 0 },
    { name: 'Nuevo Proyecto', created: 'introducir fecha', state: 'En Producción', progress: 0 }
  ]
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadDashboardData() {
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return cloneData(defaultDashboardData);
  }

  try {
    const parsed = JSON.parse(saved);
    return { ...cloneData(defaultDashboardData), ...parsed };
  } catch (error) {
    return cloneData(defaultDashboardData);
  }
}

const dashboardData = loadDashboardData();

function persistDashboardData() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardData));
}

function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getDisplayMonth(date = new Date()) {
  return MONTHS_ES[date.getMonth()];
}

function formatHeaderDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} DE ${month} DE ${year}`;
}

function heartIcon(variant = 'filled') {
  const fillClass = variant === 'empty' ? 'is-empty' : 'is-filled';
  return `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 33.5c-1.7-1.3-13.6-10.4-16.9-15.7-3.5-5.7-1.3-13.5 5.4-13.5 3.5 0 6.2 2 8.3 4.6 2.1-2.6 4.8-4.6 8.3-4.6 6.7 0 8.9 7.8 5.4 13.5-3.3 5.3-15.2 14.4-16.9 15.7Z" fill="currentColor"/>
    </svg>
  `;
}

function renderHeaderDate() {
  const now = new Date();
  const target = document.getElementById('headerDate');
  if (target) {
    target.textContent = formatHeaderDate(now);
  }
}

function renderYearStrip() {
  const monthsRow = document.getElementById('monthsRow');
  const currentMonth = new Date().getMonth();
  const yearBlock = document.querySelector('.year-block');

  if (yearBlock) {
    yearBlock.textContent = new Date().getFullYear();
  }

  if (!monthsRow) {
    return;
  }

  monthsRow.innerHTML = MONTHS_SHORT.map((month, index) => {
    let state = 'is-empty';
    if (index < currentMonth) {
      state = 'is-filled';
    } else if (index === currentMonth) {
      state = 'is-current';
    }

    return `
      <div class="month-chip">
        <span class="month-name">${month}</span>
        <span class="month-heart ${state}">${heartIcon(state === 'is-empty' ? 'empty' : 'filled')}</span>
      </div>
    `;
  }).join('');
}

function getProgressPercent() {
  if (!dashboardData.goalSubscribers || dashboardData.goalSubscribers <= 0) {
    return 0;
  }

  return Math.min(100, (dashboardData.currentSubscribers / dashboardData.goalSubscribers) * 100);
}

function renderRoadProgress() {
  const progressPercent = getProgressPercent();
  const ring = document.querySelector('.ring-progress');
  const progressValue = document.getElementById('progressValue');
  const progressLabel = document.getElementById('progressLabel');
  const progressMeta = document.getElementById('progressMeta');
  const goal = Number(dashboardData.goalSubscribers || 0);

  if (ring) {
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;
    ring.style.strokeDasharray = String(circumference);
    ring.style.strokeDashoffset = String(offset);
    ring.setAttribute('aria-label', `Progreso hacia ${goal} suscriptores: ${formatProgressPercent(progressPercent)}`);
  }

  if (progressValue) {
    progressValue.textContent = `${formatProgressPercent(progressPercent)}%`;
  }

  if (progressLabel) {
    progressLabel.textContent = `Road to ${formatLargeNumber(goal)}`;
  }

  if (progressMeta) {
    progressMeta.textContent = 'SUSCRIPTORES';
  }
}

function formatProgressPercent(value) {
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(value);
}

function formatLargeNumber(value) {
  return Number(value).toLocaleString('es-AR');
}

function renderStats() {
  const stats = [
    { key: 'currentSubscribers', value: dashboardData.currentSubscribers, label: 'Suscriptores' },
    { key: 'videos', value: dashboardData.videos, label: 'Videos' },
    { key: 'series', value: dashboardData.series, label: 'Series' },
    { key: 'completedProjects', value: dashboardData.completedProjects, label: 'Proyectos finalizados' },
    { key: 'activeProjects', value: dashboardData.activeProjects, label: 'Proyectos activos' },
    { key: 'mapsCreated', value: dashboardData.mapsCreated, label: 'Mapas creados' }
  ];

  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) {
    return;
  }

  statsGrid.innerHTML = stats.map((item) => `
    <button class="stat-card" type="button" data-metric="${item.key}" aria-label="Editar ${item.label}: ${formatLargeNumber(item.value)}">
      <span class="stat-number">${formatLargeNumber(item.value)}</span>
      <span class="stat-label">${item.label}</span>
    </button>
  `).join('');
}

function bindMetricEditor() {
  const dialog = document.getElementById('metricEditorDialog');
  const form = document.getElementById('metricEditorForm');
  const title = document.getElementById('metricEditorTitle');
  const label = document.getElementById('metricEditorLabel');
  const valueInput = document.getElementById('metricEditorValue');
  const cancelButton = document.getElementById('metricEditorCancel');
  const progressLabel = document.getElementById('progressLabel');

  if (!dialog || !form || !title || !label || !valueInput || !cancelButton || !progressLabel) {
    return;
  }

  let activeMetric = null;

  function openEditor(metric, metricLabel) {
    activeMetric = metric;
    title.textContent = `Editar ${metricLabel}`;
    label.textContent = metricLabel;
    valueInput.value = String(dashboardData[metric]);
    valueInput.min = metric === 'goalSubscribers' ? '1' : '0';
    valueInput.setAttribute('aria-label', `Nuevo valor para ${metricLabel}`);
    dialog.showModal();
    valueInput.focus();
    valueInput.select();
  }

  document.getElementById('statsGrid').addEventListener('click', (event) => {
    const card = event.target.closest('[data-metric]');
    if (!card) {
      return;
    }

    const metric = card.dataset.metric;
    const metricLabel = card.querySelector('.stat-label').textContent;
    openEditor(metric, metricLabel);
  });

  progressLabel.addEventListener('click', () => {
    openEditor('goalSubscribers', 'Meta de suscriptores');
  });

  cancelButton.addEventListener('click', () => dialog.close());

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!activeMetric || !valueInput.reportValidity()) {
      return;
    }

    const value = Number(valueInput.value);
    const minimum = activeMetric === 'goalSubscribers' ? 1 : 0;
    if (!Number.isSafeInteger(value) || value < minimum) {
      valueInput.setCustomValidity(`Ingresa un número entero igual o mayor que ${minimum}.`);
      valueInput.reportValidity();
      valueInput.setCustomValidity('');
      return;
    }

    dashboardData[activeMetric] = value;
    persistDashboardData();
    renderStats();

    if (activeMetric === 'currentSubscribers' || activeMetric === 'goalSubscribers') {
      renderRoadProgress();
    }

    dialog.close();
  });
}

function getMonthDayEntries(type, date = new Date()) {
  const key = getCurrentMonthKey(date);
  const monthData = dashboardData[`${type}Calendar`] || {};
  return monthData[key] || [];
}

function setMonthDayEntries(type, entries, date = new Date()) {
  const key = getCurrentMonthKey(date);
  if (!dashboardData[`${type}Calendar`]) {
    dashboardData[`${type}Calendar`] = {};
  }
  dashboardData[`${type}Calendar`][key] = entries.slice().sort((a, b) => a - b);
  persistDashboardData();
}

function renderCalendar(type) {
  const monthDate = new Date();
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const monthName = getDisplayMonth(monthDate);
  const calendar = document.getElementById(`${type}Calendar`);
  const monthLabel = document.getElementById(`${type}Month`);
  const countLabel = document.getElementById(`${type}Count`);

  if (!calendar || !monthLabel || !countLabel) {
    return;
  }

  const selectedDays = getMonthDayEntries(type, monthDate);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const today = new Date();
  const cells = [];

  WEEKDAYS_SHORT.forEach((weekday) => {
    cells.push(`<span class="calendar-weekday" aria-hidden="true">${weekday}</span>`);
  });

  for (let i = 0; i < firstDay; i += 1) {
    cells.push('<span class="calendar-empty" aria-hidden="true"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const isSelected = selectedDays.includes(day);
    const isToday = year === today.getFullYear()
      && monthIndex === today.getMonth()
      && day === today.getDate();
    const hasPassed = year < today.getFullYear()
      || (year === today.getFullYear() && monthIndex < today.getMonth())
      || (year === today.getFullYear() && monthIndex === today.getMonth() && day <= today.getDate());
    const dayClasses = [
      'day-button',
      hasPassed ? 'is-past' : '',
      isToday ? 'is-today' : '',
      isSelected ? 'is-selected' : ''
    ].filter(Boolean).join(' ');
    cells.push(`
      <button
        type="button"
        class="${dayClasses}"
        data-day="${day}"
        data-calendar-type="${type}"
        aria-pressed="${isSelected}"
        ${isToday ? 'aria-current="date"' : ''}
      >${day}</button>
    `);
  }

  calendar.innerHTML = cells.join('');
  calendar.querySelectorAll('.day-button').forEach((button) => {
    button.addEventListener('click', () => {
      const dayValue = Number(button.dataset.day);
      const currentEntries = getMonthDayEntries(type, monthDate);
      const nextEntries = currentEntries.includes(dayValue)
        ? currentEntries.filter((entry) => entry !== dayValue)
        : [...currentEntries, dayValue];

      setMonthDayEntries(type, nextEntries, monthDate);
      renderCalendar(type);
    });
  });

  monthLabel.textContent = monthName.toUpperCase();
  countLabel.textContent = String(selectedDays.length);
}

function renderMilestones() {
  const container = document.getElementById('milestonesContent');
  if (!container) {
    return;
  }

  const path = 'M 6 90 C 70 40, 110 70, 170 58 S 310 18, 370 48 S 510 92, 580 54 S 722 22, 820 52';
  const nodes = MILESTONE_VALUES.map((value, index) => {
    const left = MILESTONE_POSITIONS[index];
    const isHighlight = index === 5;
    const isBlank = value > 3000;

    return `
      <div class="milestone-node" style="left: ${left}; top: 0;">
        <span class="node-value">${value}</span>
        <span class="node-box ${isHighlight ? 'is-highlight' : isBlank ? 'is-blank' : ''}"></span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <svg class="milestone-curve" viewBox="0 0 840 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="${path}" />
    </svg>
    ${nodes}
  `;
}

function renderProduction() {
  const grid = document.getElementById('productionGrid');
  if (!grid) {
    return;
  }

  grid.innerHTML = (dashboardData.productionProjects || []).map((project) => {
    const status = project.state || 'En Producción';
    return `
      <button type="button" class="production-card" aria-label="Proyecto ${project.name}">
        <div class="production-header">
          <span class="production-name">${project.name}</span>
          <span class="production-status">${status}</span>
        </div>
        <div class="production-created">Creado: ${project.created}</div>
        <div class="production-meta">
          <span>${status}</span>
          <span>${project.progress}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${project.progress}%"></div>
        </div>
      </button>
    `;
  }).join('');
}

function initializeDashboard() {
  renderHeaderDate();
  renderYearStrip();
  renderRoadProgress();
  renderStats();
  bindMetricEditor();
  renderCalendar('videos');
  renderCalendar('streams');
  renderMilestones();
  renderProduction();
  scheduleDailyRefresh();
}

function scheduleDailyRefresh() {
  const now = new Date();
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const delay = nextDay.getTime() - now.getTime();

  window.setTimeout(() => {
    renderHeaderDate();
    renderYearStrip();
    renderCalendar('videos');
    renderCalendar('streams');
    scheduleDailyRefresh();
  }, delay);
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
