<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import type { ExamType, RandomizedQuestions } from "./types";
import ExamsLocalStorageData from "./localStorageExams";
import generateRandomExam from "./generateRandomExam";
import Dialog from "../../components/Dialog.vue";
import RandomExam from "./RandomExam.vue";
import LeftArrowIcon from "../../components/LeftArrowIcon.vue";

const props = defineProps<{
  examId: string;
}>();
const emit = defineEmits<{
  showSettings: [value?: never];
}>();


const settings = ref({ answersPerQuestion: 3, exams: 2 });
const answersRef = ref<HTMLDivElement>();
const showConfirmGenerateRandomExamsDialog = ref(false);

const currentExam = ref<ExamType | null>(null);
const dialogMessage = ref<null | string>(null);

onMounted(() => {
  const selectedExam = ExamsLocalStorageData.get(props.examId);
  if (selectedExam) {
    currentExam.value = selectedExam;
  } else {
    emit("showSettings");
  }
});

watch(
  currentExam,
  (newValue) => {
    if (newValue) {
      ExamsLocalStorageData.upsert(newValue);
    }
  },
  { deep: true }
);

const getRandomId = () => `${Math.random()}-${Math.random()}`;

const addQuestion = (isMultipleOption: boolean) => {
  if (isMultipleOption && currentExam.value?.answersNumber) {
    const dummyAnswers = Array(currentExam.value.answersNumber)
      .fill(null)
      .map(() => ({
        optionDisplayName: "",
        isRight: false,
        id: getRandomId(),
      }));

    currentExam.value?.questions?.push({
      id: getRandomId(),
      questionDisplayName: "",
      answers: dummyAnswers,
      type: "multipleOptions",
    });
  } else {
    currentExam.value?.questions?.push({
      type: "simpleQuestion",
      id: getRandomId(),
      questionDisplayName: "",
      expectedAnswer: "",
    });
  }
};

const updateQuestion = (newQuestion: string, id: string) => {
  const targetIndex =
    currentExam.value?.questions?.findIndex(
      (questionItem) => questionItem.id === id
    ) ?? -1;
  if (!currentExam.value?.questions || targetIndex < 0) return;
  currentExam.value.questions[targetIndex].questionDisplayName = newQuestion;
};

const updateMultipleOptionsAnswer = (
  questionId: string,
  answerId: string,
  newValue: { newAnswer?: string; isRight?: boolean }
) => {
  if (!currentExam.value?.questions) return;

  const targetQuestionIndex = currentExam.value.questions.findIndex(
    (questionItem) => questionItem.id === questionId
  );

  const targetQuestion = currentExam.value.questions[targetQuestionIndex];
  const targetAnswerIndex =
    targetQuestionIndex < 0 || targetQuestion.type !== "multipleOptions"
      ? -1
      : targetQuestion.answers.findIndex(
          (answerItem) => answerItem.id === answerId
        );
  if (targetAnswerIndex < 0 || targetQuestion.type !== "multipleOptions")
    return;

  if (newValue.newAnswer != null) {
    targetQuestion.answers[targetAnswerIndex].optionDisplayName =
      newValue.newAnswer;
  }

  if (newValue.isRight != null) {
    targetQuestion.answers[targetAnswerIndex].isRight = newValue.isRight;
  }
};

// TODO how to get the component ref

const deleteQuestion = (questionId: string) => {
  if (!currentExam.value?.questions) return;
  currentExam.value.questions = currentExam.value.questions.filter(
    (questionItem) => questionItem.id !== questionId
  );
};

const generateRandomExams = () => {
  if (!currentExam.value?.questions) return;

  const invalidQuestions = currentExam.value?.questions
    .map((questionItem, index) => {
      if (questionItem.type === "multipleOptions") {
        const hasIncompleteAnswer = questionItem.answers.some(
          (answerItem) => !answerItem.optionDisplayName
        );
        const everyAnswerIsInValid = questionItem.answers.every(
          (answerItem) => !answerItem.isRight
        );

        if (hasIncompleteAnswer || everyAnswerIsInValid) return index;
      }

      if (!questionItem.questionDisplayName) return index;

      return null;
    })
    .filter((itemIndex) => itemIndex != null);

  if (invalidQuestions.length) {
    dialogMessage.value = `Algunas preguntas tienen problemas: ${invalidQuestions
      .map((index) => index + 1)
      .join(", ")}`;
    return;
  }

  const newExams: Array<RandomizedQuestions> = [];
  for (let i = 0; i < settings.value.exams; i++) {
    newExams.push({questions: generateRandomExam(currentExam.value?.questions), id: getRandomId()});
  }

  currentExam.value.randomizedQuestions =  newExams;

  answersRef.value?.scrollIntoView({ behavior: "smooth" });
};

