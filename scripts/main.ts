declare const Chart: any;

// Интерфейс Tariff – добавлены поля licenses и tracks
interface Tariff {
  id: number;
  name: string;
  price: number;
  licenses: number;
  tracks: number;
}

// Массив тарифов (начальные данные)
const tariffs: Tariff[] = [
  { id: 1, name: "Базовый", price: 10000, licenses: 1, tracks: 5 },
  { id: 2, name: "Продвинутый", price: 18000, licenses: 3, tracks: 10 },
  { id: 3, name: "Премиум", price: 25000, licenses: 5, tracks: 15 },
];
let nextId: number = 3;

// Переменные для хранения состояния текущего редактирования/удаления
let currentEditId: number | null = null;
let currentDeleteId: number | null = null;

// Получение ссылок на элементы DOM (таблица, модальные окна, формы, поля и кнопки)
const tariffTableBody = document.getElementById(
  "tariffTableBody"
) as HTMLTableSectionElement;
const addModal = document.getElementById("addModal") as HTMLElement;
const editModal = document.getElementById("editModal") as HTMLElement;
const deleteModal = document.getElementById("deleteModal") as HTMLElement;

const addForm = document.getElementById("addForm") as HTMLFormElement;
const editForm = document.getElementById("editForm") as HTMLFormElement;

const addNameInput = document.getElementById("addName") as HTMLInputElement;
const addPriceInput = document.getElementById("addPrice") as HTMLInputElement;
const editNameInput = document.getElementById("editName") as HTMLInputElement;
const editPriceInput = document.getElementById("editPrice") as HTMLInputElement;

const deleteTariffNameSpan = document.getElementById(
  "deleteTariffName"
) as HTMLElement;

const addTariffBtn = document.getElementById(
  "addTariffBtn"
) as HTMLButtonElement;

const cancelAddBtn = document.getElementById("cancelAdd") as HTMLButtonElement;
const cancelEditBtn = document.getElementById(
  "cancelEdit"
) as HTMLButtonElement;
const cancelDeleteBtn = document.getElementById(
  "cancelDelete"
) as HTMLButtonElement;
const confirmDeleteBtn = document.getElementById(
  "confirmDelete"
) as HTMLButtonElement;

const addLicensesInput = document.getElementById(
  "addLicenses"
) as HTMLInputElement;
const addTracksInput = document.getElementById("addTracks") as HTMLInputElement;
const editLicensesInput = document.getElementById(
  "editLicenses"
) as HTMLInputElement;
const editTracksInput = document.getElementById(
  "editTracks"
) as HTMLInputElement;

// Убираем/добавляем суффикс "₸" при focus/blur
// addPriceInput.addEventListener('focus', () => {
//   addPriceInput.value = addPriceInput.value.replace(/\s?₸$/, '');
// });
// addPriceInput.addEventListener('blur', () => {
//   let raw = addPriceInput.value.replace(/[^\d.,]/g, '').replace(',', '.');
//   const price = parseFloat(raw);
//   addPriceInput.value = !isNaN(price) ? `${price}₸` : '';
// });
// editPriceInput.addEventListener('focus', () => {
//   editPriceInput.value = editPriceInput.value.replace(/\s?₸$/, '');
// });
// editPriceInput.addEventListener('blur', () => {
//   let raw = editPriceInput.value.replace(/[^\d.,]/g, '').replace(',', '.');
//   const price = parseFloat(raw);
//   editPriceInput.value = !isNaN(price) ? `${price}₸` : '';
// });

// Динамическая подгонка ширины input под длину числа
const adjustWidth = (input: HTMLInputElement) => {
  const raw = input.value.replace(/\s?₸$/, "");
  const len = raw.length || 1;
  input.style.width = `${len}ch`;
};

// Рассчитывает цену на основе количества лицензий и треков
function calculatePrice(licenses: number, tracks: number): number {
  const rate =
    licenses < 1 ? 0 : licenses < 3 ? 2000 : licenses < 5 ? 1800 : 1680;
  return Math.round((rate * tracks) / 1000) * 1000;
}

