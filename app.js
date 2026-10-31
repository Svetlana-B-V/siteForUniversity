// =========================================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ РОЛИ, ПРОФИЛЯ, ДЗ И АВТОРИЗАЦИИ
// =========================================================================
const appState = {
  role: 'abit',            // 'abit' (по умолчанию) | 'student' | 'teacher'
  isAuthenticated: false,  // false для абитуриента, true после входа в УрФУ ID
  selectedModalRole: 'student',
  pendingScreen: null,     // куда перенаправить после успешного входа
  scheduleWeek: 'even',    // 'even' | 'odd'
  scheduleTypeFilter: 'all',
  teacherOnlyMyClasses: true, // показывать педагогу только его пары
  activeMapCategory: 'atrium',
  currentUser: {
    fio: 'Режим Абитуриента',
    email: 'guest@urfu.ru',
    inst: 'ИРИТ-РтФ',
    group: 'Гость'
  },
  // Единая база домашних заданий для синхронизации между Педагогом и Студентом
  homeworks: [
    {
      id: 1,
      subject: 'Прикладной ИИ и ML • ИРИТ-РтФ',
      brsSubjectKey: 'ai',
      deadline: '🔥 До 30 октября, 23:59',
      title: 'Лабораторная №4: Обучение сверточной нейросети и деплой на FastAPI',
      desc: 'Преподаватель: доц. Соколов А. В. • Прикрепите ссылку на GitHub-репозиторий и отчет в PDF.',
      group: 'РИ-160033',
      maxPoints: 8.0,
      earnedPoints: 0,
      status: 'urgent', // 'urgent' | 'review' | 'done'
      link: 'https://github.com/urfu-ai/cnn-fastapi-lab4',
      comment: ''
    },
    {
      id: 2,
      subject: 'Проектный практикум • Команда',
      brsSubjectKey: 'project',
      deadline: '⏳ До 1 ноября, 18:00',
      title: 'Спринт 2: Интерактивный прототип и дизайн-система фасада УрФУ',
      desc: 'Куратор: В. В. Виткин • Загрузите ссылку на макеты в Figma и проведите тестирование сценариев.',
      group: 'РИ-160033',
      maxPoints: 12.0,
      earnedPoints: 0,
      status: 'urgent',
      link: 'https://figma.com/file/urfu-glass-redesign',
      comment: ''
    },
    {
      id: 3,
      subject: 'Алгоритмы и структуры данных',
      brsSubjectKey: 'algo',
      deadline: '👀 На проверке у педагога',
      title: 'Домашнее задание №3: Поиск кратчайшего пути в графе корпусов',
      desc: 'Отправлено 24 октября • Автотесты пройдены (18/18). Ожидается подтверждение преподавателя.',
      group: 'РИ-160033',
      maxPoints: 6.0,
      earnedPoints: 0,
      status: 'review',
      link: 'graph_dijkstra_urfu.py',
      comment: 'Реализован алгоритм Дейкстры и A* для графа переходов ГУК и Новокольцовского.'
    },
    {
      id: 4,
      subject: 'Базы данных и SQL',
      brsSubjectKey: 'db',
      deadline: '✅ Проверено • +10.0 БРС',
      title: 'Проектирование схемы БД для сервиса менторов Campus Connect',
      desc: 'Комментарий педагога: «Отличная нормализация таблиц и индексов, баллы зачислены в итоговый рейтинг семестра».',
      group: 'РИ-160033',
      maxPoints: 10.0,
      earnedPoints: 10.0,
      status: 'done',
      link: 'schema_campus_connect.sql',
      comment: '3НФ, миграции PostgreSQL.'
    }
  ],
  // Дисциплины в зачётке БРС (Личный кабинет)
  brsSubjects: [
    { key: 'ai', name: 'Прикладной ИИ и ML', teacher: 'доц. Соколов А. В.', score: 83.2, max: 100 },
    { key: 'project', name: 'Проектный практикум', teacher: 'В. В. Виткин', score: 89.5, max: 100 },
    { key: 'algo', name: 'Алгоритмы и структуры данных', teacher: 'проф. Мельников И. П.', score: 84.6, max: 100 },
    { key: 'db', name: 'Архитектура баз данных и SQL', teacher: 'ст. преп. Орлова Е. С.', score: 94.0, max: 100 }
  ]
};

// Закрытые разделы, недоступные без авторизации Студента или Педагога
const protectedScreens = ['schedule', 'homework', 'dashboard', 'teamup', 'mentors'];

const ambientPhotosByScreen = {
  'home': 'src/DIP_8550.jpg',
  'programs': 'src/nov_kampus_ijun_24.jpg',
  'ai-landing': 'src/DIP_8550.jpg',
  'campus-map': 'src/oblozhka.jpg',
  'events': 'src/20240604_kampus.jpg',
  'about': 'src/nov_kampus_ijun_24.jpg',
  'schedule': 'src/DIP_8550.jpg',
  'homework': 'src/6571bc0a21495630507812.jpg',
  'dashboard': 'src/oblozhka.jpg',
  'teamup': 'src/6571bc0a21495630507812.jpg',
  'mentors': 'src/6571bc0a21495630507812.jpg'
};

const heroEditorialSlides = [
  {
    src: 'src/oblozhka.jpg',
    label: 'ИРИТ-РтФ • Зеркальные стелы и фасад нового кампуса',
    heading: 'Поступай в <span class="gold-highlight">главный</span> кампус Урала!'
  },
  {
    src: 'src/DIP_8550.jpg',
    label: 'Стеклянный атриум и главный лекторий со световым куполом',
    heading: 'Архитектура <span class="gold-highlight">света</span> и открытых знаний.'
  },
  {
    src: 'src/6571bc0a21495630507812.jpg',
    label: 'Панорамный коворкинг для проектной работы и встреч с менторами',
    heading: 'Создавай <span class="gold-highlight">проекты</span> в командах UrFU TeamUp.'
  },
  {
    src: 'src/nov_kampus_ijun_24.jpg',
    label: 'Площадь флагов и современные жилые корпуса в Новокольцовском',
    heading: 'Кампус <span class="gold-highlight">будущего</span> для жизни и науки.'
  },
  {
    src: 'src/20240604_kampus.jpg',
    label: 'Внутренний зеленый двор и пешеходные аллеи студгородка',
    heading: 'Экосистема <span class="gold-highlight">комфорта</span> между парами.'
  }
];

let currentHeroSlideIndex = 0;
let activeTransitionTimer = null;

// =========================================================================
// 2. БАЗА ДАННЫХ НЕДЕЛЬНОГО РАСПИСАНИЯ И ЛОКАЦИЙ КАРТЫ
// =========================================================================
const timeSlots = [
  { pair: '1 пара', time: '08:30 – 10:05' },
  { pair: '2 пара', time: '10:15 – 11:50' },
  { pair: '3 пара', time: '12:15 – 13:50' },
  { pair: '4 пара', time: '14:15 – 15:50' },
  { pair: '5 пара', time: '16:00 – 17:35' }
];

const weekDays = [
  { key: 'mon', name: 'ПН', date: '26 окт' },
  { key: 'tue', name: 'ВТ • СЕГОДНЯ', date: '27 окт', isToday: true },
  { key: 'wed', name: 'СР', date: '28 окт' },
  { key: 'thu', name: 'ЧТ', date: '29 окт' },
  { key: 'fri', name: 'ПТ', date: '30 окт' },
  { key: 'sat', name: 'СБ', date: '31 окт' }
];

