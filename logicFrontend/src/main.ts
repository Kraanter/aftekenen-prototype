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
  timestamp: number;
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
const studentForm = createForm({ studentNumber: '', name: '' }, 'students', submitStudent, database.exportToCsv.bind(database, 'students'))
document.querySelector("#studentCol")?.appendChild(studentForm)

function submitAssignment(data: Stringify<Assignment>) {
  const student = database.select('students').find(student => student.studentNumber === data.studentNumber)
  if (!student) {
    const studentName = prompt('Enter the student name')
    if (!studentName) {
      return
    }

    database.insert('students', { studentNumber: data.studentNumber, name: studentName })
  } else {
    // Double check that the student name is correct
    if (confirm(`Is ${student.name} the correct student?`)) {
      data.studentNumber = student.studentNumber
    } else {
      return
    }
  }

  const newAssignment: Assignment = {
    ...data,
    done: !!data.done,
    timestamp: Date.now()
  }

  database.insert('assignments', newAssignment)
  render(database)
}
const assignmentForm = createForm({ studentNumber: '', assignmentId: '', done: false, notes: '', timestamp: 0 }, 'assignments', submitAssignment,
  database.exportToCsv.bind(database, 'assignments'))
document.querySelector("#assignmentCol")?.appendChild(assignmentForm)

render(database)
