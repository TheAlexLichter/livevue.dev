<script setup lang="ts">
  const { stream } = defineProps<{
    stream: Stream
  }>()

  const streamUrl = computed(() => {
    return `https://www.twitch.tv/${stream.user_name}`
  })
</script>

<template>
  <div>
    <div class="bg-black rounded-lg shadow-md p-4">
      <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-100">{{ stream.title }}</h2>
      <span class="text-sm text-gray-500">{{ stream.type }}</span>
      </div>
      <div class="mt-4 flex items-center">
      <a :href="streamUrl" 
         target="_blank" 
         class="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
        View Stream
      </a>
      <img :src="stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')" :alt="stream.title" class="w-24 h-auto ml-4 rounded">
      </div>
    </div>
  </div>
</template>