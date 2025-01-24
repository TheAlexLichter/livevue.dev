<script setup lang="ts">
const items = ref([
  { label: "All", value: "all" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
]);

const selectedItem = ref("vue");
const params = computed(() => ({
  tag: selectedItem.value === "all" ? undefined : selectedItem.value,
}));

const { data: results, refresh } = await useFetch("/api/streams", {
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
    <h1 class="text-3xl font-bold underline">
      Some Nuxt/Vue Streamer Overview App ;) (NAME WANTED)
    </h1>
    <ColorModeButton />
    <URadioGroup
      orientation="horizontal"
      v-model="selectedItem"
      :items="items"
    />
    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8 my-8 px-4 md:px-0">
      <StreamCard v-for="stream in results" :stream />
    </div>
  </UApp>
</template>
