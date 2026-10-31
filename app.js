// =========================================================================
// 1. ГЛОБАЛЬНОЕ СОСТОЯНИЕ РОЛИ, ПРОФИЛЯ, ДЗ, КАРТЫ И АВТОРИЗАЦИИ
// =========================================================================
const appState = {
  role: 'abit',            // 'abit' (по умолчанию) | 'student' | 'teacher'
  isAuthenticated: false,  // false для абитуриента, true после входа в УрФУ ID
  selectedModalRole: 'student',
  pendingScreen: null,     // куда перенаправить после успешного входа
  scheduleWeek: 'even',    // 'even' | 'odd'
  scheduleTypeFilter: 'all',
  teacherOnlyMyClasses: true,
  // Состояние встроенного навигатора корпуса
  mapMode: 'native',       // 'native' (интерактивный граф этажей) | 'iframe' (внешний сайт Vercel)
  currentFloor: 1,         // 1 | 2 | 3 | 4
  activeCategory: 'all',   // 'all' | 'coworking' | 'lecture' | 'labs' | 'dean' | 'wifi' | 'cafe'
  routeFrom: 'ENTRANCE',   // ID стартовой точки
  routeTo: 'A-101',        // ID конечной точки
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
      status: 'urgent',
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
      comment: 'Реализован алгоритм Дейкстры для графа переходов корпуса.'
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
  brsSubjects: [
    { key: 'ai', name: 'Прикладной ИИ и ML', teacher: 'доц. Соколов А. В.', score: 83.2, max: 100 },
    { key: 'project', name: 'Проектный практикум', teacher: 'В. В. Виткин', score: 89.5, max: 100 },
    { key: 'algo', name: 'Алгоритмы и структуры данных', teacher: 'проф. Мельников И. П.', score: 84.6, max: 100 },
    { key: 'db', name: 'Архитектура баз данных и SQL', teacher: 'ст. преп. Орлова Е. С.', score: 94.0, max: 100 }
  ]
};

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
// 2. АРХИТЕКТУРНАЯ БАЗА ЭТАЖЕЙ И ГРАФ МАРШРУТОВ (ДВИЖОК НАВИГАТОРА)
// =========================================================================
// Координатная сетка SVG: 1000 x 520.
// Коридорная магистраль на каждом этаже проходит по y = 260 (x от 150 до 850)
// и центральному вертикальному холлу x = 500.
const campusRoomsDB = {
  // --- 1 ЭТАЖ ---
  'ENTRANCE': {
    id: 'ENTRANCE', code: 'ВХОД', name: 'Главный вход (Турникеты УрФУ ID)',
    floor: 1, category: 'service', icon: '🚪',
    rect: { x: 430, y: 405, w: 140, h: 85 }, door: { x: 500, y: 405 },
    wifi: 'UrFU-Guest / UrFU-Campus (5 ГГц)',
    desc: 'Центральная входная группа со стороны площади флагов, пост охраны и турникеты.'
  },
  'A-101': {
    id: 'A-101', code: 'А-101', name: 'Стеклянный атриум А-101 (Главный лекторий)',
    floor: 1, category: 'lecture', icon: '✨',
    rect: { x: 350, y: 45, w: 300, h: 165 }, door: { x: 500, y: 210 },
    wifi: 'UrFU-Campus (Wi-Fi 6 • до 850 Мбит/с)',
    desc: 'Главный амфитеатр со световым куполом на 450 мест для потоковых лекций и форумов.'
  },
  'I-104': {
    id: 'I-104', code: 'И-104', name: 'Коворкинг 1 этажа «Атриум-Лаунж»',
    floor: 1, category: 'coworking', icon: '💻',
    rect: { x: 80, y: 65, w: 230, h: 145 }, door: { x: 195, y: 210 },
    wifi: 'UrFU-Campus / eduroam (Wi-Fi 6)',
    desc: 'Открытое пространство с мягкими пуфами, розетками и столами для быстрой работы между парами.'
  },
  'I-108': {
    id: 'I-108', code: 'И-108', name: 'Приёмная комиссия и Студенческий офис',
    floor: 1, category: 'dean', icon: '🏛️',
    rect: { x: 690, y: 65, w: 230, h: 145 }, door: { x: 805, y: 210 },
    wifi: 'UrFU-Guest / UrFU-Campus',
    desc: 'Выдача студенческих билетов, справок об обучении и консультации абитуриентов.'
  },
  'CAFE-1': {
    id: 'CAFE-1', code: 'КАФЕ', name: 'Кампусная столовая и Кофе-поинт',
    floor: 1, category: 'cafe', icon: '☕',
    rect: { x: 80, y: 315, w: 230, h: 145 }, door: { x: 195, y: 315 },
    wifi: 'UrFU-Guest / UrFU-Campus',
    desc: 'Горячие обеды, спешелти-кофе и выпечка. 120 посадочных мест.'
  },
  'LIB-1': {
    id: 'LIB-1', code: 'И-112', name: 'Гардероб и Зона локеров И-112',
    floor: 1, category: 'service', icon: '🧥',
    rect: { x: 690, y: 315, w: 230, h: 145 }, door: { x: 805, y: 315 },
    wifi: 'UrFU-Campus',
    desc: 'Умные ячейки хранения вещей по пропуску УрФУ и просторный гардероб.'
  },

  // --- 2 ЭТАЖ ---
  'I-204': {
    id: 'I-204', code: 'И-204', name: 'Деканат ИРИТ-РтФ и преподавательская И-204',
    floor: 2, category: 'dean', icon: '🏛️',
    rect: { x: 80, y: 65, w: 250, h: 145 }, door: { x: 205, y: 210 },
    wifi: 'UrFU-Campus (5 ГГц)',
    desc: 'Дирекция института, кураторы курсов, ведомости БРС и защита лабораторных работ.'
  },
  'I-210': {
    id: 'I-210', code: 'И-210', name: 'Коворкинг проектных команд И-210',
    floor: 2, category: 'coworking', icon: '💻',
    rect: { x: 370, y: 65, w: 260, h: 145 }, door: { x: 500, y: 210 },
    wifi: 'UrFU-Campus (Wi-Fi 6 • Макс. сигнал)',
    desc: 'Проектный коворкинг с маркерными досками и экранами для командных созвонов.'
  },
  'I-215': {
    id: 'I-215', code: 'И-215', name: 'Поточная лекционная аудитория И-215',
    floor: 2, category: 'lecture', icon: '🎓',
    rect: { x: 670, y: 65, w: 250, h: 145 }, door: { x: 795, y: 210 },
    wifi: 'UrFU-Campus (5 ГГц)',
    desc: 'Аудитория-амфитеатр на 150 человек с двойным проектором и системой звукозаписи лекций.'
  },
  'M-324': {
    id: 'M-324', code: 'М-324', name: 'Аудитория кибербезопасности и ВКС М-324',
    floor: 2, category: 'lecture', icon: '🛡️',
    rect: { x: 80, y: 315, w: 250, h: 145 }, door: { x: 205, y: 315 },
    wifi: 'UrFU-Campus + Выделенная линия',
    desc: 'Зал для лекций по информационной безопасности и телемостов с базовыми кафедрами.'
  },
  'I-220': {
    id: 'I-220', code: 'И-220', name: 'Союз студентов и Служба ИТ-поддержки',
    floor: 2, category: 'dean', icon: '🤝',
    rect: { x: 670, y: 315, w: 250, h: 145 }, door: { x: 795, y: 315 },
    wifi: 'UrFU-Campus / eduroam',
    desc: 'Помощь с настройкой корпоративного Wi-Fi, личного кабинета и студенческих инициатив.'
  },

  // --- 3 ЭТАЖ ---
  'COWORK-3': {
    id: 'COWORK-3', code: 'КОВОРКИНГ 3 ЭТ.', name: 'Панорамный коворкинг 3 этаж (Зона TeamUp)',
    floor: 3, category: 'coworking', icon: '💻',
    rect: { x: 80, y: 55, w: 410, h: 155 }, door: { x: 285, y: 210 },
    wifi: 'UrFU-Campus (Wi-Fi 6 • 2 роутера • 950 Мбит/с)',
    desc: 'Главный панорамный коворкинг кампуса 24/7 для команд проектного практикума и хакатонов.'
  },
  'COWORK-3B': {
    id: 'COWORK-3B', code: 'Б-304', name: 'Тихий коворкинг и капсулы для звонков Б-304',
    floor: 3, category: 'coworking', icon: '🎧',
    rect: { x: 530, y: 55, w: 390, h: 155 }, door: { x: 725, y: 210 },
    wifi: 'UrFU-Campus / eduroam (Wi-Fi 6)',
    desc: 'Зона тишины с акустическими кабинами для индивидуальной работы и онлайн-собеседований.'
  },
  'I-308': {
    id: 'I-308', code: 'И-308', name: 'Ауд. И-308 (Базы данных и SQL • Комп. класс)',
    floor: 3, category: 'labs', icon: '🗄️',
    rect: { x: 80, y: 315, w: 260, h: 145 }, door: { x: 210, y: 315 },
    wifi: 'UrFU-Campus + Гигабитный LAN',
    desc: 'Терминальный класс на 32 рабочих места с предустановленными PostgreSQL, Docker и DBeaver.'
  },
  'I-312': {
    id: 'I-312', code: 'И-312', name: 'Центр менторов и питч-зал И-312',
    floor: 3, category: 'lecture', icon: '🎤',
    rect: { x: 660, y: 315, w: 260, h: 145 }, door: { x: 790, y: 315 },
    wifi: 'UrFU-Campus (5 ГГц)',
    desc: 'Зал для демо-дней проектного практикума, защит перед индустриальными партнерами и встреч с менторами.'
  },

  // --- 4 ЭТАЖ ---
  'I-420': {
    id: 'I-420', code: 'И-420', name: 'Лаборатория Прикладного ИИ и ML (И-420)',
    floor: 4, category: 'labs', icon: '🔬',
    rect: { x: 80, y: 60, w: 390, h: 150 }, door: { x: 275, y: 210 },
    wifi: 'UrFU-Campus (Wi-Fi 6 + 10G LAN к GPU-кластеру)',
    desc: 'Флагманская лаборатория машинного обучения, LLM и разработки микросервисов на FastAPI.'
  },
  'I-415': {
    id: 'I-415', code: 'И-415', name: 'Лаборатория робототехники и Computer Vision И-415',
    floor: 4, category: 'labs', icon: '🤖',
    rect: { x: 530, y: 60, w: 390, h: 150 }, door: { x: 725, y: 210 },
    wifi: 'UrFU-Campus (5 ГГц)',
    desc: 'Полигон тестирования автономных роботов, лидаров и систем компьютерного зрения.'
  },
  'COWORK-4': {
    id: 'COWORK-4', code: 'И-410', name: 'R&D Коворкинг исследователей и магистрантов И-410',
    floor: 4, category: 'coworking', icon: '💻',
    rect: { x: 80, y: 315, w: 260, h: 145 }, door: { x: 210, y: 315 },
    wifi: 'eduroam / UrFU-Campus',
    desc: 'Научный коворкинг для подготовки ВКР, статей и работы над грантовыми проектами.'
  },
  'I-405': {
    id: 'I-405', code: 'И-405', name: 'Серверный центр и GPU-кластер УрФУ И-405',
    floor: 4, category: 'labs', icon: '🖧',
    rect: { x: 660, y: 315, w: 260, h: 145 }, door: { x: 790, y: 315 },
    wifi: 'UrFU-Campus (Технический сегмент)',
    desc: 'Вычислительное ядро института с серверными стойками для обучения глубоких нейросетей.'
  }
};