addPriceInput.addEventListener("input", () => adjustWidth(addPriceInput));
addPriceInput.addEventListener("blur", () => adjustWidth(addPriceInput));
editPriceInput.addEventListener("input", () => adjustWidth(editPriceInput));
editPriceInput.addEventListener("blur", () => adjustWidth(editPriceInput));

window.addEventListener("DOMContentLoaded", () => {
  adjustWidth(addPriceInput);
  adjustWidth(editPriceInput);
});

// Функция расчёта цены по лицензиям и трекам
const calculateFormPrice = (licenses: number, tracks: number): number => {
  return !isNaN(licenses) && !isNaN(tracks) ? licenses * tracks : 0;
};

// Обновление поля цены в форме добавления
const updateAddPrice = () => {
  const licStr = addLicensesInput.value.trim();
  const trkStr = addTracksInput.value.trim();
  const lic = parseInt(licStr, 10);
  const trk = parseInt(trkStr, 10);
  let displayPrice: string;
  if (licStr !== "" && trkStr !== "" && !isNaN(lic) && !isNaN(trk)) {
    const price = calculatePrice(lic, trk);
    displayPrice = price.toString();
  } else {
    displayPrice = "0";
  }
  addPriceInput.value = displayPrice;
  adjustWidth(addPriceInput);
};
addLicensesInput.addEventListener("input", updateAddPrice);
addTracksInput.addEventListener("input", updateAddPrice);

// Обновление поля цены в форме редактирования
const updateEditPrice = () => {
  const licStr = editLicensesInput.value.trim();
  const trkStr = editTracksInput.value.trim();
  const lic = parseInt(licStr, 10);
  const trk = parseInt(trkStr, 10);
  let displayPrice: string;
  if (licStr !== "" && trkStr !== "" && !isNaN(lic) && !isNaN(trk)) {
    const price = calculatePrice(lic, trk);
    displayPrice = price.toString();
  } else {
    displayPrice = "0";
  }
  editPriceInput.value = displayPrice;
  adjustWidth(editPriceInput);
};
editLicensesInput.addEventListener("input", updateEditPrice);
editTracksInput.addEventListener("input", updateEditPrice);

// Функция для отображения списка тарифов в таблице
function renderTable(): void {
  tariffTableBody.innerHTML = ""; // очищаем текущие строки

  tariffs.forEach((tariff) => {
    const row = document.createElement("tr");

    // Столбец: Название тарифа
    const nameCell = document.createElement("td");
    nameCell.textContent = tariff.name;
    row.appendChild(nameCell);

    // **Новый столбец: Лицензии**
    const licensesCell = document.createElement("td");
    licensesCell.textContent = tariff.licenses.toString();
    row.appendChild(licensesCell);

    // **Новый столбец: Количество треков**
    const tracksCell = document.createElement("td");
    tracksCell.textContent = tariff.tracks.toString();
    row.appendChild(tracksCell);

    // Столбец: Цена тарифа (с символом тенге)
    const priceCell = document.createElement("td");
    priceCell.textContent = `${tariff.price.toLocaleString("ru-RU")}₸`;
    row.appendChild(priceCell);

    // Столбец: Действия (Редактировать / Удалить)
    const actionsCell = document.createElement("td");

    // Кнопка редактирования с SVG-иконкой карандаша
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn"); // добавляем класс для стилизации
    // Вставляем SVG (иконка карандаша) внутрь кнопки
    editBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.204 10.7959L19 8.99994C19.5453 8.45469 19.8179 8.18207 19.9636 7.88797C20.2409 7.32842 20.2409 6.67146 19.9636 6.11191C19.8179 5.81782 19.5453 5.54519 19 4.99994C18.4548 4.45469 18.1821 4.18207 17.888 4.03633C17.3285 3.75905 16.6715 3.75905 16.112 4.03633C15.8179 4.18207 15.5453 4.45469 15 4.99994L13.1814 6.8186C14.1452 8.4692 15.5314 9.84476 17.204 10.7959ZM11.7269 8.27305L4.8564 15.1436C4.43134 15.5686 4.21881 15.7812 4.07907 16.0422C3.93934 16.3033 3.88039 16.5981 3.7625 17.1875L3.1471 20.2645C3.08058 20.5971 3.04732 20.7634 3.14193 20.858C3.23654 20.9526 3.40284 20.9194 3.73545 20.8529L6.81243 20.2375C7.40189 20.1196 7.69661 20.0606 7.95771 19.9209C8.21881 19.7812 8.43134 19.5686 8.8564 19.1436L15.7458 12.2542C14.1241 11.2385 12.7524 9.87622 11.7269 8.27305Z" fill="#333333"/>
</svg>
`;
    editBtn.addEventListener("click", () => openEditModal(tariff.id));
    actionsCell.appendChild(editBtn);

    // Кнопка удаления с SVG-иконкой мусорки
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn"); // класс уже использовался для стилизации
    // Вставляем SVG (иконка мусорки) внутрь кнопки
    deleteBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 6H3V9C4.10457 9 5 9.89543 5 11V15C5 17.8284 5 19.2426 5.87868 20.1213C6.75736 21 8.17157 21 11 21H13C15.8284 21 17.2426 21 18.1213 20.1213C19 19.2426 19 17.8284 19 15V11C19 9.89543 19.8954 9 21 9V6ZM10.5 11C10.5 10.4477 10.0523 10 9.5 10C8.94772 10 8.5 10.4477 8.5 11V16C8.5 16.5523 8.94772 17 9.5 17C10.0523 17 10.5 16.5523 10.5 16V11ZM15.5 11C15.5 10.4477 15.0523 10 14.5 10C13.9477 10 13.5 10.4477 13.5 11V16C13.5 16.5523 13.9477 17 14.5 17C15.0523 17 15.5 16.5523 15.5 16V11Z" fill="#FAFAFA"/>
<path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round"/>
</svg>`;
    deleteBtn.addEventListener("click", () => openDeleteModal(tariff.id));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    tariffTableBody.appendChild(row);
  });
}

