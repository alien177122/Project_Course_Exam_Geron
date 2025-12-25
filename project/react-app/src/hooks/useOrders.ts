import { useState } from 'react';
import { Order } from '../types';

// Начальные данные заказов (из оригинала)
const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    contact: "example@gmail.com",
    status: "Новый",
    items: ["Музыкальные альбомы различных жанров."],
    total: 20000,
  },
  {
    id: 2,
    contact: "@testlogin",
    status: "В процессе",
    items: [
      "Услуги звукорежиссуры и сведения треков.",
      "Индивидуальные музыкальные заказы.",
    ],
    total: 42000,
  },
  {
    id: 3,
    contact: "testlogin@gmail.com / @login23",
    status: "Завершен",
    items: [
      "Рекорд-лейбл для молодых и талантливых музыкантов.",
      "Оригинальные ремиксы популярных треков.",
    ],
    total: 33000,
  },
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [nextId, setNextId] = useState(4);

  // Создание заказа с автоинкрементным id
  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: nextId,
    };
    
    setOrders(prev => [...prev, newOrder]);
    setNextId(prev => prev + 1);
    return newOrder;
  };

  // Обновление заказа целиком по id
  const updateOrder = (id: number, orderData: Omit<Order, 'id'>) => {
    const updatedOrder: Order = {
      ...orderData,
      id,
    };

    setOrders(prev => prev.map(order => 
      order.id === id ? updatedOrder : order
    ));
    return updatedOrder;
  };

  // Удаление заказа по id
  const deleteOrder = (id: number) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const getOrderById = (id: number) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: number, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  // Фильтр по статусу для дашборда
  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  // Сумма завершённых заказов
  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === "Завершен")
      .reduce((sum, order) => sum + order.total, 0);
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    updateOrderStatus,
    getOrdersByStatus,
    getTotalRevenue
  };
}