// Роутеры Wi-Fi 6 на каждом этаже для подсветки режима "Точки Wi-Fi"
const wifiNodesByFloor = {
  1: [{ x: 260, y: 260, label: 'Wi-Fi 6 Зап.' }, { x: 500, y: 150, label: 'Wi-Fi 6 Атриум' }, { x: 740, y: 260, label: 'Wi-Fi 6 Вост.' }],
  2: [{ x: 250, y: 260, label: 'Wi-Fi 6 Деканат' }, { x: 500, y: 260, label: 'Wi-Fi 6 Холл 2 эт.' }, { x: 750, y: 260, label: 'Wi-Fi 6 Лекторий' }],
  3: [{ x: 280, y: 140, label: 'Wi-Fi 6 Коворкинг А' }, { x: 500, y: 260, label: 'Wi-Fi 6 Холл 3 эт.' }, { x: 720, y: 140, label: 'Wi-Fi 6 Коворкинг Б' }],
  4: [{ x: 275, y: 140, label: 'Wi-Fi 6 Лаб. ИИ' }, { x: 500, y: 260, label: 'Wi-Fi 6 Холл 4 эт.' }, { x: 725, y: 140, label: 'Wi-Fi 6 Робототехника' }]
};

// Построение полного графа здания (коридоры + двери аудиторий + межэтажные лестницы/лифты)
function buildCampusNavigationGraph() {
  const nodes = {};
  const edges = {};

  function addNode(id, floor, x, y, label = '') {
    nodes[id] = { id, floor, x, y, label };
    if (!edges[id]) edges[id] = [];
  }

  function addEdge(a, b, weightOverride = null) {
    if (!nodes[a] || !nodes[b]) return;
    const dx = nodes[a].x - nodes[b].x;
    const dy = nodes[a].y - nodes[b].y;
    const dist = weightOverride !== null ? weightOverride : Math.hypot(dx, dy);
    edges[a].push({ to: b, weight: dist });
    edges[b].push({ to: a, weight: dist });
  }

  // На каждом этаже создаем коридорные узлы и узел лестницы/лифта в центре (x=500, y=340)
  for (let f = 1; f <= 4; f++) {
    addNode(`STAIRS_${f}`, f, 500, 345, `Лестница / Лифт (${f} эт.)`);
    addNode(`H_${f}_CENTER`, f, 500, 260);
    addNode(`H_${f}_L1`, f, 340, 260);
    addNode(`H_${f}_L2`, f, 200, 260);
    addNode(`H_${f}_R1`, f, 660, 260);
    addNode(`H_${f}_R2`, f, 800, 260);

    addEdge(`STAIRS_${f}`, `H_${f}_CENTER`);
    addEdge(`H_${f}_CENTER`, `H_${f}_L1`);
    addEdge(`H_${f}_L1`, `H_${f}_L2`);
    addEdge(`H_${f}_CENTER`, `H_${f}_R1`);
    addEdge(`H_${f}_R1`, `H_${f}_R2`);
  }

  // Соединяем лестницы и лифты между этажами
  for (let f = 1; f < 4; f++) {
    addEdge(`STAIRS_${f}`, `STAIRS_${f + 1}`, 120);
  }

  // Подключаем каждую аудиторию через её дверь к ближайшему узлу коридора на том же этаже
  Object.values(campusRoomsDB).forEach(room => {
    addNode(room.id, room.floor, room.door.x, room.door.y, room.name);

    // Для главного входа на 1 этаже связываем напрямую с центральным узлом и лестницей
    if (room.id === 'ENTRANCE') {
      addEdge('ENTRANCE', 'STAIRS_1');
      addEdge('ENTRANCE', 'H_1_CENTER');
      return;
    }

    // Ищем ближайший коридорный узел на этаже аудитории
    const floorHallIds = [`H_${room.floor}_CENTER`, `H_${room.floor}_L1`, `H_${room.floor}_L2`, `H_${room.floor}_R1`, `H_${room.floor}_R2`];
    let nearestHall = floorHallIds[0];
    let bestDist = Infinity;
    floorHallIds.forEach(hId => {
      const d = Math.abs(nodes[hId].x - room.door.x);
      if (d < bestDist) {
        bestDist = d;
        nearestHall = hId;
      }
    });

    // Создаём промежуточную точку коридора ровно напротив двери (y = 260), чтобы линии шли строго под 90 градусов!
    const doorHallNodeId = `DOOR_HALL_${room.id}`;
    addNode(doorHallNodeId, room.floor, room.door.x, 260);
    addEdge(room.id, doorHallNodeId);
    addEdge(doorHallNodeId, nearestHall);
  });

  return { nodes, edges };
}

