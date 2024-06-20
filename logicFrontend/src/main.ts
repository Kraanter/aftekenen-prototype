import './style.css'
import { Database } from './logic/database'
import { createForm, render } from './util';

type Student = {
  studentNumber: number;
  name: string;
}

type Assignment = {
  studentNumber: number;
  assignmentId: string;
  done: boolean;
  notes: string;
  timestamp?: number;
}

type StudentSchema = {
  students: Student[];
  assignments: Assignment[];
}

export type StudentDatabase = Database<StudentSchema>

const database: StudentDatabase = new Database({
  students: [],
  assignments: []
})

function submitStudent(data: Student) {
  database.insert('students', data)
  render(database)
}
const studentForm = createForm({ studentNumber: 0, name: '' }, 'students', submitStudent)
document.querySelector("#studentCol")?.appendChild(studentForm)

function submitAssignment(data: Assignment) {
  data.timestamp = Date.now()

  database.insert('assignments', data)
  render(database)
}
const assignmentForm = createForm({ studentNumber: 0, assignmentId: '', done: false, notes: '' }, 'assignments', submitAssignment)
document.querySelector("#assignmentCol")?.appendChild(assignmentForm)


render(database)
