<script setup lang="ts">
import {ref, computed} from 'vue'
import {normalizeString} from '../../utils/localStorage'
import { useTagsStore , useTimelineEventsStore, type TimelineEventType} from './timelineStores';

type TimelineItemType = TimelineEventType['type']

const ITEM_TYPE:  TimelineItemType[] = ['event', 'period']

const props = defineProps< {
    timelineItem?:TimelineEventType
}>()
const emit = defineEmits<{submitTimelineItem: []}>()

const timelineStore = useTimelineEventsStore()

const timelineEventInfo = ref<TimelineEventType>({
    id: props.timelineItem?.id?? crypto.randomUUID(), type: props.timelineItem?.type??'event',
    title: props.timelineItem?.title??'', description: props.timelineItem?.description??'',
year: props.timelineItem?.year??2000, month: props.timelineItem?.month??12, day: props.timelineItem?.day??undefined, 
endYear: props.timelineItem?.endYear, endMonth: props.timelineItem?.endMonth, endDay: props.timelineItem?.endDay??undefined,
tagIds: props.timelineItem?.tagIds??[]})

const labelsFilter = ref('')
const errorMessage = ref('')

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
    if (timelineEventInfo.value.type === 'period' && timelineEventInfo.value.endYear != null) {
        errorMessage.value = 'Falta año final'
        return
    }


    timelineStore.upsertTimelineEvent(timelineEventInfo.value)
    emit('submitTimelineItem')
}



</script>
<template>
    <form @submit.prevent="onSave">
        <div v-if="errorMessage">
            {{ errorMessage }}
        </div>
        <label>
            Name
            <input v-model="timelineEventInfo.title" required>
        </label>
        <div>
            <label>
                Tipo de evento
                <select v-model="timelineEventInfo.type" > 
                    <option v-for="itemType in ITEM_TYPE" :key="itemType" @select="onTypeChange">{{ itemType }}</option>
                </select>
            </label>
        </div>
        <div>
            <div>Inicio</div>
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
    </div>
    <div>
        <div>Término</div>

        <label>
            year
            <input type="number" v-model="timelineEventInfo.endYear" :required="timelineEventInfo.type === 'period'">
        </label>
        <label>
            Month
            <input type="number" min="1" max="12" v-model="timelineEventInfo.endMonth"  >
        </label>
        <label>
            Day
            <input type="number" min="1" max="31" v-model="timelineEventInfo.endDay">
        </label>
    </div>
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