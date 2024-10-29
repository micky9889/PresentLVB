import { Position } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { el } from "element-plus/es/locales.mjs";
import { onMounted, ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n"; // For multilingual support
const apiUrl = import.meta.env.VITE_API_URL;

export default function useUser() {
  const accountData = ref([]);
  const accountDataR = ref([]);
  const fullscreenLoading = ref(false);
  const searchTerm = ref("");
  const currentPage = ref(1); // current page for pagination
  const pageSize = ref(10); // number of items per page
  const editPresent = ref({});
  const dataGift = ref([]);
  const filteredGiftsDer = ref([]);
  const dataBranch = ref([]);
  const selectedBalanceRange = ref("");
  const dataStock = ref([]);
  const presentName = ref("");
  const statusName = ref("");
  const profile = ref([]);
  const selectedDateRange = ref([]);
  const isUpdateModalVisible = ref(false);
  const isUpdateBtn = ref(false);
  const stock = ref(0);
  const dataToClose = ref(0);
  const noSave = ref(false);
  const save = ref(false);
  //
  const newPresent = ref({
    PS_ID: null,
    QTT: 0,
    BRN_CODE: "",
    ACCOUNT_NO: "",
    ACCOUNT_NAME: "",
    BALANCE: "",
    DATE_OPEN: "",
    DEPOSIT_END: "",
    DES: "",
    CIF_NO: "",
  });
  const isCreateModalVisible = ref(false);
  const dataStatus = ref([
    {
      id: "P",
      valueEN: "Pending",
      valueLA: "ລໍຖ້າອະນຸມັດ",
      valueVN: "Chờ chấp thuận",
    },
    { id: "C", valueEN: "Approve", valueLA: "ອະນຸມັດ", valueVN: "Chấp thuận" },
    { id: "R", valueEN: "Reject", valueLA: "ປະຕີເສດ", valueVN: "Từ chối" },
  ]);

  const { t, locale } = useI18n();

  // Currency formatting function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {}).format(amount);
  };
  // Get present name based on current locale
  const getStatus = (row) => {
    if (locale.value === "la") {
      return row.valueLA;
    } else if (locale.value === "vn") {
      return row.valueVN;
    } else {
      return row.valueEN;
    }
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
  //branch list
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
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      dataGift.value = response.data.data;
    } catch (error) {
      console.log(error);
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
        accountData.value = response.data.data;
        // console.log("data der", accountData.value);
      } else {
        ElMessage.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      fullscreenLoading.value = false;
    }
  };
  //version old
  // const filteredData = computed(() => {
  //   return  statusName.value=="R"?accountDataR.value.filter((item) => {
  //     const matchesSearchTerm =
  //       item.ACCOUNT_NO.toLowerCase().includes(
  //         searchTerm.value.toLowerCase()
  //       ) ||
  //       item.ACCOUNT_NAME.toLowerCase().includes(
  //         searchTerm.value.toLowerCase()
  //       );
  //     //range balance
  //     // const matchesBalanceRange = (() => {
  //     //   if (!selectedBalanceRange.value) return true; // If no range selected, include all
  //     //   const [min, max] = selectedBalanceRange.value.split("-").map(Number);
  //     //   const balance = item.BALANCE;
  //     //   return balance >= (min || 0) && (max ? balance <= max : true);
  //     // })();

  //     //present name
  //     // const matchesPresentName = presentName.value
  //     //   ? item.PS_ID === presentName.value
  //     //   : true;

  //     //Status

  //     const matchesStatus = statusName.value
  //       ? item.STATUS === statusName.value
  //       : true;

  //     // Date filtering logic
  //     const matchesDateRange = (() => {
  //       if (!selectedDateRange.value || selectedDateRange.value.length !== 2)
  //         return true; // If no date range is selected, include all
  //       const [startDate, endDate] = selectedDateRange.value;

  //       const dateOpen = new Date(item.DATE_OPEN).setHours(0, 0, 0, 0);
  //       const start = new Date(startDate).setHours(0, 0, 0, 0);
  //       const end = new Date(endDate).setHours(23, 59, 59, 0);

  //       return dateOpen >= start && dateOpen <= end;
  //     })();

  //     //match Creator
  //     const matchCreator = profile.value.EMPNAME
  //       ? item.EMP_NAME === profile.value.EMPNAME
  //       : true;

  //     return (
  //       matchesSearchTerm &&
  //       matchesStatus &&
  //       // matchesBalanceRange &&
  //       // matchesPresentName &&
  //       matchCreator &&
  //       matchesDateRange
  //     );
  //   }) : accountData.value.filter((item) => {
  //     const matchesSearchTerm =
  //       item.ACCOUNT_NO.toLowerCase().includes(
  //         searchTerm.value.toLowerCase()
  //       ) ||
  //       item.ACCOUNT_NAME.toLowerCase().includes(
  //         searchTerm.value.toLowerCase()
  //       );
  //     //range balance
  //     // const matchesBalanceRange = (() => {
  //     //   if (!selectedBalanceRange.value) return true; // If no range selected, include all
  //     //   const [min, max] = selectedBalanceRange.value.split("-").map(Number);
  //     //   const balance = item.BALANCE;
  //     //   return balance >= (min || 0) && (max ? balance <= max : true);
  //     // })();

  //     //present name
  //     // const matchesPresentName = presentName.value
  //     //   ? item.PS_ID === presentName.value
  //     //   : true;

  //     //Status

  //     const matchesStatus = statusName.value
  //       ? item.STATUS === statusName.value
  //       : true;

  //     // Date filtering logic
  //     const matchesDateRange = (() => {
  //       if (!selectedDateRange.value || selectedDateRange.value.length !== 2)
  //         return true; // If no date range is selected, include all
  //       const [startDate, endDate] = selectedDateRange.value;

  //       const dateOpen = new Date(item.DATE_OPEN).setHours(0, 0, 0, 0);
  //       const start = new Date(startDate).setHours(0, 0, 0, 0);
  //       const end = new Date(endDate).setHours(23, 59, 59, 0);

  //       return dateOpen >= start && dateOpen <= end;
  //     })();

  //     //match Creator
  //     const matchCreator = profile.value.EMPNAME
  //       ? item.EMP_NAME === profile.value.EMPNAME
  //       : true;

  //     return (
  //       matchesSearchTerm &&
  //       matchesStatus &&
  //       // matchesBalanceRange &&
  //       // matchesPresentName &&
  //       matchCreator &&
  //       matchesDateRange
  //     );
  //   });
  // });
  //refactor filter
  const filteredData = computed(() => {
    const applyFilters = (item) => {
      const matchesSearchTerm =
        item.ACCOUNT_NO.toLowerCase().includes(
          searchTerm.value.toLowerCase()
        ) ||
        item.ACCOUNT_NAME.toLowerCase().includes(
          searchTerm.value.toLowerCase()
        );

      const matchesStatus = statusName.value
        ? item.STATUS === statusName.value
        : true;

      const matchesDateRange = (() => {
        if (!selectedDateRange.value || selectedDateRange.value.length !== 2)
          return true;
        const [startDate, endDate] = selectedDateRange.value;

        const dateOpen = new Date(item.DATE_OPEN).setHours(0, 0, 0, 0);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 0);

        return dateOpen >= start && dateOpen <= end;
      })();
      // console.log(item.EMP_NAME);
      // console.log(profile.value.EMPNAME);

      const matchesCreator = profile.value.EMPNAME
        ? item.EMP_NAME.trim() === profile.value.EMPNAME.trim()
        : true;

      return (
        matchesSearchTerm && matchesStatus && matchesCreator && matchesDateRange
      );
    };

    return statusName.value === "R"
      ? accountDataR.value.filter(applyFilters)
      : accountData.value.filter(applyFilters);
  });

  // Paginated data for the table
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
  });
  // Handle page change
  const handlePageChange = (newPage) => {
    currentPage.value = newPage;
  };
  // Handle page size change
  const handleSizeChange = (newSize) => {
    pageSize.value = newSize; // Update the pageSize based on user selection
    currentPage.value = 1; // Reset to the first page whenever the size changes
  };

  //get stock
  const getStock = async () => {
    try {
      const body = {
        BRN_CODE: "ALL",
      };

      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(apiUrl + "/present/stock", body, {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      if (response.data.error === "0") {
        dataStock.value = response.data.data;
      } else {
        ElMessage.error(response.data.message);
      }
      //

      //
    } catch (error) {
      console.log(error);
    }
  };

  //reset form
  const resetNewPresent = () => {
    newPresent.value = {
      PS_ID: null,
      QTT: 0,
      BRN_CODE: "",
      ACCOUNT_NO: "",
      ACCOUNT_NAME: "",
      BALANCE: "",
      DATE_OPEN: "",
      DEPOSIT_END: "",
      DES: "",
      CIF_NO: "",
    };
  };
  // Open the create modal
  const openCreateModal = async () => {
    resetNewPresent();
    profile.value = JSON.parse(localStorage.getItem("Profile"));
    newPresent.value.BRN_CODE = profile.value.BRN_CODE;
    isCreateModalVisible.value = true;
  };
  //open model edit
  const openEditDialog = async (item) => {
    resetNewPresent();
    profile.value = JSON.parse(localStorage.getItem("Profile"));
    isUpdateModalVisible.value = true;
    dataToClose.value = item;
    // await updateQuantity(item);
    editPresent.value = { ...item };
    // dataGift.value = dataStock.value.filter(
    //   (item) => item.BRN_CODE === profile.value.BRN_CODE && item.QUANTITY > 0
    // );
  };
  //close model edit
  const closeEditModal = async () => {
    isUpdateModalVisible.value = false;
    noSave.value = !isUpdateBtn.value && !isUpdateModalVisible.value;
    if (noSave.value) {
      save.value = false;
    }
    // await updateQuantity(dataToClose.value);
  };
  //update quantity
  // const updateQuantity = async (item) => {
  //   try {
  //     if (noSave.value) {
  //       if (dataStock.value && Array.isArray(dataStock.value)) {
  //         stock.value =
  //           dataStock.value.filter(
  //             (value) =>
  //               value.BRN_CODE === item.BRN_CODE && value.PS_ID === item.PS_ID
  //           )[0].QUANTITY - 1;
  //       }
  //     } else if (save.value) {
  //       return;
  //     } else {
  //       if (dataStock.value && Array.isArray(dataStock.value)) {
  //         stock.value =
  //           dataStock.value.filter(
  //             (value) =>
  //               value.BRN_CODE === item.BRN_CODE && value.PS_ID === item.PS_ID
  //           )[0].QUANTITY + 1;
  //       }
  //     }
  //     const body = {
  //       PS_ID: item.PS_ID,
  //       QTT: stock.value,
  //       BRN_CODE: item.BRN_CODE,
  //       EMP_NAME: item.EMP_NAME || profile.value.EMPNAME,
  //       ACTION: "UPDATE", // Specify that this is an update action
  //     };

  //     const token = JSON.parse(localStorage.getItem("token"));
  //     const response = await axios.post(
  //       apiUrl + "/present/stock/insert",
  //       body,
  //       {
  //         headers: { access_token: token, api_key: "AX347Z" },
  //       }
  //     );

  //     if (response.data.error === "0") {
  //       ElMessage.success("Present updated successfully!");
  //       // loadData(); // Reload data after editing
  //       await getStock();
  //     } else {
  //       ElMessage.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     ElMessage.error("Failed to update present");
  //   }
  // };

  //save Edit
  const saveEditPresent = async () => {
    ElMessageBox.confirm(t("text_edit"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(async () => {
        try {
          fullscreenLoading.value = true;

          const body = {
            PS_ID: editPresent.value.PS_ID,
            QTT: 1,
            BRN_CODE: editPresent.value.BRN_CODE,
            ACCOUNT_NO: editPresent.value.ACCOUNT_NO,
            ACCOUNT_NAME: editPresent.value.ACCOUNT_NAME,
            DATE_OPEN: editPresent.value.DATE_OPEN,
            BALANCE: editPresent.value.BALANCE,
            DEPOSIT_END: Number(editPresent.value.DEPOSIT_END),
            DES: editPresent.value.DES,
            CIF_NO: editPresent.value.CIF_NO,
            EMP_NAME: editPresent.value.EMP_NAME || profile.value.EMPNAME,
            ACTION: "EDIT",
          };

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
            isUpdateBtn.value = true;
            save.value = true;
            isUpdateModalVisible.value = false; // Close the modal
            // console.log("click edit");

            await loadData(); // Reload data after creating
            // resetNewPresent();
          } else if (response.data.error === "2") {
            ElMessage.error(t("account_dup"));
          } else {
            ElMessage.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
          ElMessage.error(response.data.message);
        } finally {
          fullscreenLoading.value = false;
        }
      })
      .catch(() => {});
  };

  const validateNumber = (event) => {
    newPresent.value.ACCOUNT_NO = event.replace(/[^0-9]/g, "");
  };
  const validateNumberBal = (event) => {
    newPresent.value.BALANCE = event.replace(/[^0-9]/g, "");
  };
  const validateNumberCif = (event) => {
    newPresent.value.CIF_NO = event.replace(/[^0-9]/g, "");
  };
  const validateNumberDep = (event) => {
    newPresent.value.DEPOSIT_END = event.replace(/[^0-9]/g, "");
  };
  const validateNumberE = (event) => {
    editPresent.value.ACCOUNT_NO = event.replace(/[^0-9]/g, "");
  };
  const validateNumberBalE = (event) => {
    editPresent.value.BALANCE = event.replace(/[^0-9]/g, "");
  };
  const validateNumberCifE = (event) => {
    editPresent.value.CIF_NO = event.replace(/[^0-9]/g, "");
  };
  const validateNumberDepE = (event) => {
    editPresent.value.DEPOSIT_END = event.replace(/[^0-9]/g, "");
  };

  // Create present
  const createPresent = async () => {
    ElMessageBox.confirm(t("text_create"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(async () => {
        try {
          fullscreenLoading.value = true;
          const body = {
            PS_ID: newPresent.value.PS_ID,
            QTT: 1,
            BRN_CODE: newPresent.value.BRN_CODE,
            ACCOUNT_NO: newPresent.value.ACCOUNT_NO,
            ACCOUNT_NAME: newPresent.value.ACCOUNT_NAME,
            DATE_OPEN: newPresent.value.DATE_OPEN,
            BALANCE: newPresent.value.BALANCE,
            DEPOSIT_END: Number(newPresent.value.DEPOSIT_END),
            DES: newPresent.value.DES,
            CIF_NO: newPresent.value.CIF_NO,
            EMP_NAME: profile.value.EMPNAME,
            ACTION: "WITHDRAW", // ACTION: WITHDRAW, AUTHORIZE,EDIT
          };
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
            isCreateModalVisible.value = false; // Close the modal
            loadData(); // Reload data after creating
            // resetNewPresent();
          } else if (response.data.error === "2") {
            ElMessage.error(t("account_dup"));
          } else {
            ElMessage.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
          ElMessage.error(response.data.message);
        } finally {
          fullscreenLoading.value = false;
        }
      })
      .catch(() => {});
  };
  //
  //min date start
  const disabledDate = (time) => {
    return time.getTime() < new Date("2024-10-14");
  };
  //min date end
  const disabledDateEnd = (time) => {
    // console.log("date open", newPresent.value.DATE_OPEN);

    return time.getTime() <= new Date(newPresent.value.DATE_OPEN);
  };
  //removeClient
  const removeClient = (item) => {
    // console.log("delete", item);

    ElMessageBox.confirm(t("text_delete"), {
      confirmButtonText: t("text_confirm"),
      cancelButtonText: t("cancel"),
      type: "warning",
    })
      .then(async () => {
        try {
          fullscreenLoading.value = true;
          const body = {
            ACCOUNT_NO: item.ACCOUNT_NO,
            PS_ID: String(item.PS_ID),
            BRN_CODE: item.BRN_CODE,
          };
          // console.log("body", body);

          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.post(
            apiUrl + "/present/reward/delete",
            body,
            {
              headers: { access_token: token, api_key: "AX347Z" },
            }
          );
          // console.log("res", response.data.error);
          if (response.data.error === "0") {
            await loadData();
            ElMessage.success(response.data.message);
          }
        } catch (error) {
        } finally {
          fullscreenLoading.value = false;
        }
      })
      .catch(() => {});
  };

  const filteredGifts = computed(() => {
    // console.log('BRN_CODE',newPresent.value.BRN_CODE);
    // console.log('pro_BRN_CODE', profile.value.BRN_CODE);

    const invalidStockItems = dataStock.value.filter(
      (item) => item.BRN_CODE === newPresent.value.BRN_CODE && item.QUANTITY > 0
    );
    return invalidStockItems;
  });

  // data rejection
  const dataRejection = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(apiUrl + "/present/rejections", {
        headers: { access_token: token, api_key: "AX347Z" },
      });
      // console.log("Data fetched:", response.data.data);
      accountDataR.value = response.data.data.filter(
        (item) => item.STATUS === "R"
      );
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  watch(statusName, (newVal) => {
    if (newVal === "R") {
      dataRejection();
    }
  });
  onMounted(() => {
    profile.value = JSON.parse(localStorage.getItem("Profile"));
    statusName.value = "P";
    loadData();
    getStock();
    loadPresent();
    getBranchList();
    // dataRejection()
  });
  return {
    Position,
    accountData,
    fullscreenLoading,
    searchTerm,
    currentPage,
    pageSize,
    editPresent,
    dataGift,
    dataBranch,
    selectedBalanceRange,
    dataStock,
    presentName,
    statusName,
    newPresent,
    profile,
    isCreateModalVisible,
    formatCurrency,
    getPresentName,
    getBranchList,
    loadPresent,
    loadData,
    filteredData,
    paginatedData,
    handlePageChange,
    handleSizeChange,
    getStock,
    selectedDateRange,
    openCreateModal,
    resetNewPresent,
    validateNumber,
    createPresent,
    validateNumberBal,
    validateNumberCif,
    validateNumberE,
    validateNumberBalE,
    validateNumberCifE,
    validateNumberDepE,
    dataStatus,
    getStatus,
    disabledDate,
    disabledDateEnd,
    removeClient,
    validateNumberDep,
    filteredGiftsDer,
    filteredGifts,
    openEditDialog,
    isUpdateModalVisible,
    saveEditPresent,
    closeEditModal,
  };
}
