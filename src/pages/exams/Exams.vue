<script lang="ts" setup>
import { ref, onMounted } from "vue";

const settings = ref({ answersPerQuestion: 3, exams: 2 });

const getRandomId = () => `${Math.random()}-${Math.random()}`;

type AnswerType = {
  id: string;
  optionDisplayName: string;
  isRight: boolean;
};
type MultipleOptionsQuestionType = {
  type: "multipleOptions";
  id: string;
  questionDisplayName: string;
  answers: AnswerType[];
};
type SimpleQuestionType = {
  type: "simpleQuestion";
  id: string;
  questionDisplayName: string;
  expectedAnswer: string;
};

type QuestionsType = SimpleQuestionType | MultipleOptionsQuestionType;

const questions = ref<QuestionsType[]>([]);
const exams = ref<Array<QuestionsType[]>>([]);

const addQuestion = (isMultipleOption: boolean) => {
  if (isMultipleOption) {
    const dummyAnswers = Array(settings.value.answersPerQuestion)
      .fill(null)
      .map(() => ({
        optionDisplayName: "",
        isRight: false,
        id: getRandomId(),
      }));

    questions.value.push({
      id: getRandomId(),
      questionDisplayName: "",
      answers: dummyAnswers,
      type: "multipleOptions",
    });
  } else {
    questions.value.push({
      type: "simpleQuestion",
      id: getRandomId(),
      questionDisplayName: "",
      expectedAnswer: "",
    });
  }
};

const updateQuestion = (newQuestion: string, id: string) => {
  const targetIndex = questions.value.findIndex(
    (questionItem) => questionItem.id === id
  );
  if (targetIndex < 0) return;
  questions.value[targetIndex].questionDisplayName = newQuestion;
};

const updateMultipleOptionsAnswer = (
  questionId: string,
  answerId: string,
  newValue: { newAnswer?: string; isRight?: boolean }
) => {
  const targetQuestionIndex = questions.value.findIndex(
    (questionItem) => questionItem.id === questionId
  );

  const targetQuestion = questions.value[targetQuestionIndex];
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

// TODO remove item: question
// TODO start by asking how many questions and possibly other settings

const deleteQuestion = (questionId: string) =>  {
  questions.value = questions.value.filter(questionItem => questionItem.id !== questionId)
}


const randomizeItems = <ItemType>(itemsToRandomize: ItemType[]) => {
  const toRandomize = itemsToRandomize.map((itemToRandomize) => ({
    randomNumber: Math.random(),
    value: itemToRandomize,
  }));
  return toRandomize
    .sort((a, b) => a.randomNumber - b.randomNumber)
    .map((item) => item.value);
};

const generateRandomExam = (): QuestionsType[] => {
  const newQuestionsWithRandomizedAnswers = questions.value.map(
    (questionItem) => {
      if (questionItem.type === "multipleOptions") {
        return {
          ...questionItem,
          answers: randomizeItems(questionItem.answers),
        };
      }

      return questionItem;
    }
  );

  return randomizeItems(newQuestionsWithRandomizedAnswers);
};

const generateRandomExams = () => {
  const invalidQuestions = questions.value
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
    alert(
      `Algunas preguntas tienen problemas: ${invalidQuestions
        .map((index) => index + 1)
        .join(", ")}`
    );
    return;
  }

  const newExams: Array<QuestionsType[]> = [];
  for (let i = 0; i < settings.value.exams; i++) {
    newExams.push(generateRandomExam());
  }
  exams.value = newExams;
};

const LETTERS = "abcdefghijklmnopqrstuv".split("");

//    TODO save to local storage

