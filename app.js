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
  routeTo: 'G103',        // ID конечной точки
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
// 2. АРХИТЕКТУРНАЯ БАЗА 1–3 ЭТАЖЕЙ И ГРАФ МАРШРУТОВ ПО ПЛАНАМ КОРПУСА
// =========================================================================
// Картинки этажей 
const FLOOR_IMAGES = {
  1: 'src/floor-1.jpg',
  2: 'src/floor-2.jpg',
  3: 'src/floor-3.jpg',
  4: 'src/floor-3.jpg' // резервный план для кнопки 4 этажа на вкладке 3D-карты
};

// Состояние камеры для Pan & Zoom (translate3d + scale как в campusnavigator-mu.vercel.app)
const mapCamera = {
  scale: 1,
  minScale: 0.85,
  maxScale: 3.2,
  x: 0,
  y: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  searchQuery: ''
};

// Координаты привязаны к нормализованной сетке 1000 x 1000 поверх floor-1.jpg, floor-2.jpg, floor-3.jpg
const campusRoomsDB = {
  // ==================== 1 ЭТАЖ ====================
  'ENTRANCE': {
    id: 'ENTRANCE', code: 'ВХОД', name: 'Главный вход и фойе 1 этажа',
    floor: 1, category: 'service', icon: '🚪',
    x: 425, y: 185, hub: 'W_1_N',
    wifi: 'UrFU-Guest / UrFU-Campus (Wi-Fi 6)',
    desc: 'Входная группа учебного корпуса, турникеты УрФУ ID и проход к основным гардеробам.'
  },
  'SBER': {
    id: 'SBER', code: 'СБЕР', name: 'Образовательное пространство СБЕР',
    floor: 1, category: 'coworking', icon: '🟢',
    x: 285, y: 102, hub: 'W_1_F_TOP',
    wifi: 'UrFU-Campus (Wi-Fi 6 • до 900 Мбит/с)',
    desc: 'Брендированная зона и коворкинг Сбера в северном крыле 1 этажа.'
  },
  'WARDROBE-MAIN': {
    id: 'WARDROBE-MAIN', code: 'Гардероб', name: 'Центральный гардероб (Сектор F/G)',
    floor: 1, category: 'service', icon: '🧥',
    x: 362, y: 158, hub: 'W_1_F_MID',
    wifi: 'UrFU-Campus',
    desc: 'Просторный гардероб на 1 этаже рядом с главным входом и пространством Сбера.'
  },
  'G101': {
    id: 'G101', code: 'G101', name: 'Большая поточная аудитория G101',
    floor: 1, category: 'lecture', icon: '🎓',
    x: 690, y: 185, hub: 'W_1_NE',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Просторный зал в секторе G для потоковых лекций и презентаций.'
  },
  'G103': {
    id: 'G103', code: 'G103', name: 'Зрительный зал G103',
    floor: 1, category: 'lecture', icon: '🎭',
    x: 545, y: 285, hub: 'W_1_NE',
    wifi: 'UrFU-Campus (Wi-Fi 6 • 2 точки доступа)',
    desc: 'Главный зрительный зал 1 этажа для конференций, форумов и общеуниверситетских событий.'
  },
  'UCSB': {
    id: 'UCSB', code: 'УЦСБ', name: 'Лаунж и коворкинг УЦСБ (Сектор E)',
    floor: 1, category: 'coworking', icon: '🔶',
    x: 192, y: 355, hub: 'W_1_E_MID',
    wifi: 'UrFU-Campus / eduroam (Wi-Fi 6)',
    desc: 'Брендированное пространство компании УЦСБ в крыле E для работы и отдыха между парами.'
  },
  'E105': {
    id: 'E105', code: 'E105', name: 'Аудитория E105',
    floor: 1, category: 'labs', icon: '📘',
    x: 122, y: 275, hub: 'W_1_E_TOP',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория на 1 этаже в крыле E.'
  },
  'E104': {
    id: 'E104', code: 'E104', name: 'Аудитория E104',
    floor: 1, category: 'labs', icon: '📘',
    x: 120, y: 318, hub: 'W_1_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Семинарская аудитория напротив коворкинга УЦСБ.'
  },
  'E103': {
    id: 'E103', code: 'E103', name: 'Аудитория E103',
    floor: 1, category: 'labs', icon: '📘',
    x: 120, y: 358, hub: 'W_1_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в секторе E на 1 этаже.'
  },
  'E102': {
    id: 'E102', code: 'E102', name: 'Аудитория E102',
    floor: 1, category: 'labs', icon: '📘',
    x: 120, y: 396, hub: 'W_1_E_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в секторе E на 1 этаже.'
  },
  'E101': {
    id: 'E101', code: 'E101', name: 'Аудитория E101',
    floor: 1, category: 'labs', icon: '📘',
    x: 120, y: 425, hub: 'W_1_E_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Аудитория в южной части сектора E (1 этаж).'
  },
  'D117': {
    id: 'D117', code: 'D117', name: 'Аудитория D117',
    floor: 1, category: 'labs', icon: '🔬',
    x: 68, y: 485, hub: 'W_1_SW',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в секторе D (1 этаж).'
  },
  'D115': {
    id: 'D115', code: 'D115', name: 'Аудитория D115',
    floor: 1, category: 'labs', icon: '🔬',
    x: 52, y: 526, hub: 'W_1_D_MID',
    wifi: 'UrFU-Campus',
    desc: 'Лабораторный и практический кабинет в крыле D.'
  },
  'D113': {
    id: 'D113', code: 'D113', name: 'Аудитория D113',
    floor: 1, category: 'labs', icon: '🔬',
    x: 45, y: 575, hub: 'W_1_D_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебный блок D113–D114 на 1 этаже.'
  },
  'D110': {
    id: 'D110', code: 'D110', name: 'Аудитория D110',
    floor: 1, category: 'labs', icon: '🔬',
    x: 45, y: 636, hub: 'W_1_D_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория D110 (1 этаж, сектор D).'
  },
  'D108': {
    id: 'D108', code: 'D108', name: 'Аудитория D108',
    floor: 1, category: 'labs', icon: '🔬',
    x: 52, y: 682, hub: 'W_1_D_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Аудитория для практических занятий в секторе D.'
  },
  'D102': {
    id: 'D102', code: 'D102', name: 'Кабинет D102',
    floor: 1, category: 'dean', icon: '🏛️',
    x: 182, y: 596, hub: 'W_1_D_MID',
    wifi: 'UrFU-Campus',
    desc: 'Административно-учебный блок D101–D102 на 1 этаже.'
  },
  'CANTEEN': {
    id: 'CANTEEN', code: 'Столовая', name: 'Кампусная столовая и кафе (Сектор H)',
    floor: 1, category: 'cafe', icon: '☕',
    x: 852, y: 368, hub: 'W_1_H_MID',
    wifi: 'UrFU-Guest / UrFU-Campus',
    desc: 'Большая столовая корпуса в восточном крыле 1 этажа. Горячие обеды, выпечка и кофе.'
  },
  'NAUMEN': {
    id: 'NAUMEN', code: 'NAUMEN', name: 'Проектный коворкинг NAUMEN (Сектор I)',
    floor: 1, category: 'coworking', icon: '🟠',
    x: 588, y: 618, hub: 'W_1_I_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6 • Макс. сигнал)',
    desc: 'Открытое брендированное пространство NAUMEN в центральном атриуме 1 этажа для командной работы.'
  },
  'I105': {
    id: 'I105', code: 'I105', name: 'Аудитория I105',
    floor: 1, category: 'labs', icon: '💻',
    x: 525, y: 508, hub: 'W_1_SE',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в северной части сектора I (1 этаж).'
  },
  'I104': {
    id: 'I104', code: 'I104', name: 'Аудитория I104',
    floor: 1, category: 'labs', icon: '💻',
    x: 512, y: 565, hub: 'W_1_I_MID',
    wifi: 'UrFU-Campus',
    desc: 'Аудитория рядом с коворкингом NAUMEN (1 этаж).'
  },
  'I103': {
    id: 'I103', code: 'I103', name: 'Аудитория I103',
    floor: 1, category: 'labs', icon: '💻',
    x: 512, y: 632, hub: 'W_1_I_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебный класс I103 в секторе I (1 этаж).'
  },
  'I101': {
    id: 'I101', code: 'I101', name: 'Аудитория I101',
    floor: 1, category: 'labs', icon: '💻',
    x: 662, y: 608, hub: 'W_1_I_MID',
    wifi: 'UrFU-Campus',
    desc: 'Компьютерный и семинарский класс I101 (1 этаж).'
  },
  'I102': {
    id: 'I102', code: 'I102', name: 'Аудитория I102',
    floor: 1, category: 'labs', icon: '💻',
    x: 662, y: 665, hub: 'W_1_I_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория I102 (1 этаж).'
  },
  'YANDEX': {
    id: 'YANDEX', code: 'Яндекс', name: 'Образовательное пространство Яндекс (Сектор J)',
    floor: 1, category: 'coworking', icon: '🔴',
    x: 500, y: 788, hub: 'W_1_J_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6 • до 950 Мбит/с)',
    desc: 'Пространство Яндекса на 1 этаже для лекций, митапов и работы над алгоритмическими задачами.'
  },
  'K119': {
    id: 'K119', code: 'K119', name: 'Аудитория K119 (Сектор J/K)',
    floor: 1, category: 'labs', icon: '💻',
    x: 500, y: 846, hub: 'W_1_J_MID',
    wifi: 'UrFU-Campus',
    desc: 'Просторная аудитория рядом с зоной Яндекса на 1 этаже.'
  },
  'K117': {
    id: 'K117', code: 'K117', name: 'Аудитория K117',
    floor: 1, category: 'labs', icon: '💻',
    x: 500, y: 905, hub: 'W_1_J_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория K117 в южном крыле 1 этажа.'
  },
  'LOUNGE-1': {
    id: 'LOUNGE-1', code: 'Отдых', name: 'Комната отдыха (Сектор J)',
    floor: 1, category: 'cafe', icon: '🛋️',
    x: 395, y: 942, hub: 'W_1_J_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Тихая зона отдыха для студентов и преподавателей в южной части сектора J.'
  },
  'KONTUR': {
    id: 'KONTUR', code: 'Контур', name: 'Коворкинг СКБ Контур (Сектор K)',
    floor: 1, category: 'coworking', icon: '🟢',
    x: 672, y: 845, hub: 'W_1_K_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6 • Гигабитный холл)',
    desc: 'Флагманский коворкинг Контура в секторе K на 1 этаже для проектного практикума и хакатонов.'
  },
  'K103': {
    id: 'K103', code: 'K103', name: 'Аудитория K103',
    floor: 1, category: 'labs', icon: '🗄️',
    x: 742, y: 812, hub: 'W_1_K_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория напротив коворкинга Контур на 1 этаже.'
  },
  'K104': {
    id: 'K104', code: 'K104', name: 'Аудитория K104',
    floor: 1, category: 'labs', icon: '🗄️',
    x: 742, y: 882, hub: 'W_1_K_MID',
    wifi: 'UrFU-Campus',
    desc: 'Практическая аудитория в крыле K на 1 этаже.'
  },
  'SELF-STUDY': {
    id: 'SELF-STUDY', code: 'СРС', name: 'Зона для самостоятельной работы (Сектор K)',
    floor: 1, category: 'coworking', icon: '📖',
    x: 712, y: 965, hub: 'W_1_K_BOT',
    wifi: 'UrFU-Campus / eduroam',
    desc: 'Специализированная зона в южном торце крыла K для подготовки к занятиям и командных созвонов.'
  },

  // ==================== 2 ЭТАЖ ====================
  'ACT-HALL': {
    id: 'ACT-HALL', code: 'Актовый зал', name: 'Актовый зал корпуса (2 этаж)',
    floor: 2, category: 'lecture', icon: '🎭',
    x: 538, y: 310, hub: 'W_2_NE',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Главный актовый зал на 2 этаже для торжественных мероприятий, защит и потоковых лекций.'
  },
  'F207': {
    id: 'F207', code: 'F207', name: 'Аудитория F207',
    floor: 2, category: 'labs', icon: '💻',
    x: 355, y: 72, hub: 'W_2_F_TOP',
    wifi: 'UrFU-Campus',
    desc: 'Просторная угловая аудитория в северном крыле F на 2 этаже.'
  },
  'F209': {
    id: 'F209', code: 'F209', name: 'Аудитория F209',
    floor: 2, category: 'labs', icon: '💻',
    x: 362, y: 175, hub: 'W_2_F_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в секторе F на 2 этаже.'
  },
  'F203': {
    id: 'F203', code: 'F203', name: 'Аудитория F203',
    floor: 2, category: 'labs', icon: '💻',
    x: 215, y: 115, hub: 'W_2_F_TOP',
    wifi: 'UrFU-Campus',
    desc: 'Компьютерный и семинарский класс F203 (2 этаж).'
  },
  'E203': {
    id: 'E203', code: 'E203', name: 'Аудитория E203',
    floor: 2, category: 'lecture', icon: '🎓',
    x: 145, y: 300, hub: 'W_2_E_TOP',
    wifi: 'UrFU-Campus',
    desc: 'Большая учебная аудитория в крыле E на 2 этаже.'
  },
  'E204': {
    id: 'E204', code: 'E204', name: 'Аудитория E204 (Дирекция / Деканат)',
    floor: 2, category: 'dean', icon: '🏛️',
    x: 272, y: 345, hub: 'W_2_E_MID',
    wifi: 'UrFU-Campus (5 ГГц)',
    desc: 'Административный и учебный кабинет E204 в секторе E на 2 этаже.'
  },
  'E205': {
    id: 'E205', code: 'E205', name: 'Аудитория E205',
    floor: 2, category: 'labs', icon: '💻',
    x: 272, y: 418, hub: 'W_2_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Практическая аудитория в крыле E на 2 этаже.'
  },
  'D206': {
    id: 'D206', code: 'D206', name: 'Большая аудитория D206',
    floor: 2, category: 'lecture', icon: '🎓',
    x: 52, y: 528, hub: 'W_2_SW',
    wifi: 'UrFU-Campus',
    desc: 'Поточная аудитория в западном крыле D на 2 этаже.'
  },
  'D204': {
    id: 'D204', code: 'D204', name: 'Большая аудитория D204',
    floor: 2, category: 'lecture', icon: '🎓',
    x: 55, y: 685, hub: 'W_2_D_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Просторная лекционно-практическая аудитория в южной части сектора D (2 этаж).'
  },
  'H203': {
    id: 'H203', code: 'H203', name: 'Аудитория H203',
    floor: 2, category: 'labs', icon: '🔬',
    x: 662, y: 352, hub: 'W_2_H_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в восточном крыле H рядом с Актовым залом.'
  },
  'H204': {
    id: 'H204', code: 'H204', name: 'Аудитория H204',
    floor: 2, category: 'labs', icon: '🔬',
    x: 795, y: 350, hub: 'W_2_H_MID',
    wifi: 'UrFU-Campus',
    desc: 'Лабораторная аудитория H204 (2 этаж, сектор H).'
  },
  'H205': {
    id: 'H205', code: 'H205', name: 'Аудитория H205',
    floor: 2, category: 'labs', icon: '🔬',
    x: 800, y: 430, hub: 'W_2_H_MID',
    wifi: 'UrFU-Campus',
    desc: 'Практическая аудитория H205 (2 этаж, сектор H).'
  },
  'I202': {
    id: 'I202', code: 'I202', name: 'Аудитория I202',
    floor: 2, category: 'labs', icon: '💻',
    x: 508, y: 578, hub: 'W_2_I_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Компьютерный и проектный класс I202 в центральном секторе 2 этажа.'
  },
  'I201': {
    id: 'I201', code: 'I201', name: 'Аудитория I201',
    floor: 2, category: 'labs', icon: '💻',
    x: 508, y: 642, hub: 'W_2_I_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Учебная аудитория I201 в центральном секторе 2 этажа.'
  },
  'J201': {
    id: 'J201', code: 'J201', name: 'Аудитория J201',
    floor: 2, category: 'labs', icon: '📘',
    x: 432, y: 795, hub: 'W_2_J_MID',
    wifi: 'UrFU-Campus',
    desc: 'Семинарская аудитория в крыле J на 2 этаже.'
  },
  'J204': {
    id: 'J204', code: 'J204', name: 'Аудитория J204',
    floor: 2, category: 'labs', icon: '📘',
    x: 425, y: 925, hub: 'W_2_J_BOT',
    wifi: 'UrFU-Campus',
    desc: 'Угловая аудитория в южной части крыла J (2 этаж).'
  },
  'K203': {
    id: 'K203', code: 'K203', name: 'Специализированная лаборатория K203',
    floor: 2, category: 'labs', icon: '🌸',
    x: 732, y: 762, hub: 'W_2_K_MID',
    wifi: 'UrFU-Campus + Выделенная линия',
    desc: 'Выделенный лабораторный кластер K203–K207 в розовом секторе крыла K (2 этаж).'
  },
  'K204': {
    id: 'K204', code: 'K204', name: 'Лаборатория ИИ и разработки K204',
    floor: 2, category: 'labs', icon: '🌸',
    x: 732, y: 812, hub: 'W_2_K_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6 + LAN)',
    desc: 'Ключевая лаборатория розового крыла K на 2 этаже для практик по программированию и ИИ.'
  },
  'K205': {
    id: 'K205', code: 'K205', name: 'Компьютерный класс K205',
    floor: 2, category: 'labs', icon: '🌸',
    x: 732, y: 878, hub: 'W_2_K_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6 + LAN)',
    desc: 'Компьютерный класс в выделенном секторе K203–K207 на 2 этаже.'
  },

  // ==================== 3 ЭТАЖ ====================
  'CLUB-HALL': {
    id: 'CLUB-HALL', code: 'Зал клуба', name: 'Зрительный зал клуба (3 этаж)',
    floor: 3, category: 'lecture', icon: '🎬',
    x: 545, y: 310, hub: 'W_3_NE',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Большой зрительный зал клуба на 3 этаже для презентаций проектов, демо-дней и творческих встреч.'
  },
  'F316': {
    id: 'F316', code: 'F316', name: 'Аудитория F316',
    floor: 3, category: 'labs', icon: '💻',
    x: 362, y: 148, hub: 'W_3_F_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в северном крыле F на 3 этаже.'
  },
  'J317': {
    id: 'J317', code: 'J317', name: 'Аудитория J317 (Сектор F)',
    floor: 3, category: 'labs', icon: '💻',
    x: 362, y: 182, hub: 'W_3_F_MID',
    wifi: 'UrFU-Campus',
    desc: 'Семинарская и проектная аудитория J317 на 3 этаже.'
  },
  'E302': {
    id: 'E302', code: 'E302', name: 'Аудитория E302',
    floor: 3, category: 'labs', icon: '📘',
    x: 128, y: 365, hub: 'W_3_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в западном крыле E на 3 этаже.'
  },
  'E303': {
    id: 'E303', code: 'E303', name: 'Аудитория E303',
    floor: 3, category: 'labs', icon: '📘',
    x: 272, y: 345, hub: 'W_3_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Лабораторный класс E303 на 3 этаже.'
  },
  'E304': {
    id: 'E304', code: 'E304', name: 'Аудитория E304',
    floor: 3, category: 'labs', icon: '📘',
    x: 272, y: 415, hub: 'W_3_E_MID',
    wifi: 'UrFU-Campus',
    desc: 'Аудитория E304 для практических занятий и командных разборов.'
  },
  'D303': {
    id: 'D303', code: 'D303', name: 'Аудитория D303',
    floor: 3, category: 'lecture', icon: '🎓',
    x: 40, y: 595, hub: 'W_3_D_MID',
    wifi: 'UrFU-Campus',
    desc: 'Аудитория в западном крыле D на 3 этаже.'
  },
  'D301': {
    id: 'D301', code: 'D301', name: 'Аудитория D301',
    floor: 3, category: 'labs', icon: '🔬',
    x: 192, y: 602, hub: 'W_3_D_MID',
    wifi: 'UrFU-Campus',
    desc: 'Практический кабинет D301 на 3 этаже.'
  },
  'H301': {
    id: 'H301', code: 'H301', name: 'Большая аудитория H301',
    floor: 3, category: 'lecture', icon: '🎓',
    x: 660, y: 445, hub: 'W_3_H_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Просторная лекционная и проектная аудитория в секторе H на 3 этаже.'
  },
  'H303': {
    id: 'H303', code: 'H303', name: 'Аудитория H303',
    floor: 3, category: 'labs', icon: '🔬',
    x: 800, y: 348, hub: 'W_3_H_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в восточном крыле H (3 этаж).'
  },
  'H304': {
    id: 'H304', code: 'H304', name: 'Аудитория H304',
    floor: 3, category: 'labs', icon: '🔬',
    x: 805, y: 415, hub: 'W_3_H_MID',
    wifi: 'UrFU-Campus',
    desc: 'Компьютерный и лабораторный класс H304 (3 этаж).'
  },
  'I304': {
    id: 'I304', code: 'I304', name: 'Аудитория I304',
    floor: 3, category: 'labs', icon: '💻',
    x: 512, y: 518, hub: 'W_3_I_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в центральном крыле I на 3 этаже.'
  },
  'I306': {
    id: 'I306', code: 'I306', name: 'Аудитория I306 (Базы данных и ИИ)',
    floor: 3, category: 'labs', icon: '🗄️',
    x: 658, y: 605, hub: 'W_3_I_MID',
    wifi: 'UrFU-Campus + Гигабитный LAN',
    desc: 'Терминальный класс I306 в центральном секторе 3 этажа.'
  },
  'J308': {
    id: 'J308', code: 'J308', name: 'Аудитория J308',
    floor: 3, category: 'labs', icon: '📘',
    x: 292, y: 745, hub: 'W_3_J_MID',
    wifi: 'UrFU-Campus',
    desc: 'Учебная аудитория в секторе J на 3 этаже.'
  },
  'K304': {
    id: 'K304', code: 'K304', name: 'Лаборатория K304 (Сектор K)',
    floor: 3, category: 'labs', icon: '🤖',
    x: 732, y: 810, hub: 'W_3_K_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Лаборатория прикладной разработки и ИИ в крыле K на 3 этаже.'
  },
  'K305': {
    id: 'K305', code: 'K305', name: 'Лаборатория K305 (Сектор K)',
    floor: 3, category: 'labs', icon: '🤖',
    x: 732, y: 872, hub: 'W_3_K_MID',
    wifi: 'UrFU-Campus (Wi-Fi 6)',
    desc: 'Компьютерная лаборатория K305 в южной части крыла K на 3 этаже.'
  }
};

