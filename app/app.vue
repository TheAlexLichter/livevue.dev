<script setup lang="ts">
const items = ref([
  { label: "All", value: "all" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
]);

const selectedTag = ref("all");
const params = computed(() => ({
  tag: selectedTag.value === "all" ? undefined : selectedTag.value,
}));

const {
  data: results,
  refresh,
  status,
} = await useFetch("/api/streams", {
  params,
});

const languages = computed(() => {
  // TODO: Show list of possible/common languages, but weighted by current streams
  const langs = results.value?.streams.map((stream) => stream.language) ?? [];
  return Array.from(new Set(langs));
});

const selectedLanguages = ref<string[]>([]);

const streamsFilteredByLanguage = computed(() => {
  if (!selectedLanguages.value.length) {
    return results.value?.streams;
  }
  return results.value?.streams.filter((stream) =>
    selectedLanguages.value.includes(stream.language)
  );
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
        <div>
          <LanguageDropdown
            :languages="languages"
            v-model="selectedLanguages"
          />
        </div>
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
          v-model="selectedTag"
          :items="items"
          :disabled="status === 'pending'"
        />
      </div>
      <!-- TODO: Overlay when loading -->
      <div
        v-if="streamsFilteredByLanguage?.length"
        class="grid md:grid-cols-2 xl:grid-cols-4 gap-8 my-16"
      >
        <StreamCard v-for="stream in streamsFilteredByLanguage" :stream />
      </div>
      <template v-else>
        <!-- Error State :( -->
        <StreamEmptyState v-if="results?.streams.length">
          No streams found for the selected
          {{ selectedTag !== "all" ? "tags and" : "" }}
          language{{ selectedLanguages.length > 1 ? "s" : "" }}
        </StreamEmptyState>
        <StreamEmptyState v-else-if="selectedTag !== 'all'">
          No streams found for the selected tag
        </StreamEmptyState>
        <StreamEmptyState v-else>No streams found</StreamEmptyState>
      </template>
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
