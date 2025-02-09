<script setup lang="ts">
const items = ref([
  { label: "All", value: "all" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
]);

const selectedItem = ref("all");
const params = computed(() => ({
  tag: selectedItem.value === "all" ? undefined : selectedItem.value,
}));

const {
  data: results,
  refresh,
  status,
} = await useFetch("/api/streams", {
  params,
});

// Refresh every minute
onMounted(() => {
  setInterval(() => {
    refresh();
  }, 60 * 1000);
});
</script>

<template>
  <UApp>
    <div class="p-2 md:p-4 lg:p-8">
      <h1 class="text-3xl font-bold">
        LiveVue.dev - Live streams about Vue.js and Nuxt.js
      </h1>
      <ColorModeButton />
      <div class="my-4">
        <URadioGroup
        orientation="horizontal"
        v-model="selectedItem"
        :items="items"
        :disabled="status === 'pending'"
      />
      </div>
      <!-- TODO: Overlay when loading -->
      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8 my-8">
        <StreamCard v-for="stream in results" :stream />
      </div>
    </div>
  </UApp>
</template>
