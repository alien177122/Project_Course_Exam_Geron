import { createContext, useContext, useState, ReactNode } from 'react';
import { Tariff } from '../types';

// Начальные данные
const INITIAL_TARIFFS: Tariff[] = [
  { id: 1, name: "Базовый", price: 10000, licenses: 1, tracks: 5 },
  { id: 2, name: "Продвинутый", price: 18000, licenses: 3, tracks: 10 },
  { id: 3, name: "Премиум", price: 25000, licenses: 5, tracks: 15 },
];

interface TariffsContextType {
  // Текущий список тарифов в памяти
  tariffs: Tariff[];
  // CRUD-операции и утилиты
  addTariff: (tariffData: Omit<Tariff, 'id'>) => Tariff;
  updateTariff: (id: number, tariffData: Omit<Tariff, 'id'>) => Tariff;
  deleteTariff: (id: number) => void;
  getTariffById: (id: number) => Tariff | undefined;
  calculatePrice: (licenses: number, tracks: number) => number;
}

const TariffsContext = createContext<TariffsContextType | undefined>(undefined);

export function TariffsProvider({ children }: { children: ReactNode }) {
  const [tariffs, setTariffs] = useState<Tariff[]>(INITIAL_TARIFFS);
  const [nextId, setNextId] = useState(4);

  // Стоимость рассчитывается от количества лицензий: чем их больше, тем ниже ставка
  const calculatePrice = (licenses: number, tracks: number): number => {
    const rate = licenses < 1 ? 0 : licenses < 3 ? 2000 : licenses < 5 ? 1800 : 1680;
    return Math.round((rate * tracks) / 1000) * 1000;
  };

  // Добавление нового тарифа с автогенерацией id и цены
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

  // Замена существующего тарифа по id
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

  // Удаление тарифа по id
  const deleteTariff = (id: number) => {
    console.log('Deleting tariff with id:', id);
    setTariffs(prev => {
      const newTariffs = prev.filter(tariff => tariff.id !== id);
      console.log('Tariffs after delete:', newTariffs);
      return newTariffs;
    });
  };

  const getTariffById = (id: number) => {
    return tariffs.find(tariff => tariff.id === id);
  };

  return (
    <TariffsContext.Provider value={{
      tariffs,
      addTariff,
      updateTariff,
      deleteTariff,
      getTariffById,
      calculatePrice
    }}>
      {children}
    </TariffsContext.Provider>
  );
}

export function useTariffs() {
  const context = useContext(TariffsContext);
  if (context === undefined) {
    throw new Error('useTariffs must be used within a TariffsProvider');
  }
  return context;
}
