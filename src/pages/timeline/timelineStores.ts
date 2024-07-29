import { reactive, watch,computed, ref} from 'vue'
import { localStorageUtil , normalizeString, buildDate} from "../../utils/localStorage";

type TagType =  {id: string; displayName: string;color: string}

const LOCAL_STORAGE = {
    tags: 'timeline-tags',
    timelineEvents: 'timeline-event-item'
}
const tagsTmp:TagType[] = [
    {   id: 'revolucion',
    displayName: 'Revolufiass',
       color: 'yellow'
     },
      {
       id: 'juarez',
       displayName: 'Juarez',
       color: 'purple'
     }
   ]


const tagsStore = reactive({
    tags: localStorageUtil.get<TagType[]>(LOCAL_STORAGE.tags)??tagsTmp, // TODO how to have this as a value not as a reactive thing?
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


type StoredTimelineRecord = {
    id: string;
    year: number
    month?: number
    day?: number
    tagIds: string[]
    title: string
    description?: string
  }

const timelineEventStore = ref({
    events: localStorageUtil.get<StoredTimelineRecord[]>(LOCAL_STORAGE.timelineEvents)??[],
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

    const upsertTimelineEvent = (newTimelineEvent: Omit<StoredTimelineRecord, 'id'> & {id?:string}) => {
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
        localStorageUtil.set<StoredTimelineRecord[]>(LOCAL_STORAGE.timelineEvents ,updatedEvents)
    }, {
        deep: true
    })

    return {
        timelineEvents,
        deleteTimelineEvent,
        upsertTimelineEvent
    }

}