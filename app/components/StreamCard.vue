<script setup lang="ts">
const { stream } = defineProps<{
  stream: Stream;
}>();

const streamUrl = computed(() => {
  return `https://www.twitch.tv/${stream.user_name}`;
});

const thumbnailUrl = computed(() => {
  return stream.thumbnail_url.replace("{width}", "640").replace("{height}", "360");
});

</script>

<template>
  <UCard
    variant="subtle"
    :href="streamUrl"
    target="_blank"
    class="relative overflow-hidden hover:scale-105 transition-transform"
    :ui="{
      body: 'p-0 sm:p-0',
    }"
  >
    <a :href="streamUrl" target="_blank">
      <span class="absolute inset-0 z-10 flex items-center justify-center" />
    </a>
    <img :src="thumbnailUrl" :alt="stream.title" class="w-full aspect-video object-cover">
    <div class="p-4">
      <h3 class="text-(--ui-text-highlighted) font-bold truncate">{{ stream.title }}</h3>
      <p class="text-(--ui-text-muted) text-sm mt-1">{{ stream.user_name }}</p>
      <div class="flex items-center mt-2">
        <span class="relative flex size-2">
          <span class="absolute bg-red-500 inline-flex size-full animate-ping rounded-full opacity-75" />
          <span class="relative bg-red-500 inline-flex size-2 scale-90 rounded-full" />
        </span>
        <span class="text-(--ui-text-muted) text-sm ml-2">{{ stream.viewer_count }} viewers</span>
      </div>
    </div>
  </UCard>
</template>
