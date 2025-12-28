[README.md](https://github.com/user-attachments/files/24360923/README.md)
# Adminka — Admin Panel (migration project)

Учебно-практический проект админ-панели.  
Цель — прокачать навыки фронтенда и перевести проект со стека **HTML + SCSS + TypeScript** на современный **Vite + React + TypeScript + TailwindCSS** (с роутингом и более чистой архитектурой).

---

## Возможности (примерно)
- Разделы админки: тарифы / услуги / заказы / статистика (в зависимости от версии проекта)
- CRUD-операции (добавление/удаление/редактирование) для сущностей (где реализовано)
- Таблицы, модальные окна, базовая валидация форм
- (Опционально) графики на Chart.js

---

## Технологии

### Legacy (исходная версия)
- HTML
- SCSS (Sass)
- TypeScript
- Chart.js (графики/визуализация)
- Сборка через npm scripts: `sass` + `tsc`

### New stack (миграция)
- Vite
- React
- TypeScript
- TailwindCSS
- TanStack React Router
- ESLint

---

## Скрипты

### Legacy
- `npm run build:scss` — сборка SCSS в CSS
- `npm run watch:scss` — watch SCSS
- `npm run build:ts` — компиляция TypeScript
- `npm run watch:ts` — watch TypeScript
- `npm run build` — SCSS + TS
- `npm run start` — watch SCSS и TS параллельно

### React/Vite (миграция)
- `npm run dev` — dev-сервер
- `npm run build` — production build
- `npm run preview` — предпросмотр билда
- `npm run lint` — линт

---

## Структура проекта (рекомендуемая)
- `src/components/` — переиспользуемые UI-компоненты (таблицы, модалки, кнопки)
- `src/pages/` — страницы/разделы админки
- `src/hooks/` — кастомные хуки
- `src/utils/` — утилиты/хелперы
- `src/types/` — общие типы/интерфейсы
- `src/App.tsx` — корневой компонент приложения
- `src/main.tsx` — точка входа (mount React)

---

## План миграции (коротко)
1) Поднять Vite React TS проект и перенести статическую разметку в компоненты  
2) Подключить TailwindCSS и постепенно заменить SCSS  
3) Перенести логику (useState вместо ручного DOM), типизировать данные  
4) Добавить роутинг (TanStack Router)  
5) Рефакторинг: вынос повторяющихся частей в компоненты/хуки/утилиты

---

## Заметки
Проект учебный, но ведётся как “боевой”: маленькие итерации, чистка типов, улучшение структуры.  
Ценность для работодателя — видно прогресс: от DOM-скриптов к компонентам, типам и современной сборке.