const campusGraph = buildCampusNavigationGraph();

// Алгоритм Дейкстры для поиска кратчайшего пути между любыми двумя точками кампуса
function findShortestCampusPath(startId, endId) {
  const { nodes, edges } = campusGraph;
  if (!nodes[startId] || !nodes[endId]) return null;

  const dist = {};
  const prev = {};
  const visited = new Set();

  Object.keys(nodes).forEach(k => { dist[k] = Infinity; });
  dist[startId] = 0;

  while (true) {
    let u = null;
    let best = Infinity;
    for (const k in dist) {
      if (!visited.has(k) && dist[k] < best) {
        best = dist[k];
        u = k;
      }
    }
    if (u === null || u === endId) break;
    visited.add(u);

    (edges[u] || []).forEach(edge => {
      if (visited.has(edge.to)) return;
      const alt = dist[u] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
      }
    });
  }

  if (dist[endId] === Infinity) return null;

  const path = [];
  let curr = endId;
  while (curr) {
    path.unshift(nodes[curr]);
    curr = prev[curr];
  }

  return {
    path,
    totalDistanceMeters: Math.max(12, Math.round(dist[endId] * 0.18)),
    estimatedMinutes: Math.max(1, Math.round(dist[endId] / 340))
  };
}

// =========================================================================
// 3. ОТРИСОВКА ИНТЕРАКТИВНОЙ КАРТЫ ЭТАЖЕЙ, КАТЕГОРИЙ И МАРШРУТОВ
// =========================================================================
function renderInteractiveCampusMap() {
  const floor = appState.currentFloor;
  const fromId = appState.routeFrom;
  const toId = appState.routeTo;
  const activeCat = appState.activeCategory;

  // Вычисляем полный маршрут по графу
  const routeResult = findShortestCampusPath(fromId, toId);
  const targetRoom = campusRoomsDB[toId] || campusRoomsDB['A-101'];
  const startRoom = campusRoomsDB[fromId] || campusRoomsDB['ENTRANCE'];

  // Обновляем селекты Откуда / Куда, если они есть на странице
  const selFrom = document.getElementById('map-select-from');
  const selTo = document.getElementById('map-select-to');
  if (selFrom && selFrom.value !== fromId) selFrom.value = fromId;
  if (selTo && selTo.value !== toId) selTo.value = toId;

  // Обновляем кнопки этажей (1..4)
  document.querySelectorAll('.floor-switch-btn').forEach(btn => {
    const f = parseInt(btn.getAttribute('data-floor'), 10);
    btn.classList.toggle('active', f === floor);
  });

  // Собираем комнаты текущего этажа
  const roomsOnFloor = Object.values(campusRoomsDB).filter(r => r.floor === floor);

  // Строим SVG-схему текущего этажа
  let svgHtml = `
    <defs>
      <pattern id="ArchGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(31,42,68,0.06)" stroke-width="1"/>
      </pattern>
      <filter id="GoldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#C6A75E" flood-opacity="0.55"/>
      </filter>
    </defs>

    <!-- Подложка и архитектурная сетка корпуса -->
    <rect x="0" y="0" width="1000" height="520" fill="#FAF7F2"/>
    <rect x="0" y="0" width="1000" height="520" fill="url(#ArchGrid)"/>

    <!-- Внешний контур корпуса ИРИТ-РтФ -->
    <rect x="55" y="35" width="890" height="455" rx="28" fill="rgba(232,220,200,0.38)" stroke="#1F2A44" stroke-width="3.5"/>

    <!-- Главная коридорная галерея этажа -->
    <rect x="75" y="210" width="850" height="105" rx="14" fill="#FFFFFF" stroke="rgba(31,42,68,0.15)" stroke-width="1.5"/>
    <text x="500" y="254" text-anchor="middle" fill="rgba(82,96,122,0.45)" font-size="11" font-weight="800" letter-spacing="2">ПЕШЕХОДНАЯ ГАЛЕРЕЯ И ХОЛЛ ${floor} ЭТАЖА</text>

    <!-- Центральный лестнично-лифтовой узел -->
    <rect x="435" y="315" width="130" height="72" rx="14" fill="rgba(31,42,68,0.09)" stroke="#1F2A44" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="500" y="346" text-anchor="middle" fill="#1F2A44" font-size="11" font-weight="800">🛗 ЛИФТЫ / ЛЕСТНИЦА</text>
    <text x="500" y="364" text-anchor="middle" fill="#52607A" font-size="10" font-weight="700">Переход 1–4 этаж</text>
  `;

  // Отрисовка всех помещений на текущем этаже
  roomsOnFloor.forEach(room => {
    const isStart = room.id === fromId;
    const isTarget = room.id === toId;
    const isCatMatch = activeCat !== 'all' && room.category === activeCat;

    let fill = 'rgba(255,255,255,0.92)';
    let stroke = 'rgba(31,42,68,0.28)';
    let strokeWidth = '2';
    let filterAttr = '';

    if (room.category === 'coworking') fill = 'rgba(232,220,200,0.65)';
    if (room.category === 'lecture') fill = 'rgba(255,255,255,0.96)';
    if (room.category === 'labs') fill = 'rgba(31,42,68,0.06)';

    if (isCatMatch) {
      fill = 'rgba(223,192,119,0.38)';
      stroke = '#C6A75E';
      strokeWidth = '3.5';
      filterAttr = 'filter="url(#GoldGlow)"';
    }
    if (isStart) {
      fill = 'rgba(30,122,83,0.16)';
      stroke = '#1E7A53';
      strokeWidth = '3.5';
    }
    if (isTarget) {
      fill = 'rgba(198,167,94,0.35)';
      stroke = '#1F2A44';
      strokeWidth = '4';
      filterAttr = 'filter="url(#GoldGlow)"';
    }

    const cx = room.rect.x + room.rect.w / 2;
    const cy = room.rect.y + room.rect.h / 2;

    svgHtml += `
      <g class="svg-room-node" style="cursor:pointer;" onclick="selectRoomOnCanvas('${room.id}')">
        <rect x="${room.rect.x}" y="${room.rect.y}" width="${room.rect.w}" height="${room.rect.h}" rx="16"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${filterAttr} />
        <!-- Дверной проём -->
        <circle cx="${room.door.x}" cy="${room.door.y}" r="5" fill="#C6A75E" stroke="#1F2A44" stroke-width="1.5"/>
        <!-- Код и название аудитории -->
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="#1F2A44" font-family="Unbounded, sans-serif" font-size="13" font-weight="800">
          ${room.icon} ${room.code}
        </text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#52607A" font-size="11.5" font-weight="600">
          ${truncateText(room.name, 34)}
        </text>
        ${(isCatMatch || isTarget) ? `
          <rect x="${cx - 58}" y="${cy + 24}" width="116" height="20" rx="10" fill="#1F2A44"/>
          <text x="${cx}" y="${cy + 38}" text-anchor="middle" fill="#DFC077" font-size="10" font-weight="800">
            ${isTarget ? '🎯 ТОЧКА НАЗНАЧЕНИЯ' : '✨ ВЫДЕЛЕНО'}
          </text>
        ` : ''}
      </g>
    `;
  });

  // Если выбрана категория Wi-Fi (или всегда мягко) — показываем точки доступа Wi-Fi 6 на этаже
  const floorWifi = wifiNodesByFloor[floor] || [];
  floorWifi.forEach(w => {
    const isWifiHighlight = activeCat === 'wifi';
    svgHtml += `
      <g style="cursor:pointer;" onclick="showToast('Точка доступа ${w.label}: сеть UrFU-Campus (Wi-Fi 6, 5 ГГц) работает отлично 📶')">
        <circle cx="${w.x}" cy="${w.y}" r="${isWifiHighlight ? 28 : 14}" fill="rgba(198,167,94,${isWifiHighlight ? '0.28' : '0.12'})" stroke="#C6A75E" stroke-width="${isWifiHighlight ? 2 : 1}" stroke-dasharray="3 2"/>
        <circle cx="${w.x}" cy="${w.y}" r="8" fill="#1F2A44" stroke="#C6A75E" stroke-width="2"/>
        <text x="${w.x}" y="${w.y + 3}" text-anchor="middle" fill="#DFC077" font-size="9" font-weight="800">📶</text>
        ${isWifiHighlight ? `<text x="${w.x}" y="${w.y - 16}" text-anchor="middle" fill="#1F2A44" font-size="10.5" font-weight="800">${w.label}</text>` : ''}
      </g>
    `;
  });

  // Отрисовка линии маршрута для текущего этажа
  if (routeResult && routeResult.path.length > 1) {
    const floorNodes = routeResult.path.filter(n => n.floor === floor);
    if (floorNodes.length >= 2) {
      const pts = floorNodes.map(n => `${n.x},${n.y}`).join(' ');
      svgHtml += `
        <!-- Подложка и пунктир активного маршрута -->
        <polyline points="${pts}" fill="none" stroke="rgba(31,42,68,0.22)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="${pts}" fill="none" stroke="#C6A75E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 6"/>
      `;
      // Маркеры начала и конца сегмента на этом этаже
      const firstN = floorNodes[0];
      const lastN = floorNodes[floorNodes.length - 1];
      svgHtml += `
        <circle cx="${firstN.x}" cy="${firstN.y}" r="9" fill="#1E7A53" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="${lastN.x}" cy="${lastN.y}" r="10" fill="#1F2A44" stroke="#DFC077" stroke-width="3"/>
      `;
    }
  }

  // Вставляем сгенерированный чертеж в оба контейнера (на Главной и на экране 3D-карты)
  const mainSvg = document.getElementById('native-campus-svg');
  const fullSvg = document.getElementById('native-campus-svg-full');
  if (mainSvg) mainSvg.innerHTML = svgHtml;
  if (fullSvg) fullSvg.innerHTML = svgHtml;

  // Обновляем пошаговую навигационную цепочку этажей и инфо-панель
  updateRouteStepsAndHud(routeResult, startRoom, targetRoom);
}

