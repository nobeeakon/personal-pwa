<script lang="ts" setup>
import { ref } from "vue";

const settings = ref({ answersPerQuestion: 3, exams: 2 });

const getRandomId = () => `${Math.random()}-${Math.random()}`;

type AnswerType = {
  id: string;
  optionDisplayName: string;
  isRight: boolean;
};
type QuestionType = {
  id: string;
  questionDisplayName: string;
  answers: AnswerType[];
};

const questions = ref<QuestionType[]>([]);
const exams = ref<Array<QuestionType[]>>([]); 

const addQuestion = () => {
  const dummyAnswers = Array(settings.value.answersPerQuestion)
    .fill({ id: "", optionDisplayName: "", isRight: false })
    .map((optionItem) => ({ ...optionItem, id: getRandomId() }));
  questions.value.push({
    id: getRandomId(),
    questionDisplayName: "asdasd",
    answers: dummyAnswers,
  });
};

const updateQuestion = (newQuestion: string, id: string) => {
  const targetIndex = questions.value.findIndex(
    (questionItem) => questionItem.id === id
  );
  if (targetIndex < 0) return;
  questions.value[targetIndex].questionDisplayName = newQuestion;
};

const updateAnswer = (
  questionId: string,
  answerId: string,
  newValue: { newAnswer?: string; isRight?: boolean }
) => {
  const targetQuestionIndex = questions.value.findIndex(
    (questionItem) => questionItem.id === questionId
  );
  const targetAnswerIndex =
    targetQuestionIndex < 0
      ? -1
      : questions.value[targetQuestionIndex].answers.findIndex(
          (answerItem) => answerItem.id === answerId
        );
  if (targetAnswerIndex < 0) return;

  if (newValue.newAnswer != null) {
    questions.value[targetQuestionIndex].answers[
      targetAnswerIndex
    ].optionDisplayName = newValue.newAnswer;
  }

  if (newValue.isRight != null) {
    questions.value[targetQuestionIndex].answers[targetAnswerIndex].isRight =
      newValue.isRight;
  }
};

const onChangeNumberOfAnswers = (newNumber: number) => {
  if (
    settings.value.answersPerQuestion > newNumber &&
    questions.value.length > 0
  ) {
    alert(
      "Para reducir la cantidad de respuestas necesitas eliminar todas las preguntas"
    ); // TODO improve this
    return;
  }

  settings.value.answersPerQuestion = newNumber;
};

const randomizeItems = <ItemType>(itemsToRandomize: ItemType[]) => {
  const toRandomize = itemsToRandomize.map((itemToRandomize) => ({
    randomNumber: Math.random(),
    value: itemToRandomize,
  }));
  return toRandomize
    .sort((a, b) => a.randomNumber - b.randomNumber)
    .map((item) => item.value);
};

const generateRandomExam = (): QuestionType[] => {
  const newQuestionsWithRandomizedAnswers = questions.value.map(
    (questionItem) => ({
      ...questionItem,
      answers: randomizeItems(questionItem.answers),
    })
  );

  return randomizeItems(newQuestionsWithRandomizedAnswers);
};

const generateRandomExams = () => {
  const invalidQuestions = questions.value
    .map((questionItem, index) => {
      const hasIncompleteAnswer = questionItem.answers.some(
        (answerItem) => !answerItem.optionDisplayName
      );
      const everyAnswerIsInValid = questionItem.answers.every(
        (answerItem) => !answerItem.isRight
      );

      if (
        !questionItem.questionDisplayName ||
        hasIncompleteAnswer ||
        everyAnswerIsInValid
      )
        return index+1;

      return null;
    })
    .filter((itemIndex) => itemIndex != null);

  if (invalidQuestions.length) {
    alert(`Algunas preguntas tienen problemas: ${invalidQuestions.join(", ")}`);
    return;
  }

  const newExams: Array<QuestionType[]> = [];
  for (let i = 0; i < settings.value.exams; i++) {
    newExams.push(generateRandomExam());
  }
  exams.value = newExams;
};

