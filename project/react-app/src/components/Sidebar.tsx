import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { FC, ReactElement } from 'react';

interface SidebarProps {
  className?: string;
}

// Типизация навигационных элементов согласно структуре проекта
interface NavigationItem {
  to: '/tariffs' | '/services' | '/orders' | '/revenue';
  label: string;
  icon: ReactElement;
}

export const Sidebar: FC<SidebarProps> = ({ className = '' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const iconClass = "w-6 h-6 mr-3 shrink-0";

  // При выходе сбрасываем auth-состояние и уходим на /auth
  const handleLogout = () => {
    logout();
    navigate({ to: '/auth' });
  };

  // Конфигурация навигационных элементов (из плана миграции)
  // Здесь задаём подпись, иконку и путь для каждой ссылки
  const navigationItems: NavigationItem[] = [
    {
      to: '/tariffs',
      label: 'Тарифы',
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      to: '/services',
      label: 'Товары',
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.75 7.5v-.75a4.5 4.5 0 0 1 9 0v.75" />
          <path d="M4.5 7.5h15l-.9 10.8a2.25 2.25 0 0 1-2.24 2.025H7.64A2.25 2.25 0 0 1 5.4 18.3L4.5 7.5Z" />
          <path d="M9.75 11.25h.01M14.25 11.25h.01" />
        </svg>
      ),
    },
    {
      to: '/orders',
      label: 'Заказы',
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.25 4.5h7.5A2.25 2.25 0 0 1 18 6.75v12.5a.75.75 0 0 1-1.16.63l-3.34-2.23a1.75 1.75 0 0 0-1.92 0l-3.38 2.25a.75.75 0 0 1-1.16-.62V6.75A2.25 2.25 0 0 1 8.25 4.5Z" />
          <path d="M9.75 9.5h4.5M9.75 12.25h4.5" />
        </svg>
      ),
    },
    {
      to: '/revenue',
      label: 'Доходы',
      icon: (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 13.5V19a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 8.5 19v-3.5a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 12.5 15v4a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 16.5 19v-6.5a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 20.5 12v7" />
          <path d="M3.5 10.5 9 6.75l3 2.25L20.5 4.5" />
          <path d="M20.5 4.5H17M20.5 4.5v3.5" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen ${className}`}>
      <div className="p-6">
        {/* Логотип */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-400">A</span>
          </div>
        </div>

        {/* Навигация */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link 
              key={item.to}
              to={item.to} 
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-orange-400 rounded transition-colors"
              activeProps={{
                className: "flex items-center px-4 py-3 text-orange-400 bg-gray-700 rounded transition-colors"
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded transition-colors"
          >
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.75 8.25V6.75A2.25 2.25 0 0 0 13.5 4.5h-6A2.25 2.25 0 0 0 5.25 6.75v10.5A2.25 2.25 0 0 0 7.5 19.5h6a2.25 2.25 0 0 0 2.25-2.25V15" />
              <path d="M18 12H9.75" />
              <path d="m15 9 3 3-3 3" />
            </svg>
            Выход
          </button>
        </nav>
      </div>
    </aside>
  );
}