// Функция открытия модального окна "Добавить тариф"
function openAddModal(): void {
  // ... (очистка старых данных)
  addNameInput.value = "";
  addPriceInput.value = "0";
  adjustWidth(addPriceInput);
  addLicensesInput.value = "";
  addTracksInput.value = "";
  updateAddPrice();
  addModal.classList.add("open");
  addNameInput.focus();
}

function openEditModal(id: number): void {
  const tariff = tariffs.find((t) => t.id === id);
  if (!tariff) return;
  currentEditId = id;
  // Заполняем поля формы текущими значениями тарифа
  editNameInput.value = tariff.name;
  editPriceInput.value = tariff.price.toString();
  adjustWidth(editPriceInput);
  editLicensesInput.value = tariff.licenses.toString();
  editTracksInput.value = tariff.tracks.toString();
  updateEditPrice();
  editModal.classList.add("open");
  editNameInput.focus();
}

// Функция открытия модального окна подтверждения удаления тарифа
function openDeleteModal(id: number): void {
  const tariff = tariffs.find((t) => t.id === id);
  if (!tariff) return;
  currentDeleteId = id; // сохраняем ID удаляемого тарифа
  // Подставляем название тарифа в текст предупреждения
  deleteTariffNameSpan.textContent = tariff.name;
  // Отображаем модальное окно удаления
  deleteModal.classList.add("open");
}