function truncateText(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

function updateRouteStepsAndHud(routeResult, startRoom, targetRoom) {
  const statusText = document.getElementById('map-route-text');
  const stepsBox = document.getElementById('map-floor-steps-bar');
  const poiTitle = document.getElementById('map-selected-room-title');
  const poiDesc = document.getElementById('map-selected-room-desc');
  const poiMeta = document.getElementById('map-selected-room-meta');

  if (poiTitle) poiTitle.textContent = `${targetRoom.icon} ${targetRoom.name}`;
  if (poiDesc) poiDesc.textContent = targetRoom.desc;
  if (poiMeta) {
    poiMeta.innerHTML = `
      <span class="badge-gold">${targetRoom.floor} этаж</span>
      <span class="badge-soft">📶 ${targetRoom.wifi}</span>
      ${routeResult ? `<span class="badge-soft">🚶 ${routeResult.totalDistanceMeters} м (~${routeResult.estimatedMinutes} мин)</span>` : ''}
    `;
  }

  const crossesFloors = startRoom.floor !== targetRoom.floor;
  if (statusText && routeResult) {
    statusText.textContent = crossesFloors
      ? `Маршрут: ${startRoom.code} (${startRoom.floor} эт.) → Лифт/Лестница → ${targetRoom.code} (${targetRoom.floor} эт.) • ${routeResult.totalDistanceMeters} м`
      : `Маршрут на ${targetRoom.floor} этаже: ${startRoom.code} → ${targetRoom.code} • ${routeResult.totalDistanceMeters} м (~${routeResult.estimatedMinutes} мин)`;
  }

  if (stepsBox) {
    if (crossesFloors) {
      stepsBox.innerHTML = `
        <span style="font-size:11.5px; font-weight:800; color:var(--navy);">Пошаговый переход по этажам:</span>
        <button class="pill-btn ${appState.currentFloor === startRoom.floor ? 'active' : ''}" style="padding:4px 12px; font-size:11.5px;" onclick="switchCampusFloor(${startRoom.floor})">
          Шаг 1: ${startRoom.floor} этаж (${startRoom.code} → Лифт)
        </button>
        <span style="font-weight:800; color:var(--gold);">➔</span>
        <button class="pill-btn ${appState.currentFloor === targetRoom.floor ? 'active' : ''}" style="padding:4px 12px; font-size:11.5px;" onclick="switchCampusFloor(${targetRoom.floor})">
          Шаг 2: ${targetRoom.floor} этаж (Лифт → ${targetRoom.code})
        </button>
      `;
    } else {
      stepsBox.innerHTML = `
        <span style="font-size:11.5px; font-weight:800; color:var(--navy);">Прямой маршрут в пределах ${targetRoom.floor} этажа:</span>
        <span class="badge-soft">${startRoom.name} ➔ ${targetRoom.name}</span>
      `;
    }
  }
}

// Переключение этажа (1, 2, 3, 4)
function switchCampusFloor(floorNum) {
  appState.currentFloor = floorNum;
  renderInteractiveCampusMap();
}

// Клик по аудитории прямо на схеме этажа
function selectRoomOnCanvas(roomId) {
  const room = campusRoomsDB[roomId];
  if (!room) return;
  if (roomId === 'ENTRANCE') {
    appState.routeFrom = 'ENTRANCE';
    showToast('Точка старта установлена: Главный вход (1 этаж)');
  } else {
    appState.routeTo = roomId;
    appState.currentFloor = room.floor;
    showToast(`Построен маршрут в: ${room.name} (${room.floor} этаж) 🧭`);
  }
  renderInteractiveCampusMap();
}

// Изменение точки Откуда / Куда через выпадающие списки
function updateCampusRouteEndpoints() {
  const selFrom = document.getElementById('map-select-from');
  const selTo = document.getElementById('map-select-to');
  if (selFrom) appState.routeFrom = selFrom.value;
  if (selTo) {
    appState.routeTo = selTo.value;
    const target = campusRoomsDB[appState.routeTo];
    if (target) appState.currentFloor = target.floor;
  }
  renderInteractiveCampusMap();
  const target = campusRoomsDB[appState.routeTo];
  if (target) {
    showToast(`Маршрут перестроен: → ${target.name} (${target.floor} этаж)`);
  }
}

// Клик по кнопкам быстрых категорий ("Коворкинги", "Атриум А-101", "Деканат", "Лаборатории", "Wi-Fi")
function highlightCampusRoute(routeTitle, btn, categoryKey, targetRoomId) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.route-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  appState.activeCategory = categoryKey || 'all';

  if (targetRoomId && campusRoomsDB[targetRoomId]) {
    appState.routeTo = targetRoomId;
    appState.currentFloor = campusRoomsDB[targetRoomId].floor;
  } else if (categoryKey === 'coworking') {
    appState.routeTo = 'COWORK-3';
    appState.currentFloor = 3;
  } else if (categoryKey === 'dean') {
    appState.routeTo = 'I-204';
    appState.currentFloor = 2;
  } else if (categoryKey === 'labs') {
    appState.routeTo = 'I-420';
    appState.currentFloor = 4;
  } else if (categoryKey === 'lecture') {
    appState.routeTo = 'A-101';
    appState.currentFloor = 1;
  }

  renderInteractiveCampusMap();
  showToast(`На схеме выделена категория и построен путь: ${routeTitle}`);
}

