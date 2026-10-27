// =========================================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ РОЛИ И АВТОРИЗАЦИИ (СТАРТУЕМ С АБИТУРИЕНТА)
// =========================================================================
const appState = {
  role: 'abit',            // 'abit' (по умолчанию) | 'student' | 'teacher'
  isAuthenticated: false,  // false для абитуриента, true после входа в УрФУ ID
  selectedModalRole: 'student',
  pendingScreen: null,     // куда перенаправить после успешного входа
  scheduleWeek: 'even',    // 'even' | 'odd'
  scheduleTypeFilter: 'all'
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
// 2. БАЗА ДАННЫХ НЕДЕЛЬНОГО РАСПИСАНИЯ (ПН–СБ, ВРЕМЯ, ИМЯ, АУДИТОРИЯ)
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
    room: 'Стеклянный атриум А-101'
  },
  '1_mon': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Алгоритмы и структуры данных',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420'
  },
  '1_tue': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Прикладной ИИ и Machine Learning',
    teacher: 'доц. Соколов А. В.',
    group: 'Поток ИРИТ-РтФ',
    room: 'Стеклянный атриум А-101'
  },
  '2_tue': {
    type: 'project', typeLabel: 'Практикум',
    subject: 'Проектный практикум УрФУ',
    teacher: 'В. В. Виткин',
    group: 'Команды РИ-160033',
    room: 'Коворкинг 3 этаж'
  },
  '3_tue': {
    type: 'lab', typeLabel: 'Практика',
    subject: 'Архитектура баз данных и SQL',
    teacher: 'ст. преп. Орлова Е. С.',
    group: 'Группа РИ-160033',
    room: 'Ауд. И-308 (Новокольцовский)'
  },
  '0_wed': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Глубокие нейросети и Computer Vision',
    teacher: 'доц. Соколов А. В.',
    group: 'Поток РИ-160033',
    room: 'Стеклянный атриум А-101'
  },
  '2_wed': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Разработка микросервисов на FastAPI',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420'
  },
  '1_thu': {
    type: 'lecture', typeLabel: 'Лекция',
    subject: 'Информационная безопасность',
    teacher: 'проф. Громов Д. А.',
    group: 'Поток ИРИТ-РтФ',
    room: 'ГУК • Ауд. М-324 (Мира 19)'
  },
  '3_thu': {
    type: 'project', typeLabel: 'Консультация',
    subject: 'Ревью кода и защита лабораторных БРС',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Деканат И-204'
  },
  '1_fri': {
    type: 'lab', typeLabel: 'Лабораторная',
    subject: 'Обучение LLM и RAG-пайплайны',
    teacher: 'доц. Соколов А. В.',
    group: 'Группа РИ-160033',
    room: 'Лаборатория И-420'
  },
  '2_fri': {
    type: 'project', typeLabel: 'Спринт TeamUp',
    subject: 'Демо-день проектных команд кампуса',
    teacher: 'В. В. Виткин',
    group: 'Все команды ИРИТ-РтФ',
    room: 'Коворкинг 3 этаж'
  },
  '1_sat': {
    type: 'project', typeLabel: 'Факультатив',
    subject: 'Олимпиадное программирование и графы',
    teacher: 'проф. Мельников И. П.',
    group: 'Сборная УрФУ',
    room: 'Коворкинг 3 этаж'
  }
};

