import { defineStore } from "pinia";

export const useGiftStore = defineStore("Gift", {
  state: () => ({
    present: [],
  }),
  actions: {
    setPresent(data) {
      this.present = data;
    },
  },
  getters: {},
});
