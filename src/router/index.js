import { createRouter, createWebHistory, RouterView } from 'vue-router'
import Tr from "@/i18n/translation"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/Image-Compressor/:locale?",
      component: RouterView,
      beforeEnter: Tr.routeMiddleware,
    }
  ]
})

export default router