// Отрисовка недельной сетки расписания
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
      const matchesFilter = !item || appState.scheduleTypeFilter === 'all' || item.type === appState.scheduleTypeFilter;

      if (item && matchesFilter) {
        const personLine = isTeacher
          ? `👥 ${item.group} • 👩‍🏫 ${item.teacher}`
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
            <span class="empty-slot-label">${isTeacher ? 'Свободный слот' : 'Свободное окно'}</span>
          </div>
        `;
      }
    });
  });

  grid.innerHTML = html;
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
    document.getElementById('map-route-text').textContent = `Маршрут из расписания: ${roomName}`;
    showToast(`На карте подсвечена аудитория: ${roomName}`);
  }, 550);
}

// =========================================================================
// 3. НАВИГАЦИЯ С ПРОВЕРКОЙ АВТОРИЗАЦИИ И ПЛАВНЫМ ПЕРЕХОДОМ КАК НА ВИДЕО
// =========================================================================
function navigateTo(screenId, navBtn) {
  // Если пользователь в режиме Абитуриента (не авторизован) и кликает на закрытый раздел —
  // сначала открываем анимированное окно авторизации УрФУ ID!
  if (!appState.isAuthenticated && protectedScreens.includes(screenId)) {
    appState.pendingScreen = screenId;
    const sectionTitles = {
      'schedule': 'Расписание недели',
      'homework': 'Домашние задания и БРС',
      'dashboard': 'Дашборд студента',
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
// 4. РОЛЕВАЯ ЛОГИКА: АБИТУРИЕНТ (ПО УМОЛЧАНИЮ) ↔ СТУДЕНТ ↔ ПЕДАГОГ
// =========================================================================
function requestRoleSwitch(targetRole) {
  if (targetRole === 'abit') {
    logoutToAbiturient();
    return;
  }

  // Если еще не авторизован или хочет сменить роль на Студента / Педагога — требуем вход!
  if (!appState.isAuthenticated || appState.role !== targetRole) {
    selectModalRole(targetRole);
    document.getElementById('auth-modal-prompt').innerHTML =
      targetRole === 'teacher'
        ? '👩‍🏫 Для входа в <strong>Режим Педагога</strong> (проверка ДЗ, ведомость БРС и нагрузка) подтвердите аккаунт преподавателя УрФУ:'
        : '⚡ Для входа в <strong>Режим Студента</strong> (расписание группы, сдача ДЗ, БРС и TeamUp) войдите через УрФУ ID:';
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

  const fio = document.getElementById('reg-fio').value || (role === 'teacher' ? 'Соколов Алексей Викторович' : 'Эльдаров Эльдар Эльдарович');
  const email = document.getElementById('reg-email').value || (role === 'teacher' ? 'a.v.sokolov@urfu.ru' : 'proverka@urfu.ru');
  const inst = document.getElementById('reg-inst').value || 'ИРИТ-РтФ';
  const group = document.getElementById('reg-group').value || (role === 'teacher' ? 'Доцент' : 'РИ-160033');

  applyRoleUI(role, { fio, email, inst, group });
  closeAuthModal();

  const nextScreen = appState.pendingScreen || 'home';
  appState.pendingScreen = null;

  setTimeout(() => {
    if (nextScreen !== 'home') {
      navigateTo(nextScreen);
    }
    showToast(role === 'teacher'
      ? `Добро пожаловать, ${fio}! Открыт режим Педагога 👩‍🏫`
      : `Добро пожаловать, ${fio}! Открыт режим Студента ⚡`);
  }, 220);
}

function logoutToAbiturient() {
  appState.isAuthenticated = false;
  appState.role = 'abit';
  appState.pendingScreen = null;

  applyRoleUI('abit', null);
  navigateTo('home', document.querySelector('[data-screen="home"]'));
  showToast('Вы вернулись в стартовый режим Абитуриента 🎓');
}

// Синхронизация всего контента сайта под активную роль (Абитуриент / Студент / Педагог)
function applyRoleUI(role, userData) {
  // 1. Кнопки ролей в верхней панели
  document.querySelectorAll('.role-pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('role-btn-' + role).classList.add('active');

  document.getElementById('role-btn-student').textContent = appState.isAuthenticated && role === 'student' ? '⚡ Студенту' : '🔒 Студенту';
  document.getElementById('role-btn-teacher').textContent = appState.isAuthenticated && role === 'teacher' ? '👩‍🏫 Педагогу' : '🔒 Педагогу';

  // 2. Иконки замков в левом меню
  document.querySelectorAll('.lock-tag').forEach(tag => {
    tag.style.display = appState.isAuthenticated ? 'none' : 'inline';
  });

  // 3. Блоки на Главной странице
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
      <button class="btn-glass" onclick="document.getElementById('main-navigator-block').scrollIntoView({behavior:'smooth'})">🗺️ Карта корпуса (85%)</button>
    `;
  } else {
    // Общее для авторизованных ролей (Студент и Педагог)
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

    if (role === 'student') {
      teacherRibbon.style.display = 'none';
      document.getElementById('topbar-role-indicator').textContent = `Студент • ${userData.group}`;
      badge.textContent = `⚡ Личное пространство студента • ${userData.inst} (${userData.group})`;
      heading.innerHTML = `Привет, <span class="gold-highlight">${parts[1] || parts[0]}!</span> Твой кампус готов к учёбе.`;
      desc.textContent = 'Следующая пара сегодня в 10:15 в Стеклянном атриуме А-101 (доц. Соколов А. В.). У тебя 2 активных домашних задания и 88.4 балла в рейтинге БРС.';
      ctaGroup.innerHTML = `
        <button class="btn-gold" onclick="navigateTo('schedule', document.querySelector('[data-screen=schedule]'))">🗓️ Расписание недели Пн–Сб</button>
        <button class="btn-primary" onclick="document.getElementById('main-homework-block').scrollIntoView({behavior:'smooth'})">📚 Сдать домашнее задание (2)</button>
        <button class="btn-glass" onclick="navigateTo('dashboard', document.querySelector('[data-screen=dashboard]'))">📊 Зачетка БРС</button>
      `;

      document.getElementById('home-hw-section-title').textContent = '📚 Мои домашние задания и трекер семестра';
      document.querySelectorAll('.teacher-grade-btn').forEach(b => b.style.display = 'none');
      document.querySelectorAll('.student-submit-btn').forEach(b => b.style.display = 'inline-flex');
      document.getElementById('schedule-role-badge').textContent = `РАСПИСАНИЕ НЕДЕЛИ • ГРУППА ${userData.group}`;
      document.getElementById('schedule-main-title').textContent = `Расписание занятий группы ${userData.group}`;
    } else if (role === 'teacher') {
      teacherRibbon.style.display = 'block';
      document.getElementById('topbar-role-indicator').textContent = 'Кабинет Педагога';
      badge.textContent = `👩‍🏫 Цифровое рабочее место преподавателя • ${userData.inst}`;
      heading.innerHTML = `Добро пожаловать, <span class="gold-highlight">${parts[0]} ${parts[1] || ''}!</span>`;
      desc.textContent = 'В вашем расписании на этой неделе 12 академических часов в Новокольцовском и ГУКе. На проверке 4 лабораторные работы студентов потока РИ-160033.';
      ctaGroup.innerHTML = `
        <button class="btn-gold" onclick="navigateTo('schedule', document.querySelector('[data-screen=schedule]'))">🗓️ Расписание моих пар и потоков</button>
        <button class="btn-primary" onclick="document.getElementById('main-homework-block').scrollIntoView({behavior:'smooth'})">✅ Проверить работы в БРС (4)</button>
        <button class="btn-glass" onclick="navigateTo('homework', document.querySelector('[data-screen=homework]'))">+ Выдать задание потоку</button>
      `;

      document.getElementById('home-hw-section-title').textContent = '👩‍🏫 Журнал проверки работ студентов (Ведомость БРС)';
      document.querySelectorAll('.teacher-grade-btn').forEach(b => b.style.display = 'inline-flex');
      document.querySelectorAll('.student-submit-btn').forEach(b => b.style.display = 'none');
      document.getElementById('schedule-role-badge').textContent = `ПРЕПОДАВАТЕЛЬСКОЕ РАСПИСАНИЕ • ${userData.fio.toUpperCase()}`;
      document.getElementById('schedule-main-title').textContent = 'Мои лекции, лабораторные и консультации на неделе';
    }
  }

  renderWeeklySchedule();
}

