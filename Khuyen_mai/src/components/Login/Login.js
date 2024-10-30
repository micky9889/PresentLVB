// src/composables/login.js

import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { User, Lock } from "@element-plus/icons-vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

const apiUrl = import.meta.env.VITE_API_URL;

export default function useLogin() {
  const { t } = useI18n();
  const loginForm = ref({
    username: "",
    password: "",
  });

  const router = useRouter();
  const loading = ref(false);

  const rules = ref({
    username: [
      {
        required: true,
        message: t("validation.usernameRequired"),
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: t("validation.passwordRequired"),
        trigger: "blur",
      },
    ],
  });

  const loginFormRef = ref(null);

  // Submit form logic
  const submitForm = async () => {
    const valid = await loginFormRef.value.validate();

    if (valid) {
      try {
        loading.value = true;
        const body = {
          Project_id: "PRJ100000000081",
          Request: {
            RequestID: "3",
            Username: loginForm.value.username,
            Password: loginForm.value.password,
            SearchDetail: loginForm.value.username,
          },
        };
        const response = await axios.post(apiUrl + "/login", body);
        if (response.data.error === "3") {
          ElMessage.error(response.data.message);
        } else if (response.data.error === "0") {
          ElMessage.success(t("login_success"));
          const token = JSON.stringify(response.data.data.token);

          //only admin
          if (
            response.data.data.user.USERAD === "ADMIN" &&
            response.data.data.user.POSITION === "ADMIN" &&
            response.data.data.user.EMPID === "ADMIN"
          ) {
            response.data.data.user.DEP_CODE="LVB010010";
            response.data.data.user.ROLE_NAME="CHECKER";
          }
          //
          const user = JSON.stringify(response.data.data.user);
          localStorage.setItem("token", token);
          localStorage.setItem("Profile", user);
          router.push({ name: "Gift" });
        }
      } catch (error) {
        ElMessage.error(t("login_failed"));
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.error(t("login_failed"));
    }
  };

  return {
    loginForm,
    loading,
    rules,
    loginFormRef,
    submitForm,
    User,
    Lock,
  };
}