const LETTERS = 'abcdefghijklmnopqrstuv'.split('')

//    TODO save to local storage



</script>
<template>
  <button @click="addQuestion">Agregar pregunta</button>
  <div>
    <label>
      ¿Cuántas respuestas por pregunta?
      <input
        type="number"
        :value="settings.answersPerQuestion"
        @input="event => onChangeNumberOfAnswers(parseInt((event.target as HTMLInputElement).value, 10))"
      />
    </label>
  </div>
  <div>
    <label>
      ¿Cuántos exámenes?
      <input
        type="number"
        :value="settings.exams"
        @input="event => settings.exams = parseInt((event.target as HTMLInputElement).value, 10)"
      />
    </label>
    <button type="button" @click="generateRandomExams">Generar examenes</button>

  </div>

  <ol>
    <li v-for="questionItem in questions" :key="questionItem.id">
      <div>
        <div>
          <label :for="questionItem.id"> Pregunta </label>
        </div>
        <textarea
          :id="questionItem.id"
          :value="questionItem.questionDisplayName"
          @input="(event) => updateQuestion((event.target as HTMLInputElement).value, questionItem.id)"
        />
      </div>

      <div>
        <ul>
          <li v-for="answerItem in questionItem.answers" :key="answerItem.id">
            <div>
              <label :for="`${answerItem.id}`"> </label>
            </div>
            <textarea
              :id="`${answerItem.id}`"
              :value="answerItem.optionDisplayName"
              @input="(event) => updateAnswer(questionItem.id, answerItem.id, { newAnswer: (event.target as HTMLInputElement).value })"
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  :checked="answerItem.isRight"
                  @input="
                    () =>
                      updateAnswer(questionItem.id, answerItem.id, {
                        isRight: !answerItem.isRight,
                      })
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
                <ol type="a" >
                    <li v-for="answerItem in questionItem.answers">
                        {{  answerItem.optionDisplayName }}
                    </li>
                </ol>
            </li>
        </ol>
        <div>
            <h4>
                Opciones
            </h4>
            <div>
                <div class="options" :style="{gridTemplateColumns: `repeat(${settings.answersPerQuestion+1}, 1fr)`}">
                    <div>Q</div>
                    <div v-for="answerIndex in Array(settings.answersPerQuestion).keys()">{{ LETTERS[answerIndex]  }}</div>
                <template v-for="(questionItem, questionIndex) in examItem" :key="questionItem.id">
      
                
                    <div>{{ questionIndex +1 }}</div>
                    <div v-for="_ in questionItem.answers" :key="questionItem.id" class="answerOption"></div>
                </template>
            </div>
       
            </div>
        </div>
    </div>

    <h3>Respuestas</h3>
    <div >
        <ol>
            <li v-for="questionItem in examItem" :key="questionItem.id">
                <div>
                    <strong>
                        {{ questionItem.questionDisplayName }}
                    </strong>
                </div>
                <ol type="a" >
                    <li v-for="answerItem in questionItem.answers">
                        <span :class=" {correctAnswer: answerItem.isRight}">
                            {{  answerItem.optionDisplayName }}
                        </span>
                    </li>
                </ol>
            </li>
        </ol>
    </div>
    <div>
            <h4>
                Opciones
            </h4>
            <div>
                <div class="options" :style="{gridTemplateColumns: `repeat(${settings.answersPerQuestion+1}, 1fr)`}">
                    <div>Q</div>
                    <div v-for="answerIndex in Array(settings.answersPerQuestion).keys()">{{ LETTERS[answerIndex]  }}</div>
                <template v-for="(questionItem, questionIndex) in examItem" :key="questionItem.id">
      
                
                    <div>{{ questionIndex +1 }}</div>
                    <div v-for="answerItem in questionItem.answers" :key="questionItem.id" :class="{answerOption: true, isRight: answerItem.isRight}"></div>
                </template>
            </div>
       
            </div>
        </div>
  </div>
  
  <div>

  </div>


</template>

<style scoped >
h2, h3 {
    color: blue;
}

.examTitle{
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