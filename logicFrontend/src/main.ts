import './style.css'
import { Database } from './logic/database'
import { createForm, render, Stringify } from './util';

type Student = {
  studentNumber: string;
  name: string;
}

type Assignment = {
  studentNumber: string;
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

function submitStudent(data: Stringify<Student>) {
  database.insert('students', data)
  render(database)
}
const studentForm = createForm({ studentNumber: '', name: '' }, 'students', submitStudent)
document.querySelector("#studentCol")?.appendChild(studentForm)

function submitAssignment(data: Stringify<Assignment>) {
  database.select('students').find(student => student.studentNumber == data.studentNumber) || (() => { throw new Error('Student not found') })()

  const newAssignment: Assignment = {
    ...data,
    done: !!data.done,
    timestamp: Date.now()
  }

  database.insert('assignments', newAssignment)
  render(database)
}
const assignmentForm = createForm({ studentNumber: '', assignmentId: '', done: false, notes: '' }, 'assignments', submitAssignment)
document.querySelector("#assignmentCol")?.appendChild(assignmentForm)


render(database)
