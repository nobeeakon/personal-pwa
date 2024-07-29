<script lang="ts" setup>
import { ref, computed} from 'vue'
import {buildDate} from '../../utils/localStorage'
import {useTimelineEventsStore} from './timelineStores'

import TimelineRecord from './TimelineRecord.vue'
import TimeItemInput from './TimeItemInput.vue'
import Tags from './tags/Tags.vue'
import ExportData from './ExportData.vue'

const settings = ref({ showLabels: true, showDateDiff: true, showDeleteButton: false, showTagsManager: false, showAddItem: true ,showEditButton: false})

const filters = ref<{tags: Set<string>; dates:{ from?: Date; to?: Date }}>({tags: new Set(), dates:{}})

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
    let show = true;

    if (filters.value.tags.size > 0 && timelineItem.tags.every(tagItem => !filters.value.tags.has(tagItem.id) )) {
      show = false
    }


    const itemDate = buildDate({
    day: timelineItem.day,
    month: timelineItem.month,
    year: timelineItem.year
  })
    
    if (filters.value.dates.from && filters.value.dates.from > itemDate) {
      show = false
    }

    if (filters.value.dates.to && filters.value.dates.to < itemDate) {
      show = false
    }
    return show
  }).map((timelineItem, index, timelineArray) => {

    const nextItem = timelineArray[index + 1]

    let dateDiff:undefined|string;
    if (nextItem) {
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
  <h1>Línea del tiempo</h1>
  <div>
    <label> <input v-model="settings.showLabels" type="checkbox" />Show labels </label>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <label><input v-model="settings.showDateDiff" type="checkbox" />Show date diff </label>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <label><input v-model="settings.showTagsManager" type="checkbox" />Show tags manager </label>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <label><input v-model="settings.showAddItem" type="checkbox" />Show add Item </label>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <label><input v-model="settings.showDeleteButton" type="checkbox" />Show delete </label>
    &nbsp;&nbsp;|&nbsp;&nbsp;
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

  <div v-if="filters.tags.size > 0">
    <span>Filters: </span> <template v-for="tagItem in filters.tags"> {{ tagItem }},  </template>
  </div>

  <div>
    <div v-for="(timelineItem) in filteredItems" :key="timelineItem.id">
      <TimelineRecord
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
