<script lang="ts" setup>
import { ref } from "vue";
import type { QuestionsType } from "./types";

defineProps<{
  questions: QuestionsType[];
  answersPerQuestion: number;
  title: string;
}>();
const LETTERS = "abcdefghijklmnopqrstuvxyz".split("");

const isCollapsed = ref(false);
</script>
<template>
  <div class="exam">
    <div class="examTitle">
      <h3>
        {{ $props.title }}
      </h3>
      <button @click="isCollapsed = !isCollapsed">
        <template v-if="isCollapsed">Expandir</template>
        <template v-else>Colapsar</template>
      </button>
    </div>

    <div v-if="!isCollapsed" class="content">
      <div>
        <h4>Preguntas</h4>
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
            <table>
              <thead>
                <tr>
                  <th>Q</th>
                  <th
                    v-for="answerIndex in Array(
                      $props.answersPerQuestion
                    ).keys()"
                  >
                    {{ LETTERS[answerIndex] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="(questionItem, questionIndex) in $props.questions"
                >
                  <tr
                    :key="questionItem.id"
                    v-if="questionItem.type === 'multipleOptions'"
                  >
                    <th>{{ questionIndex + 1 }}</th>
                    <td
                      v-for="_ in questionItem.answers"
                      :key="questionItem.id"
                    >
                      <div class="answerOption" />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h4>Respuestas</h4>
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
            <table>
              <thead>
                <tr>
                  <th>Q</th>
                  <th
                    v-for="answerIndex in Array(
                      $props.answersPerQuestion
                    ).keys()"
                  >
                    {{ LETTERS[answerIndex] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="(questionItem, questionIndex) in $props.questions"
                >
                  <tr
                    :key="questionItem.id"
                    v-if="questionItem.type === 'multipleOptions'"
                  >
                    <th>{{ questionIndex + 1 }}</th>
                    <td
                      v-for="answerItem in questionItem.answers"
                      :key="questionItem.id"
                    >
                      <div
                        :class="{
                          answerOption: true,
                          isRight: answerItem.isRight,
                        }"
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h4,
h4 {
  color: blue;
}
.exam {
  border: 1px solid lightgrey;
  padding: 16px;
  border-radius: 8px;
}

.examTitle {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.correctAnswer {
  font-weight: bolder;
  text-decoration: underline;
  font-style: italic;
}

.answerOption {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid black;
  margin-left: 5px;
  margin-right: 5px;
}
.answerOption.isRight {
  background-color: black;
}

@media (min-width: 700px) {
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
  }
}
</style>
