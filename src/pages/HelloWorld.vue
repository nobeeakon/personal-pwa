<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { localStorageUtil } from '../utils/localStorage';

type StoredValues = {id: string;displayName: string;value: string}

const getRandomId = () =>  crypto.randomUUID()

const LOCAL_STORAGE_KEYS = {
  copy: 'copy-text-value'
}

const itemsToCopy = ref<StoredValues[]>([])
const newValue = ref<Pick<StoredValues, 'displayName'|'value'>>({displayName: '', value: ''})

// set initial values
onMounted(() => {
  const storedValues = localStorageUtil.get<StoredValues[]>(LOCAL_STORAGE_KEYS.copy);

  if (storedValues && Array.isArray(storedValues) ) {
    const filteredValues = storedValues.filter(storedItem => storedItem.displayName && storedItem.id && storedItem.value)
    itemsToCopy.value = filteredValues
  }
})

const onAddNewValue = () => {
  itemsToCopy.value.push({displayName: newValue.value.displayName, value: newValue.value.value, id: getRandomId()})
  localStorageUtil.set(LOCAL_STORAGE_KEYS.copy, itemsToCopy.value)
}

const onRemoveValue = (itemId: string) => {
  itemsToCopy.value = itemsToCopy.value.filter(item=> item.id !== itemId)
  localStorageUtil.set(LOCAL_STORAGE_KEYS.copy, itemsToCopy.value)
}

const copyValue = (storedItem: StoredValues) => {
  navigator.clipboard.writeText(storedItem.value)
}

</script>

<template>

<form @submit.prevent="onAddNewValue">
  <label>Text: <input v-model="newValue.displayName" required></label>
  <label>Value: <input v-model="newValue.value" required></label>
  <button>guardar</button>
</form>

<ul>
  <li v-for="item in itemsToCopy">
    <button @click="copyValue(item)">{{ item.displayName }}</button> &nbsp;&nbsp;&nbsp;<button @click="() => onRemoveValue(item.id)">x</button>
  </li>
</ul>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
