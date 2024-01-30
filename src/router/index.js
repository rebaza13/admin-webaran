import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/HomePage.vue";

import LoginPage from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import profile from "@/views/profile.vue";
import ManageDoctor from "@/views/ManageDoctor.vue";
import DoctorUi from "@/views/DoctorUi.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import { useDoctorStore } from "@/stores/doctor";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
          meta: { requiresAuth: true },
          beforeEnter: (to, from, next) => {
            const useStore = useDoctorStore();
            if (useStore.role == "doctor") {
              next({ name: "doctor-ui" }); // Redirect to a different route for admin
            } else {
              next(); // Proceed to the "dashboard" route for non-admin users
            }
          },
        },
        {
          path: "/manage-doctors",
          name: "manage-doctors",
          component: ManageDoctor,
          meta: { requiresAuth: true },
        },
        {
          path: "/profile",
          name: "profile",
          component: profile,
          meta: { requiresAuth: true },
        },

        {
          path: "doctor-ui",
          name: "doctor-ui",
          component: DoctorUi,
          meta: { requiresAuth: true },
        },
      ],
      beforeEnter: (to, from, next) => {
        if (to.path === "/") {
          next({ name: "dashboard" });
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
    },
  ],
});
router.beforeEach((to, from, next) => {
  const useStore = useDoctorStore();
  if (to.meta.requiresAuth && !useStore.userId) {
    // Redirect to the login page when authentication is required but the user is not logged in
    next("/login");
  } else {
    // Continue with the route navigation
    next();
  }
});
export default router;
