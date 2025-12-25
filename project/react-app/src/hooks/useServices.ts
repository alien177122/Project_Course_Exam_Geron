import { useState } from 'react';
import { Service } from '../types';

// Начальные данные услуг (из оригинала)
const INITIAL_SERVICES: Service[] = [
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
];

export function useServices() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [nextId, setNextId] = useState(16);

  // Создание услуги с новым id
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: nextId,
    };
    
    setServices(prev => [...prev, newService]);
    setNextId(prev => prev + 1);
    return newService;
  };

  // Замена услуги по id
  const updateService = (id: number, serviceData: Omit<Service, 'id'>) => {
    const updatedService: Service = {
      ...serviceData,
      id,
    };

    setServices(prev => prev.map(service => 
      service.id === id ? updatedService : service
    ));
    return updatedService;
  };

  const deleteService = (id: number) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const getServiceById = (id: number) => {
    return services.find(service => service.id === id);
  };

  // Поиск по названию (регистр не учитываем)
  const filterServices = (searchTerm: string) => {
    if (!searchTerm.trim()) return services;
    return services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    services,
    addService,
    updateService,
    deleteService,
    getServiceById,
    filterServices
  };
}