onMounted(() => {
  const answersString = prompt("¿Cuántas respuestas por pregunta?", "3");
  const answersNumber = parseInt(answersString ?? "3", 10);
  const isInvalidNumber =
    !answersNumber ||
    isNaN(answersNumber) ||
    !isFinite(answersNumber) ||
    answersNumber > 10;

  settings.value.answersPerQuestion = isInvalidNumber ? 3 : answersNumber;
});
</script>
<template>
  <h2>Agrega tus preguntas</h2>
  <div class="addQuestionContainer">
    <button @click="() => addQuestion(true)">+ Opción múltiple</button>
    <button @click="() => addQuestion(false)">+ Pregunta</button>
  </div>

  <div>
    <label>
      ¿Cuántas variaciones?
      <input
        type="number"
        :value="settings.exams"
        @input="event => settings.exams = parseInt((event.target as HTMLInputElement).value, 10)"
      />
    </label>
    <button type="button" @click="generateRandomExams">Generar</button>
  </div>

  <ol>
    <li v-for="questionItem in questions" :key="questionItem.id">
      <div>
        <div>
          <label :for="questionItem.id"> Pregunta <button @click="() => deleteQuestion(questionItem.id)">X</button> </label>
        </div>
        <textarea
          :id="questionItem.id"
          :value="questionItem.questionDisplayName"
          @input="(event) => updateQuestion((event.target as HTMLInputElement).value, questionItem.id)"
        />
      </div>

      <div v-if="questionItem.type === 'multipleOptions'">
        <ul>
          <li v-for="answerItem in questionItem.answers" :key="answerItem.id">
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

  <div class="exam" v-for="(examItem, examIndex) in exams" :key="examIndex">
    <h2 class="examTitle">Examen {{ examIndex + 1 }}</h2>
    <h3>Preguntas</h3>
    <div>
      <ol>
        <li v-for="questionItem in examItem" :key="questionItem.id">
          <div>
            <strong>
              {{ questionItem.questionDisplayName }}
            </strong>
          </div>
          <ol v-if="questionItem.type === 'multipleOptions'" type="a">
            <li v-for="answerItem in questionItem.answers">
              {{ answerItem.optionDisplayName }}
            </li>
          </ol>
        </li>
      </ol>
      <div>
      <h4>Opcioneeees</h4>
      <div>
        <div
          class="options"
          :style="{
            gridTemplateColumns: `repeat(${
              settings.answersPerQuestion + 1
            }, 1fr)`,
          }"
        >
          <div>Q</div>
          <div v-for="answerIndex in Array(settings.answersPerQuestion).keys()">
            {{ LETTERS[answerIndex] }}
          </div>

          <template
            v-for="(questionItem, questionIndex) in examItem"
            :key="questionItem.id"
          >
            <template v-if="questionItem.type === 'multipleOptions'">
              <div>{{ questionIndex + 1 }}</div>
              <div
                v-for="_ in questionItem.answers"
                :key="questionItem.id"
                class="answerOption"
              ></div>
            </template>
          </template>
        </div>
      </div>
    </div>
    </div>

    <h3>Respuestas</h3>
    <div>
      <ol>
        <li v-for="questionItem in examItem" :key="questionItem.id">
          <div>
            <strong>
              {{ questionItem.questionDisplayName }}
            </strong>
          </div>
          <ol v-if="questionItem.type === 'multipleOptions'" type="a">
            <li v-for="answerItem in questionItem.answers">
              <span :class="{ correctAnswer: answerItem.isRight }">
                <span v-if="answerItem.isRight">****** </span
                >{{ answerItem.optionDisplayName }}
                <span v-if="answerItem.isRight">****** </span>
              </span>
            </li>
          </ol>
        </li>
      </ol>
    </div>

    <div>
      <h4>Opciones</h4>
      <div>
        <div
          class="options"
          :style="{
            gridTemplateColumns: `repeat(${
              settings.answersPerQuestion + 1
            }, 1fr)`,
          }"
        >
          <div>Q</div>
          <div v-for="answerIndex in Array(settings.answersPerQuestion).keys()">
            {{ LETTERS[answerIndex] }}
          </div>

          <template
            v-for="(questionItem, questionIndex) in examItem"
            :key="questionItem.id"
          >
            <template v-if="questionItem.type === 'multipleOptions'">
              <div>{{ questionIndex + 1 }}</div>
              <div
                v-for="answerItem in questionItem.answers"
                :key="questionItem.id"
                :class="{ answerOption: true, isRight: answerItem.isRight }"
              ></div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div></div>
</template>

<style scoped>
h2,
h3 {
  color: blue;
}

.addQuestionContainer {
  display: flex;
  gap: 8px;
}

.examTitle {
  text-align: center;
}
.exam {
  border: 1px solid grey;
  margin: 32px 16px;
}
.correctAnswer {
  font-weight: bolder;
  text-decoration: underline;
  font-style: italic;
}

.options {
  width: 150px;
  display: grid;
  align-items: center;
}

.answerOption {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid black;
}
.answerOption.isRight {
  background-color: black;
}
</style>