// Функция закрытия (скрытия) любого модального окна
function closeModal(modalElement: HTMLElement): void {
  modalElement.classList.remove("open");
}
// Функция добавления нового тарифа
function addTariff(
  name: string,
  price: number,
  licenses: number,
  tracks: number
): void {
  const newTariff: Tariff = {
    id: nextId++,
    name: name,
    price: price,
    licenses: licenses,
    tracks: tracks,
  };
  tariffs.push(newTariff);
}
// Функция обновления существующего тарифа по id
function updateTariff(
  id: number,
  name: string,
  price: number,
  licenses: number,
  tracks: number
): void {
  const tariff = tariffs.find((t) => t.id === id);
  if (tariff) {
    tariff.name = name;
    tariff.price = price;
    tariff.licenses = licenses;
    tariff.tracks = tracks;
  }
}
// Функция удаления тарифа по id
function deleteTariff(id: number): void {
  const index = tariffs.findIndex((t) => t.id === id);
  if (index !== -1) {
    tariffs.splice(index, 1); // удаляем 1 элемент массива по найденному индексу
  }
}
// Кнопка "Добавить тариф" — открытие соответствующего модального окна
addTariffBtn.addEventListener("click", openAddModal);
// Кнопки "Отмена" в каждом модальном окне (делают то же самое, что крестики)
cancelAddBtn.addEventListener("click", () => closeModal(addModal));
cancelEditBtn.addEventListener("click", () => closeModal(editModal));
cancelDeleteBtn.addEventListener("click", () => closeModal(deleteModal));
// Обработка отправки формы добавления тарифа
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = addNameInput.value.trim();
  const price = parseFloat(addPriceInput.value);
  const licenses = parseInt(addLicensesInput.value, 10);
  const tracks = parseInt(addTracksInput.value, 10);
  if (
    name &&
    !isNaN(price) &&
    price >= 0 &&
    !isNaN(licenses) &&
    licenses >= 0 &&
    !isNaN(tracks) &&
    tracks >= 0
  ) {
    addTariff(name, price, licenses, tracks);
    renderTable();
    closeModal(addModal);
  } else {
    alert("Пожалуйста, введите корректные неотрицательные значения");
  }
});
// Обработка отправки формы редактирования тарифа
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentEditId !== null) {
    const name = editNameInput.value.trim();
    const price = parseFloat(editPriceInput.value);
    const licenses = parseInt(editLicensesInput.value, 10);
    const tracks = parseInt(editTracksInput.value, 10);
    if (
      name &&
      !isNaN(price) &&
      price >= 0 &&
      !isNaN(licenses) &&
      licenses >= 0 &&
      !isNaN(tracks) &&
      tracks >= 0
    ) {
      updateTariff(currentEditId, name, price, licenses, tracks);
      renderTable();
      closeModal(editModal);
      currentEditId = null;
    } else {
      alert("Пожалуйста, введите корректные неотрицательные значения");
    }
  }
});
// Обработка нажатия кнопки подтверждения удаления
confirmDeleteBtn.addEventListener("click", () => {
  if (currentDeleteId !== null) {
    deleteTariff(currentDeleteId);
    renderTable();
    closeModal(deleteModal);
    currentDeleteId = null;
  }
});

// Первоначальный вызов для отображения таблицы при загрузке страницы
renderTable();
//--------------------------------------------
// --- Управление услугами ---
interface Service {
  id: number;
  name: string;
  price: number;
}

