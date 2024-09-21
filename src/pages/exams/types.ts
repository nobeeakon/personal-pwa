
export type AnswerType = {
    id: string;
    optionDisplayName: string;
    isRight: boolean;
  };
 
  export  type MultipleOptionsQuestionType = {
    type: "multipleOptions";
    id: string;
    questionDisplayName: string;
    answers: AnswerType[];
  };
 
  export  type SimpleQuestionType = {
    type: "simpleQuestion";
    id: string;
    questionDisplayName: string;
    expectedAnswer: string;
  };
  
  export  type QuestionsType = SimpleQuestionType | MultipleOptionsQuestionType;
  
  export type ExamType = {
    id: string;
    name: string;
    answersNumber: number;
    /** created at date, in YYYY-MM-DD format */
    createdAtYMD: string; 
    questions: QuestionsType[]
  }