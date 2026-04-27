import { createContext, useContext, useState } from 'react';

const translations = {
  ky: {
    // Tab labels
    search: 'Издөө',
    post: 'Жарыялоо',
    myJobs: 'Менин',
    saved: 'Сакталган',
    profile: 'Профиль',

    // Search tab
    searchPlaceholder: 'Вакансия издөө...',
    noJobs: 'Вакансия табылган жок',
    allTypes: 'Баары',
    employer: 'Жумуш берүүчү',
    seeker: 'Жумуш издөөчү',

    // Post tab
    postTitle: 'Вакансия жарыялоо',
    postType: 'Категория',
    description: 'Сүрөттөмө',
    descriptionPlaceholder: 'Вакансияны сүрөттөңүз...',
    whatsapp: 'WhatsApp',
    phone: 'Телефон',
    address: 'Дарек',
    addressPlaceholder: 'Бишкек, Чүй проспектиси',
    negotiable: 'Келишим боюнча',
    salaryFrom: 'Баадан',
    salaryTo: 'Баага чейин',
    publish: 'Жарыялоо →',
    publishing: 'Жарыяланууда...',

    // My jobs tab
    noMyJobs: 'Вакансияңыз жок',
    deleteConfirm: 'Вакансияны жок кылуу?',
    deleted: 'Жок кылынды 🗑️',
    hidden: 'Вакансия жашырылды 🙈',
    activated: 'Вакансия активдүү! 🟢',
    active: 'Активдүү',
    inactive: 'Жашык',
    activateTitle: 'Активдештирүү — издөөдө көрүнөт',
    hideTitle: 'Жашыруу — издөөдөн алып салынат',

    // Saved tab
    noSaved: 'Сакталган вакансия жок',
    removedFromSaved: 'Сакталгандан өчүрүлдү',

    // Profile tab
    profileTitle: 'Профиль',
    fullName: 'Аты-жөнү',
    changePhoto: 'Сүрөтүңүздү өзгөртүү',
    photoUpdated: 'Сүрөт жаңыланды! 📸',
    save: 'Сактоо',
    saving: 'Сакталуда...',
    saved2: 'Сакталды ✅',
    logoutConfirm: 'Чыгышыңызды ырастайсызбы?',
    logout: 'Чыгуу',
    vacancies: 'Вакансиялар',
    bookmarks: 'Сакталган',
    language: 'Тил',

    // JobCard
    views: 'көрүлдү',
    nego: 'Договордук',
    edit: 'Өзгөртүү',
    delete: 'Жок кылуу',
    copy: 'Көчүрүлдү! 📋',
    error: 'Ката болду',
    call: 'Чалуу',
    share: 'Бөлүшүү',
    shareTitle: 'Бөлүшүү',
    shareWa: 'WhatsApp аркылуу жөнөтүү',
    shareTg: 'Telegram',
    shareCopy: 'Текст көчүрүү',
    employer: 'Иш берүүчү',
    seeker: 'Иш издейт',
    salary: 'Маяна',
    rating: 'Баа',

    // EditModal
    editTitle: 'Вакансияны өзгөртүү',
    editSaved: 'Вакансия жаңыланды! ✅',
    cancel: 'Жок кылуу',
    salaryNego: 'Келишим боюнча',
    priceFrom: 'Баадан',
    priceTo: 'Баага чейин',

    // Header
    darkMode: 'Жарык режим',
    lightMode: 'Караңгы режим',
    logoutHeader: 'Чыгуу?',
    bookmarkAdded: 'Сакталды ⭐',
    rateGiven: 'Баа берилди',
    loginRequired: 'Катталыңыз',
  },

  ru: {
    // Tab labels
    search: 'Поиск',
    post: 'Разместить',
    myJobs: 'Мои',
    saved: 'Избранное',
    profile: 'Профиль',

    // Search tab
    searchPlaceholder: 'Поиск вакансий...',
    noJobs: 'Вакансии не найдены',
    allTypes: 'Все',
    employer: 'Работодатель',
    seeker: 'Ищу работу',

    // Post tab
    postTitle: 'Разместить вакансию',
    postType: 'Категория',
    description: 'Описание',
    descriptionPlaceholder: 'Опишите вакансию...',
    whatsapp: 'WhatsApp',
    phone: 'Телефон',
    address: 'Адрес',
    addressPlaceholder: 'Бишкек, просп. Чуй',
    negotiable: 'По договору',
    salaryFrom: 'Зарплата от',
    salaryTo: 'Зарплата до',
    publish: 'Опубликовать →',
    publishing: 'Публикация...',

    // My jobs tab
    noMyJobs: 'У вас нет вакансий',
    deleteConfirm: 'Удалить вакансию?',
    deleted: 'Удалено 🗑️',
    hidden: 'Вакансия скрыта 🙈',
    activated: 'Вакансия активна! 🟢',
    active: 'Активна',
    inactive: 'Скрыта',
    activateTitle: 'Активировать — появится в поиске',
    hideTitle: 'Скрыть — уберётся из поиска',

    // Saved tab
    noSaved: 'Нет сохранённых вакансий',
    removedFromSaved: 'Удалено из избранного',

    // Profile tab
    profileTitle: 'Профиль',
    fullName: 'Имя',
    changePhoto: 'Изменить фото',
    photoUpdated: 'Фото обновлено! 📸',
    save: 'Сохранить',
    saving: 'Сохранение...',
    saved2: 'Сохранено ✅',
    logoutConfirm: 'Вы уверены, что хотите выйти?',
    logout: 'Выйти',
    vacancies: 'Вакансии',
    bookmarks: 'Избранное',
    language: 'Язык',

    // JobCard
    views: 'просмотров',
    nego: 'Договорная',
    edit: 'Редактировать',
    delete: 'Удалить',
    copy: 'Скопировано! 📋',
    error: 'Ошибка',
    call: 'Позвонить',
    share: 'Поделиться',
    shareTitle: 'Поделиться',
    shareWa: 'Отправить в WhatsApp',
    shareTg: 'Telegram',
    shareCopy: 'Скопировать текст',
    employer: 'Работодатель',
    seeker: 'Ищу работу',
    salary: 'Зарплата',
    rating: 'Оценка',

    // EditModal
    editTitle: 'Редактировать вакансию',
    editSaved: 'Вакансия обновлена! ✅',
    cancel: 'Отмена',
    salaryNego: 'Договорная зарплата',
    priceFrom: 'Зарплата от',
    priceTo: 'Зарплата до',

    // Header
    darkMode: 'Светлый режим',
    lightMode: 'Тёмный режим',
    logoutHeader: 'Выйти?',
    bookmarkAdded: 'Сохранено ⭐',
    rateGiven: 'Оценка поставлена',
    loginRequired: 'Авторизуйтесь',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ky');

  const toggleLang = () => {
    const next = lang === 'ky' ? 'ru' : 'ky';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
