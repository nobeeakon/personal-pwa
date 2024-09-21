<script lang="ts" setup>
  import type {QuestionsType} from './types'


  defineProps<{ questions: QuestionsType[];answersPerQuestion: number}>()
const LETTERS = "abcdefghijklmnopqrstuv".split("");
 
 
</script>
<template>
      <h3>Preguntas</h3>
      <div>
        <ol>
          <li v-for="questionItem in $props.questions" :key="questionItem.id">
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
          <h4>Opciones</h4>
          <div>
            <div
              class="options"
              :style="{
                gridTemplateColumns: `repeat(${
                  $props.answersPerQuestion + 1
                }, 1fr)`,
              }"
            >
              <div>Q</div>
              <div
                v-for="answerIndex in Array($props.answersPerQuestion).keys()"
              >
                {{ LETTERS[answerIndex] }}
              </div>

              <template
                v-for="(questionItem, questionIndex) in $props.questions"
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
          <li v-for="questionItem in $props.questions" :key="questionItem.id">
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
                $props.answersPerQuestion + 1
              }, 1fr)`,
            }"
          >
            <div>Q</div>
            <div
              v-for="answerIndex in Array($props.answersPerQuestion).keys()"
            >
              {{ LETTERS[answerIndex] }}
            </div>

            <template
              v-for="(questionItem, questionIndex) in $props.questions"
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
</template>
<style scoped>
h2,
h3 {
  color: blue;
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