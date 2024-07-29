<script lang="ts" setup>
import {useTimelineEventsStore, useTagsStore} from './timelineStores'

const timelineStore = useTimelineEventsStore()
const tagsStore = useTagsStore()

const onSaveData = () => {
  const eventsData = timelineStore.timelineEvents.value;
  const tagsData = tagsStore.tags

  const downloadLink = document.createElement('a')
  downloadLink.download = 'data.json'
  const jsonData = JSON.stringify({events: eventsData, tags: tagsData})
  downloadLink.href = `data:application/json;charset=UTF-8,${jsonData}`

  const clickEvent = new MouseEvent('click')
  downloadLink.dispatchEvent(clickEvent)
}


</script>
<template>
    <button @click="onSaveData">Guardar datos</button>
</template>