// Расписание по слотам (индекс пары 0..4 и день недели)
const weeklyLessonsData = {
  '0_mon': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Математические методы ИИ',
    teacher: 'проф. Мельников И. П.',
    group: 'Поток РИ-160033 / 34',
    room: 'Стеклянный атриум А-101',
    weeks: ['even', 'odd']
  },
  '1_mon': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Алгоритмы и структуры данных',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420',
    weeks: ['even', 'odd']
  },
  '1_tue': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Прикладной ИИ и Machine Learning',
    teacher: 'доц. Соколов А. В.',
    group: 'Поток ИРИТ-РтФ',
    room: 'Стеклянный атриум А-101',
    weeks: ['even', 'odd']
  },
  '2_tue': {
    type: 'project', typeLabel: 'Практикум',
    subject: 'Проектный практикум УрФУ',
    teacher: 'В. В. Виткин',
    group: 'Команды РИ-160033',
    room: 'Коворкинг 3 этаж',
    weeks: ['even', 'odd']
  },
  '3_tue': {
    type: 'lab', typeLabel: 'Практика',
    subject: 'Архитектура баз данных и SQL',
    teacher: 'ст. преп. Орлова Е. С.',
    group: 'Группа РИ-160033',
    room: 'Ауд. И-308 (Новокольцовский)',
    weeks: ['even', 'odd']
  },
  '0_wed': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Глубокие нейросети и Computer Vision',
    teacher: 'доц. Соколов А. В.',
    group: 'Поток РИ-160033',
    room: 'Стеклянный атриум А-101',
    weeks: ['even', 'odd']
  },
  '2_wed': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Разработка микросервисов на FastAPI',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420',
    weeks: ['even', 'odd']
  },
  '1_thu': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Информационная безопасность',
    teacher: 'проф. Громов Д. А.',
    group: 'Поток ИРИТ-РтФ',
    room: 'ГУК • Ауд. М-324 (Мира 19)',
    weeks: ['even', 'odd']
  },
  '3_thu': {
    type: 'project', typeLabel: 'Консультация',
    subject: 'Ревью кода и защита лабораторных БРС',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Деканат И-204',
    weeks: ['even', 'odd']
  },
  '1_fri': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Обучение LLM и RAG-пайплайны',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420',
    weeks: ['even', 'odd']
  },
  '2_fri': {
    type: 'project', typeLabel: 'Спринт TeamUp',
    subject: 'Демо-день проектных команд кампуса',
    teacher: 'В. В. Виткин',
    group: 'Все команды ИРИТ-РтФ',
    room: 'Коворкинг 3 этаж',
    weeks: ['even']
  },
  '1_sat': {
    type: 'project', typeLabel: 'Факультатив',
    subject: 'Олимпиадное программирование и графы',
    teacher: 'проф. Мельников И. П.',
    group: 'Сборная УрФУ',
    room: 'Коворкинг 3 этаж',
    weeks: ['even', 'odd']
  }
};

// Проверка: принадлежит ли пара авторизованному педагогу
function isLessonTaughtByCurrentUser(lessonTeacher) {
  if (!appState.currentUser || !appState.currentUser.fio) return false;
  const userFio = appState.currentUser.fio.trim().toLowerCase();
  const teacherStr = lessonTeacher.toLowerCase();

  // Извлекаем фамилию (первое слово с длиной > 2 символов, не являющееся должностью)
  const words = userFio.split(/\s+/).filter(w => w.length > 2 && !['доц.', 'проф.', 'преп.'].includes(w));
  const surname = words[0] || 'соколов';

  if (teacherStr.includes(surname)) return true;

  // Если педагог ввел нестандартное ФИО при регистрации, сопоставляем его с основным профилем (доц. Соколов А. В.)
  const knownSurnames = ['соколов', 'мельников', 'виткин', 'орлова', 'громов'];
  const matchesKnown = knownSurnames.some(k => userFio.includes(k));
  if (!matchesKnown && teacherStr.includes('соколов')) {
    return true;
  }
  return false;
}

// Отрисовка недельной сетки расписания (с фильтрацией пар для Педагога)
function renderWeeklySchedule() {
  const grid = document.getElementById('week-grid-table');
  if (!grid) return;

  const isTeacher = appState.role === 'teacher';
  let html = '';

  // Верхняя шапка таблицы (Угол + 6 дней недели Пн–Сб)
  html += `
    <div class="week-col-header" style="background:rgba(31,42,68,0.88); display:flex; flex-direction:column; justify-content:center;">
      <span class="day-name" style="color:var(--gold);">ВРЕМЯ</span>
      <span class="day-date">${appState.scheduleWeek === 'even' ? 'Чётная нед.' : 'Нечётная нед.'}</span>
    </div>
  `;

  weekDays.forEach(d => {
    html += `
      <div class="week-col-header ${d.isToday ? 'today-col' : ''}">
        <span class="day-name">${d.name}</span>
        <span class="day-date">${d.date}</span>
      </div>
    `;
  });

  // Строки по временным слотам (1..5 пара)
  timeSlots.forEach((slot, sIdx) => {
    html += `
      <div class="time-slot-cell">
        <span class="pair-num">${slot.pair}</span>
        <span class="pair-hours">${slot.time}</span>
      </div>
    `;

    weekDays.forEach(day => {
      const key = `${sIdx}_${day.key}`;
      const item = weeklyLessonsData[key];
      const matchesWeek = item && (!item.weeks || item.weeks.includes(appState.scheduleWeek));
      const matchesType = item && (appState.scheduleTypeFilter === 'all' || item.type === appState.scheduleTypeFilter);

      // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ №1: Если роль "педагог", показываем только пары этого педагога
      const matchesTeacher = !isTeacher || !appState.teacherOnlyMyClasses || (item && isLessonTaughtByCurrentUser(item.teacher));

      if (item && matchesWeek && matchesType && matchesTeacher) {
        const displayTeacherName = (isTeacher && isLessonTaughtByCurrentUser(item.teacher))
          ? formatShortTeacherName(appState.currentUser.fio, item.teacher)
          : item.teacher;

        const personLine = isTeacher
          ? `👥 ${item.group} • 👩‍🏫 ${displayTeacherName}`
          : `👤 ${item.teacher}`;

        html += `
          <div class="schedule-cell">
            <div class="lesson-card type-${item.type}">
              <div>
                <div class="lesson-top-row">
                  <span class="lesson-time-tag">${slot.time}</span>
                  <span class="lesson-type-badge">${item.typeLabel}</span>
                </div>
                <div class="lesson-subject" style="margin-top:6px;">${item.subject}</div>
              </div>
              <div>
                <div class="lesson-person" style="margin-bottom:6px;">${personLine}</div>
                <button class="lesson-room-btn" onclick="openRoomOnCampusMap('${item.room}')" title="Показать аудиторию на 3D-карте корпуса">
                  📍 ${item.room} ↗
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="schedule-cell">
            <span class="empty-slot-label">${isTeacher ? 'Нет вашей пары' : 'Свободное окно'}</span>
          </div>
        `;
      }
    });
  });

  grid.innerHTML = html;
}

function formatShortTeacherName(fullFio, fallback) {
  if (!fullFio) return fallback;
  const parts = fullFio.trim().split(/\s+/);
  if (parts.length >= 3) {
    return `доц. ${parts[0]} ${parts[1][0]}. ${parts[2][0]}.`;
  }
  return fullFio;
}

function switchScheduleWeek(parity, btn) {
  appState.scheduleWeek = parity;
  document.getElementById('week-even-btn').className = parity === 'even' ? 'btn-gold' : 'btn-glass';
  document.getElementById('week-odd-btn').className = parity === 'odd' ? 'btn-gold' : 'btn-glass';
  renderWeeklySchedule();
  showToast(parity === 'even' ? 'Показана чётная учебная неделя' : 'Показана нечётная учебная неделя');
}

