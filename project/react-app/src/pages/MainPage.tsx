import { useEffect } from 'react';
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from '../hooks/useAuth';

export function MainPage(){
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    console.log('MainPage: isAuthenticated =', isAuthenticated);

    // На входе проверяем авторизацию и перенаправляем на нужный маршрут
    // Здесь нет UI — только редирект на /tariffs или /auth
    useEffect(() => {
        console.log('MainPage useEffect: isAuthenticated =', isAuthenticated);
        if (isAuthenticated) {
            console.log('Redirecting to /tariffs');
            navigate({ to: '/tariffs' });
        } else {
            console.log('Redirecting to /auth');
            navigate({ to: '/auth' });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-400">A</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Adminka</h1>
                <p className="text-gray-600">Загрузка...</p>
            </div>
        </div>
    );
}
