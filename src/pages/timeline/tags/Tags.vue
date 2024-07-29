<script setup lang="ts">
import {ref} from 'vue'
import { useTagsStore } from '../timelineStores';
import EditTag from './EditTag.vue';

const newTag = ref({displayName:'', color: ''})
const tagsStore = useTagsStore()



const onAddTag = () => {
    tagsStore.addTag(newTag.value)
    newTag.value = {displayName:'', color: ''}
}



</script>
<template>
    <div>Tag manager</div>

    <div>
        <div>
            New tag
        </div>
        <form @submit.prevent="onAddTag">
            <label>Name <input v-model="newTag.displayName"/></label>
            <label>color <input v-model="newTag.color"/></label>
            <button type="submit">Guardar</button>
        </form>
    </div>

    <div v-for="tagItem in tagsStore.tags" :key="tagItem.id">
       <EditTag :tag="tagItem"/>
    </div>
</template>