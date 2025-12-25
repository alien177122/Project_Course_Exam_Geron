import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TariffsProvider } from "../contexts/TariffsContext";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        // Оборачиваем всё приложение контекстом тарифов и выводим дочерние роуты
        <TariffsProvider>
            <Outlet />
            <TanStackRouterDevtools />
        </TariffsProvider>
    );
}