function filterScheduleType(type, btn) {
  appState.scheduleTypeFilter = type;
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderWeeklySchedule();
}

function openRoomOnCampusMap(roomName) {
  navigateTo('home');
  setTimeout(() => {
    const mapBlock = document.getElementById('main-navigator-block');
    if (mapBlock) mapBlock.scrollIntoView({ behavior: 'smooth' });

    // Автоматически определяем категорию пина на карте по названию аудитории
    let category = 'atrium';
    const lower = roomName.toLowerCase();
    if (lower.includes('коворкинг')) category = 'coworking';
    else if (lower.includes('лаборатор') || lower.includes('420') || lower.includes('308')) category = 'labs';
    else if (lower.includes('деканат') || lower.includes('204')) category = 'dean';
    else if (lower.includes('атриум') || lower.includes('101') || lower.includes('324')) category = 'atrium';

    const matchingBtn = document.querySelector(`.route-chip[data-map-cat="${category}"]`);
    highlightCampusRoute(`Маршрут из расписания: ${roomName}`, matchingBtn, category);
  }, 550);
}

// =========================================================================
// 3. НАВИГАЦИЯ С ПРОВЕРКОЙ АВТОРИЗАЦИИ И ПЛАВНЫМ ПЕРЕХОДОМ
// =========================================================================
function navigateTo(screenId, navBtn) {
  if (!appState.isAuthenticated && protectedScreens.includes(screenId)) {
    appState.pendingScreen = screenId;
    const sectionTitles = {
      'schedule': 'Расписание недели',
      'homework': 'Домашние задания и БРС',
      'dashboard': 'Дашборд и Личный кабинет',
      'teamup': 'UrFU TeamUp',
      'mentors': 'Менторы и профиль'
    };
    document.getElementById('auth-modal-prompt').innerHTML =
      `🔒 Раздел <strong>«${sectionTitles[screenId] || screenId}»</strong> доступен только студентам и педагогам. Пожалуйста, авторизуйтесь через УрФУ ID:`;
    openAuthModal('login');
    showToast('Сначала авторизуйтесь как Студент или Педагог 🔐');
    return;
  }

  const current = document.querySelector('.screen.active');
  const target = document.getElementById('screen-' + screenId);
  if (!target || current === target) return;

  if (activeTransitionTimer) {
    clearTimeout(activeTransitionTimer);
    document.querySelectorAll('.screen.is-leaving').forEach(el => {
      el.classList.remove('is-leaving', 'visible');
    });
  }

  document.querySelectorAll('.sidebar-menu .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = navBtn || document.querySelector(`.sidebar-menu [data-screen="${screenId}"]`);
  if (activeNav) activeNav.classList.add('active');

  const ambientLayer = document.getElementById('ambient-photo-layer');
  if (ambientLayer && ambientPhotosByScreen[screenId]) {
    ambientLayer.classList.add('zooming');
    ambientLayer.style.backgroundImage = `url('${ambientPhotosByScreen[screenId]}')`;
    setTimeout(() => ambientLayer.classList.remove('zooming'), 750);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (current) {
    current.classList.remove('active', 'visible');
    current.classList.add('is-leaving');
  }

  target.classList.remove('is-leaving', 'visible');
  target.classList.add('active', 'is-entering');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.remove('is-entering');
      target.classList.add('visible');
    });
  });

  activeTransitionTimer = setTimeout(() => {
    if (current) {
      current.classList.remove('is-leaving');
    }
    activeTransitionTimer = null;
  }, 950);
}

// =========================================================================
// 4. РОЛЕВАЯ ЛОГИКА: АБИТУРИЕНТ ↔ СТУДЕНТ ↔ ПЕДАГОГ
// =========================================================================
function requestRoleSwitch(targetRole) {
  if (targetRole === 'abit') {
    logoutToAbiturient();
    return;
  }

  if (!appState.isAuthenticated || appState.role !== targetRole) {
    selectModalRole(targetRole);
    document.getElementById('auth-modal-prompt').innerHTML =
      targetRole === 'teacher'
        ? '👩‍🏫 Для входа в <strong>Режим Педагога</strong> (личное расписание преподавателя, выдача ДЗ и ведомость БРС) подтвердите аккаунт УрФУ:'
        : '⚡ Для входа в <strong>Режим Студента</strong> (расписание группы, сдача ДЗ, личный кабинет БРС и TeamUp) войдите через УрФУ ID:';
    openAuthModal('login');
  }
}

function selectModalRole(role) {
  appState.selectedModalRole = role;
  document.getElementById('modal-role-student').classList.toggle('active', role === 'student');
  document.getElementById('modal-role-teacher').classList.toggle('active', role === 'teacher');

  if (role === 'teacher') {
    document.getElementById('login-email').value = 'a.v.sokolov@urfu.ru';
    document.getElementById('reg-fio').value = 'Соколов Алексей Викторович';
    document.getElementById('reg-email').value = 'a.v.sokolov@urfu.ru';
    document.getElementById('reg-inst').value = 'ИРИТ-РтФ • Кафедра ИИ';
    document.getElementById('reg-group').value = 'Доцент / Куратор';
  } else {
    document.getElementById('login-email').value = 'proverka@urfu.ru';
    document.getElementById('reg-fio').value = 'Эльдаров Эльдар Эльдарович';
    document.getElementById('reg-email').value = 'proverka@urfu.ru';
    document.getElementById('reg-inst').value = 'ИРИТ-РтФ';
    document.getElementById('reg-group').value = 'РИ-160033';
  }
}

function quickDemoLogin(role) {
  selectModalRole(role);
  performAnimatedLogin('register');
}

function performAnimatedLogin(mode) {
  const role = appState.selectedModalRole || 'student';
  appState.isAuthenticated = true;
  appState.role = role;

  let fio = document.getElementById('reg-fio').value;
  let email = mode === 'login' ? document.getElementById('login-email').value : document.getElementById('reg-email').value;
  let inst = document.getElementById('reg-inst').value || 'ИРИТ-РтФ';
  let group = document.getElementById('reg-group').value || (role === 'teacher' ? 'Доцент' : 'РИ-160033');

  if (!fio) {
    fio = role === 'teacher' ? 'Соколов Алексей Викторович' : 'Эльдаров Эльдар Эльдарович';
  }

  appState.currentUser = { fio, email, inst, group };

  applyRoleUI(role, appState.currentUser);
  closeAuthModal();

  const nextScreen = appState.pendingScreen || 'home';
  appState.pendingScreen = null;

  setTimeout(() => {
    if (nextScreen !== 'home') {
      navigateTo(nextScreen);
    }
    showToast(role === 'teacher'
      ? `Добро пожаловать, ${fio}! Открыто расписание и кабинет Педагога 👩‍🏫`
      : `Добро пожаловать, ${fio}! Открыт личный кабинет Студента ⚡`);
  }, 220);
}

function logoutToAbiturient() {
  appState.isAuthenticated = false;
  appState.role = 'abit';
  appState.pendingScreen = null;
  appState.currentUser = {
    fio: 'Режим Абитуриента',
    email: 'guest@urfu.ru',
    inst: 'ИРИТ-РтФ',
    group: 'Гость'
  };

  applyRoleUI('abit', null);
  navigateTo('home', document.querySelector('[data-screen="home"]'));
  showToast('Вы вернулись в стартовый режим Абитуриента 🎓');
}

