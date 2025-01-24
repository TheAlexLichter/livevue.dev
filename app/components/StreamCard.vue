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
  <a :href="streamUrl" target="_blank" class="block bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
    <img :src="thumbnailUrl" :alt="stream.title" class="w-full aspect-video object-cover">
    <div class="p-4">
      <h3 class="text-white font-bold truncate">{{ stream.title }}</h3>
      <p class="text-gray-400 text-sm mt-1">{{ stream.user_name }}</p>
      <div class="flex items-center mt-2">
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
        <span class="text-gray-400 text-sm ml-2">{{ stream.viewer_count }} viewers</span>
      </div>
    </div>
  </a>
</template>
