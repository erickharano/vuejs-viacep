import { createWebHistory, createRouter } from "vue-router";

const routes =  [
    {
        path: "/",
        alias: "/home",
        name: "Home",
        component: () => import("./components/Home")
    },
    {
        path: "/",
        alias: "/cep",
        name: "search-cep",
        component: () => import("./components/ViaCep")
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