// Синхронизация всего контента сайта под активную роль
function applyRoleUI(role, userData) {
  document.querySelectorAll('.role-pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('role-btn-' + role).classList.add('active');

  document.getElementById('role-btn-student').textContent = appState.isAuthenticated && role === 'student' ? '⚡ Студенту' : '🔒 Студенту';
  document.getElementById('role-btn-teacher').textContent = appState.isAuthenticated && role === 'teacher' ? '👩‍🏫 Педагогу' : '🔒 Педагогу';

  document.querySelectorAll('.lock-tag').forEach(tag => {
    tag.style.display = appState.isAuthenticated ? 'none' : 'inline';
  });

  const abitBlock = document.getElementById('abiturient-steps-block');
  const hwSection = document.getElementById('authenticated-homework-section');
  const teacherRibbon = document.getElementById('teacher-quick-ribbon');
  const badge = document.getElementById('hero-role-badge');
  const heading = document.getElementById('hero-main-heading');
  const desc = document.getElementById('hero-main-desc');
  const ctaGroup = document.getElementById('hero-cta-group');
  const logoutBtn = document.getElementById('header-logout-btn');

  if (role === 'abit') {
    abitBlock.style.display = 'block';
    hwSection.style.display = 'none';
    teacherRibbon.style.display = 'none';
    logoutBtn.style.display = 'none';

    document.getElementById('sidebar-avatar-initials').textContent = 'АБ';
    document.getElementById('sidebar-status-dot').style.background = '#C6A75E';
    document.getElementById('sidebar-user-name').textContent = 'Режим Абитуриента';
    document.getElementById('sidebar-user-mail').textContent = 'Гость • Нажмите для входа в УрФУ ID';
    document.getElementById('topbar-role-indicator').textContent = 'Приёмная кампания';
    document.getElementById('header-auth-btn').textContent = 'Войти через УрФУ';

    badge.textContent = '🎓 Абитуриенту 2026 • 9 600+ бюджетных мест в УрФУ';
    heading.innerHTML = 'Поступай в <span class="gold-highlight">главный</span> кампус Урала!';
    desc.textContent = 'Выбери свою индивидуальную траекторию из 350+ программ, рассчитай шансы по баллам ЕГЭ и познакомься с новым стеклянным кампусом в Новокольцовском. Для доступа к расписанию, ДЗ и БРС войди как студент или педагог.';
    ctaGroup.innerHTML = `
      <button class="btn-gold" onclick="navigateTo('programs', document.querySelector('[data-screen=programs]'))">🧮 Калькулятор ЕГЭ и программы</button>
      <button class="btn-primary" onclick="document.getElementById('abiturient-steps-block').scrollIntoView({behavior:'smooth'})">🚀 Как поступить в 4 шага</button>
      <button class="btn-glass" onclick="document.getElementById('main-navigator-block').scrollIntoView({behavior:'smooth'})">🗺️ Карта корпуса и Wi-Fi</button>
    `;
  } else {
    abitBlock.style.display = 'none';
    hwSection.style.display = 'block';
    logoutBtn.style.display = 'inline-flex';

    const parts = userData.fio.trim().split(/\s+/);
    const initials = ((parts[0] ? parts[0][0] : 'У') + (parts[1] ? parts[1][0] : 'С')).toUpperCase();
    document.getElementById('sidebar-avatar-initials').textContent = initials;
    document.getElementById('sidebar-status-dot').style.background = '#27C93F';
    document.getElementById('sidebar-user-name').textContent = parts.slice(0, 2).join(' ');
    document.getElementById('sidebar-user-mail').textContent = `${userData.email} • ${userData.group}`;
    document.getElementById('header-auth-btn').textContent = '👤 ' + parts[0];

    document.getElementById('profile-fio-field').value = userData.fio;
    document.getElementById('profile-inst-field').value = userData.inst;
    document.getElementById('profile-group-field').value = userData.group;

    const studentFormCard = document.getElementById('hw-student-form-card');
    const teacherFormCard = document.getElementById('hw-teacher-form-card');

    if (role === 'student') {
      teacherRibbon.style.display = 'none';
      if (studentFormCard) studentFormCard.style.opacity = '1';
      if (teacherFormCard) teacherFormCard.style.opacity = '0.85';

      document.getElementById('topbar-role-indicator').textContent = `Студент • ${userData.group}`;
      badge.textContent = `⚡ Личное пространство студента • ${userData.inst} (${userData.group})`;
      heading.innerHTML = `Привет, <span class="gold-highlight">${parts[1] || parts[0]}!</span> Твой кампус готов к учёбе.`;

      document.getElementById('home-hw-section-title').textContent = '📚 Мои домашние задания и трекер семестра';
      document.getElementById('schedule-role-badge').textContent = `РАСПИСАНИЕ НЕДЕЛИ • ГРУППА ${userData.group}`;
      document.getElementById('schedule-main-title').textContent = `Расписание занятий группы ${userData.group}`;
      document.getElementById('schedule-main-sub').textContent = 'Нажми на любую аудиторию в карточке пары, чтобы мгновенно подсветить её на 3D-карте корпуса';
    } else if (role === 'teacher') {
      teacherRibbon.style.display = 'block';
      if (studentFormCard) studentFormCard.style.opacity = '0.85';
      if (teacherFormCard) teacherFormCard.style.opacity = '1';

      // Считаем количество пар, которые ведет именно этот педагог
      const myLessonsCount = Object.values(weeklyLessonsData).filter(l => isLessonTaughtByCurrentUser(l.teacher)).length;
      const reviewCount = appState.homeworks.filter(h => h.status === 'review' || h.status === 'urgent').length;

      document.getElementById('topbar-role-indicator').textContent = 'Кабинет Педагога';
      badge.textContent = `👩‍🏫 Цифровое рабочее место преподавателя • ${userData.inst}`;
      heading.innerHTML = `Добро пожаловать, <span class="gold-highlight">${parts[0]} ${parts[1] || ''}!</span>`;
      desc.textContent = `В вашем личном расписании на этой неделе ${myLessonsCount} пар (${myLessonsCount * 2} ак. часов) в Новокольцовском. Активных работ и заданий у студентов потока РИ-160033: ${reviewCount}.`;
      ctaGroup.innerHTML = `
        <button class="btn-gold" onclick="navigateTo('schedule', document.querySelector('[data-screen=schedule]'))">🗓️ Только мои пары (${myLessonsCount})</button>
        <button class="btn-primary" onclick="document.getElementById('main-homework-block').scrollIntoView({behavior:'smooth'})">✅ Проверить работы в БРС</button>
        <button class="btn-glass" onclick="navigateTo('homework', document.querySelector('[data-screen=homework]'))">+ Выдать задание потоку</button>
      `;

      const ribbonDesc = document.getElementById('teacher-ribbon-user-desc');
      if (ribbonDesc) {
        ribbonDesc.innerHTML = `Вы вошли как: <strong>${userData.fio} (${userData.inst})</strong> • В расписании показаны только ваши пары (${myLessonsCount} шт.)`;
      }

      document.getElementById('home-hw-section-title').textContent = '👩‍🏫 Журнал проверки работ студентов (Ведомость БРС)';
      document.getElementById('schedule-role-badge').textContent = `ЛИЧНОЕ РАСПИСАНИЕ ПЕДАГОГА • ${userData.fio.toUpperCase()}`;
      document.getElementById('schedule-main-title').textContent = `Мои лекции, лабораторные и консультации (${myLessonsCount} пар на неделе)`;
      document.getElementById('schedule-main-sub').textContent = 'Отображаются только дисциплины, которые ведёт авторизованный преподаватель';
    }
  }

  renderWeeklySchedule();
  renderAllHomeworksAndDashboard();
}

function handleProfileClick() {
  if (!appState.isAuthenticated) {
    openAuthModal('login');
  } else {
    navigateTo('mentors', document.querySelector('[data-screen="mentors"]'));
  }
}

// =========================================================================
// 5. ЕДИНАЯ СИСТЕМА ДОМАШНИХ ЗАДАНИЙ, ОЦЕНОК ПЕДАГОГА И ЛИЧНОГО КАБИНЕТА
// =========================================================================
function renderAllHomeworksAndDashboard(activeFilter = 'all') {
  const isTeacher = appState.role === 'teacher';
  const hws = appState.homeworks;

  const urgentCount = hws.filter(h => h.status === 'urgent').length;
  const reviewCount = hws.filter(h => h.status === 'review').length;
  const doneCount = hws.filter(h => h.status === 'done').length;
  const totalEarnedBrs = hws.reduce((acc, h) => acc + (Number(h.earnedPoints) || 0), 0);
  const progressPct = hws.length > 0 ? Math.min(100, Math.round(((doneCount + reviewCount * 0.5) / hws.length) * 100)) : 80;

  // 1. Обновляем прогресс-бар и счётчики на главной витрине
  const progLabel = document.getElementById('hw-progress-label');
  const progBar = document.getElementById('hw-progress-bar');
  const brsBonus = document.getElementById('hw-brs-bonus');
  if (progLabel) progLabel.textContent = `${progressPct}% выполнено`;
  if (progBar) progBar.style.width = `${progressPct}%`;
  if (brsBonus) brsBonus.textContent = `+${(14.5 + totalEarnedBrs).toFixed(1)} балла в БРС`;

  const filterAllBtn = document.getElementById('hw-filter-all-btn');
  if (filterAllBtn) filterAllBtn.textContent = `Все (${hws.length})`;

  // Если активна роль студента — обновляем Hero-описание с актуальным числом ДЗ
  if (appState.role === 'student') {
    const avgBrs = calculateAverageBrs();
    const desc = document.getElementById('hero-main-desc');
    const ctaGroup = document.getElementById('hero-cta-group');
    if (desc) {
      desc.textContent = `Следующая пара сегодня в 10:15 в Стеклянном атриуме А-101 (доц. Соколов А. В.). Активных домашних заданий: ${urgentCount}, на проверке: ${reviewCount}, средний балл в личном кабинете БРС: ${avgBrs}.`;
    }
    if (ctaGroup) {
      ctaGroup.innerHTML = `
        <button class="btn-gold" onclick="navigateTo('schedule', document.querySelector('[data-screen=schedule]'))">🗓️ Расписание недели Пн–Сб</button>
        <button class="btn-primary" onclick="document.getElementById('main-homework-block').scrollIntoView({behavior:'smooth'})">📚 Сдать домашнее задание (${urgentCount})</button>
        <button class="btn-glass" onclick="navigateTo('dashboard', document.querySelector('[data-screen=dashboard]'))">📊 Личный кабинет БРС (${avgBrs})</button>
      `;
    }
  }

  // 2. Рендерим карточки в #main-hw-grid (Главная) и #extra-hw-list (Экран ДЗ)
  const mainGrid = document.getElementById('main-hw-grid');
  const extraList = document.getElementById('extra-hw-list');

  const buildHwCardHTML = (item) => {
    const statusClass = item.status;
    let statusLabel = item.deadline;
    if (item.status === 'review') statusLabel = '👀 На проверке у педагога';
    if (item.status === 'done') statusLabel = `✅ Проверено • +${Number(item.earnedPoints || item.maxPoints).toFixed(1)} БРС`;

    const actionRow = item.status === 'done'
      ? `
        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid rgba(31,42,68,0.08);">
          <span style="font-size:12.5px; color:var(--success); font-weight:700;">В ведомости Личного кабинета: +${Number(item.earnedPoints || item.maxPoints).toFixed(1)} из ${item.maxPoints} БРС</span>
          <span class="badge-gold">Зачтено в ЛК</span>
        </div>
      `
      : `
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; padding-top:10px; border-top:1px solid rgba(31,42,68,0.08);">
          <input type="text" id="hw-link-${item.id}" class="form-input" style="flex:1; padding:8px 12px; font-size:13px;" value="${item.link || ''}" placeholder="Ссылка на GitHub / Figma / Отчет..." />
          <button class="btn-primary student-submit-btn" style="display:${isTeacher ? 'none' : 'inline-flex'}; padding:9px 16px; font-size:12.5px;" onclick="submitHomework(${item.id})">
            ${item.status === 'review' ? 'Обновить решение ↻' : 'Сдать работу ✓'}
          </button>
          <button class="btn-gold teacher-grade-btn" style="display:${isTeacher ? 'inline-flex' : 'none'}; padding:9px 14px; font-size:12px;" onclick="gradeHomework(${item.id}, ${item.maxPoints})">
            Оценить: +${item.maxPoints} в БРС
          </button>
        </div>
      `;

    return `
      <div class="hw-card hw-item" data-status="${statusClass}" style="display:${activeFilter === 'all' || activeFilter === statusClass ? 'flex' : 'none'};">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px; flex-wrap:wrap;">
            <span class="badge-soft">${item.subject} (${item.group})</span>
            <span class="hw-status ${statusClass}" id="hw-st-${item.id}">${statusLabel}</span>
          </div>
          <h3 style="font-size:17px; margin-bottom:6px;">${item.title}</h3>
          <p style="font-size:13px; color:var(--text-muted);">
            ${item.desc} Максимум: <strong>+${item.maxPoints} баллов БРС</strong>.
          </p>
          ${item.comment ? `<p style="font-size:12px; color:var(--navy); margin-top:6px; background:rgba(232,220,200,0.4); padding:6px 10px; border-radius:8px;">💬 Комментарий: ${item.comment}</p>` : ''}
        </div>
        ${actionRow}
      </div>
    `;
  };

  if (mainGrid) {
    mainGrid.innerHTML = hws.map(buildHwCardHTML).join('');
  }
  if (extraList) {
    extraList.innerHTML = hws.map(buildHwCardHTML).join('');
  }

  // 3. КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ №2: Обновляем Личный кабинет (screen-dashboard)
  renderPersonalCabinetDashboard();
}

function calculateAverageBrs() {
  const list = appState.brsSubjects;
  if (!list.length) return '88.4';
  const sum = list.reduce((acc, s) => acc + Math.min(100, s.score), 0);
  return (sum / list.length).toFixed(1);
}

function renderPersonalCabinetDashboard() {
  const greetingEl = document.getElementById('dashboard-user-greeting');
  const subEl = document.getElementById('dashboard-user-sub');
  const hwSummaryText = document.getElementById('dashboard-hw-summary-text');
  const brsListEl = document.getElementById('dashboard-brs-list');
  const cabinetHwFeed = document.getElementById('dashboard-cabinet-hw-feed');
  const todayLessonsEl = document.getElementById('dashboard-today-lessons');

  const avgBrs = calculateAverageBrs();
  const urgentCount = appState.homeworks.filter(h => h.status === 'urgent').length;
  const reviewCount = appState.homeworks.filter(h => h.status === 'review').length;
  const doneCount = appState.homeworks.filter(h => h.status === 'done').length;
  const totalEarnedBrs = appState.homeworks.reduce((acc, h) => acc + (Number(h.earnedPoints) || 0), 0);

  if (greetingEl && appState.isAuthenticated) {
    greetingEl.textContent = appState.role === 'teacher'
      ? `Кабинет педагога: ${appState.currentUser.fio}`
      : `Привет, ${appState.currentUser.fio}`;
  }
  if (subEl && appState.isAuthenticated) {
    subEl.textContent = `${appState.currentUser.inst}, ${appState.currentUser.group} • Средний балл БРС группы: ${avgBrs} • Кампус Новокольцовский`;
  }
  if (hwSummaryText) {
    hwSummaryText.textContent = `Активных: ${urgentCount} • На проверке: ${reviewCount} • Проверено: ${doneCount} (+${(14.5 + totalEarnedBrs).toFixed(1)} БРС)`;
  }

  // Отрисовка баллов БРС по предметам
  if (brsListEl) {
    brsListEl.innerHTML = appState.brsSubjects.map(subj => {
      const cappedScore = Math.min(100, subj.score).toFixed(1);
      const color = cappedScore >= 85 ? 'var(--success)' : 'var(--navy)';
      return `
        <div style="padding:10px 14px; background:rgba(255,255,255,0.75); border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
          <span><strong>${subj.name}</strong> (${subj.teacher})</span>
          <strong style="color:${color};">${cappedScore} / ${subj.max}</strong>
        </div>
      `;
    }).join('');
  }

  // Отрисовка ленты домашних заданий и оценок прямо в Личном кабинете (screen-dashboard)
  if (cabinetHwFeed) {
    cabinetHwFeed.innerHTML = appState.homeworks.map(hw => {
      let badgeHtml = `<span class="hw-status urgent">🔥 Выдано педагогом (${hw.deadline})</span>`;
      if (hw.status === 'review') badgeHtml = `<span class="hw-status review">👀 Отправлено на проверку</span>`;
      if (hw.status === 'done') badgeHtml = `<span class="hw-status done">✅ Оценено: +${Number(hw.earnedPoints || hw.maxPoints).toFixed(1)} БРС</span>`;

      return `
        <div style="padding:12px 14px; background:rgba(255,255,255,0.82); border-radius:14px; border-left:4px solid ${hw.status === 'done' ? 'var(--success)' : hw.status === 'review' ? 'var(--gold)' : 'var(--danger)'}; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
          <div>
            <div style="font-size:11.5px; font-weight:700; color:var(--text-muted);">${hw.subject} • Поток ${hw.group}</div>
            <strong style="font-size:14px; color:var(--navy); display:block; margin-top:2px;">${hw.title}</strong>
            ${hw.link ? `<span style="font-size:11.5px; color:var(--text-muted);">🔗 ${hw.link}</span>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${badgeHtml}
            <button class="pill-btn" style="padding:5px 10px; font-size:11px;" onclick="navigateTo('homework', document.querySelector('[data-screen=homework]'))">Открыть →</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Обновление сегодняшних пар (Вторник) в Личном кабинете с учетом роли
  if (todayLessonsEl) {
    const tueKeys = ['0_tue', '1_tue', '2_tue', '3_tue', '4_tue'];
    const tueLessons = tueKeys
      .map(k => ({ slot: timeSlots[parseInt(k.split('_')[0], 10)], data: weeklyLessonsData[k] }))
      .filter(entry => entry.data && (appState.role !== 'teacher' || isLessonTaughtByCurrentUser(entry.data.teacher)));

    if (tueLessons.length === 0) {
      todayLessonsEl.innerHTML = `<div style="padding:12px; color:var(--text-muted);">На сегодня (Вторник) у вас нет запланированных пар.</div>`;
    } else {
      todayLessonsEl.innerHTML = tueLessons.map(entry => `
        <div style="padding:10px 14px; background:rgba(255,255,255,0.75); border-radius:12px; border-left:4px solid ${entry.data.type === 'lecture' ? 'var(--gold)' : 'var(--navy)'};">
          <strong>${entry.slot.time} • ${entry.data.subject} (${entry.data.typeLabel})</strong>
          <div style="color:var(--text-muted); font-size:12px;">👤 ${entry.data.teacher} • 👥 ${entry.data.group} • 📍 ${entry.data.room}</div>
        </div>
      `).join('');
    }
  }
}

function submitHomework(id) {
  const hw = appState.homeworks.find(h => h.id === id);
  if (!hw) return;
  const linkInput = document.getElementById('hw-link-' + id);
  if (linkInput && linkInput.value.trim()) {
    hw.link = linkInput.value.trim();
  }
  hw.status = 'review';
  renderAllHomeworksAndDashboard();
  showToast('Домашнее задание отправлено преподавателю и отображено в Личном кабинете ✓');
}

function gradeHomework(id, maxPoints) {
  const hw = appState.homeworks.find(h => h.id === id);
  if (!hw) return;
  const pts = parseFloat(maxPoints) || hw.maxPoints || 8.0;
  hw.status = 'done';
  hw.earnedPoints = pts;
  hw.deadline = `✅ Проверено • +${pts.toFixed(1)} БРС`;

  // Начисляем баллы в соответствующий предмет зачётки БРС в Личном кабинете
  const subj = appState.brsSubjects.find(s => s.key === hw.brsSubjectKey) || appState.brsSubjects[0];
  if (subj) {
    subj.score = Math.min(100, Number((subj.score + pts).toFixed(1)));
  }

  renderAllHomeworksAndDashboard();
  showToast(`Оценка +${pts.toFixed(1)} БРС выставлена и синхронизирована с Личным кабинетом студента ✓`);
}

function filterHomework(status, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllHomeworksAndDashboard(status);
}

function addStudentSubmission() {
  const subj = document.getElementById('new-hw-subject').value;
  const url = document.getElementById('new-hw-url').value.trim();
  const comm = document.getElementById('new-hw-comment').value.trim();

  let brsKey = 'ai';
  if (subj.toLowerCase().includes('практикум')) brsKey = 'project';
  else if (subj.toLowerCase().includes('алгоритм')) brsKey = 'algo';

  const newId = Date.now();
  appState.homeworks.unshift({
    id: newId,
    subject: subj,
    brsSubjectKey: brsKey,
    deadline: '👀 Отправлено только что',
    title: `Индивидуальная работа студента (${appState.currentUser.fio.split(' ')[0]})`,
    desc: comm || 'Загружено через форму быстрой отправки решения.',
    group: appState.currentUser.group || 'РИ-160033',
    maxPoints: 8.0,
    earnedPoints: 0,
    status: 'review',
    link: url || 'https://github.com/urfu-student/solution',
    comment: comm
  });

  renderAllHomeworksAndDashboard();
  showToast('Решение загружено, отправлено педагогу и добавлено в Личный кабинет ✓');
}

function publishTeacherTask() {
  const grp = document.getElementById('teacher-group').value.trim() || 'РИ-160033';
  const ptsRaw = document.getElementById('teacher-points').value.trim() || '+10.0';
  const title = document.getElementById('teacher-task-title').value.trim();
  if (!title) {
    showToast('Пожалуйста, укажите название и критерии задания');
    return;
  }

  const parsedPts = parseFloat(ptsRaw.replace(',', '.').replace(/[^\d.]/g, '')) || 10.0;
  const teacherName = appState.currentUser?.fio || 'доц. Соколов А. В.';

  const newId = Date.now();
  appState.homeworks.unshift({
    id: newId,
    subject: `Новое задание педагога (${formatShortTeacherName(teacherName, 'доц. Соколов А. В.')})`,
    brsSubjectKey: 'ai',
    deadline: '🔥 Новое задание • Дедлайн 7 дней',
    title: title,
    desc: `Выдано преподавателем (${teacherName}) для потока ${grp}. Сдайте ссылку на решение в личном кабинете.`,
    group: grp,
    maxPoints: parsedPts,
    earnedPoints: 0,
    status: 'urgent',
    link: '',
    comment: ''
  });

  renderAllHomeworksAndDashboard();
  showToast(`Новое задание (+${parsedPts} БРС) опубликовано и отображено в Личном кабинете студентов ${grp} ✓`);
}

// =========================================================================
// 6. ИНТЕРАКТИВНАЯ КАРТА КОРПУСА С ВЫДЕЛЕНИЕМ ЗОН И МАРШРУТОВ
// =========================================================================
const campusMapZonesData = {
  'atrium': {
    badge: '1 ЭТАЖ • ЦЕНТРАЛЬНОЕ ЯДРО',
    title: '✨ Стеклянный атриум и главный лекторий А-101',
    desc: 'Главный вход со стороны площади флагов, 3 уровня галерей со световым куполом и амфитеатр на 450 мест.',
    wifi: 'UrFU-Campus (5 ГГц • 650 Мбит/с)',
    pinX: '48%', pinY: '52%',
    svgPath: 'M 180 410 Q 320 330 480 265',
    stageTransform: 'scale(0.92) translate(-2%, -2%)'
  },
  'coworking': {
    badge: '3 ЭТАЖ • КРЫЛО Б • 24/7',
    title: '💻 Панорамные коворкинги и зона UrFU TeamUp',
    desc: 'Выделены 3 коворкинг-зоны: тихий зал с панорамными окнами, переговорные капсулы для команд и зона с розетками у каждого стола.',
    wifi: 'UrFU-Campus / eduroam (Wi-Fi 6 • Макс. сигнал)',
    pinX: '68%', pinY: '34%',
    svgPath: 'M 180 410 Q 420 350 680 175',
    stageTransform: 'scale(0.96) translate(-6%, 2%)'
  },
  'dean': {
    badge: '2 ЭТАЖ • АДМИНИСТРАТИВНОЕ КРЫЛО',
    title: '🏛️ Деканат ИРИТ-РтФ, преподавательская и студсовет (И-204)',
    desc: 'Приём студентов по вопросам БРС, справок, индивидуальных траекторий и консультаций с кураторами курсов.',
    wifi: 'UrFU-Campus (5 ГГц • Стабильный)',
    pinX: '32%', pinY: '40%',
    svgPath: 'M 180 410 Q 230 300 320 205',
    stageTransform: 'scale(0.94) translate(3%, 1%)'
  },
  'labs': {
    badge: '4 ЭТАЖ • НАУЧНЫЙ КЛАСТЕР',
    title: '🔬 Лаборатория Прикладного ИИ и робототехники (И-420 / И-308)',
    desc: 'Серверная стойка с GPU-ускорителями, рабочие станции для компьютерного зрения, робототехники и дипломных проектов.',
    wifi: 'UrFU-Campus + Гигабитный Ethernet',
    pinX: '62%', pinY: '64%',
    svgPath: 'M 180 410 Q 410 410 620 325',
    stageTransform: 'scale(0.95) translate(-5%, -5%)'
  },
  'wifi': {
    badge: 'ПОКРЫТИЕ 100% • БЕСШОВНЫЙ РОУМИНГ',
    title: '📶 Точки доступа Wi-Fi 6 (UrFU-Campus / eduroam / UrFU-Guest)',
    desc: 'Высокоскоростные роутеры размещены в атриуме, всех коворкингах, коридорах и лекционных залах. Инструкция по подключению расположена ниже.',
    wifi: 'До 1 Гбит/с по всему кампусу',
    pinX: '52%', pinY: '45%',
    svgPath: 'M 180 410 Q 350 280 520 230',
    stageTransform: 'scale(0.85) translate(0%, 0%)'
  }
};

function highlightCampusRoute(routeTitle, btn, categoryKey) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.route-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  // Определяем ключ категории
  let cat = categoryKey;
  if (!cat) {
    const t = routeTitle.toLowerCase();
    if (t.includes('коворкинг')) cat = 'coworking';
    else if (t.includes('деканат') || t.includes('204')) cat = 'dean';
    else if (t.includes('лаборатор') || t.includes('420')) cat = 'labs';
    else if (t.includes('wi-fi') || t.includes('вай-фай')) cat = 'wifi';
    else cat = 'atrium';
  }
  appState.activeMapCategory = cat;
  const zone = campusMapZonesData[cat] || campusMapZonesData['atrium'];

  // Обновляем статусную строку
  const statusBox = document.getElementById('map-route-status');
  const routeText = document.getElementById('map-route-text');
  if (statusBox) {
    statusBox.style.transform = 'scale(1.04)';
    setTimeout(() => { statusBox.style.transform = 'scale(1)'; }, 260);
  }
  if (routeText) {
    routeText.textContent = `Выделена зона на карте: ${zone.title}`;
  }

  // Плавная фокусировка сцены карты
  const stage = document.getElementById('navigator-scale-stage');
  if (stage) {
    stage.style.transform = zone.stageTransform;
  }

  // Подсвечиваем маркеры и карточку объекта поверх самой карты
  updateMapVisualOverlay(cat, zone);
  showToast(`На карте выделена зона: ${zone.title}`);
}

function updateMapVisualOverlay(activeCat, zone) {
  // Подсвечиваем пины на карте (активный пин увеличивается и пульсирует золотым кольцом)
  document.querySelectorAll('.campus-map-pin').forEach(pin => {
    const pinCat = pin.getAttribute('data-pin-cat');
    const isSelected = pinCat === activeCat || activeCat === 'wifi';
    pin.style.opacity = isSelected ? '1' : '0.42';
    pin.style.transform = isSelected ? 'translate(-50%, -50%) scale(1.18)' : 'translate(-50%, -50%) scale(0.9)';
    pin.style.zIndex = isSelected ? '10' : '4';
  });

  // Обновляем SVG-линию маршрута от входа до выбранной точки
  const routePath = document.getElementById('map-svg-route-line');
  if (routePath && zone.svgPath) {
    routePath.setAttribute('d', zone.svgPath);
  }

  // Обновляем всплывающую информационную карточку выбранного объекта на самой карте
  const cardBadge = document.getElementById('map-poi-badge');
  const cardTitle = document.getElementById('map-poi-title');
  const cardDesc = document.getElementById('map-poi-desc');
  const cardWifi = document.getElementById('map-poi-wifi');

  if (cardBadge) cardBadge.textContent = zone.badge;
  if (cardTitle) cardTitle.textContent = zone.title;
  if (cardDesc) cardDesc.textContent = zone.desc;
  if (cardWifi) cardWifi.textContent = `📶 ${zone.wifi}`;
}

function copyWifiCredentials(ssid, authInfo) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`Сеть: ${ssid} | Вход: ${authInfo}`).catch(() => {});
  }
  showToast(`Параметры сети «${ssid}» скопированы! (${authInfo}) 📶`);
}

