<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ExamType } from "./types";
import Dialog from '../../components/Dialog.vue'
import ExamsLocalStorageData from './localStorageExams'

const emit = defineEmits<{
  onSelectedExam: [examId: string];
}>();

const showExam = ref(false);
const existingExams = ref<ExamType[]>([]);
const examInfo = ref({
  examName: "",
  answersNumber: 3,
});
const examIdToDelete = ref<null|string>(null)

onMounted(() => {
  const currentExistingExams = ExamsLocalStorageData.getAll()
  if (currentExistingExams) {
    existingExams.value = currentExistingExams;
  }
});

const getRandomId = () => `${Math.random()}-${Math.random()}`;

const onCreateNewExam = () => {
  const newId = getRandomId();

  const newExam: ExamType = {
    id: newId,
    name: examInfo.value.examName,
    answersNumber: examInfo.value.answersNumber,
    questions: [],
    createdAtYMD: (new Date().toISOString()).split('T')[0], // this is an example of an ISOString '2024-09-21T22:18:16.827Z'
    randomizedQuestions: []
  }

  ExamsLocalStorageData.upsert(newExam)

  showExam.value = true;
  emit("onSelectedExam", newId);
};

const onShowDeleteExamDialog = (examId: string) => {
  examIdToDelete.value = examId
}

const onDeleteExam = () => {
  if (!examIdToDelete.value)  return;

  ExamsLocalStorageData.delete(examIdToDelete.value)
  existingExams.value = existingExams.value.filter(examItem => examItem.id !== examIdToDelete.value)
  examIdToDelete.value = null
}


</script>
<template>
  <div class="content">
    <h2>Examenes</h2>
    <p>
      Esta página aleatoriza preguntas de opción múltiple y genera sus hojas de
      respuestas
    </p>
    <p><em><strong>NOTA:</strong> la información se guarda en tu navegador</em></p>
    <form @submit.prevent="onCreateNewExam">
      <h3>Crear nuevo</h3>
      <div>
        <label>
          <span>Nombre</span>
          <input required v-model="examInfo.examName" />
        </label>
      </div>
      <div>
        <label>
          <span>Cantidad de respuestas de opción múltiple</span>
          <input
            type="number"
            min="1"
            max="6"
            required
            :value="examInfo.answersNumber"
            @input="(e) => examInfo.answersNumber= parseInt((e.target as HTMLInputElement).value??'3',10)"
          />
        </label>
      </div>
      <div>
        <button type="submit">Crear</button>
      </div>
    </form>
    <div v-if="existingExams.length > 0">
      <h3>Exámenes existentes</h3>
      <ol>
        <li v-for="examItem in existingExams">
          {{ examItem.name }} (<i>{{ examItem.createdAtYMD }}</i>). Preguntas: {{ examItem.questions.length }} <button @click="$emit('onSelectedExam' , examItem.id)">Ver</button> <button @click="onShowDeleteExamDialog(examItem.id)">X</button> 
        </li>
      </ol>
    </div>
  </div>
  <Dialog :is-open="!!examIdToDelete" @close="examIdToDelete = null">
      <div>
        ¿Estás seguro que quieres eliminar este examen?
      </div>
      <div class="deleteDialogButtonsContainer"> <button @click="onDeleteExam">Confirmar</button></div>
  </Dialog>
</template>
<style scoped>
.content {
  margin: 32px;
}

.deleteDialogButtonsContainer{
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

</style>