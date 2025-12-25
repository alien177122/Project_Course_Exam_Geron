import { useState, useEffect } from 'react';
import { Tariff } from '../../types';
import { Modal } from '../ui/Modal';

interface TariffModalProps {
  // Открыта ли модалка
  isOpen: boolean;
  // Закрытие без сохранения
  onClose: () => void;
  // Создание нового тарифа
  onSave: (tariff: Omit<Tariff, 'id'>) => void;
  // Обновление существующего тарифа
  onUpdate: (id: number, tariff: Omit<Tariff, 'id'>) => void;
  tariff?: Tariff;
  mode: 'add' | 'edit';
  // Функция из контекста для пересчёта цены
  calculatePrice: (licenses: number, tracks: number) => number;
}

export function TariffModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  tariff, 
  mode,
  calculatePrice
}: TariffModalProps) {
  // Управляемые поля формы
  // price тоже лежит в состоянии, чтобы показывать пересчёт на лету
  const [formData, setFormData] = useState({
    name: '',
    licenses: 1,
    tracks: 5,
    price: 0
  });

  // При открытии модалки подставляем данные тарифа или значения по умолчанию.
  // Зависимость от isOpen позволяет сбрасывать форму при повторном открытии.
  useEffect(() => {
    if (mode === 'edit' && tariff) {
      setFormData({
        name: tariff.name,
        licenses: tariff.licenses,
        tracks: tariff.tracks,
        price: tariff.price
      });
    } else {
      setFormData({
        name: '',
        licenses: 1,
        tracks: 5,
        price: calculatePrice(1, 5)
      });
    }
  }, [mode, tariff, isOpen, calculatePrice]);

  // Автопересчёт цены при изменении лицензий или треков
  useEffect(() => {
    const newPrice = calculatePrice(formData.licenses, formData.tracks);
    setFormData(prev => ({ ...prev, price: newPrice }));
  }, [formData.licenses, formData.tracks, calculatePrice]);

  // Универсальный сабмит: вызывает add или update и закрывает модалку
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tariffData = {
      name: formData.name,
      licenses: formData.licenses,
      tracks: formData.tracks,
      price: formData.price
    };

    if (mode === 'edit' && tariff) {
      onUpdate(tariff.id, tariffData);
    } else {
      onSave(tariffData);
    }
    
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'edit' ? 'Редактировать тариф' : 'Добавить тариф'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название тарифа
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label htmlFor="licenses" className="block text-sm font-medium text-gray-700 mb-1">
            Количество лицензий
          </label>
          <input
            type="number"
            id="licenses"
            min="1"
            value={formData.licenses}
            onChange={(e) => setFormData(prev => ({ ...prev, licenses: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tracks" className="block text-sm font-medium text-gray-700 mb-1">
            Количество треков
          </label>
          <input
            type="number"
            id="tracks"
            min="1"
            value={formData.tracks}
            onChange={(e) => setFormData(prev => ({ ...prev, tracks: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена (автоматический расчёт)
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            {formData.price.toLocaleString('ru-RU')}₸
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors"
          >
            {mode === 'edit' ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
