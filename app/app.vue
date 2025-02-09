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
      <div class="grid grid-cols-12 justify-center items-center">
        <div></div>
        <div class="text-center col-span-10">
          <h1 class="text-3xl font-bold">LiveVue.dev</h1>
          <h2>Live streams about Vue.js and Nuxt.js</h2>
        </div>
        <div class="ml-auto">
          <ColorModeButton />
        </div>
      </div>
      <div class="my-4 mt-8 flex justify-center">
        <URadioGroup
          size="xl"
          orientation="horizontal"
          v-model="selectedItem"
          :items="items"
          :disabled="status === 'pending'"
        />
      </div>
      <!-- TODO: Overlay when loading -->
      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-8 my-16">
        <StreamCard v-for="stream in results" :stream />
      </div>
      <footer class="flex justify-center mt-8">
        <div>
          Find the code on
          <NuxtLink
            target="_blank"
            href="https://github.com/TheAlexLichter/livevue.dev"
            aria-label="GitHub"
          >
            <Icon name="lucide:github" />
          </NuxtLink>
        </div>
      </footer>
    </div>
  </UApp>
</template>
