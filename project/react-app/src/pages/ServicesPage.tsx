import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useServices } from '../hooks/useServices';

export function ServicesPage() {
  const { services, deleteService, filterServices } = useServices();
  const [searchTerm, setSearchTerm] = useState('');

  // Отфильтрованный список по поиску
  const filteredServices = filterServices(searchTerm);

  // Простой confirm на удаление услуги
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить услугу "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление услугами</h1>
          
          {/* Фильтры и кнопка добавления */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <button 
                onClick={() => alert('Модальное окно добавления услуги будет добавлено позже')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Добавить услугу
              </button>
              
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Поиск услуг..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            {/* Таблица услуг */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Название услуги
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'Ничего не найдено' : 'Нет услуг'}
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.price.toLocaleString('ru-RU')}₸
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            Редактировать
                          </button>
                          <button 
                            onClick={() => handleDelete(service.id, service.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            Всего услуг: {services.length}
            {searchTerm && ` | Найдено: ${filteredServices.length}`}
          </div>
        </div>
      </main>
      
      {/* TODO: Добавить ServiceModal когда будет готов */}
    </div>
  );
}
