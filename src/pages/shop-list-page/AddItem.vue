<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {  STORAGE_KEYS } from './localStorageUtil'
import { localStorageUtil, normalizeString } from '../../utils/localStorage'
import ItemTypes from './ItemTypes.vue'

type ItemType = { type: string; name: string }
const emit = defineEmits<{
  onAddItem: [newItem: ItemType]
}>()

const showItemTypesForm = ref(false)
const shopItemTypes = ref<string[]>([])
const itemOptions = ref<ItemType[]>([])
const itemToAdd = ref<ItemType>({
  type: '',
  name: ''
})

const handleSubmit = () => {
  emit('onAddItem', itemToAdd.value)
  const storedItems = localStorageUtil.get<ItemType[]>(STORAGE_KEYS.shopPreviousBoughtItems) ?? []
  if (
    !storedItems.find(
      (item) => item.name === itemToAdd.value.name && item.type === itemToAdd.value.type
    )
  ) {
    storedItems.push(itemToAdd.value)
    localStorageUtil.set(STORAGE_KEYS.shopPreviousBoughtItems, storedItems)
  }

  // reset
  itemToAdd.value = { type: '', name: '' }
}

const onSelectOption = (item: ItemType) => {
  emit('onAddItem', item)
  // reset
  itemToAdd.value = { type: '', name: '' }
}

onMounted(() => {
  const storedItemTypes = localStorageUtil.get<string[]>(STORAGE_KEYS.shopItemTypes)
  if (storedItemTypes) {
    shopItemTypes.value = storedItemTypes.sort((a, b) => a.localeCompare(b, 'es'))
  }
})

watch(
  () => itemToAdd.value.name,
  (newValue) => {
    const storedItems = localStorageUtil.get<ItemType[]>(STORAGE_KEYS.shopPreviousBoughtItems) ?? []

    const listToShow =
      itemToAdd.value.name.length < 3
        ? []
        : storedItems.filter((item) =>
            normalizeString(item.name).includes(normalizeString(newValue))
          )

    itemOptions.value = listToShow
  }
)

watch(shopItemTypes, (newValue) => {
  localStorageUtil.set(STORAGE_KEYS.shopItemTypes, newValue)
})

const toggleShowItemsForm = () => {
  showItemTypesForm.value = !showItemTypesForm.value
}

const onAddType = (newItem: string) => {
  const itemsSet = new Set([...shopItemTypes.value, newItem])
  shopItemTypes.value = [...itemsSet]
}

const onRemoveType = (itemName: string) => {
  shopItemTypes.value = shopItemTypes.value.filter((item) => item !== itemName)
}

const onRemoveOptionItem = (itemToRemove: ItemType) => {
  const storedItems = localStorageUtil.get<ItemType[]>(STORAGE_KEYS.shopPreviousBoughtItems) ?? []
  const newItems = storedItems.filter(
    (item) => !(item.name === itemToRemove.name && item.type === itemToRemove.type)
  )

  const listToShow =
    itemToAdd.value.name.length < 3
      ? []
      : newItems.filter((item) =>
          normalizeString(item.name).includes(normalizeString(itemToAdd.value.name))
        )

  itemOptions.value = listToShow
  localStorageUtil.set(STORAGE_KEYS.shopPreviousBoughtItems, newItems)
}
</script>
<template>
  <div v-if="!showItemTypesForm">
    <button @click="toggleShowItemsForm">Edit tags</button>
  </div>
  <ItemTypes
    v-else
    @onClose="toggleShowItemsForm"
    :items="shopItemTypes"
    @onAdd="onAddType"
    @onRemoveItem="onRemoveType"
  />
  <form @submit.prevent="handleSubmit">
    <div class="addItemForm">
      <label>Name: <input v-model="itemToAdd.name" required /></label>

      <div v-if="shopItemTypes.length > 0">
        <label>Type</label>
        <select v-model="itemToAdd.type" required>
          <option v-for="itemType in shopItemTypes" :key="itemType">
            {{ itemType }}
          </option>
        </select>
      </div>
      <button type="submit">Add</button>
    </div>
  </form>
  <div v-if="itemOptions.length > 0">
    <ul>
      <li v-for="optionItem in itemOptions">
        {{ optionItem.type }} : {{ optionItem.name }}
        <button type="button" @click="onSelectOption(optionItem)">+</button>
        <button type="button" @click="onRemoveOptionItem(optionItem)">x</button>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.addItemForm {
  display: flex;
  gap: 20px;
}
</style>
