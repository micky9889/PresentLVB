import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

export default function usePresent() {
  const { t, locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const fullscreenLoading = ref(false);
  const data = ref([]);
  const isDialogVisible = ref(false); // For dialog visibility    
  const form = ref({
    PRESENT_LA: "",
    PRESENT_EN: "",
    PRESENT_VN: "",
    PCT_ID: null,
  });
  const formRef = ref(null);
  const isEditMode = ref(false);
  const searchTerm = ref("");
  const dataCondition = ref([]);

  // Computed property to get present name based on current locale
  const presentName = (item) => {
    return locale.value === "en"
      ? item.PRESENT_EN
      : locale.value === "la"
      ? item.PRESENT_LA
      : item.PRESENT_VN;
  };
  const conditionName = (item) => {
    return locale.value === "en"
      ? item.CONDITION_EN
      : locale.value === "la"
      ? item.CONDITION_LA
      : item.CONDITION_VN;
  };

  // Load data
  const loadPresent = async () => {
    try {
      fullscreenLoading.value = true;
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present", {
        headers: { access_token: token, api_key: "AX347Z" },
      });

      if (response.data.error === "3") {
        ElMessage.error(t("unauthorize"));
      } else if (response.data.error === "0") {
        data.value = response.data.data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      fullscreenLoading.value = false;
    }
  };

  // Open the edit dialog
  const openEditDialog = (item) => {
    form.value.PRESENT_LA = item.PRESENT_LA;
    form.value.PRESENT_EN = item.PRESENT_EN;
    form.value.PRESENT_VN = item.PRESENT_VN;
    form.value.PS_ID = item.PS_ID;
    form.value.PCT_ID = item.PCT_ID;

    isEditMode.value = true;
    isDialogVisible.value = true;
  };

  // Open the dialog
  const createPresent = () => {
    isDialogVisible.value = true;
  };

  // Reset the form fields and close the dialog
  const resetForm = () => {
    form.value.PRESENT_LA = "";
    form.value.PRESENT_EN = "";
    form.value.PRESENT_VN = "";
    form.value.PCT_ID = null;
    isDialogVisible.value = false;
    isEditMode.value = false; // Reset edit mode
    if (formRef.value) {
      formRef.value.clearValidate(); // Clear validation errors
    }
  };

  // Submit the form
  const submitForm = async () => {
    const valid = await formRef.value.validate();
    if (valid) {
      try {
        const resMessage = await ElMessageBox.confirm(
          isEditMode.value ? t("text_update") : t("text_create"),
          {
            confirmButtonText: t("text_confirm"),
            cancelButtonText: t("cancel"),
            type: "warning",
          }
        );

        fullscreenLoading.value = true;
        const body = {
          PS_ID: isEditMode ? form.value.PS_ID : null,
          NAME_LA: form.value.PRESENT_LA,
          NAME_EN: form.value.PRESENT_EN,
          NAME_VN: form.value.PRESENT_VN,
          PCT_ID: form.value.PCT_ID,
          ACTION: isEditMode.value ? "UPDATE" : "INSERT",
        };

        const token = JSON.parse(localStorage.getItem("token"));
        const header = { access_token: token, api_key: "AX347Z" };
        const response = await axios.post(apiUrl + "/present/action", body, {
          headers: header,
        });

        if (response.data.error === "0") {
          ElMessage.success(response.data.message);
          loadPresent();
          resetForm();
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        fullscreenLoading.value = false;
      }
    } else {
      ElMessage.error(t("create_failed"));
    }
  };

  // Function to normalize Vietnamese characters by removing diacritics
  const normalizeString = (str) => {
    return str
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .toLowerCase(); // Convert to lowercase
  };

  // Filter presents based on search term

  // const filteredPresents = computed(() => {
  //   const normalizedSearchTerm = normalizeString(searchTerm.value);
  //   return data.value.filter((item) =>
  // {
  //    const normalizedPresentsLA = normalizeString(item.PRESENT_LA);
  //     const normalizedPresentsEN = normalizeString(item.PRESENT_EN);
  //     const normalizedPresentsVN = normalizeString(item.PRESENT_VN);

  //     return (
  //       normalizedPresentsLA.includes(normalizedSearchTerm) ||
  //       normalizedPresentsEN.includes(normalizedSearchTerm) ||
  //       normalizedPresentsVN.includes(normalizedSearchTerm)
  //     );
  // }
  //   );
  // });
  //
  const filteredPresents = computed(() => {
    const normalizedSearchTerm = normalizeString(searchTerm.value);
    return data.value.filter((item) => {
      const normalizedPresentName = normalizeString(presentName(item)); // Use computed property for name
      return normalizedPresentName.includes(normalizedSearchTerm);
    });
  });

  //get condition
  const loadCondition = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present/condition", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      dataCondition.value = response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  onMounted(() => {
    loadPresent();
    loadCondition();

  });
  return {
    fullscreenLoading,
    data,
    isDialogVisible,
    form,
    formRef,
    isEditMode,
    searchTerm,
    loadPresent,
    openEditDialog,
    createPresent,
    resetForm,
    submitForm,
    filteredPresents,
    presentName,
    conditionName,
    dataCondition,
  };
}
