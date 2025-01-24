<script setup lang="ts">
const { data: results } = await useFetch("/api/streams");
</script>

<template>
  <UApp>
    <h1 class="text-3xl font-bold underline">
      Some Nuxt/Vue Streamer Overview App ;) (NAME WANTED)
    </h1>
    <div class="grid grid-cols-4 gap-4 mt-8">
      <StreamCard v-for="stream in results" :stream />
    </div>
  </UApp>
</template>
