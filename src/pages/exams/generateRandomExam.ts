import type { QuestionsType } from './types';


const randomizeItems = <ItemType>(itemsToRandomize: ItemType[]) => {
    const toRandomize = itemsToRandomize.map((itemToRandomize) => ({
      randomNumber: Math.random(),
      value: {...itemToRandomize},
    }));
    return toRandomize
      .sort((a, b) => a.randomNumber - b.randomNumber)
      .map((item) => item.value);
  };
  

  const generateRandomExam = (questions: QuestionsType[]): QuestionsType[] => {
    const newQuestionsWithRandomizedAnswers = questions.map((questionItem) => {
      if (questionItem.type === "multipleOptions") {
        return {
          ...questionItem,
          answers: randomizeItems(questionItem.answers),
        };
      }
  
      return {...questionItem};
    });
  
    return randomizeItems(newQuestionsWithRandomizedAnswers);
  };
  

  export default generateRandomExam;