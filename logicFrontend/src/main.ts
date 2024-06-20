import './style.css'
import { Database } from './logic/database'

type Student = {
  studentNumber: number;
  name: string;
}

type Assignment = {
  studentNumber: number;
  assignmentId: string;
  done: boolean;
  notes: string;
}

const database = new Database({
  students: [] as Student[],
  assignments: [] as Assignment[]
})

const studentsList = document.querySelector('#students')!
const assignmentList = document.querySelector('#assignments')!

function createFormInput(label: string, type: "string" | "number" | "boolean" | any) {
  const div = document.createElement('div')
  const input = document.createElement('input')
  const labelElement = document.createElement('label')

  switch (type) {
    case 'string':
      input.type = 'text'
      break
    case 'number':
      input.type = 'number'
      break
    case 'boolean':
      input.type = 'checkbox'
      break
    default:
      throw new Error('Invalid type')
  }

  input.name = label
  labelElement.textContent = label
  labelElement.appendChild(input)
  div.appendChild(labelElement)

  return div
}

function createForm(object: { [key: string]: any }, name: string) {
  const form = document.createElement('form')
  form.id = `${name}Form`

  Object.keys(object).forEach((key) => {
    form.appendChild(createFormInput(key, typeof object[key]))
  })

  const submit = document.createElement('button')
  submit.type = 'submit'
  submit.textContent = 'Submit'
  form.appendChild(submit)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    Object.keys(object).forEach((key) => {
      const input = form.querySelector(`input[name=${key}]`) as HTMLInputElement
      object[key] = input.type === 'checkbox' ? input.checked : input.value
    })

    // @ts-ignore
    database.insert(name, object)
    render()
  })

  return form
}

const studentForm = createForm({ studentNumber: 0, name: '' }, 'students')
document.querySelector("#studentCol")?.appendChild(studentForm)

const assignmentForm = createForm({ studentNumber: 0, assignmentId: '', done: false, notes: '' }, 'assignments')
document.querySelector("#assignmentCol")?.appendChild(assignmentForm)

function renderStudents() {
  const students = database.select('students')

  studentsList.innerHTML = ''
  students.forEach((student) => {
    const li = document.createElement('li')
    li.textContent = `${student.studentNumber} - ${student.name}`
    studentsList.appendChild(li)
  })
}

function renderAssignments() {
  const assignments = database.select('assignments')

  assignmentList.innerHTML = ''
  assignments.forEach((assignment) => {
    const li = document.createElement('li')
    li.textContent = `${assignment.studentNumber} - ${assignment.assignmentId} - ${assignment.done ? 'Done' : 'Not Done'}`
    assignmentList.appendChild(li)
  })
}

function render() {
  renderStudents()
  renderAssignments()
}

render()
