<script setup lang="ts">
import {ref, computed} from 'vue'
import {normalizeString} from '../../utils/localStorage'
import { useTagsStore , useTimelineEventsStore} from './timelineStores';

type TimelineEventType = {id?: string; title: string; description?: string; year: number; month?: number; day?: number; tagIds:string[]}

const props = defineProps< {
    timelineItem?:TimelineEventType
}>()
const emit = defineEmits<{submitTimelineItem: []}>()

const timelineStore = useTimelineEventsStore()

const timelineEventInfo = ref<TimelineEventType>({id: props.timelineItem?.id, title: props.timelineItem?.title??'', description: props.timelineItem?.description??'',year: props.timelineItem?.year??2000, month: props.timelineItem?.month??12, day: props.timelineItem?.day??undefined, tagIds: props.timelineItem?.tagIds??[]})

const labelsFilter = ref('')

const tagsStore = useTagsStore()
const filteredLabels = computed(() => tagsStore.tags.filter(labelItem => normalizeString(labelItem.displayName).includes(normalizeString(labelsFilter.value))))


const handleSelectLabel = (labelId: string) =>  {
    const labelIndex = timelineEventInfo.value.tagIds.findIndex(labelIdItem => labelIdItem === labelId)
    if (labelIndex>=0) {
        timelineEventInfo.value.tagIds.splice(labelIndex, 1)
    }  else {
        timelineEventInfo.value.tagIds.push(labelId)
    }
}

const onSave = () => {
    timelineStore.upsertTimelineEvent(timelineEventInfo.value)
    emit('submitTimelineItem')
}



</script>
<template>
    <form @submit.prevent="onSave">
        <label>
            Name
            <input v-model="timelineEventInfo.title" required>
        </label>
        <label>
            year
            <input type="number" v-model="timelineEventInfo.year" required>
        </label>
        <label>
            Month
            <input type="number" min="1" max="12" v-model="timelineEventInfo.month"  >
        </label>
        <label>
            Day
            <input type="number" min="1" max="31" v-model="timelineEventInfo.day">
        </label>
        <label>
            Description
            <textarea v-model="timelineEventInfo.description"/>
        </label>
        <div>
            <div>
                <label>Filter <input v-model="labelsFilter"/></label>
            </div>
            <label v-for="labelItem in filteredLabels" :key="labelItem.id">
                <label> <input type="checkbox" @change="() => handleSelectLabel(labelItem.id)" :checked="timelineEventInfo.tagIds.includes(labelItem.id)"> {{ labelItem.displayName }}</label>
            </label>

        </div>
        <div>
            <button type="submit">Guardar</button>
        </div>
    </form>
</template>