const services: Service[] = [
  { id: 1, name: "Запись вокала", price: 20000 },
  { id: 2, name: "Микширование трека", price: 15000 },
  { id: 3, name: "Мастеринг композиции", price: 10000 },
  { id: 4, name: "Создание бита в стиле Phonk", price: 25000 },
  { id: 5, name: "Оригинальный ремикс под Phonk", price: 30000 },
  { id: 6, name: "Запись трека Phonk/Funk", price: 22000 },
  { id: 7, name: "Аранжировка песни", price: 20000 },
  { id: 8, name: "Сведение многодорожечных треков", price: 35000 },
  { id: 9, name: "Редактирование звука для видео", price: 18000 },
  { id: 10, name: "Запись музыкального фортепиано", price: 30000 },

  { id: 11, name: "Запись гитарной партии", price: 20000 },
  { id: 12, name: "Запись бас-гитары", price: 20000 },
  { id: 13, name: "Запись ударных инструментов", price: 25000 },
  { id: 14, name: "Комплекс: сведение + мастеринг", price: 40000 },
  { id: 15, name: "Услуги саунд-дизайна", price: 30000 },
  { id: 16, name: "Создание звуковых эффектов", price: 25000 },
  { id: 17, name: "Запись под фонограмму", price: 15000 },
  { id: 18, name: "Распространение трека по платформам", price: 100000 },
  { id: 19, name: "Диджитал-дистрибуция", price: 80000 },
  { id: 20, name: "Консультация звукорежиссёра", price: 10000 },

  { id: 21, name: "Настройка микрофонов", price: 12000 },
  { id: 22, name: "Сведение по радио-стандартам", price: 28000 },
  { id: 23, name: "Ремастеринг старых записей", price: 35000 },
  { id: 24, name: "Реставрация виниловых записей", price: 30000 },
  { id: 25, name: "Добавление аранжировки", price: 22000 },
  { id: 26, name: "Корректировка вокала", price: 15000 },
  { id: 27, name: "Репродукшн трека", price: 45000 },
  { id: 28, name: "Озвучка рекламных роликов", price: 40000 },
  { id: 29, name: "Озвучка для игр", price: 35000 },
  { id: 30, name: "Запись подкаста", price: 20000 },

  { id: 31, name: "Монтаж подкаста", price: 18000 },
  { id: 32, name: "Сведение подкаста", price: 15000 },
  { id: 33, name: "Мобильная звукозапись", price: 20000 },
  { id: 34, name: "Студийная звукозапись", price: 40000 },
  { id: 35, name: "Удалённая звукозапись", price: 25000 },
  { id: 36, name: "Сведение онлайн", price: 18000 },
  { id: 37, name: "Мастеринг онлайн", price: 15000 },
  { id: 38, name: "Обучение звукорежиссуре", price: 30000 },
  { id: 39, name: "Обучение музыкальному продакшену", price: 35000 },
  { id: 40, name: "Консультация по дистрибуции", price: 12000 },

  { id: 41, name: "Создание джинглов", price: 20000 },
  { id: 42, name: "Создание музыкальных заставок", price: 22000 },
  { id: 43, name: "Создание саундтреков", price: 45000 },
  { id: 44, name: "Создание MIDI-аранжировок", price: 20000 },
  { id: 45, name: "Экспертная оценка трека", price: 15000 },
  { id: 46, name: "Съёмка и звукозапись стрима", price: 30000 },
  { id: 47, name: "Услуги звукорежиссёра за кадром", price: 40000 },
  { id: 48, name: "Запись ферма-голоса (lo-fi phonk)", price: 25000 },
  { id: 49, name: "Ghost-продакшн трека", price: 90000 },
  {
    id: 50,
    name: "Универсальный пакет: запись + сведение + мастеринг",
    price: 100000,
  },
];
let nextServiceId = services.length + 1;

let currentServiceEditId: number | null = null;
let currentServiceDeleteId: number | null = null;

// DOM-элементы раздела «Услуги»
const serviceTableBody = document.getElementById(
  "serviceTableBody"
) as HTMLTableSectionElement;
const addServiceBtn = document.getElementById(
  "addServiceBtn"
) as HTMLButtonElement;
const addServiceModal = document.getElementById(
  "addServiceModal"
) as HTMLElement;
const editServiceModal = document.getElementById(
  "editServiceModal"
) as HTMLElement;
const deleteServiceModal = document.getElementById(
  "deleteServiceModal"
) as HTMLElement;

const addServiceForm = document.getElementById(
  "addServiceForm"
) as HTMLFormElement;
const editServiceForm = document.getElementById(
  "editServiceForm"
) as HTMLFormElement;

const addServiceNameInput = document.getElementById(
  "addServiceName"
) as HTMLInputElement;
const addServicePriceInput = document.getElementById(
  "addServicePrice"
) as HTMLInputElement;
const editServiceNameInput = document.getElementById(
  "editServiceName"
) as HTMLInputElement;
const editServicePriceInput = document.getElementById(
  "editServicePrice"
) as HTMLInputElement;

const closeAddServiceModalBtn = document.getElementById(
  "closeAddServiceModal"
) as HTMLElement;
const cancelAddServiceBtn = document.getElementById(
  "cancelAddService"
) as HTMLButtonElement;
const closeEditServiceModalBtn = document.getElementById(
  "closeEditServiceModal"
) as HTMLElement;
const cancelEditServiceBtn = document.getElementById(
  "cancelEditService"
) as HTMLButtonElement;
const confirmDeleteServiceBtn = document.getElementById(
  "confirmDeleteService"
) as HTMLButtonElement;
const cancelDeleteServiceBtn = document.getElementById(
  "cancelDeleteService"
) as HTMLButtonElement;
const deleteServiceNameSpan = document.getElementById(
  "deleteServiceName"
) as HTMLElement;