function setNavigatorScale(scaleFactor, btn) {
  const stage = document.getElementById('navigator-scale-stage');
  const pct = (100 / scaleFactor).toFixed(2) + '%';
  stage.style.width = pct;
  stage.style.height = pct;
  stage.style.transform = `scale(${scaleFactor})`;

  btn.parentElement.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const labelPct = Math.round(scaleFactor * 100) + '%';
  document.getElementById('map-route-text').textContent = `Масштаб карты плавно изменен на ${labelPct} для удобного обзора корпуса`;
}

function toggleMapHeight() {
  document.getElementById('main-map-viewport').classList.toggle('tall-map');
}

function reloadCampusMap() {
  const iframe = document.getElementById('campus-navigator-iframe');
  iframe.src = iframe.src;
  highlightCampusRoute('Стеклянный атриум (1 этаж) • Главный лекторий А-101', document.querySelector('.route-chip[data-map-cat="atrium"]'), 'atrium');
  showToast('Интерактивная схема корпуса и маркеры обновлены ✓');
}

// =========================================================================
// 7. ПАНОРАМЫ КАМПУСА, ПОИСК, КАЛЬКУЛЯТОР ЕГЭ, TEAMUP И ИИ-ЧАТ
// =========================================================================
function changeHeroPhoto(slideIndex, btn) {
  currentHeroSlideIndex = slideIndex;
  const slide = heroEditorialSlides[slideIndex];
  if (!slide) return;

  const img = document.getElementById('hero-showcase-img');
  const label = document.getElementById('hero-photo-label');
  const ambient = document.getElementById('hero-ambient-bg');
  const heading = document.getElementById('hero-main-heading');

  if (heading) {
    heading.classList.remove('hero-editorial-zoom-in');
    heading.classList.add('hero-editorial-zoom-out');
  }

  img.style.opacity = '0.28';
  img.style.transform = 'scale(1.18)';
  img.style.filter = 'blur(14px)';

  setTimeout(() => {
    img.src = slide.src;
    label.textContent = slide.label;
    if (ambient) ambient.style.backgroundImage = `url('${slide.src}')`;

    img.classList.remove('hero-img-bokeh-transition');
    void img.offsetWidth;
    img.classList.add('hero-img-bokeh-transition');
    img.style.opacity = '';
    img.style.transform = '';
    img.style.filter = '';

    if (heading) {
      heading.innerHTML = slide.heading;
      heading.classList.remove('hero-editorial-zoom-out');
      heading.classList.add('hero-editorial-zoom-in');
    }
  }, 340);

  const thumbs = document.querySelectorAll('.hero-thumb-btn');
  thumbs.forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else if (thumbs[slideIndex]) {
    thumbs[slideIndex].classList.add('active');
  }
}