// Построение реального восьмиугольного графа коридоров и 5 межэтажных лестниц (Этажи 1–3)
function buildCampusNavigationGraph() {
  const nodes = {};
  const edges = {};

  function addNode(id, floor, x, y, label = '', isStair = false) {
    nodes[id] = { id, floor, x, y, label, isStair };
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

  // На каждом из 3 этажей создаем 5 реальных лестничных узлов и коридорные галереи каждого сектора
  for (let f = 1; f <= 3; f++) {
    // 5 основных узлов с лестницами (отмечены штриховкой на планах floor-1..3)
    addNode(`STAIR_${f}_NW`, f, 260, 260, `Лестница СЗ (сектор E/F, ${f} эт.)`, true);
    addNode(`STAIR_${f}_SW`, f, 170, 490, `Лестница ЮЗ (сектор D/E, ${f} эт.)`, true);
    addNode(`STAIR_${f}_NE`, f, 625, 245, `Лестница СВ (у зала G/H, ${f} эт.)`, true);
    addNode(`STAIR_${f}_SE`, f, 655, 520, `Лестница ЮВ (сектор H/I, ${f} эт.)`, true);
    addNode(`STAIR_${f}_S`,  f, 512, 735, `Центральная южная лестница (сектор I/J/K, ${f} эт.)`, true);

    // Коридорные точки по крыльям F, E, D, G, H, I, J, K
    addNode(`W_${f}_F_TOP`, f, 285, 85);
    addNode(`W_${f}_F_MID`, f, 315, 195);
    addNode(`W_${f}_N`,     f, 455, 205);
    addNode(`W_${f}_NE`,    f, 625, 245);

    addNode(`W_${f}_E_TOP`, f, 205, 290);
    addNode(`W_${f}_E_MID`, f, 215, 365);
    addNode(`W_${f}_E_BOT`, f, 200, 435);
    addNode(`W_${f}_SW`,    f, 170, 490);

    addNode(`W_${f}_D_MID`, f, 140, 575);
    addNode(`W_${f}_D_BOT`, f, 145, 690);
    addNode(`W_${f}_S_WEST`,f, 355, 695);

    addNode(`W_${f}_H_MID`, f, 735, 395);
    addNode(`W_${f}_SE`,    f, 655, 520);

    addNode(`W_${f}_I_MID`, f, 588, 600);
    addNode(`W_${f}_I_BOT`, f, 588, 695);

    addNode(`W_${f}_J_MID`, f, 395, 815);
    addNode(`W_${f}_J_BOT`, f, 395, 910);

    addNode(`W_${f}_K_MID`, f, 655, 825);
    addNode(`W_${f}_K_BOT`, f, 655, 925);

    // Связи внутри этажа по коридорам
    addEdge(`W_${f}_F_TOP`, `W_${f}_F_MID`);
    addEdge(`W_${f}_F_MID`, `STAIR_${f}_NW`);
    addEdge(`W_${f}_F_MID`, `W_${f}_N`);
    addEdge(`W_${f}_N`,     `STAIR_${f}_NE`);
    addEdge(`STAIR_${f}_NE`,`W_${f}_NE`);

    addEdge(`STAIR_${f}_NW`, `W_${f}_E_TOP`);
    addEdge(`W_${f}_E_TOP`,  `W_${f}_E_MID`);
    addEdge(`W_${f}_E_MID`,  `W_${f}_E_BOT`);
    addEdge(`W_${f}_E_BOT`,  `STAIR_${f}_SW`);
    addEdge(`STAIR_${f}_SW`, `W_${f}_SW`);

    addEdge(`STAIR_${f}_SW`, `W_${f}_D_MID`);
    addEdge(`W_${f}_D_MID`,  `W_${f}_D_BOT`);
    addEdge(`W_${f}_D_BOT`,  `W_${f}_S_WEST`);
    addEdge(`W_${f}_S_WEST`, `STAIR_${f}_S`);

    addEdge(`STAIR_${f}_NE`, `W_${f}_H_MID`);
    addEdge(`W_${f}_H_MID`,  `STAIR_${f}_SE`);
    addEdge(`STAIR_${f}_SE`, `W_${f}_SE`);

    addEdge(`STAIR_${f}_SE`, `W_${f}_I_MID`);
    addEdge(`W_${f}_I_MID`,  `W_${f}_I_BOT`);
    addEdge(`W_${f}_I_BOT`,  `STAIR_${f}_S`);

    addEdge(`STAIR_${f}_S`,  `W_${f}_J_MID`);
    addEdge(`W_${f}_J_MID`,  `W_${f}_J_BOT`);

    addEdge(`STAIR_${f}_S`,  `W_${f}_K_MID`);
    addEdge(`W_${f}_K_MID`,  `W_${f}_K_BOT`);
  }

  // Межэтажные переходы по всем 5 лестницам (1 <-> 2 <-> 3 этаж)
  const stairSuffixes = ['NW', 'SW', 'NE', 'SE', 'S'];
  for (let f = 1; f < 3; f++) {
    stairSuffixes.forEach(s => {
      addEdge(`STAIR_${f}_${s}`, `STAIR_${f + 1}_${s}`, 180);
    });
  }

  // Привязываем каждую комнату к её коридорному хабу
  Object.values(campusRoomsDB).forEach(room => {
    addNode(room.id, room.floor, room.x, room.y, room.name);
    if (room.hub && nodes[room.hub]) {
      addEdge(room.id, room.hub);
    }
  });

  return { nodes, edges };
}

const campusGraph = buildCampusNavigationGraph();

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
    totalDistanceMeters: Math.max(15, Math.round(dist[endId] * 0.22)),
    estimatedMinutes: Math.max(1, Math.round(dist[endId] / 310))
  };
}

