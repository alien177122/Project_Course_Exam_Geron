import { Sidebar } from '../components/Sidebar';
import { useOrders } from '../hooks/useOrders';

export function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder, getTotalRevenue } = useOrders();

  // Обновляем статус заказа из селекта
  const handleStatusChange = (id: number, status: "Новый" | "В процессе" | "Завершен") => {
    updateOrderStatus(id, status);
  };

  // Простой confirm на удаление заказа
  const handleDelete = (id: number, contact: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить заказ от "${contact}"?`)) {
      deleteOrder(id);
    }
  };

  // Цвет бейджа статуса в таблице
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Новый': return 'bg-blue-100 text-blue-800';
      case 'В процессе': return 'bg-yellow-100 text-yellow-800';
      case 'Завершен': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление заказами</h1>
          
          {/* Карточки с агрегированными показателями */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Всего заказов</h3>
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">В работе</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'В процессе').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Общий доход</h3>
              <p className="text-3xl font-bold text-green-600">
                {getTotalRevenue().toLocaleString('ru-RU')}₸
              </p>
            </div>
          </div>

          {/* Таблица заказов с управлением статусом и удалением */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <button 
                onClick={() => alert('Модальное окно добавления заказа будет добавлено позже')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Добавить заказ
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Почта/Телеграм
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Позиции
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Сумма заказа
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as "Новый" | "В процессе" | "Завершен")}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          <option value="Новый">Новый</option>
                          <option value="В процессе">В процессе</option>
                          <option value="Завершен">Завершен</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <ol className="list-decimal list-inside space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="truncate max-w-xs">{item}</li>
                          ))}
                        </ol>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {order.total.toLocaleString('ru-RU')}₸
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Редактировать
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id, order.contact)}
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
    </div>
  );
}