function cycleHeroEditorialSlide() {
  const nextIndex = (currentHeroSlideIndex + 1) % heroEditorialSlides.length;
  changeHeroPhoto(nextIndex);
}

function toggleSidebarPin() {
  const sb = document.getElementById('smart-sidebar');
  sb.classList.toggle('pinned');
  const pinned = sb.classList.contains('pinned');
  showToast(pinned ? 'Боковая навигация закреплена в раскрытом виде 📌' : 'Включен режим авто-раскрытия меню при наведении');
}

function handleQuickSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;
  if (q.includes('распис') || q.includes('пар') || q.includes('недел')) {
    navigateTo('schedule');
  } else if (q.includes('дз') || q.includes('задан') || q.includes('лаб')) {
    navigateTo('homework');
  } else if (q.includes('егэ') || q.includes('програм') || q.includes('балл')) {
    navigateTo('programs');
  } else if (q.includes('карт') || q.includes('атриум') || q.includes('коворк') || q.includes('wi-fi') || q.includes('вай')) {
    navigateTo('home');
    setTimeout(() => {
      document.getElementById('main-navigator-block').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  } else {
    navigateTo('programs');
    showToast('Результаты поиска по запросу: «' + query + '»');
  }
}

function openAuthModal(defaultTab = 'login') {
  switchAuthTab(defaultTab);
  document.getElementById('auth-modal-backdrop').classList.add('open');
}

function closeAuthModal() {
  document.getElementById('auth-modal-backdrop').classList.remove('open');
}

function switchAuthTab(mode) {
  document.getElementById('tab-btn-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-btn-register').classList.toggle('active', mode === 'register');
  document.getElementById('auth-panel-login').classList.toggle('active', mode === 'login');
  document.getElementById('auth-panel-register').classList.toggle('active', mode === 'register');
}

function togglePwdVisibility(inputId) {
  const inp = document.getElementById(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function openLightbox(src, caption) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  document.getElementById('lightbox-modal').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.remove('open');
}

function filterByEge(score) {
  document.getElementById('ege-val').textContent = score;
  let visible = 0;
  document.querySelectorAll('.prog-item').forEach(card => {
    const minScore = parseInt(card.getAttribute('data-score'), 10);
    if (score >= minScore) {
      card.style.display = 'block';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });
  document.getElementById('prog-count').textContent = visible;
}

function filterTopic(topic, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  let visible = 0;
  document.querySelectorAll('.prog-item').forEach(card => {
    const t = card.getAttribute('data-topic');
    if (topic === 'all' || t === topic) {
      card.style.display = 'block';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });
  document.getElementById('prog-count').textContent = visible;
}

function saveTeamUpProfile() {
  showToast('Профиль студента сохранен в базу UrFU TeamUp ✓');
}

function runTeamUpMatch() {
  const q = document.getElementById('teamup-query').value;
  document.getElementById('teamup-ai-result').innerHTML = `
    <h3 style="margin-bottom:6px;">✨ Кандидат подобран алгоритмом UrFU TeamUp</h3>
    <p style="font-size:13px; color:var(--text-muted); margin-bottom:6px;">По запросу: «${q}»</p>
    <p style="font-size:14px;"><strong>Выбран кандидат №1: Максим (ИРИТ-РтФ, совпадение 98%)</strong> — Python, FastAPI, C++, Figma. Средство связи: <span class="badge-gold">@makrol337</span></p>
  `;
  showToast('ИИ подобрал оптимального участника в команду ✓');
}

function showToast(msg) {
  const t = document.getElementById('toast-notice');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function toggleAiChat() {
  document.getElementById('ai-drawer').classList.toggle('open');
}

function sendQuickAi(text) {
  document.getElementById('ai-input').value = text;
  sendAiMsg();
}

function sendAiMsg() {
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if (!msg) return;
  const box = document.getElementById('ai-messages');
  box.innerHTML += `<div class="msg-user">${msg}</div>`;
  input.value = '';

  let reply = 'Вы можете рассчитать баллы ЕГЭ в каталоге программ или войти через УрФУ ID для доступа к расписанию недели и домашним заданиям.';
  const lower = msg.toLowerCase();
  if (lower.includes('распис')) {
    reply = '🗓️ Недельное расписание (Пн–Сб) автоматически адаптируется под роль: студент видит все пары группы, а педагог — только свои лекции и лабораторные!';
  } else if (lower.includes('wi-fi') || lower.includes('вай')) {
    reply = '📶 В кампусе работает сеть <strong>UrFU-Campus</strong> (вход по логину и паролю УрФУ ID) и гостевая сеть <strong>UrFU-Guest</strong> (авторизация по СМС).';
  } else if (lower.includes('поступ')) {
    reply = '🎓 Для поступления в УрФУ выберите до 5 направлений в калькуляторе ЕГЭ, подайте документы онлайн с 20 июня и отслеживайте конкурсные списки.';
  } else if (lower.includes('истори')) {
    reply = '🏛️ <strong>История УрФУ:</strong> В 1920 году основан Уральский государственный университет. В 2009–2010 годах УГТУ-УПИ и УрГУ объединились в УрФУ, а сегодня открыт новый кампус в Новокольцовском!';
  }

  setTimeout(() => {
    box.innerHTML += `<div class="msg-bot">${reply}</div>`;
    box.scrollTop = box.scrollHeight;
  }, 220);
}

// Инициализация при загрузке: сайт встречает нас в роли Абитуриента
document.addEventListener('DOMContentLoaded', () => {
  applyRoleUI('abit', null);
});