// =========================================================================
// 3. ОТРИСОВКА КАРТЫ, ПИНЫ, SVG-МАРШРУТ И PAN/ZOOM КАМЕРЫ
// =========================================================================
function applyMapCameraTransform(smooth = false) {
  ['mapWrapper', 'mapWrapperFull'].forEach(id => {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    wrapper.classList.toggle('smooth-pan', smooth);
    wrapper.style.transform = `translate3d(${mapCamera.x}px, ${mapCamera.y}px, 0px) scale(${mapCamera.scale})`;
  });
  const zoomBadge = document.getElementById('map-zoom-indicator');
  if (zoomBadge) {
    zoomBadge.textContent = `Масштаб: ${Math.round(mapCamera.scale * 100)}%`;
  }
}

function zoomCampusMap(delta) {
  mapCamera.scale = Math.min(mapCamera.maxScale, Math.max(mapCamera.minScale, +(mapCamera.scale + delta).toFixed(2)));
  applyMapCameraTransform(true);
}

function populateMapRouteSelects() {
  const selFrom = document.getElementById('map-select-from');
  const selTo = document.getElementById('map-select-to');
  if (!selFrom || !selTo || selFrom.options.length > 0) return;

  const rooms = Object.values(campusRoomsDB);
  [1, 2, 3].forEach(floorNum => {
    const groupFrom = document.createElement('optgroup');
    groupFrom.label = `${floorNum} этаж`;
    const groupTo = document.createElement('optgroup');
    groupTo.label = `${floorNum} этаж`;

    rooms.filter(r => r.floor === floorNum).forEach(r => {
      const opt1 = new Option(`${r.icon} ${r.code} — ${r.name}`, r.id);
      const opt2 = new Option(`${r.icon} ${r.code} — ${r.name}`, r.id);
      groupFrom.appendChild(opt1);
      groupTo.appendChild(opt2);
    });

    selFrom.appendChild(groupFrom);
    selTo.appendChild(groupTo);
  });
}

