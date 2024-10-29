// src/composables/useCommonLayout.js
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";

const apiImg = import.meta.env.VITE_API_URL_IMG;

export function useCommonLayout() {
  const { locale, t } = useI18n();
  const route = useRoute();
  const router = useRouter();

  // Determine the active menu item based on the current route path
  const activeMenuItem =
    route.path === "/"
      ? "1"
      : route.path === "/stock"
      ? "2"
      : route.path === "/user"
      ? "3"
      : route.path === "/authorize"
      ? "4"
      : "";

  // Change language
  const changeLanguage = (lang) => {
    locale.value = lang;
  };

  // Logout function with confirmation
  const logout = () => {
    ElMessageBox.confirm(t("text_logout"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(() => {
        localStorage.clear();
        router.push({ name: "Login" });
      })
      .catch(() => {});
  };

  // Profile data
  const profile = JSON.parse(localStorage.getItem("Profile"));

  // Dialog visibility for profile
  const isProfileDialogVisible = ref(false);

  // Function to show profile dialog
  const showProfileDialog = () => {
    isProfileDialogVisible.value = true;
  };

  return {
    apiImg,
    activeMenuItem,
    changeLanguage,
    logout,
    profile,
    isProfileDialogVisible,
    showProfileDialog,
  };
}
