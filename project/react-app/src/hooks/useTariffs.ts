import { useState } from 'react';
import { Tariff } from '../types';

// Начальные данные (как в оригинале)
const INITIAL_TARIFFS: Tariff[] = [
  { id: 1, name: "Базовый", price: 10000, licenses: 1, tracks: 5 },
  { id: 2, name: "Продвинутый", price: 18000, licenses: 3, tracks: 10 },
  { id: 3, name: "Премиум", price: 25000, licenses: 5, tracks: 15 },
];

export function useTariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>(INITIAL_TARIFFS);
  const [nextId, setNextId] = useState(4);

  // Функция расчёта цены (из оригинала)
  const calculatePrice = (licenses: number, tracks: number): number => {
    const rate = licenses < 1 ? 0 : licenses < 3 ? 2000 : licenses < 5 ? 1800 : 1680;
    return Math.round((rate * tracks) / 1000) * 1000;
  };

  // Создание тарифа с автоинкрементным id
  const addTariff = (tariffData: Omit<Tariff, 'id'>) => {
    const newTariff: Tariff = {
      ...tariffData,
      id: nextId,
      price: calculatePrice(tariffData.licenses, tariffData.tracks)
    };
    
    setTariffs(prev => [...prev, newTariff]);
    setNextId(prev => prev + 1);
    return newTariff;
  };

  // Обновление тарифа целиком
  const updateTariff = (id: number, tariffData: Omit<Tariff, 'id'>) => {
    const updatedTariff: Tariff = {
      ...tariffData,
      id,
      price: calculatePrice(tariffData.licenses, tariffData.tracks)
    };

    setTariffs(prev => prev.map(tariff => 
      tariff.id === id ? updatedTariff : tariff
    ));
    return updatedTariff;
  };

  // Удаление по id
  const deleteTariff = (id: number) => {
    setTariffs(prev => prev.filter(tariff => tariff.id !== id));
  };

  const getTariffById = (id: number) => {
    return tariffs.find(tariff => tariff.id === id);
  };

  return {
    tariffs,
    addTariff,
    updateTariff,
    deleteTariff,
    getTariffById,
    calculatePrice
  };
}
