import { createRouter, createWebHashHistory } from "vue-router";
import { isTokenValid } from "../utils/auth";

const routes = [
  {
    path: "/",
    component: () => import("../layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "Gift",
        component: () => import("../views/Gift.vue"),
      },
      {
        path: "user",
        name: "User",
        component: () => import("../views/User.vue"),
      },
      {
        path: "stock",
        name: "Stock",
        component: () => import("../views/Stock.vue"),
      },
      {
        path: "authorize",
        name: "Authorize",
        component: () => import("../views/Authorize.vue"),
      },
    ],
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },

  // Catch-all route for 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/notFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token"); 
  const profile = JSON.parse(localStorage.getItem("Profile")); 
  

  if (to.name !== "Login" &&(!token || !isTokenValid(token))) {
    localStorage.clear()
    next({ name: "Login" }); 
  } 
  else if (to.name === "Authorize" && profile?.ROLE_NAME !== "CHECKER") {
    // If trying to access 'Authorize' but the role is not 'CHECKER'
    next({ name: "NotFound" }); 
  } 
  else {
    next();
  }
});

export default router;