// Переключение между встроенным интерактивным навигатором и оригинальным iframe Vercel
function toggleMapEngineMode(mode) {
  appState.mapMode = mode || (appState.mapMode === 'native' ? 'iframe' : 'native');
  const nativeBox = document.getElementById('native-map-stage');
  const iframeBox = document.getElementById('vercel-iframe-stage');
  const modeBtn = document.getElementById('toggle-map-engine-btn');

  if (appState.mapMode === 'iframe') {
    if (nativeBox) nativeBox.style.display = 'none';
    if (iframeBox) iframeBox.style.display = 'block';
    if (modeBtn) modeBtn.textContent = '🧭 Вернуться к интерактивной схеме маршрутов';
    showToast('Включен прямой просмотр виджета campusnavigator-mu.vercel.app');
  } else {
    if (nativeBox) nativeBox.style.display = 'block';
    if (iframeBox) iframeBox.style.display = 'none';
    if (modeBtn) modeBtn.textContent = '🌐 Режим: Оригинальный виджет Vercel';
    renderInteractiveCampusMap();
    showToast('Включена интерактивная поэтажная схема с поиском пути');
  }
}

// Переход из карточки расписания прямо к нужной аудитории на карте
function openRoomOnCampusMap(roomName) {
  navigateTo('home');
  setTimeout(() => {
    const mapBlock = document.getElementById('main-navigator-block');
    if (mapBlock) mapBlock.scrollIntoView({ behavior: 'smooth' });

    if (appState.mapMode !== 'native') {
      toggleMapEngineMode('native');
    }

    const lower = roomName.toLowerCase();
    let targetId = 'A-101';
    let cat = 'lecture';

    if (lower.includes('коворкинг')) { targetId = 'COWORK-3'; cat = 'coworking'; }
    else if (lower.includes('420')) { targetId = 'I-420'; cat = 'labs'; }
    else if (lower.includes('308')) { targetId = 'I-308'; cat = 'labs'; }
    else if (lower.includes('204') || lower.includes('деканат')) { targetId = 'I-204'; cat = 'dean'; }
    else if (lower.includes('324')) { targetId = 'M-324'; cat = 'lecture'; }
    else if (lower.includes('101') || lower.includes('атриум')) { targetId = 'A-101'; cat = 'lecture'; }

    const chipBtn = document.querySelector(`.route-chip[data-map-cat="${cat}"]`);
    highlightCampusRoute(roomName, chipBtn, cat, targetId);
  }, 550);
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
  appState.routeFrom = 'ENTRANCE';
  appState.routeTo = 'A-101';
  appState.currentFloor = 1;
  appState.activeCategory = 'all';
  renderInteractiveCampusMap();
  const iframe = document.getElementById('campus-navigator-iframe');
  if (iframe) iframe.src = iframe.src;
  showToast('Маршрут и схема корпуса сброшены к 1 этажу ✓');
}

