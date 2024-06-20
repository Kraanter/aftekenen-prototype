import { StudentDatabase } from "./main"

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
  div.appendChild(labelElement)
  div.appendChild(input)

  return div
}

export type Stringify<T extends { [key: string]: any }> = {
  [key in keyof T]: string
}

function createForm<T extends Record<string, any>>(object: T, name: string, onSubmit: (data: Stringify<T>) => void) {
  const form = document.createElement('form')
  form.id = `${name}Form`

  Object.keys(object).forEach((key) => {
    form.appendChild(createFormInput(key, typeof object[key]))
  })

  const submit = document.createElement('button')
  submit.type = 'submit'
  submit.textContent = 'Submit'
  form.appendChild(submit)

  const error = document.createElement('div')
  error.id = 'error'
  form.appendChild(error)

  const showError = (message: string) => {
    error.textContent = message
  }

  const list = document.createElement('ul')
  list.id = `${name}`
  form.appendChild(list)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    try {
      Object.keys(object).forEach((key) => {
        const input = form.querySelector(`input[name=${key}]`) as HTMLInputElement
        if (!input) {
          throw new Error(`Could not find input for ${key}`)
        }

        // @ts-ignore
        object[key] = input.type === 'checkbox' ? input.checked : input.value
        if (typeof object[key] !== "boolean" && !object[key]) {
          throw new Error(`${key} is required`)
        }
      })

      onSubmit(object)
    } catch (e: any) {
      showError(e.message || 'An error occurred')
    }
  })

  return form
}

function renderStudents(database: StudentDatabase) {
  const studentList = document.querySelector('#students')
  if (!studentList) {
    return
  }

  const students = database.select('students')

  studentList.innerHTML = ''
  students.forEach((student) => {
    const li = document.createElement('li')
    li.textContent = `${student.studentNumber} - ${student.name}`
    studentList.appendChild(li)
  })
}

function renderAssignments(database: StudentDatabase) {
  const assignmentList = document.querySelector('#assignments')
  if (!assignmentList) {
    return
  }

  const assignments = database.select('assignments')

  assignmentList.innerHTML = ''
  assignments.forEach((assignment) => {
    const li = document.createElement('li')
    li.textContent = `${new Date(assignment.timestamp ?? 0).toLocaleString()} | ${assignment.studentNumber} - ${assignment.assignmentId} - ${assignment.done ? 'Done' : 'Not Done'}`
    assignmentList.appendChild(li)
  })
}

function render(database: StudentDatabase) {
  renderStudents(database)
  renderAssignments(database)
}


export { createForm, createFormInput, render }
