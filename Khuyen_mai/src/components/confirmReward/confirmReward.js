import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n"; // For multilingual support
import { Position } from "@element-plus/icons-vue";
import * as XLSX from 'xlsx';
const apiUrl = import.meta.env.VITE_API_URL;

export default function useConfirmReward() {
  const fullscreenLoading = ref(false);
  const accountData = ref([]);
  const { t, locale } = useI18n();
  const searchTerm = ref("");
  const selectedBranch = ref("");
  const dataBranch = ref([]);
  const profile = ref([]);
  const isDialogVisible = ref(false);
  const modalForm = ref({
    EMP_NAME:""
  });

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
          (item) => item.STATUS === "C"
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
      // return (
      //   item.ACCOUNT_NO.toLowerCase().includes(
      //     searchTerm.value.toLowerCase()
      //   ) ||
      //   item.ACCOUNT_NAME.toLowerCase().includes(searchTerm.value.toLowerCase())
      // );
            
      const matchesSearch = item.ACCOUNT_NO.toLowerCase().includes(
        searchTerm.value.toLowerCase()
      ) ||
      item.ACCOUNT_NAME.toLowerCase().includes(searchTerm.value.toLowerCase())
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
  // edit again
  const editAgain=async(item)=>{
  //confirmReward
    ElMessageBox.confirm(t("text_edit_again"), {
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
            ACTION: "REMOVE",
          };
          // console.log("body", body);

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
            // window.location.reload();
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
  }
  //lookDetail
  const lookDetail=(row)=>{
    isDialogVisible.value=true
    modalForm.value={
      EMP_NAME:row.EMP_NAME
    }
    console.log('row',row.EMP_NAME);
  }
  //download to excel
  const exportToExcel=async()=>{
    console.log('approved=>',accountData.value);
    
    if (accountData.value.length === 0) {
      ElMessage.warning("No data to export");
      return;
    }
  
    // Convert accountData to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(accountData.value);
  
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "client approved");
  
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "client_approved.xlsx");
  }

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
    selectedBranch,
    dataBranch,
    profile,
    editAgain,
    lookDetail,
    isDialogVisible,
    modalForm,
    exportToExcel
  };
}
