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
year: props.timelineItem?.year??2000, month: props.timelineItem?.month, day: props.timelineItem?.day??undefined, 
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

const onNumericChange = (event:Event, inputType: 'year'|'month'|'day'|'endYear'|'endMonth'|'endDay') => {
    const inputValue = (event.target as HTMLInputElement).value;
    const numericValue = inputValue === ''?undefined:parseInt(inputValue);
    const finalNumericValue = numericValue == null || isNaN(numericValue) || !isFinite(numericValue)?undefined:numericValue;

    switch(inputType) {
        case 'year':
            timelineEventInfo.value.year = finalNumericValue??0;
            break;
        case 'month':
            timelineEventInfo.value.month = finalNumericValue;
            break;
        case 'day':
            timelineEventInfo.value.day = finalNumericValue;
            break;
        case 'endYear':
            timelineEventInfo.value.endYear = finalNumericValue;
            break;
        case 'endMonth':
            timelineEventInfo.value.endMonth = finalNumericValue;
            break;
        case 'endDay':
            timelineEventInfo.value.endDay = finalNumericValue;
            break;
        default: 
            return null;
    }
}

</script>
<template>
    <form @submit.prevent="onSave" >
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
                    <option v-for="itemType in ITEM_TYPE" :key="itemType" >{{ itemType }}</option>
                </select>
            </label>
        </div>
        <div>
            <div>Inicio</div>
        <label>
            Año
            <input type="number" :value="timelineEventInfo.year" @input="event => onNumericChange(event, 'year')" required>
        </label>
        <label>
            Mes
            <input type="number" min="1" max="12" 
                :value="timelineEventInfo.month" @input="event => onNumericChange(event, 'month')"  
                :required="!!timelineEventInfo.day"
            >
        </label>
        <label>
            Día
            <input type="number" min="1" max="31" :value="timelineEventInfo.day" @input="event => onNumericChange(event, 'day')">
        </label>
    </div>
    <div>
        <div>Término</div>

        <label>
            Año
            <input type="number" 
                :value="timelineEventInfo.endYear" @input="event => onNumericChange(event, 'endYear')"
            :required="timelineEventInfo.type === 'period'">
        </label>
        <label>
            Mes
            <input type="number" min="1" max="12" 
                :value="timelineEventInfo.endMonth" @input="event => onNumericChange(event, 'endMonth')"
                :required="!!timelineEventInfo.endDay"
            >
        </label>
        <label>
            Día
            <input type="number" min="1" max="31" 
                :value="timelineEventInfo.endYear" @input="event => onNumericChange(event, 'endYear')"
            >
        </label>
    </div>
    <div>
        <div>
            <label :for="`timeline-description-${timelineEventInfo.id}`">
                Description
            </label>
        </div>
            <textarea
             class="descriptionInput"
                :id="`timeline-description-${timelineEventInfo.id}`"
            v-model="timelineEventInfo.description" rows="4"/>
    </div>
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
<style scoped>
 .descriptionInput {
    width: 80vw;
 }
</style>