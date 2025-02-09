<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  languages: string[];
}>();

const selectedLanguages = defineModel<string[]>({
  default: [],
});

const items = computed(() => {
  const languageCheckboxes: DropdownMenuItem[] = props.languages.map((l) => ({
    label: l.toLocaleUpperCase(),
    icon: "circle-flags:" + l,
    type: "checkbox" as const,
    checked: selectedLanguages.value.includes(l),
    onUpdateChecked(isCheckedNow: boolean) {
      if (isCheckedNow) {
        selectedLanguages.value.push(l);
        return;
      }
      selectedLanguages.value = selectedLanguages.value.filter(
        (lang) => lang !== l
      );
    },
  }));

  const clearAllButton: DropdownMenuItem = {
    label: "Clear All",
    slot: 'clear-all',
    onSelect() {
      selectedLanguages.value = [];
    },
  };

  return [...languageCheckboxes, clearAllButton];
});
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'w-48' }"
  >
    <UButton
      label="Filter Languages"
      color="neutral"
      variant="outline"
      icon="i-lucide-menu"
    />
    <template #clear-all>
      Clear all
    </template>
  </UDropdownMenu>
</template>