const validateGenerateRandomExams = () => {
  if (currentExam.value?.randomizedQuestions?.length ?? 0 > 0) {
    showConfirmGenerateRandomExamsDialog.value = true;

    return;
  }

  generateRandomExams();
};
</script>
<template>
  <div>
    <button class="goBackButton" @click="$emit('showSettings')">
      <div class="leftArrow">
        <LeftArrowIcon />
      </div>
      Volver atrás
    </button>
  </div>

  <template v-if="!currentExam">
    <div>No encontramos lo que buscabas</div>
  </template>
  <template v-else>
    <div class="questionsContainer">
      <h1>{{ currentExam.name }}</h1>
      <div class="controllers">
        <h2>Agrega tus preguntas</h2>
        <div class="addQuestionContainer">
          <button @click="() => addQuestion(true)">+ Opción múltiple</button>
          <button @click="() => addQuestion(false)">+ Pregunta abierta</button>
        </div>

        <div v-if="currentExam.questions.length > 0">
          <h3>Generar variaciones</h3>
          <div>
            <label>
              ¿Cuántas variaciones?
              <input
                type="number"
                :value="settings.exams"
                @input="event => settings.exams = parseInt((event.target as HTMLInputElement).value, 10)"
              />
            </label>
            <button type="button" @click="validateGenerateRandomExams">
              Generar
            </button>
          </div>
          <p>
            <em
              >Aleatoriza las preguntas y respuestas y genera la hoja de
              respuestas</em
            >
          </p>
        </div>
      </div>

      <div v-if="currentExam.questions.length > 0">
        <h2>Preguntas</h2>
        <ol class="questionsContainer">
          <li
            v-for="questionItem in currentExam.questions"
            :key="questionItem.id"
          >
            <div>
              <div>
                <label :for="questionItem.id">
                  Pregunta
                  <button @click="() => deleteQuestion(questionItem.id)">
                    X
                  </button>
                </label>
              </div>
              <textarea
                :id="questionItem.id"
                :value="questionItem.questionDisplayName"
                @input="(event) => updateQuestion((event.target as HTMLTextAreaElement).value, questionItem.id)"
              />
            </div>

            <div v-if="questionItem.type === 'multipleOptions'">
              <ul>
                <li
                  v-for="answerItem in questionItem.answers"
                  :key="answerItem.id"
                >
                  <div>
                    <label :for="`${answerItem.id}`"> </label>
                  </div>
                  <textarea
                    :id="`${answerItem.id}`"
                    :value="answerItem.optionDisplayName"
                    @input="(event) => updateMultipleOptionsAnswer(questionItem.id, answerItem.id, { newAnswer: (event.target as HTMLInputElement).value })"
                  />
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        :checked="answerItem.isRight"
                        @input="
                          () =>
                            updateMultipleOptionsAnswer(
                              questionItem.id,
                              answerItem.id,
                              {
                                isRight: !answerItem.isRight,
                              }
                            )
                        "
                      />
                      Correcta
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <div ref="answersRef" class="randomExams" v-if="currentExam.randomizedQuestions.length> 0">
      <h2 class="randomExamsTitle">Examenes aleatorizados</h2>

      <RandomExam
        v-for="(examItem, examIndex) in currentExam.randomizedQuestions"
        :key="examItem.id"
        :title="`Examen  ${examIndex + 1} `"
        :questions="examItem.questions"
        :answers-per-question="currentExam.answersNumber"
      />
    </div>

    <Dialog :is-open="!!dialogMessage" @close="dialogMessage = null">
      <div>{{ dialogMessage }}</div>
    </Dialog>
    <Dialog
      :is-open="showConfirmGenerateRandomExamsDialog"
      @close="showConfirmGenerateRandomExamsDialog = false"
    >
      <p>Al generar nuevas variantes se perderán las anteriores.</p>
      <p>¿Seguro que deseas continuar?</p>
      <div>
        <button
          @click="
            () => {
              showConfirmGenerateRandomExamsDialog = false;
              generateRandomExams();
            }
          "
        >
          Generar
        </button>
      </div>
    </Dialog>
  </template>
</template>
<style scoped>
textarea {
  width: 100%;
  border: 1px solid lightgray;
  resize: none;
  border-radius: 4px;
}
li {
  margin-top: 8px;
}

.goBackButton {
  display: flex;
  column-gap: 8px;
  align-items: center;
}

.leftArrow {
  width: 16px;
  height: 16px;
}

.questionsContainer {
  position: relative;
}

.controllers {
  position: sticky;
  top: 0;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  padding: 0 16px 16px 16px;
  border-radius: 8px;
  z-index: 1;
}

.addQuestionContainer {
  display: flex;
  gap: 8px;
}

.questionsContainer {
  margin-right: 32px;
  margin-left: 32px;
}

.randomExamsTitle {
  text-align: center;
}

.randomExams {
  scroll-padding-top: 300px;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  margin-top: 24px;
  border-top: 3px solid lightgrey;
}
</style>
