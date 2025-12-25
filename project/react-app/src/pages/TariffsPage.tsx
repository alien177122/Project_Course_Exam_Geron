import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TariffModal } from '../components/tariffs/TariffModal';
import { Modal } from '../components/ui/Modal';
import { useTariffs } from '../contexts/TariffsContext';
import { Tariff } from '../types';

export function TariffsPage() {
  const { tariffs, addTariff, updateTariff, deleteTariff, calculatePrice } = useTariffs();
  // Локальное состояние модалки создания/редактирования
  // mode: add | edit — определяет, какой обработчик вызываем при сабмите
  // selectedTariff — кладём сюда запись, которую редактируем
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    selectedTariff: undefined as Tariff | undefined
  });
  // Тариф, который пользователь собирается удалить (отдельная модалка)
  const [tariffToDelete, setTariffToDelete] = useState<Tariff | null>(null);

  const openAddModal = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      selectedTariff: undefined
    });
  };

  const openEditModal = (tariff: Tariff) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      selectedTariff: tariff
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'add',
      selectedTariff: undefined
    });
  };

  const openDeleteModal = (tariff: Tariff) => {
    setTariffToDelete(tariff);
  };

  const closeDeleteModal = () => {
    setTariffToDelete(null);
  };

  const handleDelete = () => {
    if (!tariffToDelete) return;
    deleteTariff(tariffToDelete.id);
    closeDeleteModal();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление тарифами</h1>
          
          {/* Карточка с таблицей тарифов */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              {/* Кнопка создания тарифа — открывает TariffModal в режиме add */}
              <button 
                onClick={openAddModal}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Добавить тариф
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Лицензии
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Треки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Рендерим строки тарифов из контекста */}
                  {tariffs.map((tariff) => (
                    <tr key={tariff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tariff.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tariff.price.toLocaleString('ru-RU')}₸
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tariff.licenses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tariff.tracks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          // Открываем модалку редактирования и передаём выбранный тариф
                          onClick={() => openEditModal(tariff)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Редактировать
                        </button>
                        <button 
                          // Открываем модалку удаления (confirm UI)
                          onClick={() => openDeleteModal(tariff)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Модалка добавления/редактирования тарифа */}
      <TariffModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={addTariff}
        onUpdate={updateTariff}
        tariff={modalState.selectedTariff}
        mode={modalState.mode}
        calculatePrice={calculatePrice}
      />

      {/* Модалка подтверждения удаления тарифа */}
      {tariffToDelete && (
        <Modal
          isOpen={true}
          onClose={closeDeleteModal}
          title="Удалить тариф"
        >
          <p className="text-gray-700">
            Вы уверены, что хотите удалить тариф &quot;{tariffToDelete.name}&quot;? Действие нельзя будет отменить.
          </p>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Удалить
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
