<script setup lang="ts">
import {  ref, onMounted, watch } from 'vue'
import {  STORAGE_KEYS } from './localStorageUtil'
import { localStorageUtil } from '../../utils/localStorage'
import AddItem from './AddItem.vue'

type ItemToBuy = {
  displayName: string
  checked: boolean
}

type ItemsToBuyMapType = Record<string, ItemToBuy[]>

const itemsToBuyMap = ref<ItemsToBuyMapType>({})

watch(
  itemsToBuyMap,
  (newVal) => {
    localStorageUtil.set(STORAGE_KEYS.shopItemsToBuy, newVal)
  },
  {
    deep: true
  }
)

onMounted(() => {
  const storedItemsToBuy = localStorageUtil.get<ItemsToBuyMapType>(STORAGE_KEYS.shopItemsToBuy)
  if (storedItemsToBuy) {
    itemsToBuyMap.value = storedItemsToBuy
  }
})

const onAddNewItem = (newItem: { type: string; name: string }) => {
  if (
    itemsToBuyMap.value[newItem.type] &&
    !!itemsToBuyMap.value[newItem.type].find((item) => item.displayName === newItem.name)
  ) {
    return
  }

  if (!itemsToBuyMap.value[newItem.type]) {
    itemsToBuyMap.value[newItem.type] = []
  }
  itemsToBuyMap.value[newItem.type].push({ displayName: newItem.name, checked: false })
}

const onRemoveItem = (itemToDelete: { type: string; name: string }) => {
  const newItemsList = (itemsToBuyMap.value[itemToDelete.type] ?? []).filter(
    (item) => item.displayName !== itemToDelete.name
  )

  if (newItemsList.length === 0) {
    delete itemsToBuyMap.value[itemToDelete.type]
  } else {
    itemsToBuyMap.value[itemToDelete.type] = newItemsList
  }
}

const onCheckItem = (itemToCheck: { type: string; name: string }) => {
  const newItemsList = (itemsToBuyMap.value[itemToCheck.type] ?? []).map((item) =>
    item.displayName !== itemToCheck.name
      ? item
      : {
          displayName: item.displayName,
          checked: !item.checked
        }
  )
  itemsToBuyMap.value[itemToCheck.type] = newItemsList
}

// what is the difference between watch and effect? and watchEffect?
</script>
<template>
  <h1>Shop list</h1>
  <div>
    <AddItem @onAddItem="onAddNewItem" />
  </div>
  <div v-if="Object.entries(itemsToBuyMap).length === 0">No Items added yet</div>
  <div v-else>
    <div v-for="itemToBuyKey in Object.keys(itemsToBuyMap)" :key="itemToBuyKey">
      <h2>{{ itemToBuyKey }}</h2>
      <ul>
        <li v-for="itemInfo in itemsToBuyMap[itemToBuyKey]">
          <label>
            <input
              type="checkbox"
              class="itemCheckbox"
              :checked="itemInfo.checked"
              @change="onCheckItem({ type: itemToBuyKey, name: itemInfo.displayName })"
            />{{ itemInfo.displayName }}</label
          >
          <button
            class="removeItemButton"
            @click="onRemoveItem({ type: itemToBuyKey, name: itemInfo.displayName })"
          >
            x
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.itemCheckbox {
  margin-right: 0.5rem;
}
.removeItemButton {
  margin-left: 1rem;
}
</style>
