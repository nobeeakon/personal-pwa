<script lang="ts" setup>
import { ref, computed} from 'vue'
import {buildDate, normalizeString} from '../../utils/localStorage'
import {useTimelineEventsStore, type TimelineType} from './timelineStores'

import TimelineRecord from './TimelineRecord.vue'
import TimeItemInput from './TimeItemInput.vue'
import Tags from './tags/Tags.vue'
import ExportData from './ExportData.vue'

const showSettings = ref(true);
const settings = ref({ showLabels: true, showDateDiff: true, showDeleteButton: false, showTagsManager: false, showAddItem: true ,showEditButton: false})

const filters = ref<{
  text: string;
  tags: Set<string>; 
  dates:{ from?: Date; to?: Date };
  timelineType?:TimelineType 
}>({text: '',tags: new Set(), dates:{}})


  const ITEM_TYPE:  TimelineType[] = ['event', 'period']


type TimelineRecord = {
  id: string;
  year: number
  month?: number
  day?: number
  tags: {id: string;displayName: string;color: string}[]
  title: string
  description?: string
}


const timelineStore = useTimelineEventsStore()

const DAY_MS = 1000 * 60 * 60 * 24
const MONTH_DAYS = 30
const YEAR_DAYS = MONTH_DAYS * 12


const onDelete = (itemId: string) => {
  timelineStore.deleteTimelineEvent(itemId)
}


const filteredItems = computed(() => (
  timelineStore.timelineEvents.value.filter(timelineItem => {

    if (filters.value.timelineType && timelineItem.type !== filters.value.timelineType) {
      return false;
    }

    const normalizedFilter = normalizeString(filters.value.text)
    if(normalizedFilter &&   !normalizeString(timelineItem.title).includes(normalizedFilter) && !normalizeString(timelineItem.description??'').includes(normalizedFilter)) {
      return false
    }

    if (filters.value.tags.size > 0 && timelineItem.tags.every(tagItem => !filters.value.tags.has(tagItem.id) )) {
      return false
    }


    const itemDate = buildDate({
    day: timelineItem.day,
    month: timelineItem.month,
    year: timelineItem.year
  })
    
    if (filters.value.dates.from && filters.value.dates.from > itemDate) {
      return false
    }

    if (filters.value.dates.to && filters.value.dates.to < itemDate) {
      return false
    }


    return true;
  }).map((timelineItem, index, timelineArray) => {

    const nextItem = timelineArray[index + 1]

    let dateDiff:undefined|string;
    if (nextItem) {
      // TODO this is not taking into account that we may have end date
      const currentDate = buildDate({
        day: timelineItem.day,
        month: timelineItem.month,
        year: timelineItem.year
      })
      const nextDate =  buildDate({
        day: nextItem.day,
        month: nextItem.month,
        year: nextItem.year
      })

      const diffDays = Math.floor((nextDate.getTime() - currentDate.getTime()) / DAY_MS)
      if (diffDays < MONTH_DAYS) {
        dateDiff = `${diffDays} d`
      } else if (diffDays < YEAR_DAYS) {
        dateDiff= `${Math.floor(diffDays / MONTH_DAYS)} m`
      } else {
        const years = Math.floor(diffDays / YEAR_DAYS)
        const months = Math.floor((diffDays - years * YEAR_DAYS) / MONTH_DAYS)
        dateDiff = `${years} y${months === 0 ? '' : `-${months} m`}`
      }
    }

    return {...timelineItem, 
dateDiff,
    }

  })

))

const onClickTag = (tagId: string) => {
  if (filters.value.tags.has(tagId) ){
      filters.value.tags.delete(tagId)
  } else {
    filters.value.tags.add(tagId)
  }
}

</script>
<template>
  <div v-if="showSettings">

  <h3>Línea del tiempo</h3>
  <button @click="showSettings = false">Ocultar</button>
  <div class="settings">
    <label> <input v-model="settings.showLabels" type="checkbox" />Show labels </label>
    <label><input v-model="settings.showDateDiff" type="checkbox" />Show date diff </label>
    <label><input v-model="settings.showTagsManager" type="checkbox" />Show tags manager </label>
    <label><input v-model="settings.showAddItem" type="checkbox" />Show add Item </label>
    <label><input v-model="settings.showDeleteButton" type="checkbox" />Show delete </label>
    <label><input v-model="settings.showEditButton" type="checkbox" />Show edit </label>
  </div>
  <div v-if="settings.showAddItem">
    <TimeItemInput />
  </div>
  <div v-if="settings.showTagsManager">
    <Tags/>
  </div>
  <div>
    <ExportData />
  </div>
</div>
<div v-else>
  <button @click="showSettings = true">Config</button>
</div>

  <div>
    <span  v-if="filters.tags.size > 0">Tags: </span> <template v-for="tagItem in filters.tags"> {{ tagItem }},  </template>
    <div>
      <label>
        text: <input v-model="filters.text"/> 
      </label>

      <label>
        Type <select v-model="filters.timelineType"><option selected :value="undefined">Todos</option><option v-for="typeItem in ITEM_TYPE" :key="typeItem" :value="typeItem">{{ typeItem }}</option></select>
      </label>

    </div>
  </div>

  <div>
    <div v-for="(timelineItem) in filteredItems" :key="timelineItem.id">
      <TimelineRecord
        :type="timelineItem.type"
        :id="timelineItem.id"
        :day="timelineItem.day"
        :month="timelineItem.month"
        :year="timelineItem.year"
        :tags="timelineItem.tags"
        :title="timelineItem.title"
        :description="timelineItem.description"
        :timeline-diff="timelineItem.dateDiff"
        :show-labels="settings.showLabels"
        :show-date-diff="settings.showDateDiff"
        :show-delete-button="settings.showDeleteButton"
        :show-edit-button="settings.showEditButton"
        @click-tag="(tagId) => onClickTag(tagId)"
        @delete="(itemId) => onDelete(itemId)"
      />
    </div>
  </div>
</template>
<style scoped>
  .settings{
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>