import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"

 // Import the router
import router from './router'; 
// Import Pinia
import { createPinia } from 'pinia';
 // Import i18n configuration
import i18n from './i18n';

// Element Plus and its styles
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router); 
app.use(ElementPlus);
app.use(i18n);

app.mount("#app");