// Функция отрисовки таблицы услуг
function renderServiceTable(filterText = ""): void {
  serviceTableBody.innerHTML = "";
  const query = filterText.trim().toLowerCase();
  const list = query
    ? services.filter((s) => s.name.toLowerCase().includes(query))
    : services;

  if (list.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = "Ничего не найдено";
    tr.appendChild(td);
    serviceTableBody.appendChild(tr);
    return;
  }

  list.forEach((svc) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = svc.name;
    row.appendChild(nameCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = svc.price.toLocaleString("ru-RU") + "₸";
    row.appendChild(priceCell);

    const actionsCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.title = "Редактировать";
    editBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.204 10.7959L19 8.99994C19.5453 8.45469 19.8179 8.18207 19.9636 7.88797C20.2409 7.32842 20.2409 6.67146 19.9636 6.11191C19.8179 5.81782 19.5453 5.54519 19 4.99994C18.4548 4.45469 18.1821 4.18207 17.888 4.03633C17.3285 3.75905 16.6715 3.75905 16.112 4.03633C15.8179 4.18207 15.5453 4.45469 15 4.99994L13.1814 6.8186C14.1452 8.4692 15.5314 9.84476 17.204 10.7959ZM11.7269 8.27305L4.8564 15.1436C4.43134 15.5686 4.21881 15.7812 4.07907 16.0422C3.93934 16.3033 3.88039 16.5981 3.7625 17.1875L3.1471 20.2645C3.08058 20.5971 3.04732 20.7634 3.14193 20.858C3.23654 20.9526 3.40284 20.9194 3.73545 20.8529L6.81243 20.2375C7.40189 20.1196 7.69661 20.0606 7.95771 19.9209C8.21881 19.7812 8.43134 19.5686 8.8564 19.1436L15.7458 12.2542C14.1241 11.2385 12.7524 9.87622 11.7269 8.27305Z" fill="#333333"/>
</svg>
`;
    editBtn.addEventListener("click", () => openEditServiceModal(svc.id));
    actionsCell.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.title = "Удалить";
    deleteBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 6H3V9C4.10457 9 5 9.89543 5 11V15C5 17.8284 5 19.2426 5.87868 20.1213C6.75736 21 8.17157 21 11 21H13C15.8284 21 17.2426 21 18.1213 20.1213C19 19.2426 19 17.8284 19 15V11C19 9.89543 19.8954 9 21 9V6ZM10.5 11C10.5 10.4477 10.0523 10 9.5 10C8.94772 10 8.5 10.4477 8.5 11V16C8.5 16.5523 8.94772 17 9.5 17C10.0523 17 10.5 16.5523 10.5 16V11ZM15.5 11C15.5 10.4477 15.0523 10 14.5 10C13.9477 10 13.5 10.4477 13.5 11V16C13.5 16.5523 13.9477 17 14.5 17C15.0523 17 15.5 16.5523 15.5 16V11Z" fill="#FAFAFA"/>
<path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#FAFAFA" stroke-width="2" stroke-linecap="round"/>
</svg>`;
    deleteBtn.addEventListener("click", () => openDeleteServiceModal(svc.id));
    actionsCell.appendChild(deleteBtn);


    row.appendChild(actionsCell);
    serviceTableBody.appendChild(row);
  });
}

// Поиск услуг
const serviceSearchInput = document.getElementById(
  "serviceSearch"
) as HTMLInputElement;
serviceSearchInput.addEventListener("input", () =>
  renderServiceTable(serviceSearchInput.value)
);

