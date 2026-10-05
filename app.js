const STORAGE_KEY = 'pammerose-dashboard-v1';

const MONTHS_ES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
const MONTHS_SHORT = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const WEEKDAYS_SHORT = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const MILESTONE_VALUES = [1000, 1009, 1486, 1986, 2020, 2026, 3126, 4000, 5000];
const MILESTONE_POSITIONS = ['8%', '18%', '30%', '41%', '52%', '64%', '74%', '86%', '94%'];
const PRODUCTION_STATUSES = ['Producción', 'Edición', 'Grabación', 'Pausado', 'Finalizado'];

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
  completedMilestones: [],
  productionProjects: [
    { id: 'studios-pammerose', name: 'Studios PammeRose', created: '5 de marzo 2026', state: 'Producción', tasks: [] },
    { id: 'final-paradox', name: 'Final Paradox', created: '5 de agosto 2026', state: 'Producción', tasks: [] },
    { id: 'los-gauchos', name: 'Los Gauchos', created: '5 de mayo 2026', state: 'Edición', tasks: [] },
    { id: 'hitos-patreon', name: 'Hitos Patreon', created: '5 de mayo 2026', state: 'Producción', tasks: [] },
    { id: 'nuevo-proyecto-5', name: 'Nuevo Proyecto', created: 'introducir fecha', state: 'Producción', tasks: [] },
    { id: 'nuevo-proyecto-6', name: 'Nuevo Proyecto', created: 'introducir fecha', state: 'Producción', tasks: [] }
  ],
  completedProductionProjects: []
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
    const data = { ...cloneData(defaultDashboardData), ...parsed };
    const projects = normalizeProjects(data.productionProjects, 'project');
    const completedProjects = normalizeProjects(data.completedProductionProjects, 'completed-project')
      .map((project) => ({ ...project, state: 'Finalizado' }));
    data.productionProjects = projects.filter((project) => project.state !== 'Finalizado');
    data.completedProductionProjects = [
      ...projects.filter((project) => project.state === 'Finalizado'),
      ...completedProjects
    ];
    return data;
  } catch (error) {
    return cloneData(defaultDashboardData);
  }
}

function normalizeProjects(projects, idPrefix) {
  if (!Array.isArray(projects)) {
    return [];
  }

  return projects.map((project, index) => {
    const tasks = Array.isArray(project.tasks)
      ? project.tasks.map((task, taskIndex) => ({
        id: String(task.id || `${project.id || idPrefix}-${taskIndex + 1}`),
        text: String(task.text || ''),
        completed: Boolean(task.completed)
      }))
      : [];

    return {
      id: String(project.id || `${idPrefix}-${index + 1}`),
      name: String(project.name || 'Nuevo Proyecto'),
      created: String(project.created || 'introducir fecha'),
      state: normalizeProductionStatus(project.state),
      tasks
    };
  });
}

function normalizeProductionStatus(status) {
  const normalized = String(status || '').replace(/^En\s+/i, '');
  return PRODUCTION_STATUSES.includes(normalized) ? normalized : 'Producción';
}

function getProjectDateInputValue(value) {
  const date = String(value || '');
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  let dateParts;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    dateParts = date.split('-').map(Number);
  } else {
    const match = date.match(/^(\d{1,2}) de ([a-záéíóú]+) (\d{4})$/i);
    if (!match) {
      return '';
    }

    const month = months.indexOf(match[2].toLowerCase());
    if (month === -1) {
      return '';
    }
    dateParts = [Number(match[3]), month + 1, Number(match[1])];
  }

  const [year, month, day] = dateParts;
  const validatedDate = new Date(year, month - 1, day);
  if (validatedDate.getFullYear() !== year || validatedDate.getMonth() !== month - 1 || validatedDate.getDate() !== day) {
    return '';
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatProjectCreated(value) {
  const inputValue = getProjectDateInputValue(value);
  if (!inputValue) {
    return String(value || 'introducir fecha');
  }

  const [year, month, day] = inputValue.split('-').map(Number);
  const formatted = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(year, month - 1, day));
  return formatted.replace(/ de (\d{4})$/, ' $1');
}

