// Фоновые фотографии кампуса из папки src/ для каждого из 11 экранов
const ambientPhotosByScreen = {
  'home': 'src/DIP_8550.jpg',
  'homework': 'src/6571bc0a21495630507812.jpg',
  'programs': 'src/nov_kampus_ijun_24.jpg',
  'ai-landing': 'src/DIP_8550.jpg',
  'dashboard': 'src/oblozhka.jpg',
  'teamup': 'src/6571bc0a21495630507812.jpg',
  'mentors': 'src/6571bc0a21495630507812.jpg',
  'events': 'src/20240604_kampus.jpg',
  'about': 'src/nov_kampus_ijun_24.jpg',
  'campus-map': 'src/oblozhka.jpg',
  'auth-profile': 'src/oblozhka.jpg'
};

// Слайды главного экрана для кинематографичного переключения (как в видео)
const heroEditorialSlides = [
  {
    src: 'src/oblozhka.jpg',
    label: 'ИРИТ-РтФ • Зеркальные стелы и фасад нового кампуса',
    heading: 'Добро пожаловать в <span class="gold-highlight">сообщество</span> нового кампуса!'
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

// 1. БЕСШОВНЫЙ КИНЕМАТОГРАФИЧНЫЙ ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ (КАК НА ВИДЕО)
function navigateTo(screenId, navBtn) {
  const current = document.querySelector('.screen.active');
  const target = document.getElementById('screen-' + screenId);
  if (!target || current === target) return;

  // Если предыдущая анимация еще завершается, аккуратно очищаем классы
  if (activeTransitionTimer) {
    clearTimeout(activeTransitionTimer);
    document.querySelectorAll('.screen.is-leaving').forEach(el => {
      el.classList.remove('is-leaving', 'visible');
    });
  }

  // Обновляем активный пункт с бежевым вырезом в боковом меню
  document.querySelectorAll('.sidebar-menu .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = navBtn || document.querySelector(`.sidebar-menu [data-screen="${screenId}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Плавный оптический зум и смена фоновой фотографии кампуса
  const ambientLayer = document.getElementById('ambient-photo-layer');
  if (ambientLayer && ambientPhotosByScreen[screenId]) {
    ambientLayer.classList.add('zooming');
    ambientLayer.style.backgroundImage = `url('${ambientPhotosByScreen[screenId]}')`;
    setTimeout(() => ambientLayer.classList.remove('zooming'), 750);
  }

  // Плавно поднимаем скролл наверх
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Одновременное существование уходящего и входящего экранов:
  // уходящий заголовок вырастает и уплывает вправо, а новый проявляется из оптического боке
  if (current) {
    current.classList.remove('active', 'visible');
    current.classList.add('is-leaving');
  }

  target.classList.remove('is-leaving', 'visible');
  target.classList.add('active', 'is-entering');

  // Запускаем плавную фокусировку и въезд текста нового экрана в следующем кадре
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

// 2. ПЕРЕКЛЮЧЕНИЕ ПАНОРАМ КАМПУСА В ВИТРИНЕ HERO С ЭФФЕКТОМ УПЛЫВАЮЩЕГО КРУПНОГО ТЕКСТА И БОКЕ (КАК В ВИДЕО)
function changeHeroPhoto(slideIndex, btn) {
  currentHeroSlideIndex = slideIndex;
  const slide = heroEditorialSlides[slideIndex];
  if (!slide) return;

  const img = document.getElementById('hero-showcase-img');
  const label = document.getElementById('hero-photo-label');
  const ambient = document.getElementById('hero-ambient-bg');
  const heading = document.getElementById('hero-main-heading');

  // Заголовок увеличивается и уплывает вправо, как "THE ART OF LIFE" на 00:01
  if (heading) {
    heading.classList.remove('hero-editorial-zoom-in');
    heading.classList.add('hero-editorial-zoom-out');
  }

  // Фотография уходит в мягкий расфокус и зум
  img.style.opacity = '0.28';
  img.style.transform = 'scale(1.18)';
  img.style.filter = 'blur(14px)';

  setTimeout(() => {
    img.src = slide.src;
    label.textContent = slide.label;
    if (ambient) ambient.style.backgroundImage = `url('${slide.src}')`;

    // Плавный возврат фотографии из боке в резкость (как на 00:04 -> 00:05)
    img.classList.remove('hero-img-bokeh-transition');
    void img.offsetWidth;
    img.classList.add('hero-img-bokeh-transition');
    img.style.opacity = '';
    img.style.transform = '';
    img.style.filter = '';

    // Новый заголовок плавно выезжает слева
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

// Фиксация раскрытого состояния бокового сайдбара
function toggleSidebarPin() {
  const sb = document.getElementById('smart-sidebar');
  sb.classList.toggle('pinned');
  const pinned = sb.classList.contains('pinned');
  showToast(pinned ? 'Боковая навигация закреплена в раскрытом виде 📌' : 'Включен режим авто-раскрытия меню при наведении');
}

// Быстрый поиск из верхней компактной панели
function handleQuickSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;
  if (q.includes('дз') || q.includes('задан') || q.includes('лаб')) {
    navigateTo('homework');
  } else if (q.includes('егэ') || q.includes('програм') || q.includes('балл')) {
    navigateTo('programs');
  } else if (q.includes('карт') || q.includes('атриум') || q.includes('ауд')) {
    navigateTo('campus-map');
  } else if (q.includes('команд') || q.includes('team')) {
    navigateTo('teamup');
  } else {
    navigateTo('programs');
    showToast('Результаты поиска по запросу: «' + query + '»');
  }
}

// 3. АНИМИРОВАННОЕ ОКНО АВТОРИЗАЦИИ И РЕГИСТРАЦИИ УрФУ ID
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

function fillDemoUser(fio, email, inst, group) {
  document.getElementById('reg-fio').value = fio;
  document.getElementById('reg-email').value = email;
  document.getElementById('reg-inst').value = inst;
  document.getElementById('reg-group').value = group;
  showToast('Данные профиля ' + fio + ' подставлены ✓');
}

function performAnimatedLogin(mode) {
  let fio = 'Эльдаров Эльдар Эльдарович';
  let email = 'proverka@urfu.ru';
  let inst = 'ИРИТ-РтФ';
  let group = 'РИ-160033';

  if (mode === 'register') {
    fio = document.getElementById('reg-fio').value || fio;
    email = document.getElementById('reg-email').value || email;
    inst = document.getElementById('reg-inst').value || inst;
    group = document.getElementById('reg-group').value || group;
  }

  const parts = fio.trim().split(/\s+/);
  const initials = ((parts[0] ? parts[0][0] : 'У') + (parts[1] ? parts[1][0] : 'С')).toUpperCase();

  document.getElementById('sidebar-avatar-initials').textContent = initials;
  document.getElementById('sidebar-user-name').textContent = parts.slice(0, 2).join(' ');
  document.getElementById('sidebar-user-mail').textContent = `${email} • ${group}`;
  document.getElementById('dashboard-user-greeting').textContent = 'Привет, ' + fio;
  document.getElementById('dashboard-user-sub').textContent = `${inst}, группа ${group} • Средний балл БРС: 88.4 • Кампус Новокольцовский`;
  document.getElementById('header-auth-btn').textContent = '👤 ' + parts[0];

  closeAuthModal();
  setTimeout(() => {
    navigateTo('dashboard');
    showToast('Добро пожаловать в Campus Connect, ' + fio + '!');
  }, 220);
}

// 4. УПРАВЛЕНИЕ МАСШТАБОМ И МАРШРУТАМИ АНИМИРОВАННОЙ КАРТЫ КОРПУСА
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

// 5. ПЕРЕКЛЮЧЕНИЕ РОЛЕЙ: СТУДЕНТУ / ПЕДАГОГУ / АБИТУРИЕНТУ И ДОМАШНИЕ ЗАДАНИЯ
let teacherMode = false;

function setGlobalRole(role) {
  document.querySelectorAll('.role-pill-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('role-btn-' + role).classList.add('active');

  const ribbon = document.getElementById('teacher-quick-ribbon');
  const badge = document.getElementById('hero-role-badge');
  const desc = document.getElementById('hero-main-desc');

  if (role === 'teacher') {
    ribbon.style.display = 'block';
    badge.textContent = '👩‍🏫 Цифровое рабочее место преподавателя и научного руководителя УрФУ';
    desc.textContent = 'Удобный интерфейс для педагогов: проверка домашних заданий в один клик, синхронизация с ведомостью БРС, расписание потоковых аудиторий и руководство командами.';
    if (!teacherMode) toggleTeacherHwMode(true);
    showToast('Включен режим педагога: доступна быстрая оценка ДЗ и журнал БРС');
  } else if (role === 'abit') {
    ribbon.style.display = 'none';
    badge.textContent = '🎓 Абитуриенту 2026 • 9 600+ бюджетных мест в УрФУ';
    desc.textContent = 'Подбери программу по баллам ЕГЭ, соверши виртуальный тур по стеклянному кампусу в Новокольцовском и подай документы онлайн.';
    if (teacherMode) toggleTeacherHwMode(false);
  } else {
    ribbon.style.display = 'none';
    badge.textContent = '✨ Пространство света, стекла и технологий • Новокольцовский';
    desc.textContent = 'Люди. Идеи. События. В одном кампусе. Наводи курсор на левую панель для плавного перехода по 11 разделам экосистемы и сдавай домашние задания в БРС.';
    if (teacherMode) toggleTeacherHwMode(false);
  }
}

function toggleTeacherHwMode(forceState) {
  teacherMode = typeof forceState === 'boolean' ? forceState : !teacherMode;
  const btn = document.getElementById('hw-mode-toggle-btn');
  if (btn) {
    btn.classList.toggle('active', teacherMode);
    btn.textContent = teacherMode ? '👩‍🏫 Режим педагога: ВКЛЮЧЕН' : '👩‍🏫 Режим проверки (Педагогу)';
  }
  document.querySelectorAll('.teacher-grade-btn').forEach(b => {
    b.style.display = teacherMode ? 'inline-flex' : 'none';
  });
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

// 6. ЛАЙТБОКС, КАЛЬКУЛЯТОР ЕГЭ, TEAMUP И GIGACHAT
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

  let reply = 'Используй боковое раскрывающееся меню слева для плавного перехода по всем 11 страницам или нажми на золотую кнопку со стрелкой на витрине кампуса!';
  if (msg.toLowerCase().includes('где я')) {
    reply = '🌟 Привет! Ты находишься в системе <strong>Campus Connect Уральского федерального университета (УрФУ)</strong>. Здесь можно узнать информацию о вузе, учебных подразделениях, мероприятиях, общежитиях и многом другом.';
  } else if (msg.toLowerCase().includes('дз') || msg.toLowerCase().includes('дедлайн')) {
    reply = '📚 Ближайшие дедлайны: Лабораторная №4 по Прикладному ИИ (до 30 октября, +8 БРС) и Спринт 2 по Проектному практикуму (до 1 ноября, +12 БРС).';
  } else if (msg.toLowerCase().includes('истори')) {
    reply = '🏛️ <strong>История УрФУ:</strong> В 1920 году основан Уральский государственный университет. В 2009–2010 годах УГТУ-УПИ и УрГУ объединились в УрФУ, а сегодня открыт новый кампус в Новокольцовском!';
  }

  setTimeout(() => {
    box.innerHTML += `<div class="msg-bot">${reply}</div>`;
    box.scrollTop = box.scrollHeight;
  }, 220);
}