// Открытие/закрытие модалок услуг
function openAddServiceModal(): void {
  addServiceNameInput.value = "";
  addServicePriceInput.value = "";
  addServiceModal.classList.add("open");
  addServiceNameInput.focus();
}
function openEditServiceModal(id: number): void {
  const svc = services.find((s) => s.id === id);
  if (!svc) return;
  currentServiceEditId = id;
  editServiceNameInput.value = svc.name;
  editServicePriceInput.value = svc.price.toString();
  editServiceModal.classList.add("open");
  editServiceNameInput.focus();
}
function openDeleteServiceModal(id: number): void {
  const svc = services.find((s) => s.id === id);
  if (!svc) return;
  currentServiceDeleteId = id;
  deleteServiceNameSpan.textContent = svc.name;
  deleteServiceModal.classList.add("open");
}

addServiceBtn.addEventListener("click", openAddServiceModal);
closeAddServiceModalBtn.addEventListener("click", () =>
  closeModal(addServiceModal)
);
cancelAddServiceBtn.addEventListener("click", () =>
  closeModal(addServiceModal)
);
closeEditServiceModalBtn.addEventListener("click", () =>
  closeModal(editServiceModal)
);
cancelEditServiceBtn.addEventListener("click", () =>
  closeModal(editServiceModal)
);
cancelDeleteServiceBtn.addEventListener("click", () =>
  closeModal(deleteServiceModal)
);
confirmDeleteServiceBtn.addEventListener("click", () => {
  if (currentServiceDeleteId !== null) {
    deleteService(currentServiceDeleteId);
    renderServiceTable();
    closeModal(deleteServiceModal);
    currentServiceDeleteId = null;
  }
});

// CRUD-функции услуг
function addService(name: string, price: number): void {
  services.push({ id: nextServiceId++, name, price });
}
function updateService(id: number, name: string, price: number): void {
  const svc = services.find((s) => s.id === id);
  if (svc) {
    svc.name = name;
    svc.price = price;
  }
}
function deleteService(id: number): void {
  const idx = services.findIndex((s) => s.id === id);
  if (idx !== -1) services.splice(idx, 1);
}

// Формы услуг
addServiceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = addServiceNameInput.value.trim();
  const price = parseFloat(addServicePriceInput.value);
  if (name && !isNaN(price)) {
    addService(name, price);
    renderServiceTable();
    closeModal(addServiceModal);
  }
});
editServiceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentServiceEditId !== null) {
    const name = editServiceNameInput.value.trim();
    const price = parseFloat(editServicePriceInput.value);
    if (name && !isNaN(price)) {
      updateService(currentServiceEditId, name, price);
      renderServiceTable();
      closeModal(editServiceModal);
      currentServiceEditId = null;
    }
  }
});

// Инициализация
renderServiceTable();

//-------------------------------------
// По загрузке страницы выбираем все ссылки сайдбара
const links: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll(".sidebar__link");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    // Читаем именно тот атрибут, который стоит в HTML
    const targetId = link.getAttribute("data-target");
    if (!targetId) return;

    // Скрываем все секции
    document.querySelectorAll("section").forEach((sec) => {
      sec.classList.remove("active");
    });

    // Если кликнули по "Выход"
    if (targetId === "login") {
      document.getElementById("login")?.classList.add("active");
    } else {
      document.getElementById(targetId)?.classList.add("active");
    }
  });
});

//===================================================
interface Order {
  id: number;
  contact: string; // почта или телеграм
  status: "Новый" | "В процессе" | "Завершен";
  items: string[]; // каждая позиция — отдельная строка
  total: number; // сумма
}

const orders: Order[] = [
  {
    id: 1,
    contact: "example@gmail.com",
    status: "Новый",
    items: ["Музыкальные альбомы различных жанров."],
    total: 20_000,
  },
  {
    id: 2,
    contact: "@testlogin",
    status: "В процессе",
    items: [
      "Услуги звукорежиссуры и сведения треков.",
      "Индивидуальные музыкальные заказы.",
    ],
    total: 42_000,
  },
  {
    id: 3,
    contact: "testlogin@gmail.com / @login23",
    status: "Завершен",
    items: [
      "Рекорд-лейбл для молодых и талантливых музыкантов.",
      "Оригинальные ремиксы популярных треков.",
    ],
    total: 33_000,
  },
];

const ordersTableBody = document
  .getElementById("ordersTable")!
  .querySelector("tbody")! as HTMLTableSectionElement;

