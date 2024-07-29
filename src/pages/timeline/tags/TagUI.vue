<script setup lang="ts">
const props = defineProps<{ color: string; displayName: string }>()
defineEmits<{ click: [] }>()
</script>
<template>
  <span class="tag" :style="{ borderColor: props.color }" @click.stop.prevent="$emit('click')">
    {{ props.displayName }}
  </span>
</template>
<style scoped>
.tag {
  padding: 4px;
  border-radius: 4px;
  border: 1px solid blue;
  cursor: pointer;
}
</style>
