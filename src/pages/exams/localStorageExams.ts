import { localStorageUtil } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "./constants";
import { ExamType } from "./types";


const ExamsLocalStorageData = {
    getAll(){ return localStorageUtil.get<ExamType[]>(LOCAL_STORAGE_KEYS.exams)},
    get(examId: string){
        return (this.getAll()??[]).find(examItem => examItem.id === examId)
    },
    upsert(updatedExam: ExamType)  {
       const currentExams = this.getAll()??[]

       const newExams = currentExams.filter(examItem => examItem.id !== updatedExam.id)
       newExams.push(updatedExam)

       localStorageUtil.set(LOCAL_STORAGE_KEYS.exams, newExams)
    },
    delete(examId: string) {
        const newExams = (this.getAll()??[]).filter(examItem => examItem.id !== examId)

        localStorageUtil.set(LOCAL_STORAGE_KEYS.exams, newExams)
    }
}


export default ExamsLocalStorageData;