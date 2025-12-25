# Инструкции для Copilot

## Картина проекта
- Репозиторий состоит из легаси SPA (`index.html` + `scripts/main.ts` + `styles/main.scss`) и новой ветки миграции на React в `project/react-app/`.
- Легаси часть сейчас эталон бизнес-логики (CRUD тарифов/услуг/заказов, диаграмма доходов Chart.js, модальные окна), React-версия постепенно переписывает те же сценарии.
- Обе части независимы: у каждой свой `package.json` и цепочка сборки. Не смешивайте импорт/бандлы между ними.

## React-архитектура (`project/react-app/`)
- Vite + React 19 + TypeScript + Tailwind CSS v4. Tailwind подключён через `@import "tailwindcss";` в `src/index.css`, без отдельного `tailwind.config.js`; кастомные стили добавляйте через `@layer` либо локальные классы.
- Роутинг на TanStack Router v1 с file-based структурой (`src/routes/**`). После добавления/переименования файлов запустите `npm run dev`, чтобы плагин перегенерировал `src/routeTree.gen.ts` (не редактируйте его вручную).
- Корневой маршрут `src/routes/__root.tsx` монтирует `<TanStackRouterDevtools />`. Главная страница (`src/pages/MainPage.tsx`) следит за состоянием входа и перенаправляет на `/tariffs` или `/auth`, поэтому редиректы реализуйте через изменение `useAuth`.
- Аутентификация инкапсулирована в `src/hooks/useAuth.ts`: мок-логины (`user1/pass123`), хранение флага `isLogged` и `currentUser` в `localStorage`. Любые страницы, требующие авторизации, должны использовать этот хук или проверку в роуте.
- Сайдбар (`src/components/Sidebar.tsx`) импортируется каждой защищённой страницей; он сам вызывает `useAuth().logout()` и `navigate({ to: '/auth' })`. Соблюдайте этот паттерн, чтобы выход всегда очищал localStorage.
- Тарифы реализованы полностью: `src/hooks/useTariffs.ts` хранит состояние, повторяет формулу `calculatePrice` из легаси (`scripts/main.ts`), возвращает CRUD-операции; UI живёт в `src/pages/TariffsPage.tsx` с модалками `src/components/tariffs/TariffModal.tsx` и базовым `src/components/ui/Modal.tsx`.
- При добавлении новых сущностей повторяйте шаблон тарифов: типы в `src/types/index.ts`, хук состояния в `src/hooks`, страница в `src/pages`, вспомогательные компоненты в `src/components/<feature>`, маршрут в `src/routes/<feature>.tsx`.
- `src/routes/auth/index.tsx` и `src/routes/auth/$email.tsx` показывают, как читать параметры маршрута: если прокидываете `email`, не забудьте обновить `AuthPage` пропсами.
- Пустые страницы (`ServicesPage`, `OrdersPage`, `RevenuePage`) уже подключены к маршрутам; расширяйте их внутри `<Sidebar />` контейнера, чтобы сохранить макет.

## Легаси-архитектура (корень репозитория)
- SPA управляется через `data-target` на ссылках сайдбара, каждая `<section>` в `index.html` представляет отдельный экран; показ/скрытие делается в `scripts/main.ts`.
- Основной скрипт (`scripts/main.ts`, ~900 строк) содержит интерфейсы `Tariff/Service/Order`, локальное состояние массивов, обработчики модальных окон и инициализацию Chart.js донат-диаграммы. При миграции переносите логику отсюда.
- SCSS файл `styles/main.scss` задаёт цветовую систему (`$main-orange-color`, `$primary-color` и т.д.) и миксин `@mixin hover-swap` для всех кнопок; даже после перехода на Tailwind он служит справочником по фирменному стилю.
- Сборка: `npm run watch:scss` + `npm run watch:ts` или `npm run start` (оба вотчера в фоне), `npm run build` для однократной компиляции. Chart.js подключается из `node_modules` при бандле TypeScript.

## Рабочие процессы
- React-приложение: `cd project/react-app && npm install && npm run dev` (localhost:5173). `npm run lint` запускает ESLint с `eslint.config.js`, `npm run build` делает `tsc -b` + `vite build`.
- Легаси-приложение: `npm install` в корне, далее команды из раздела выше. Для разработки достаточно открыть `index.html` через любой http-сервер после компиляции `styles/main.css` и `scripts/main.js`.

## Паттерны и проверки
- Модальные окна в React всегда оборачиваются в общий `<Modal>` и управляются объектом `modalState` (`isOpen`, `mode`, `selectedTariff`). Пересчёт производных значений (цена тарифа) выполняйте через `useEffect`, как в `TariffModal`.
- Новые таблицы/формы лучше выстраивать на Tailwind, но повторять UX легаси: кнопки с оттенками `bg-orange-500`, подтверждения с `window.confirm` или отдельной модалкой.
- Для диаграмм в React берите исходные данные и цветовую палитру из `scripts/main.ts` (раздел Chart.js в конце файла), чтобы сохранить локализацию месяцев и формат тенге (`₸`).
- Любая логика авторизации должна работать синхронно с `localStorage` ключами `isLogged` и `currentUser`, иначе `MainPage` не сможет корректно перенаправлять.

## Что ещё важно знать
- `project/react-app/src/utils` пока пуст — смело добавляйте форматтеры (например, `formatCurrencyRu`) и переиспользуйте их по страницам.
- `src/styles/main-page.css` содержит временные глобальные стили (пример применения Tailwind+plain CSS). Перед подключением убедитесь, что классы не конфликтуют с Tailwind preflight.
- При добавлении новых SVG иконок в сайдбар придерживайтесь инлайн-SVG, как в `Sidebar.tsx`, чтобы не зависеть от внешних ассетов.
- Если ловите тайпинги роутера, удалите `src/routeTree.gen.ts` и снова запустите `npm run dev`: файл пересоберётся автоматически.

Нужны уточнения по каким-либо разделам? Дайте знать, и я дополню инструкцию.