function renderOrdersTable(): void {
  ordersTableBody.innerHTML = "";
  orders.forEach((o) => {
    const tr = document.createElement("tr");
    // Контакт
    const tdContact = document.createElement("td");
    tdContact.textContent = o.contact;
    tr.appendChild(tdContact);

    // Статус (select)
    const tdStatus = document.createElement("td");
    const sel = document.createElement("select");
    ["Новый", "В процессе", "Завершен"].forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      if (s === o.status) opt.selected = true;
      sel.appendChild(opt);
    });
    tdStatus.appendChild(sel);
    tr.appendChild(tdStatus);

    // Позиции (нумерованный список)
    const tdItems = document.createElement("td");
    const ol = document.createElement("ol");
    o.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ol.appendChild(li);
    });
    tdItems.appendChild(ol);
    tr.appendChild(tdItems);

    // Сумма
    const tdTotal = document.createElement("td");
    tdTotal.textContent = o.total.toLocaleString("ru-RU") + "₸";
    tr.appendChild(tdTotal);

    ordersTableBody.appendChild(tr);
  });
}

// …далее твой существующий код…

window.addEventListener("DOMContentLoaded", () => {
  renderTable();
  renderServiceTable();
  renderOrdersTable();

  // инициализируем диаграмму
  const ctx = document.getElementById(
    "revenueChart"
  ) as HTMLCanvasElement | null;
  if (ctx) {
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        datasets: [
          {
            data: [
              2730000, 1930000, 1700000, 2150000, 2490000, 1050000, 1540000,
              1280000, 2010000, 2700000, 0, 3030000,
            ],
            backgroundColor: [
              "#4e79a7",
              "#f28e2b",
              "#e15759",
              "#76b7b2",
              "#59a14f",
              "#edc948",
              "#b07aa1",
              "#ff9da7",
              "#9c755f",
              "#bab0ab",
              "#8cd17d",
              "#86c5da",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { animateRotate: true, duration: 1500 },
        plugins: {
          legend: { position: "right", labels: { boxWidth: 14, padding: 8 } },
        },
        cutout: "40%",
      },
    });
  }

  // существующий links.forEach не трогаем — он переключит секции по data-target
});

//----------------------------------

//---------------------------------
interface User {
  username: string;
  password: string;
}
const users: User[] = [{ username: "user1", password: "pass123" }];

document.addEventListener("DOMContentLoaded", () => {
  // Находим необходимые элементы
  const loginSection = document.getElementById("login") as HTMLElement;
  const sidebar = document.querySelector(".sidebar") as HTMLElement;
  const container = document.querySelector(".container") as HTMLElement;
  const logoutBtn = document.getElementById("logoutBtn") as HTMLElement | null;
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;

  // Функция для переключения видимости секций
  function toggleVisibility(isLoggedIn: boolean) {
    loginSection.style.display = isLoggedIn ? "none" : "flex";
    sidebar.style.display = isLoggedIn ? "block" : "none";
    container.style.display = isLoggedIn ? "block" : "none";
  }

  const isLogged = localStorage.getItem("isLogged") === "true";
  toggleVisibility(isLogged);

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const uname = (loginForm.elements.namedItem("username") as HTMLInputElement)
      .value;
    const pass = (loginForm.elements.namedItem("password") as HTMLInputElement)
      .value;

    // Проверяем против массива users
    if (users.some((u) => u.username === uname && u.password === pass)) {
      localStorage.setItem("isLogged", "true");
      toggleVisibility(true);
      // Активируем первую секцию и сбрасываем все остальные
      document
        .querySelectorAll<HTMLElement>(".section")
        .forEach((s) => s.classList.remove("active"));
      const first = document.getElementById("tariff");
      if (first) first.classList.add("active");
    } else {
      alert("Неверный логин или пароль");
    }
  });

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("isLogged");
    toggleVisibility(false);

    // Очищаем пароль
    const pwd = loginForm.elements.namedItem("password") as HTMLInputElement;
    if (pwd) pwd.value = "";

    // Сбрасываем активность секций
    document
      .querySelectorAll<HTMLElement>(".section")
      .forEach((s) => s.classList.remove("active"));
  });
});
