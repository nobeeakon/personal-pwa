<script setup lang="ts">
import { ref,  computed } from 'vue'

defineEmits<{ onClose: [value: void]; onAdd: [value: string]; onRemoveItem: [value: string] }>()
const props = defineProps<{ items: string[] }>()
const itemType = ref('')

const filteredList = computed(() =>
  !itemType.value || itemType.value.length < 2
    ? []
    : props.items.filter((item) => item.includes(itemType.value))
)
</script>
<template>
  <form @submit.prevent="$emit('onAdd', itemType)">
    <input required v-model="itemType" />
    <button type="submit">Add</button>
    <button type="button" @click="$emit('onClose')">close</button>
    <div v-if="filteredList.length > 0">
      <button
        v-for="listItem in filteredList"
        :key="listItem"
        @click="$emit('onRemoveItem', listItem)"
      >
        {{ listItem }}
      </button>
    </div>
  </form>
</template>
