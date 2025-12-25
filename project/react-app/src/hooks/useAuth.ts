import { useState, useEffect } from 'react';
import { User } from '../types';

// Моковые пользователи (как в оригинале)
const MOCK_USERS: User[] = [
  { username: "user1", password: "pass123" }
];

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // При монтировании подтягиваем данные из localStorage (автологин)
  useEffect(() => {
    const savedAuth = localStorage.getItem('isLogged');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Проверка логина/пароля по списку MOCK_USERS
  const login = (username: string, password: string): boolean => {
    const user = MOCK_USERS.find(u => 
      u.username === username && u.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  // Сброс локального состояния и очищение storage
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isLogged');
    localStorage.removeItem('currentUser');
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout
  };
}