function renderInteractiveCampusMap() {
  populateMapRouteSelects();

  if (!campusRoomsDB[appState.routeFrom]) appState.routeFrom = 'ENTRANCE';
  if (!campusRoomsDB[appState.routeTo]) appState.routeTo = 'G103';

  const floor = appState.currentFloor;
  const fromId = appState.routeFrom;
  const toId = appState.routeTo;
  const activeCat = appState.activeCategory;
  const query = (mapCamera.searchQuery || '').toLowerCase();

  // 1. Обновляем подложку этажа (img#floorMap)
  const imgSrc = FLOOR_IMAGES[floor] || FLOOR_IMAGES[1];
  ['floorMap', 'floorMapFull'].forEach(imgId => {
    const imgEl = document.getElementById(imgId);
    if (imgEl && imgEl.getAttribute('src') !== imgSrc) {
      imgEl.setAttribute('src', imgSrc);
      imgEl.setAttribute('alt', `План ${floor} этажа`);
    }
  });

  // 2. Синхронизируем селекты и кнопки этажей
  const selFrom = document.getElementById('map-select-from');
  const selTo = document.getElementById('map-select-to');
  if (selFrom && selFrom.value !== fromId) selFrom.value = fromId;
  if (selTo && selTo.value !== toId) selTo.value = toId;

  document.querySelectorAll('.floor-switch-btn').forEach(btn => {
    const f = parseInt(btn.getAttribute('data-floor'), 10);
    btn.classList.toggle('active', f === floor);
  });

  // 3. Вычисляем маршрут по графу
  const routeResult = findShortestCampusPath(fromId, toId);
  const startRoom = campusRoomsDB[fromId];
  const targetRoom = campusRoomsDB[toId];

  // 4. Отрисовываем интерактивные пины в #markersContainer
  const roomsOnFloor = Object.values(campusRoomsDB).filter(r => r.floor === floor);
  const pinsHtml = roomsOnFloor.map(room => {
    const isStart = room.id === fromId;
    const isEnd = room.id === toId;
    const matchesCat = activeCat === 'all' || room.category === activeCat;
    const matchesSearch = !query || room.code.toLowerCase().includes(query) || room.name.toLowerCase().includes(query);

    let stateClass = '';
    if (isStart) stateClass = 'pin-start';
    else if (isEnd) stateClass = 'pin-end';
    else if ((activeCat !== 'all' && matchesCat) || (query && matchesSearch)) stateClass = 'pin-highlight';
    else if ((activeCat !== 'all' && !matchesCat) || (query && !matchesSearch)) stateClass = 'pin-dimmed';

    return `
      <button type="button"
              class="map-room-pin ${stateClass}"
              style="left: ${(room.x / 10).toFixed(2)}%; top: ${(room.y / 10).toFixed(2)}%;"
              onclick="selectRoomOnCanvas('${room.id}')"
              title="${room.name}">
        <span>${room.icon}</span>
        <span>${room.code}</span>
      </button>
    `;
  }).join('');

  ['markersContainer', 'markersContainerFull'].forEach(cId => {
    const container = document.getElementById(cId);
    if (container) container.innerHTML = pinsHtml;
  });

  // 5. Отрисовываем SVG-линию маршрута на текущем этаже (#routeSvg)
  let svgHtml = '';
  let stairTransitionNode = null;

  if (routeResult && routeResult.path.length > 1) {
    // Разбиваем путь на непрерывные сегменты текущего этажа
    const segments = [];
    let currentSeg = [];

    routeResult.path.forEach((node, idx) => {
      if (node.floor === floor) {
        currentSeg.push(node);
        const nextNode = routeResult.path[idx + 1];
        if (nextNode && nextNode.floor !== floor) {
          stairTransitionNode = { fromFloor: floor, toFloor: nextNode.floor, stairNode: node };
        }
      } else if (currentSeg.length > 0) {
        segments.push(currentSeg);
        currentSeg = [];
      }
    });
    if (currentSeg.length > 0) segments.push(currentSeg);

    segments.forEach(seg => {
      if (seg.length >= 2) {
        const pts = seg.map(n => `${n.x},${n.y}`).join(' ');
        svgHtml += `
          <polyline class="route-path-glow" points="${pts}" />
          <polyline class="route-path-line" points="${pts}" />
        `;
      }
      const firstN = seg[0];
      const lastN = seg[seg.length - 1];
      svgHtml += `
        <circle cx="${firstN.x}" cy="${firstN.y}" r="11" fill="#1E7A53" stroke="#FFFFFF" stroke-width="3.5" />
        <circle cx="${lastN.x}" cy="${lastN.y}" r="13" fill="#1F2A44" stroke="#DFC077" stroke-width="4" />
      `;
    });
  }

  ['routeSvg', 'routeSvgFull'].forEach(sId => {
    const svgEl = document.getElementById(sId);
    if (svgEl) svgEl.innerHTML = svgHtml;
  });

  // 6. Показываем подсказку межэтажного перехода (#stairMessageContainer)
  ['stairMessageContainer', 'stairMessageContainerFull'].forEach(stId => {
    const stairBox = document.getElementById(stId);
    if (!stairBox) return;
    if (stairTransitionNode) {
      stairBox.style.display = 'flex';
      stairBox.innerHTML = `
        <span>🪜 Дойдите до узла «${stairTransitionNode.stairNode.label || 'Лестница'}» и перейдите на ${stairTransitionNode.toFloor} этаж</span>
        <button class="btn-gold" style="padding:5px 12px; font-size:11.5px;" onclick="switchCampusFloor(${stairTransitionNode.toFloor})">
          Переключить на ${stairTransitionNode.toFloor} этаж →
        </button>
      `;
    } else if (startRoom.floor !== targetRoom.floor && floor !== startRoom.floor && floor !== targetRoom.floor) {
      stairBox.style.display = 'flex';
      stairBox.innerHTML = `
        <span>🧭 Маршрут проходит между ${startRoom.floor} и ${targetRoom.floor} этажами</span>
        <button class="btn-gold" style="padding:5px 12px; font-size:11.5px;" onclick="switchCampusFloor(${targetRoom.floor})">
          На этаж назначения (${targetRoom.floor} эт.) →
        </button>
      `;
    } else {
      stairBox.style.display = 'none';
    }
  });

  // 7. Обновляем нижнюю карточку #infoCard и цепочку шагов
  updateRouteStepsAndHud(routeResult, startRoom, targetRoom);
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
      <span class="badge-gold">${targetRoom.floor} этаж • Код: ${targetRoom.code}</span>
      <span class="badge-soft">📶 ${targetRoom.wifi}</span>
      ${routeResult ? `<span class="badge-soft">🚶 ${routeResult.totalDistanceMeters} м (~${routeResult.estimatedMinutes} мин)</span>` : ''}
    `;
  }

  const crossesFloors = startRoom.floor !== targetRoom.floor;
  if (statusText && routeResult) {
    statusText.textContent = crossesFloors
      ? `Маршрут: ${startRoom.code} (${startRoom.floor} эт.) → Лестница → ${targetRoom.code} (${targetRoom.floor} эт.) • ${routeResult.totalDistanceMeters} м`
      : `Маршрут на ${targetRoom.floor} этаже: ${startRoom.code} → ${targetRoom.code} • ${routeResult.totalDistanceMeters} м (~${routeResult.estimatedMinutes} мин)`;
  }

  if (stepsBox) {
    if (crossesFloors) {
      stepsBox.innerHTML = `
        <span style="font-size:11.5px; font-weight:800; color:var(--navy);">Маршрут между этажами:</span>
        <button class="pill-btn ${appState.currentFloor === startRoom.floor ? 'active' : ''}" style="padding:4px 12px; font-size:11.5px;" onclick="switchCampusFloor(${startRoom.floor})">
          Шаг 1: ${startRoom.floor} этаж (${startRoom.code} → Лестница)
        </button>
        <span style="font-weight:800; color:var(--gold);">➔</span>
        <button class="pill-btn ${appState.currentFloor === targetRoom.floor ? 'active' : ''}" style="padding:4px 12px; font-size:11.5px;" onclick="switchCampusFloor(${targetRoom.floor})">
          Шаг 2: ${targetRoom.floor} этаж (Лестница → ${targetRoom.code})
        </button>
      `;
    } else {
      stepsBox.innerHTML = `
        <span style="font-size:11.5px; font-weight:800; color:var(--navy);">Маршрут в пределах ${targetRoom.floor} этажа:</span>
        <span class="badge-soft">${startRoom.name} ➔ ${targetRoom.name}</span>
      `;
    }
  }
}

function switchCampusFloor(floorNum) {
  appState.currentFloor = floorNum;
  renderInteractiveCampusMap();
}

function selectRoomOnCanvas(roomId) {
  const room = campusRoomsDB[roomId];
  if (!room) return;
  if (roomId === 'ENTRANCE') {
    appState.routeFrom = 'ENTRANCE';
    showToast('Точка старта: Главный вход (1 этаж)');
  } else {
    appState.routeTo = roomId;
    appState.currentFloor = room.floor;
    showToast(`Построен маршрут в: ${room.name} (${room.floor} этаж) 🧭`);
  }
  renderInteractiveCampusMap();
}

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
}

function swapCampusRouteEndpoints() {
  const temp = appState.routeFrom;
  appState.routeFrom = appState.routeTo;
  appState.routeTo = temp;
  const target = campusRoomsDB[appState.routeTo];
  if (target) appState.currentFloor = target.floor;
  renderInteractiveCampusMap();
  showToast('Точки отправления и назначения поменяны местами ⇄');
}

function handleMapRoomSearch(val) {
  mapCamera.searchQuery = val.trim();
  if (mapCamera.searchQuery.length >= 2) {
    const q = mapCamera.searchQuery.toLowerCase();
    const match = Object.values(campusRoomsDB).find(
      r => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
    );
    if (match) {
      appState.routeTo = match.id;
      appState.currentFloor = match.floor;
    }
  }
  renderInteractiveCampusMap();
}

function highlightCampusRoute(routeTitle, btn, categoryKey, targetRoomId) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.route-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }
  appState.activeCategory = categoryKey || 'all';

  if (targetRoomId && campusRoomsDB[targetRoomId]) {
    appState.routeTo = targetRoomId;
    appState.currentFloor = campusRoomsDB[targetRoomId].floor;
  }
  renderInteractiveCampusMap();
  showToast(`Категория на карте: ${routeTitle}`);
}

function reloadCampusMap() {
  appState.routeFrom = 'ENTRANCE';
  appState.routeTo = 'G103';
  appState.currentFloor = 1;
  appState.activeCategory = 'all';
  mapCamera.scale = 1;
  mapCamera.x = 0;
  mapCamera.y = 0;
  mapCamera.searchQuery = '';
  const searchInput = document.getElementById('map-room-search');
  if (searchInput) searchInput.value = '';
  applyMapCameraTransform(true);
  renderInteractiveCampusMap();
  showToast('Камера и маршрут сброшены к 1 этажу ✓');
}

// Инициализация перетаскивания (Drag) и зума колесиком (Wheel) на #mapArea и #mapAreaFull
function initMapPanAndZoom() {
  ['mapArea', 'mapAreaFull'].forEach(areaId => {
    const area = document.getElementById(areaId);
    if (!area) return;

    area.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.18 : -0.18;
      zoomCampusMap(delta);
    }, { passive: false });

    area.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      mapCamera.isDragging = true;
      mapCamera.startX = e.clientX - mapCamera.x;
      mapCamera.startY = e.clientY - mapCamera.y;
      area.classList.add('is-dragging');
      area.setPointerCapture(e.pointerId);
    });

    area.addEventListener('pointermove', (e) => {
      if (!mapCamera.isDragging) return;
      mapCamera.x = e.clientX - mapCamera.startX;
      mapCamera.y = e.clientY - mapCamera.startY;
      applyMapCameraTransform(false);
    });

    const stopDrag = () => {
      mapCamera.isDragging = false;
      area.classList.remove('is-dragging');
    };
    area.addEventListener('pointerup', stopDrag);
    area.addEventListener('pointercancel', stopDrag);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMapPanAndZoom();
});

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

function openRoomOnCampusMap(roomName) {
  navigateTo('home');
  setTimeout(() => {
    const mapBlock = document.getElementById('main-navigator-block');
    if (mapBlock) mapBlock.scrollIntoView({ behavior: 'smooth' });

    if (appState.mapMode !== 'native') {
      toggleMapEngineMode('native');
    }

    const lower = roomName.toLowerCase();
    let targetId = 'G103';
    let cat = 'lecture';

    if (lower.includes('коворкинг') || lower.includes('контур')) { targetId = 'KONTUR'; cat = 'coworking'; }
    else if (lower.includes('naumen')) { targetId = 'NAUMEN'; cat = 'coworking'; }
    else if (lower.includes('уцсб')) { targetId = 'UCSB'; cat = 'coworking'; }
    else if (lower.includes('420') || lower.includes('k204') || lower.includes('лаб')) { targetId = 'K204'; cat = 'labs'; }
    else if (lower.includes('308') || lower.includes('i306')) { targetId = 'I306'; cat = 'labs'; }
    else if (lower.includes('204') || lower.includes('деканат')) { targetId = 'E204'; cat = 'dean'; }
    else if (lower.includes('324') || lower.includes('актов')) { targetId = 'ACT-HALL'; cat = 'lecture'; }
    else if (lower.includes('101') || lower.includes('атриум') || lower.includes('g103')) { targetId = 'G103'; cat = 'lecture'; }

    const chipBtn = document.querySelector(`.route-chip[data-map-cat="${cat}"]`);
    highlightCampusRoute(roomName, chipBtn, cat, targetId);
  }, 550);
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