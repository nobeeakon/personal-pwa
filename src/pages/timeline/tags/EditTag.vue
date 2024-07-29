<script setup lang="ts">
import {ref} from 'vue'
import { useTagsStore } from '../timelineStores';

const props = defineProps<{
    tag:{
        displayName: string;
        color: string;
        id: string;
    }}>()

const tagsStore = useTagsStore()

const tag = ref({...props.tag})


const onDeleteTag = ( ) => {
    tagsStore.removeTag(tag.value.id)
}

const onSaveTag = () => {
    console.log(tag.value)
    tagsStore.updateTag(tag.value)
}


</script>
<template>
          <label>Name <input v-model="tag.displayName"/></label>
            <label>color <input v-model="tag.color"/></label>
            <button type="button" @click="onDeleteTag">x</button>
            <button type="button" @click="onSaveTag">Save</button>
</template>