<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>

import { onMounted, onBeforeUnmount } from 'vue';

const LAST_VISIT_KEY = "lastVisit";

const isBrowserClose = () => {
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
  const currentTime = Date.now();

  // Check if the last visit was recent (within 1 second, which indicates a refresh)
  if (lastVisit && currentTime - parseInt(lastVisit) < 1000) {
    return false; // This means the page was reloaded
  }
  return true; // This means the browser or tab was closed
};

onMounted(() => {
  if (isBrowserClose()) {
    localStorage.clear(); // Clear storage if the browser or tab was closed
  }

  // Add event listener to set the last visit time on unload
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
  });
});

onBeforeUnmount(() => {
  // Clean up the event listener
  window.removeEventListener("beforeunload", () => {
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
