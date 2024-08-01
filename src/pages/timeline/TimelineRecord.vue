<script setup lang="ts">
import {ref} from 'vue'
import Tag from './tags/TagUI.vue'
import TimelineInput from './TimeItemInput.vue'
import type { TimelineType} from './timelineStores'

type Props = {
  id: string;
  type: TimelineType
  day?: number
  month?: number
  year: number
  tags: ({id: string; displayName:string;color: string})[]
  title: string
  description?: string
  timelineDiff?: string
  showLabels: boolean
  showDateDiff: boolean
  showDeleteButton: boolean;
  showEditButton: boolean;
}


const props = defineProps<Props>()
defineEmits<{
  clickTag: [labelId: string];
  delete: [itemId: string]
}>()


const showEdit = ref(false)


</script>
<template>
  <TimelineInput v-if="showEdit" 
   :timeline-item="{
    type: props.type,
    id: props.id,
    title: props.title,
    description: props.description,
    year: props.year,
    month: props.month,
    day: props.day,
    tagIds: props.tags.map(tagItem => tagItem.id)
    }"
    @submit-timeline-item="showEdit = false"
  />
  <template v-else>
  <p v-if="!props.description" class="itemWithoutDescription">
    <button v-if="showDeleteButton" type="button" @click.prevent.stop="$emit('delete', props.id )">x</button>
    <button v-if="showEditButton" type="button" @click.prevent.stop="showEdit=true">e</button>

    <span v-if="props.day && props.month">{{ props.day.toString().padStart(2, '0') }}/</span>
    <span v-if="props.month">{{ props.month }}/</span>
    <span>{{ props.year }}: </span>
    <span>{{ props.title }}</span>
    <span v-if="props.timelineDiff && props.showDateDiff">
      (<em>{{ timelineDiff }}</em
      >)
    </span>
    <span
      v-if="props.tags.length > 0 && showLabels"
      v-for="labelItem in props.tags"
      class="label"
    >
      <Tag
        class="label"
        :color="labelItem.color"
        :display-name="labelItem.displayName"
        @click="console.log(labelItem)"
      ></Tag>
    </span>
  </p>

  <details v-else class="detailItem">
    <summary class="summaryItem">
      <button v-if="showDeleteButton" type="button" @click.prevent.stop="$emit('delete', props.id )">x</button>
    <button v-if="showEditButton" type="button" @click.prevent.stop="showEdit=true">e</button>

      <span v-if="props.day && props.month">{{ props.day.toString().padStart(2, '0') }}/</span>
      <span v-if="props.month">{{ props.month.toString().padStart(2, '0') }}/</span>
      <span>{{ props.year }}: </span>
      <span>{{ props.title }}</span>

      <span v-if="props.timelineDiff && props.showDateDiff">
        (<em>{{ timelineDiff }}</em>)
      </span>
      <span
        v-if="props.tags.length > 0 && showLabels"
        v-for="labelItem in props.tags"
        class="label"
      >
        <Tag
          class="label"
          :color="labelItem.color"
          :display-name="labelItem.displayName"
          @click="$emit('clickTag', labelItem.id)"
        ></Tag>
      </span>
    </summary>
    <p>
      {{ props.description }}
    </p>
  </details>
</template>
</template>
<style scoped>
.detailItem {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.summaryItem {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  gap: 4px;
}
.label {
  margin-left: 4px;
}
.itemWithoutDescription {
  margin-left: 1rem;
}
</style>