function handleProfileClick() {
  if (!appState.isAuthenticated) {
    openAuthModal('login');
  } else {
    navigateTo('mentors', document.querySelector('[data-screen="mentors"]'));
  }
}

// =========================================================================
// 5. ПЕРЕКЛЮЧЕНИЕ ПАНОРАМ КАМПУСА И ОСТАЛЬНЫЕ ИНТЕРАКТИВНЫЕ МОДУЛИ
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
  } else if (q.includes('карт') || q.includes('атриум') || q.includes('ауд')) {
    navigateTo('campus-map');
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

function highlightCampusRoute(routeTitle, btn) {
  document.querySelectorAll('.route-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const statusBox = document.getElementById('map-route-status');
  statusBox.style.transform = 'scale(1.04)';
  document.getElementById('map-route-text').textContent = 'Построен маршрут: ' + routeTitle;
  setTimeout(() => { statusBox.style.transform = 'scale(1)'; }, 260);
  showToast('Локация подсвечена на карте: ' + routeTitle);
}

function toggleMapHeight() {
  document.getElementById('main-map-viewport').classList.toggle('tall-map');
}

function reloadCampusMap() {
  const iframe = document.getElementById('campus-navigator-iframe');
  iframe.src = iframe.src;
  showToast('Интерактивная схема корпуса обновлена ✓');
}

function toggleTeacherHwMode() {
  if (!appState.isAuthenticated) {
    requestRoleSwitch('teacher');
    return;
  }
  const nextRole = appState.role === 'teacher' ? 'student' : 'teacher';
  selectModalRole(nextRole);
  performAnimatedLogin('register');
}

function submitHomework(id) {
  const st = document.getElementById('hw-st-' + id);
  const card = st.closest('.hw-item');
  st.className = 'hw-status review';
  st.textContent = '👀 На проверке у педагога';
  card.setAttribute('data-status', 'review');
  document.getElementById('hw-progress-bar').style.width = '88%';
  document.getElementById('hw-progress-label').textContent = '88% выполнено';
  showToast('Домашнее задание отправлено преподавателю на проверку ✓');
}

function gradeHomework(id, pointsText) {
  const st = document.getElementById('hw-st-' + id);
  const card = st.closest('.hw-item');
  st.className = 'hw-status done';
  st.textContent = '✅ Проверено • ' + pointsText;
  card.setAttribute('data-status', 'done');
  document.getElementById('hw-progress-bar').style.width = '96%';
  document.getElementById('hw-progress-label').textContent = '96% выполнено';
  document.getElementById('hw-brs-bonus').textContent = '+32.5 балла в БРС';
  showToast('Оценка выставлена в журнал БРС (' + pointsText + ') ✓');
}

function filterHomework(status, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#main-hw-grid .hw-item').forEach(item => {
    const st = item.getAttribute('data-status');
    item.style.display = (status === 'all' || st === status) ? 'flex' : 'none';
  });
}

