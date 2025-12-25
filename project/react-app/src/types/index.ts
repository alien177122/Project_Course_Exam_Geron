// Типы данных для админ-панели

// Описание тарифа: тарифный план, который продаём
export interface Tariff {
  id: number;
  name: string;
  price: number;      // Расчётная стоимость тарифа
  licenses: number;   // Сколько лицензий включает
  tracks: number;     // Сколько треков можно залить
}

// Описание услуги (товара) в каталоге
export interface Service {
  id: number;
  name: string;
  price: number;      // Стоимость услуги
}

// Заказ пользователя
export interface Order {
  id: number;
  contact: string;    // Почта/телеграм клиента
  status: "Новый" | "В процессе" | "Завершен";
  items: string[];    // Перечень позиций заказа
  total: number;      // Итоговая сумма
}

// Пользователь для авторизации
export interface User {
  username: string;
  password: string;
}

// Типы для состояния приложения
export interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

// Типы для модальных окон
export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'delete';
  selectedId?: number;
}
