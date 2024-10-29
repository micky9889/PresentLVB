import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n"; // For multilingual support
import { Position } from "@element-plus/icons-vue";
const apiUrl = import.meta.env.VITE_API_URL;

export default function useAuthor() {
  const fullscreenLoading = ref(false);
  const accountData = ref([]);
  const { t, locale } = useI18n();
  const searchTerm = ref("");
  const selectedBranch = ref("");
  const dataBranch = ref([]);
  const profile = ref([]);
  const isDialogVisible = ref(false);
  const dataReject = ref([]);
  const rejectForm = ref({
    DES: "",
  });
  const formRef = ref(null);

  // Currency formatting function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {}).format(amount);
  };
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
  //load data
  const loadData = async () => {
    try {
      fullscreenLoading.value = true;
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present/reward", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      if (response.data.error === "0") {
        accountData.value = response.data.data.filter(
          (item) => item.STATUS === "P"
        );
      } else {
        ElMessage.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      fullscreenLoading.value = false;
    }
  };
  //filter data
  const filteredData = computed(() => {
    return accountData.value.filter((item) => {
      //
      // return (
      //   item.ACCOUNT_NO.toLowerCase().includes(
      //     searchTerm.value.toLowerCase()
      //   ) ||
      //   item.ACCOUNT_NAME.toLowerCase().includes(searchTerm.value.toLowerCase())
      // );
      //
      const matchesSearch =
        item.ACCOUNT_NO.toLowerCase().includes(
          searchTerm.value.toLowerCase()
        ) ||
        item.ACCOUNT_NAME.toLowerCase().includes(
          searchTerm.value.toLowerCase()
        );
      const matchesBranch = selectedBranch.value
        ? item.BRN_CODE === selectedBranch.value
        : true;
      return matchesSearch && matchesBranch;
    });
  });
  //confirmReward
  const confirmRewawrd = async (item) => {
    ElMessageBox.confirm(t("text_authorize"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(async () => {
        const profile = JSON.parse(localStorage.getItem("Profile"));
        // console.log('profile=>',profile);

        try {
          fullscreenLoading.value = true;
          const body = {
            PS_ID: item.PS_ID,
            QTT: 1,
            BRN_CODE: item.BRN_CODE,
            ACCOUNT_NO: item.ACCOUNT_NO,
            ACCOUNT_NAME: item.ACCOUNT_NAME,
            DATE_OPEN: item.DATE_OPEN,
            BALANCE: item.BALANCE,
            DEPOSIT_END: item.DEPOSIT_END,
            DES: item.DES,
            CIF_NO: item.CIF_NO,
            EMP_NAME: profile.EMPNAME,
            ACTION: "AUTHORIZE",
          };
          console.log("body", body);

          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.post(
            apiUrl + "/present/stock/action",
            body,
            {
              headers: { access_token: token, api_key: "AX347Z" },
            }
          );
          if (response.data.error === "0") {
            ElMessage.success(response.data.message);
            await loadData();
            window.location.reload();
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
  //open remove reward
  const rejectRewawrd = async (item) => {
    if (formRef.value) {
      formRef.value.clearValidate(); // Clear validation errors
    }
    isDialogVisible.value = true;
    rejectForm.value = { ...item, DES: "" };
  };
  //validate whitespace
  const validateDescription = (rule, value, callback) => {
    if (!value || !value.trim()) {
      callback(new Error(t('validate_reject'))); // Custom error message
    } else {
      callback();
    }
  };
  //submit reject
  const submitForm = async () => {
    const valid = await formRef.value.validate();
        
    if (valid) {
      ElMessageBox.confirm(t("text_reject"), {
        confirmButtonText: t("text_confirm"),
        cancelButtonText: t("cancel"),
        type: "warning",
      })
        .then(async () => {
          const profile = JSON.parse(localStorage.getItem("Profile"));
          try {
            const body = {
              PS_ID: rejectForm.value.PS_ID,
              QTT: 1,
              BRN_CODE: rejectForm.value.BRN_CODE,
              ACCOUNT_NO: rejectForm.value.ACCOUNT_NO,
              ACCOUNT_NAME: rejectForm.value.ACCOUNT_NAME,
              DATE_OPEN: rejectForm.value.DATE_OPEN,
              BALANCE: rejectForm.value.BALANCE,
              DEPOSIT_END: rejectForm.value.DEPOSIT_END,
              DES: rejectForm.value.DES,
              EMP_NAME: rejectForm.value.EMP_NAME,
              CIF_NO: rejectForm.value.CIF_NO,
              ACTION: "REJECTION",
            };
            // console.log("bodyreject=", body);

            const token = JSON.parse(localStorage.getItem("token"));
            const response = await axios.post(
              apiUrl + "/present/stock/action",
              body,
              {
                headers: { access_token: token, api_key: "AX347Z" },
              }
            );
            if (response.data.error === "0") {
              ElMessage.success(response.data.message);
              await loadData();
              isDialogVisible.value = false;
              // window.location.reload();
            } else {
              ElMessage.error(response.data.message);
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {});
    } else {
      ElMessage.error(t("create_failed"));
    }
  };

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

  onMounted(() => {
    loadData();
    getBranchList();
    profile.value = JSON.parse(localStorage.getItem("Profile"));
    if (profile.value && profile.value.BRN_CODE) {
      selectedBranch.value =
        profile.value.DEP_CODE === "LVB010010" ? "" : profile.value.BRN_CODE;
      // selectedBranch.value = profile.value.BRN_CODE==="LVB010"?"":profile.value.BRN_CODE;
    }
  });
  // ard ja mi wacth
  // watch(selectedBranch, (newBranch) => {
  //   loadData(); // Call loadData whenever selectedBranch changes
  // });

  return {
    Position,
    searchTerm,
    fullscreenLoading,
    accountData,
    filteredData,
    loadData,
    formatCurrency,
    getPresentName,
    confirmRewawrd,
    selectedBranch,
    dataBranch,
    profile,
    rejectRewawrd,
    isDialogVisible,
    rejectForm,
    formRef,
    submitForm,
    validateDescription
  };
}
