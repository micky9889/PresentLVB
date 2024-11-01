import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
const apiUrl = import.meta.env.VITE_API_URL;

export default function useStock() {
  const data = ref([]);
  const searchTerm = ref("");
  const selectedBranch = ref("");
  const profile = ref([]);
  const dataBranch = ref([]);
  const dataGift = ref([]);
  const newPresent = ref({
    PS_ID: "",
    QTT: 1,
    BRN_CODE: "",
  });
  const fullscreenLoading = ref(false);
  const isCreateModalVisible = ref(false);

  const isEditModalVisible = ref(false);
  const editPresent = ref({});
  //permiss branches
  const validBranchCodes = [
    'LVB030', 'LVB031', 'LVB032', 'LVB050', 'LVB051', 'LVB052', 
    'LVB053', 'LVB060', 'LVB070', 'LVB071', 'LVB080', 'LVB081', 
    'LVB090', 'LVB091', 'LVB100', 'LVB110'
  ];
  
  const { t, locale } = useI18n();

  // Function to load data from API
  const loadData = async () => {
    try {
      const body = {
        BRN_CODE: selectedBranch.value || "ALL",
      };

      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(apiUrl + "/present/stock", body, {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      if (response.data.error === "0") {
        data.value = response.data.data;
      } else {
        ElMessage.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Create present
  const createPresent = async () => {
    try {
      fullscreenLoading.value = true;
      const body = {
        PS_ID: newPresent.value.PS_ID,
        QTT: Number(newPresent.value.QTT),
        BRN_CODE: newPresent.value.BRN_CODE,
        EMP_NAME: profile.value.EMPNAME,
        ACTION: "INSERT",
      };

      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(
        apiUrl + "/present/stock/insert",
        body,
        {
          headers: { access_token: token, api_key: "AX347Z" },
        }
      );

      if (response.data.error === "0") {
        ElMessage.success("Present created successfully!");
        isCreateModalVisible.value = false; // Close the modal
        loadData(); // Reload data after creating
        resetNewPresent(); // Reset form data
      } else if (response.data.error === "2") {
        ElMessage.error(t("present_dup"));
      } else {
        ElMessage.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to create present.");
    } finally {
      fullscreenLoading.value = false;
    }
  };
  // Reset the new present object
  const resetNewPresent = () => {
    newPresent.value = {
      PS_ID: "",
      QTT: 1,
      BRN_CODE: "",
    };
  };
  // Open the create modal
  const openCreateModal = () => {
    resetNewPresent();
    newPresent.value.BRN_CODE = profile.value.BRN_CODE;
    isCreateModalVisible.value = true;
  };
  // Filter data based on the search term and selected branch
  const filteredData = computed(() => {
    return data.value.filter((item) => {
      const matchesSearch = item.PRESENT_LA.toLowerCase().includes(
        searchTerm.value.toLowerCase()
      );
      const matchesBranch = selectedBranch.value
        ? item.BRN_CODE === selectedBranch.value
        : true;
      return matchesSearch && matchesBranch;
    });
  });
  // Function to get branch list
  const getBranchList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/branch", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      if (response.data.error === "0") {
        dataBranch.value = response.data.data;
      } else {
        ElMessage.error("get branch failed");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Load gift
  const loadPresent = async () => {
    try {
      fullscreenLoading.value = true;
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      dataGift.value = response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
      fullscreenLoading.value = false;
    }
  };
  // Function to open the edit modal and populate it with the selected data
  const openEditModal = (present) => {
    editPresent.value = { ...present };
    isEditModalVisible.value = true;
  };
  // Function to save the edited data
  const saveEditPresent = async () => {
    try {
      fullscreenLoading.value = true;
      const body = {
        PS_ID: editPresent.value.PS_ID,
        QTT: Number(editPresent.value.QUANTITY),
        BRN_CODE: editPresent.value.BRN_CODE,
        EMP_NAME: profile.value.EMPNAME,
        ACTION: "UPDATE", // Specify that this is an update action
      };

      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(
        apiUrl + "/present/stock/insert",
        body,
        {
          headers: { access_token: token, api_key: "AX347Z" },
        }
      );

      if (response.data.error === "0") {
        ElMessage.success("Present updated successfully!");
        isEditModalVisible.value = false; // Close the modal
        loadData(); // Reload data after editing
      } else {
        ElMessage.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      ElMessage.error("Failed to update present.");
    } finally {
      fullscreenLoading.value = false;
    }
  };
  const validateNumber = (value) => {
    newPresent.value.QTT = value.replace(/[^0-9]/g, "");
  };

  function checkQuantityInput(value) {
    editPresent.value.QUANTITY = value.replace(/[^0-9]/g, "");
  }
  // Get present name based on current locale
  const getPresentName = (row) => {
    if (locale.value === "la") {
      return row.PRESENT_LA;
    } else if (locale.value === "vn") {
      return row.PRESENT_VN;
    } else {
      return row.PRESENT_EN;
    }
  };
  //remove register
  const removeRegister = async (item) => {
    // console.log(item);
    ElMessageBox.confirm(t("text_delete"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(async () => {
        try {
          fullscreenLoading.value = true;
          const body = {
            PS_ID: item.PS_ID,
            QTT: item.QUANTITY,
            BRN_CODE: item.BRN_CODE,
            EMP_NAME: item.EMP_NAME,
            ACTION: "DELETE", // ACTION: INSERT, UPDATE, DELETE
          };
          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.post(
            apiUrl + "/present/stock/insert",
            body,
            {
              headers: { access_token: token, api_key: "AX347Z" },
            }
          );

          if (response.data.error === "0") {
            ElMessage.success("Present delete successfully!");
            await loadData(); // Reload data after editing
          } else {
            ElMessage.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          fullscreenLoading.value = false;
        }
      })
      .catch(() => {});
  };
  // On component mount
  onMounted(() => {
    profile.value = JSON.parse(localStorage.getItem("Profile"));
    if (profile.value && profile.value.BRN_CODE) {
      selectedBranch.value =
        profile.value.DEP_CODE === "LVB010010" ? "" : profile.value.BRN_CODE;

      // selectedBranch.value = profile.value.BRN_CODE==="LVB010"?"":profile.value.BRN_CODE;
    }

    loadData();
    getBranchList();
    loadPresent();
  });

  watch(selectedBranch, (newBranch) => {
    loadData(); // Call loadData whenever selectedBranch changes
  });

  // Define the condition permiss
const isAuthorized = computed(() =>
  profile.value.DEP_CODE === 'LVB010010'
  // profile.value.DEP_CODE === 'LVB010010' || validBranchCodes.includes(profile.value.BRN_CODE)
);

  return {
    Edit,
    data,
    searchTerm,
    selectedBranch,
    profile,
    dataBranch,
    dataGift,
    newPresent,
    fullscreenLoading,
    isCreateModalVisible,
    isEditModalVisible,
    editPresent,
    loadData,
    createPresent,
    resetNewPresent,
    openCreateModal,
    filteredData,
    getBranchList,
    loadPresent,
    openEditModal,
    saveEditPresent,
    validateNumber,
    checkQuantityInput,
    getPresentName,
    removeRegister,
    isAuthorized
  };
}