// =========================================================================
// 4. БАЗА ДАННЫХ НЕДЕЛЬНОГО РАСПИСАНИЯ (С ФИЛЬТРОМ ПАР ПЕДАГОГА)
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

function isLessonTaughtByCurrentUser(lessonTeacher) {
  if (!appState.currentUser || !appState.currentUser.fio) return false;
  const userFio = appState.currentUser.fio.trim().toLowerCase();
  const teacherStr = lessonTeacher.toLowerCase();

  const words = userFio.split(/\s+/).filter(w => w.length > 2 && !['доц.', 'проф.', 'преп.'].includes(w));
  const surname = words[0] || 'соколов';

  if (teacherStr.includes(surname)) return true;

  const knownSurnames = ['соколов', 'мельников', 'виткин', 'орлова', 'громов'];
  const matchesKnown = knownSurnames.some(k => userFio.includes(k));
  if (!matchesKnown && teacherStr.includes('соколов')) {
    return true;
  }
  return false;
}

function renderWeeklySchedule() {
  const grid = document.getElementById('week-grid-table');
  if (!grid) return;

  const isTeacher = appState.role === 'teacher';
  let html = '';

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
                <button class="lesson-room-btn" onclick="openRoomOnCampusMap('${item.room}')" title="Построить маршрут в аудиторию на карте корпуса">
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

// =========================================================================
// 5. НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ И РОЛЕВАЯ АВТОРИЗАЦИЯ
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

    if (role === 'student') {
      teacherRibbon.style.display = 'none';
      document.getElementById('topbar-role-indicator').textContent = `Студент • ${userData.group}`;
      badge.textContent = `⚡ Личное пространство студента • ${userData.inst} (${userData.group})`;
      heading.innerHTML = `Привет, <span class="gold-highlight">${parts[1] || parts[0]}!</span> Твой кампус готов к учёбе.`;

      document.getElementById('home-hw-section-title').textContent = '📚 Мои домашние задания и трекер семестра';
      document.getElementById('schedule-role-badge').textContent = `РАСПИСАНИЕ НЕДЕЛИ • ГРУППА ${userData.group}`;
      document.getElementById('schedule-main-title').textContent = `Расписание занятий группы ${userData.group}`;
      document.getElementById('schedule-main-sub').textContent = 'Нажми на любую аудиторию в карточке пары, чтобы мгновенно построить маршрут на карте корпуса';
    } else if (role === 'teacher') {
      teacherRibbon.style.display = 'block';
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
  renderInteractiveCampusMap();
}

function handleProfileClick() {
  if (!appState.isAuthenticated) {
    openAuthModal('login');
  } else {
    navigateTo('mentors', document.querySelector('[data-screen="mentors"]'));
  }
}

// =========================================================================
// 6. ЕДИНАЯ СИСТЕМА ДОМАШНИХ ЗАДАНИЙ И ЛИЧНОГО КАБИНЕТА (БРС)
// =========================================================================
function renderAllHomeworksAndDashboard(activeFilter = 'all') {
  const isTeacher = appState.role === 'teacher';
  const hws = appState.homeworks;

  const urgentCount = hws.filter(h => h.status === 'urgent').length;
  const reviewCount = hws.filter(h => h.status === 'review').length;
  const doneCount = hws.filter(h => h.status === 'done').length;
  const totalEarnedBrs = hws.reduce((acc, h) => acc + (Number(h.earnedPoints) || 0), 0);
  const progressPct = hws.length > 0 ? Math.min(100, Math.round(((doneCount + reviewCount * 0.5) / hws.length) * 100)) : 80;

  const progLabel = document.getElementById('hw-progress-label');
  const progBar = document.getElementById('hw-progress-bar');
  const brsBonus = document.getElementById('hw-brs-bonus');
  if (progLabel) progLabel.textContent = `${progressPct}% выполнено`;
  if (progBar) progBar.style.width = `${progressPct}%`;
  if (brsBonus) brsBonus.textContent = `+${(14.5 + totalEarnedBrs).toFixed(1)} балла в БРС`;

  const filterAllBtn = document.getElementById('hw-filter-all-btn');
  if (filterAllBtn) filterAllBtn.textContent = `Все (${hws.length})`;

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

  if (mainGrid) mainGrid.innerHTML = hws.map(buildHwCardHTML).join('');
  if (extraList) extraList.innerHTML = hws.map(buildHwCardHTML).join('');

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
  } else if (q.includes('карт') || q.includes('атриум') || q.includes('коворк') || q.includes('wi-fi') || q.includes('вай') || q.includes('420') || q.includes('204')) {
    openRoomOnCampusMap(query);
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

  let reply = 'Вы можете рассчитать баллы ЕГЭ в каталоге программ, построить маршрут по этажам корпуса на карте или войти через УрФУ ID.';
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

document.addEventListener('DOMContentLoaded', () => {
  applyRoleUI('abit', null);
});