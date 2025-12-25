import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Sidebar } from '../components/Sidebar';

export function RevenuePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Рисуем пончик Chart.js при монтировании, чистим при размонтировании
  useEffect(() => {
    if (canvasRef.current) {
      // Уничтожаем предыдущую диаграмму если она была
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Конфигурация пончик-диаграммы: данные по месяцам + палитра
        const config: ChartConfiguration<'doughnut'> = {
          type: 'doughnut',
          data: {
            labels: [
              'Январь',
              'Февраль', 
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Август',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь',
            ],
            datasets: [
              {
                data: [
                  2730000, 1930000, 1700000, 2150000, 2490000, 1050000, 1540000,
                  1280000, 2010000, 2700000, 0, 3030000,
                ],
                backgroundColor: [
                  '#4e79a7',
                  '#f28e2b',
                  '#e15759',
                  '#76b7b2',
                  '#59a14f',
                  '#edc948',
                  '#b07aa1',
                  '#ff9da7',
                  '#9c755f',
                  '#bab0ab',
                  '#8cd17d',
                  '#86c5da',
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { 
              duration: 1500 
            },
            plugins: {
              legend: { 
                position: 'right', 
                labels: { 
                  boxWidth: 14, 
                  padding: 8,
                  usePointStyle: true,
                } 
              },
            },
            cutout: '40%',
          },
        };

        chartRef.current = new Chart(ctx, config);
      }
    }

    // Cleanup функция
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Подсчитаем общий доход
  const totalRevenue = [
    2730000, 1930000, 1700000, 2150000, 2490000, 1050000, 1540000,
    1280000, 2010000, 2700000, 0, 3030000,
  ].reduce((sum, value) => sum + value, 0);

  const bestMonth = 'Декабрь';
  const bestMonthRevenue = 3030000;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Доходы за 2025</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Общий доход</h3>
              <p className="text-3xl font-bold text-green-600">
                {totalRevenue.toLocaleString('ru-RU')}₸
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Лучший месяц</h3>
              <p className="text-xl font-bold text-blue-600">{bestMonth}</p>
              <p className="text-lg text-gray-600">
                {bestMonthRevenue.toLocaleString('ru-RU')}₸
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Средний доход</h3>
              <p className="text-3xl font-bold text-orange-600">
                {Math.round(totalRevenue / 12).toLocaleString('ru-RU')}₸
              </p>
              <p className="text-sm text-gray-500">в месяц</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Распределение доходов по месяцам</h2>
            <div className="relative h-96">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Анализ</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Пиковый период: Декабрь (3,030,000₸)</p>
              <p>• Слабый период: Ноябрь (0₸) - возможно, техническая пауза</p>
              <p>• Стабильные месяцы: Январь, Апрель, Май, Октябрь</p>
              <p>• Общая тенденция: Положительная динамика к концу года</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