function getProjectProgress(project) {
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (tasks.length === 0) {
    return 0;
  }
  return (tasks.filter((task) => task.completed).length / tasks.length) * 100;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
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

  const nodes = MILESTONE_VALUES.map((value, index) => {
    const left = MILESTONE_POSITIONS[index];
    const isHighlight = index === 5;
    const isBlank = value > 3000;
    const isCompleted = (dashboardData.completedMilestones || []).includes(value);

    return `
      <div class="milestone-node" style="left: ${left}; top: 0;">
        <span class="node-value">${value}</span>
        <input
          class="node-box ${isHighlight ? 'is-highlight' : isBlank ? 'is-blank' : ''}"
          type="checkbox"
          data-milestone="${value}"
          aria-label="Marcar hito alcanzado: ${value} suscriptores"
          ${isCompleted ? 'checked' : ''}
        />
      </div>
    `;
  }).join('');

  container.innerHTML = nodes;
  container.querySelectorAll('.node-box').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const value = Number(checkbox.dataset.milestone);
      const completed = new Set(dashboardData.completedMilestones || []);
      if (checkbox.checked) {
        completed.add(value);
      } else {
        completed.delete(value);
      }
      dashboardData.completedMilestones = [...completed];
      persistDashboardData();
    });
  });
}

function renderProduction() {
  const grid = document.getElementById('productionGrid');
  const completedGrid = document.getElementById('completedProductionGrid');
  if (!grid || !completedGrid) {
    return;
  }

  function renderCards(projects) {
    return projects.map((project) => {
      const progress = getProjectProgress(project);
      const status = escapeHTML(project.state);
      const name = escapeHTML(project.name);
      const created = escapeHTML(formatProjectCreated(project.created));
      return `
        <button type="button" class="production-card" data-project-id="${escapeHTML(project.id)}" aria-label="Abrir proyecto ${name}">
          <div class="production-header">
            <span class="production-name">${name}</span>
            <span class="production-status">${status}</span>
          </div>
          <div class="production-created">Creado: ${created}</div>
          <div class="production-progress-row">
            <div class="progress-track" role="progressbar" aria-label="Progreso de ${name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.toFixed(1)}">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="production-progress-value">${formatProgressPercent(progress)}%</span>
          </div>
        </button>
      `;
    }).join('');
  }

  grid.innerHTML = renderCards(dashboardData.productionProjects || []);
  completedGrid.innerHTML = renderCards(dashboardData.completedProductionProjects || []);
  document.getElementById('completedProductionEmpty').hidden = dashboardData.completedProductionProjects.length > 0;
}

function findProductionProject(projectId) {
  const activeProject = dashboardData.productionProjects.find((project) => project.id === projectId);
  if (activeProject) {
    return activeProject;
  }
  return dashboardData.completedProductionProjects.find((project) => project.id === projectId);
}

function moveProjectToStatusCollection(project) {
  const isCompleted = project.state === 'Finalizado';
  const source = isCompleted ? dashboardData.productionProjects : dashboardData.completedProductionProjects;
  const destination = isCompleted ? dashboardData.completedProductionProjects : dashboardData.productionProjects;
  const currentIndex = source.findIndex((item) => item.id === project.id);

  if (currentIndex !== -1) {
    source.splice(currentIndex, 1);
    destination.push(project);
  }
}

function renderProjectTasks(project) {
  const taskList = document.getElementById('projectTaskList');
  const taskSummary = document.getElementById('projectTaskSummary');
  if (!taskList || !taskSummary) {
    return;
  }

  taskList.innerHTML = project.tasks.length === 0
    ? '<li class="project-task-empty">Todavía no hay tareas. Agregá el primer paso del proyecto.</li>'
    : project.tasks.map((task) => `
        <li class="project-task-item">
          <input
            class="project-task-checkbox"
            type="checkbox"
            data-task-toggle="${escapeHTML(task.id)}"
            aria-label="Marcar ${escapeHTML(task.text)} como completada"
            ${task.completed ? 'checked' : ''}
          />
          <input
            class="project-task-text ${task.completed ? 'is-completed' : ''}"
            type="text"
            value="${escapeHTML(task.text)}"
            data-task-edit="${escapeHTML(task.id)}"
            aria-label="Editar tarea"
          />
          <button class="project-task-delete" type="button" data-task-delete="${escapeHTML(task.id)}" aria-label="Eliminar tarea">×</button>
        </li>
    `).join('');

  const progress = getProjectProgress(project);
  taskSummary.textContent = `${project.tasks.filter((task) => task.completed).length} de ${project.tasks.length} tareas · ${formatProgressPercent(progress)}%`;
}