function addStudentSubmission() {
  const subj = document.getElementById('new-hw-subject').value;
  const url = document.getElementById('new-hw-url').value;
  const comm = document.getElementById('new-hw-comment').value;
  const list = document.getElementById('extra-hw-list');
  list.innerHTML = `
    <div class="hw-card">
      <div style="display:flex; justify-content:space-between;">
        <span class="badge-soft">${subj}</span>
        <span class="hw-status review">👀 Отправлено только что</span>
      </div>
      <p style="font-size:13.5px;">${comm}</p>
      <span style="font-size:12px; font-weight:700; color:var(--navy);">🔗 ${url}</span>
    </div>
  ` + list.innerHTML;
  showToast('Решение загружено и отправлено преподавателю ✓');
}

function publishTeacherTask() {
  const grp = document.getElementById('teacher-group').value;
  const pts = document.getElementById('teacher-points').value;
  const title = document.getElementById('teacher-task-title').value;
  const list = document.getElementById('extra-hw-list');
  list.innerHTML = `
    <div class="hw-card" style="border-color:var(--gold);">
      <div style="display:flex; justify-content:space-between;">
        <span class="badge-gold">НОВОЕ ЗАДАНИЕ ПЕДАГОГА • ${grp}</span>
        <span class="hw-status urgent">${pts}</span>
      </div>
      <h3 style="font-size:16px;">${title}</h3>
    </div>
  ` + list.innerHTML;
  showToast('Новое домашнее задание опубликовано для потока ' + grp + ' ✓');
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
  if (msg.toLowerCase().includes('распис')) {
    reply = '🗓️ Недельное расписание (Пн–Сб) содержит все пары с указанием времени, ФИО преподавателя и аудитории. Нажмите на вкладку «Расписание недели» в левом меню!';
  } else if (msg.toLowerCase().includes('поступ')) {
    reply = '🎓 Для поступления в УрФУ выберите до 5 направлений в калькуляторе ЕГЭ, подайте документы онлайн с 20 июня и отслеживайте конкурсные списки.';
  } else if (msg.toLowerCase().includes('истори')) {
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