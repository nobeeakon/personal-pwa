<script setup lang="ts">
import {ref} from 'vue'
import Settings from './Settings.vue';
import Exam from './Exam.vue';

const currentExamId = ref<string|null>(null)
</script>
<template>
    <div class="content">

        <Settings v-if="!currentExamId" @on-selected-exam="(selectedExamId) => currentExamId=selectedExamId"/>
            <Exam v-else :exam-id="currentExamId" @show-settings="() => {currentExamId = null;console.log('iii')}"/>
            </div>
</template>
<style scoped>

.content {
  margin: 32px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 700px) {
        .content {
    max-width: 1300px;
    padding-right: 32px;
    padding-left: 32px;
    }
}

</style>