function bindProjectDetails() {
  const dialog = document.getElementById('projectDetailDialog');
  const closeButton = document.getElementById('projectDetailClose');
  const nameInput = document.getElementById('projectNameInput');
  const statusSelect = document.getElementById('projectStatus');
  const createdInput = document.getElementById('projectCreatedInput');
  const taskForm = document.getElementById('projectTaskForm');
  const taskInput = document.getElementById('projectTaskInput');
  const taskList = document.getElementById('projectTaskList');
  const completedGrid = document.getElementById('completedProductionGrid');

  if (!dialog || !closeButton || !nameInput || !statusSelect || !createdInput || !taskForm || !taskInput || !taskList || !completedGrid) {
    return;
  }

  let activeProjectId = null;

  function openProject(projectId) {
    const project = findProductionProject(projectId);
    if (!project) {
      return;
    }

    activeProjectId = project.id;
    dialog.dataset.projectId = project.id;
    document.getElementById('projectDetailTitle').textContent = project.name;
    document.getElementById('projectDetailCreated').textContent = `Creado: ${formatProjectCreated(project.created)}`;
    nameInput.value = project.name;
    statusSelect.value = project.state;
    createdInput.value = getProjectDateInputValue(project.created);
    renderProjectTasks(project);
    dialog.showModal();
  }

  document.getElementById('productionGrid').addEventListener('click', (event) => {
    const card = event.target.closest('[data-project-id]');
    if (card) {
      openProject(card.dataset.projectId);
    }
  });

  completedGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-project-id]');
    if (card) {
      openProject(card.dataset.projectId);
    }
  });

  closeButton.addEventListener('click', () => dialog.close());

  nameInput.addEventListener('change', () => {
    const project = findProductionProject(activeProjectId);
    const name = nameInput.value.trim();
    if (!project || !name) {
      nameInput.value = project ? project.name : '';
      return;
    }

    project.name = name;
    nameInput.value = name;
    document.getElementById('projectDetailTitle').textContent = name;
    persistDashboardData();
    renderProduction();
  });

  statusSelect.addEventListener('change', () => {
    const project = findProductionProject(activeProjectId);
    if (!project) {
      return;
    }

    project.state = statusSelect.value;
    moveProjectToStatusCollection(project);
    persistDashboardData();
    renderProduction();
  });

  createdInput.addEventListener('change', () => {
    const project = findProductionProject(activeProjectId);
    if (!project) {
      return;
    }

    project.created = createdInput.value || 'introducir fecha';
    document.getElementById('projectDetailCreated').textContent = `Creado: ${formatProjectCreated(project.created)}`;
    persistDashboardData();
    renderProduction();
  });

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const project = findProductionProject(activeProjectId);
    const text = taskInput.value.trim();
    if (!project || !text) {
      taskInput.reportValidity();
      return;
    }

    project.tasks.push({
      id: `${project.id}-task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      completed: false
    });
    persistDashboardData();
    renderProjectTasks(project);
    renderProduction();
    taskInput.value = '';
    taskInput.focus();
  });

  taskList.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-task-toggle]');
    const taskEdit = event.target.closest('[data-task-edit]');
    const project = findProductionProject(activeProjectId);
    if (!project) {
      return;
    }

    if (checkbox) {
      const task = project.tasks.find((item) => item.id === checkbox.dataset.taskToggle);
      if (!task) {
        return;
      }
      task.completed = checkbox.checked;
      persistDashboardData();
      renderProjectTasks(project);
      renderProduction();
    } else if (taskEdit) {
      const task = project.tasks.find((item) => item.id === taskEdit.dataset.taskEdit);
      const text = taskEdit.value.trim();
      if (!task || !text) {
        if (task) {
          taskEdit.value = task.text;
        }
        return;
      }
      task.text = text;
      persistDashboardData();
    }
  });

  taskList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-task-delete]');
    if (!deleteButton) {
      return;
    }

    const project = findProductionProject(activeProjectId);
    if (!project) {
      return;
    }
    project.tasks = project.tasks.filter((task) => task.id !== deleteButton.dataset.taskDelete);
    persistDashboardData();
    renderProjectTasks(project);
    renderProduction();
  });
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
  bindProjectDetails();
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
