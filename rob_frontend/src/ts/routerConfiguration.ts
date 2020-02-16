import VueRouter, {RouteConfig} from "vue-router";
import {SettingsPage} from "./pages/settings/settingsPage";
import {AuthPage} from "./pages/authPage";
import {MainPage} from "./pages/mainPage";
import {StatusPage} from "./pages/statusPage";
import {HelpPage} from "./pages/helpPage";

/**
 * Класс отвечающий за создание роутингов и инициализацию роутера
 */
export class RouterConfiguration {

    /** Экземпляр роутера */
    private static router: VueRouter;

    /**
     * Возвращает инициализированный экземпляр роутера
     * @returns {VueRouter} роутер
     */
    static getRouter(): VueRouter {
        if (!RouterConfiguration.router) {
            RouterConfiguration.router = new VueRouter({
                base: "/",
                routes: RouterConfiguration.createRoutes(),
                scrollBehavior: (() => ({x: 0, y: 0}))
            });
        }
        return RouterConfiguration.router;
    }

    private static createRoutes(): RouteConfig[] {
        return [
            {
                path: "/",
                redirect: "/main"
            },
            {
                path: "/main", name: "main",
                component: MainPage
            },
            {
                path: "/settings", name: "settings",
                component: SettingsPage
            },
            {
                path: "/status", name: "status",
                component: StatusPage
            },
            {
                path: "/help", name: "help",
                component: HelpPage
            },
            {
                path: "/auth", name: "auth",
                component: AuthPage
            },
            {
                path: "/auth/:id", name: "auth",
                component: AuthPage
            }
        ];
    }
}
