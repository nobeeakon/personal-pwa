import { reactive, watch,computed, ref} from 'vue'
import { localStorageUtil , normalizeString, buildDate} from "../../utils/localStorage";

type TagType =  {id: string; displayName: string;color: string}

// TODO replace this with indexedDb
const LOCAL_STORAGE = {
    tags: 'timeline-tags',
    timelineEvents: 'timeline-event-item'
}



const tagsStore = reactive({
    tags: localStorageUtil.get<TagType[]>(LOCAL_STORAGE.tags)??[],
    removeTag(tagId: string) {
        const tagToRemoveIndex = this.tags.findIndex(tagItem => tagItem.id === tagId)
        if (tagToRemoveIndex>=0) {
            this.tags.splice(tagToRemoveIndex,1)
        }
    },
    addTag(newTag: Pick<TagType, 'displayName'|'color'>){
        const newTagId = normalizeString(newTag.displayName)
        if (this.tags.find(tagItem => tagItem.id === newTagId)) {
            return;
        }

        this.tags.push({...newTag, id: newTagId})
    },
    updateTag(updatedTag: TagType) {
        const tagIndex = this.tags.findIndex(tagItem => tagItem.id === updatedTag.id);
        if (tagIndex >= 0) {
            this.tags[tagIndex] = {...updatedTag}
        }
    } 
})

export const  useTagsStore = () => {
    watch(() => tagsStore.tags, (newTags) => {
    localStorageUtil.set(LOCAL_STORAGE.tags, newTags)
    }, {deep: true})

    return tagsStore
}


export type TimelineType = 'event'|'period'
export type TimelineEventType =  {
    type: TimelineType
    id: string;
    tagIds: string[]
    title: string
    description?: string
    year: number
    month?: number
    day?: number;
    endYear?:number;
    endMonth?:number;
    endDay?:number;
  }





  // TODO validate input
const timelineEventStore = ref({
    events: localStorageUtil.get<TimelineEventType[]>(LOCAL_STORAGE.timelineEvents)??[],
})


export const useTimelineEventsStore = () => {
    const tagsStore = useTagsStore()

    const getTag = (targetTagId: string) => tagsStore.tags.find(tagItem => tagItem.id === targetTagId)??{id: 'UNKNOWN', displayName: '???', color: 'red'}

    const timelineEvents = computed(() => {
        const newEvents = timelineEventStore.value.events.map(({tagIds, ...rest}) => {
            const tags = tagIds.map(tagIdItem => getTag(tagIdItem)).filter(Boolean)
            return {
                ...rest,
                tags,
                tagIds
            }
        })

        return newEvents.sort((a,b) => buildDate({year: a.year, month: a.month, day: a.day}).getTime() - buildDate({year: b.year, month: b.month, day: b.day}).getTime())
    })

    const deleteTimelineEvent = (eventId: string) => {
        timelineEventStore.value.events = timelineEventStore.value.events.filter(eventItem => eventItem.id !== eventId)
    }

    const upsertTimelineEvent = (newTimelineEvent: Omit<TimelineEventType, 'id'> & {id?:string}) => {
        const targetItemIndex = timelineEventStore.value.events.findIndex(timelineEventItem => timelineEventItem.id === newTimelineEvent.id);
        const eventId = newTimelineEvent.id
        if (eventId && targetItemIndex >=0) {
            timelineEventStore.value.events[targetItemIndex]  = {...newTimelineEvent, id: eventId}
            return;
        }

        const id = crypto.randomUUID()
        timelineEventStore.value.events.push({...newTimelineEvent, id})
    }

    watch(() => timelineEventStore.value.events, (newEvents) => {
        const updatedEvents = [...newEvents]
        updatedEvents.sort((a,b) => buildDate({year: a.year, month: a.month, day: a.day}).getTime() - buildDate({year: b.year, month: b.month, day: b.day}).getTime())
        localStorageUtil.set<TimelineEventType[]>(LOCAL_STORAGE.timelineEvents ,updatedEvents)
    }, {
        deep: true
    })

    return {
        timelineEvents,
        deleteTimelineEvent,
        upsertTimelineEvent
    }
}