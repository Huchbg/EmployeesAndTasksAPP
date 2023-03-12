const date = new Date()

const body = document.body

//localStorage.setItem("employee", JSON.stringify(tryEmployee))
//JSON.parse(localStorage.getItem("employee"))

const OvarLay = document.querySelector("#OverLay")
const [
  MainContainerEmployees,
  MainContainerTasks,
  ModalAddEmployee,
  MOdalUpdateEmployee,
  ModalReadEmployee,
  ModalReadTask,
  ModalAddTask,
  ModalUpdateTask,
  AddEmployeeButton,
  AddTaskButton,
  templateEmployRow,
  templateTAskRow,
  templateEmployeeRowForRead,
  templateTaskRowForRead,
  modalAsk,
  btnStatisticsTop5,
  modalStatisticsTop5,
  teamplateRowStatistic,
  btnPieChart,
  ModalPieChart,
  btnClearData,
] = getElementsFromDom(body)

addCloseButtons()

AddEmployeeButton.addEventListener("pointerdown", () => {
  ResetValuesAddEmployee(ModalAddEmployee)
  MakeModalApear(ModalAddEmployee, OvarLay)
})

AddTaskButton.addEventListener("pointerdown", () => {
  ResetValuesAddTask(ModalAddTask)
  MakeModalApear(ModalAddTask, OvarLay)
})

const employees = []
const tasks = []
TryGetingData()

btnClearData.addEventListener("pointerdown", () => {
  localStorage.clear()
  location.reload()
})

SetUpModulAddEmployee()
SetUpModulAddTask()
SetUpUpdateEmployeeButton()
SetUpUpdateTaskButton()
SetUpDeleteModule()
SetUpStatisticsTop5()
SetUpPieChart()

function TryGetingData() {
  const tryEmployees = JSON.parse(localStorage.getItem("employee"))
  const tryTasks = JSON.parse(localStorage.getItem("tasks"))
  if (tryEmployees !== null) {
    //console.log(tryEmployee.length)
    if (tryEmployees.length == undefined) {
      employees.push(tryEmployees)
    } else {
      for (const tryEmployee of tryEmployees) {
        employees.push(tryEmployee)
      }
    }
  }
  if (tryTasks !== null) {
    if (tryTasks.length == undefined) {
      tasks.push(tryTasks)
    } else {
      for (const tryTask of tryTasks) {
        tasks.push(tryTask)
      }
    }
  }
  if (employees.length !== 0) {
    DisplayEmployees(MainContainerEmployees, employees, templateEmployRow)
  }
  if (tasks.length !== 0) {
    DisplayTasks(MainContainerTasks, tasks, templateTAskRow)
  }
}

function DisplayEmployees(parent, items, template) {
  parent.innerHTML = ""
  for (const item of items) {
    if (!item.isDeleted) {
      const fullName = `${item.fullName[0]} ${item.fullName[1]}`
      const row = template.content.cloneNode(true).children[0]
      const nametag = row.querySelector("[data-emName]")
      const emailtag = row.querySelector("[data-emEmail]")
      const idTag = row.querySelector("[data-emID]")
      const btnRead = row.querySelector("[data-emReadBTN]")
      const btnUpdate = row.querySelector("[data-emUpdateBTN]")
      const btnDelete = row.querySelector("[data-emDeleteBTN]")
      btnRead.addEventListener("pointerdown", () => {
        const EmployeeTasks = []

        for (const Task of tasks) {
          if (!Task.isDeleted) {
            if (Task.assignee == item.ID) {
              EmployeeTasks.push(Task)
            }
          }
        }

        SetModalReadEmployee(
          item,
          ModalReadEmployee,
          EmployeeTasks,
          templateTaskRowForRead
        )
        MakeModalApear(ModalReadEmployee, OvarLay)
      })

      btnUpdate.addEventListener("pointerdown", () => {
        MOdalUpdateEmployee.dataset.Target = item.ID

        MakeUpdateEmployeeWork(MOdalUpdateEmployee, item)
        MakeModalApear(MOdalUpdateEmployee, OvarLay)
      })
      btnDelete.addEventListener("pointerdown", () => {
        MakeModalApear(modalAsk, OvarLay)
        modalAsk.dataset.Target = item.ID
        modalAsk.dataset.TypeTarget = "employee"
        modalAsk
          .querySelector("[data-DeleteTargetedModalButton]")
          .classList.remove("hiden")
        const messageP = modalAsk.querySelector("[data-HeadDeleteModal]")
        messageP.textContent = `Are you sure you want to delete employee with ID${item.ID}`
      })

      nametag.textContent = fullName
      idTag.textContent = `ID${item.ID}`
      emailtag.textContent = item.email
      parent.appendChild(row)
    }
  }
}

function DisplayTasks(parent, items, template) {
  parent.innerHTML = ""
  for (const item of items) {
    if (!item.isDeleted) {
      let assignee = {}
      for (const em of employees) {
        if (em.ID == item.assignee) {
          assignee = em

          break
        }
      }
      item.isDue = checkIfExpired(item.dueDate)

      const row = template.content.cloneNode(true).children[0]
      const taskTitletag = row.querySelector("[data-taskTitle]")
      const taskAsigneetag = row.querySelector("[data-taskAsignee]")
      const idTag = row.querySelector("[data-taskID]")
      const statusSpan = row.querySelector("[data-taskStatus]")
      if (item.finished) {
        statusSpan.textContent = "finished"
        statusSpan.style.color = "#4EE1AD"
      } else if (item.isDue) {
        statusSpan.textContent = "due date"
        statusSpan.style.color = "rgb(255, 100, 100)"
        SaveTasks(tasks)
      } else {
        statusSpan.textContent = "working..."
        statusSpan.style.color = "#4bfff6"
      }

      const btnRead = row.querySelector("[data-taskReadBTN]")
      const btnUpdate = row.querySelector("[data-taskUpdateBTN]")
      const btnDelete = row.querySelector("[data-taskDeleteBTN]")
      btnRead.addEventListener("pointerdown", () => {
        const employee = []
        employee.push(assignee)
        SetModalReadTask(
          item,
          ModalReadTask,
          employee,
          templateEmployeeRowForRead
        )
        MakeModalApear(ModalReadTask, OvarLay)
      })
      if (!item.finished) {
        btnUpdate.addEventListener("pointerdown", () => {
          ModalUpdateTask.dataset.Target = item.ID
          MakeUpdateTaskWork(ModalUpdateTask, item)
          MakeModalApear(ModalUpdateTask, OvarLay)
        })
      } else {
        btnUpdate.classList.add("hiden")
      }
      btnDelete.addEventListener("pointerdown", () => {
        MakeModalApear(modalAsk, OvarLay)
        modalAsk.dataset.Target = item.ID
        modalAsk.dataset.TypeTarget = "task"
        modalAsk
          .querySelector("[data-DeleteTargetedModalButton]")
          .classList.remove("hiden")
        const messageP = modalAsk.querySelector("[data-HeadDeleteModal]")
        messageP.textContent = `Are you sure you want to delete task with ID${item.ID}`
      })

      taskTitletag.textContent = item.title
      taskAsigneetag.textContent = `${assignee.fullName[0]} ${assignee.fullName[1]}`

      idTag.textContent = `ID${item.ID}`

      parent.appendChild(row)
    }
  }
}

function addCloseButtons() {
  const modals = document.querySelectorAll(".modal")
  OvarLay.addEventListener("pointerdown", () => {
    OvarLay.classList.remove("active")
    modals.forEach((element) => {
      element.classList.remove("active")
    })
  })
  const closeBTN = document.querySelectorAll(".CloseModal")
  closeBTN.forEach((element) => {
    element.addEventListener("pointerdown", () => {
      OvarLay.classList.remove("active")
      modals.forEach((element) => {
        element.classList.remove("active")
      })
    })
  })
}

function SetUpModulAddEmployee() {
  const FirstnameInput = ModalAddEmployee.querySelector("[data-AddEmFirstName]")
  const LastnameInput = ModalAddEmployee.querySelector("[data-AddEmLastName]")
  const EmailInput = ModalAddEmployee.querySelector("[data-AddEmEmail]")
  const PhoneInput = ModalAddEmployee.querySelector("[data-AddEmPhone]")
  const SalaryInput = ModalAddEmployee.querySelector("[data-AddEmSalary]")
  const DateInput = ModalAddEmployee.querySelector("[data-AddEmBithDate]")
  const FeedBackP = ModalAddEmployee.querySelector("[data-AddEmFeedback]")
  const ButtonAddEmployee = ModalAddEmployee.querySelector("[data-AddEmButton]")
  ButtonAddEmployee.addEventListener("pointerdown", () => {
    if (
      FirstnameInput.value != null &&
      FirstnameInput.value != "" &&
      LastnameInput.value != null &&
      LastnameInput.value != "" &&
      EmailInput.value != null &&
      EmailInput.value != "" &&
      PhoneInput.value != null &&
      PhoneInput.value != "" &&
      SalaryInput.value != "" &&
      SalaryInput.value != null &&
      DateInput.value != null &&
      DateInput.value != ""
    ) {
      FeedBackP.textContent = "Congratulations on hiring a new Employee!"
      const hireDate = new Date()
      const birtDate = new Date(DateInput.value)
      const newEmplyee = new Employee(
        FirstnameInput.value,
        LastnameInput.value,
        EmailInput.value,
        PhoneInput.value,
        birtDate,
        SalaryInput.value,
        hireDate
      )
      newEmplyee.ID = employees.length
      employees.push(newEmplyee)
      DisplayEmployees(MainContainerEmployees, employees, templateEmployRow)
      SaveEmployees(employees)
    } else {
      FeedBackP.textContent = "Please fill all the fields!"
      FeedBackP.style.backgroundColor = "rgb(255, 100, 100)"
    }
  })
}

function SetUpModulAddTask() {
  const titleInput = ModalAddTask.querySelector("[data-AddTaskInputTitle]")
  const employeeIDtag = ModalAddTask.querySelector(
    "[data-AddTaskInputEmployee]"
  )
  const decriptionAreaTag = ModalAddTask.querySelector(
    "[data-AddTaskTextAread]"
  )
  const dueDate = ModalAddTask.querySelector("[data-AddTaskDueDate]")

  const FeedBackP = ModalAddTask.querySelector("[data-AddTaskFeedBack]")
  const buttonAddTAsk = ModalAddTask.querySelector("[data-AddTaskButton]")
  buttonAddTAsk.addEventListener("pointerdown", () => {
    if (
      titleInput.value != null &&
      titleInput.value != "" &&
      employeeIDtag.value != null &&
      employeeIDtag.value != "" &&
      decriptionAreaTag.value != null &&
      decriptionAreaTag.value != "" &&
      dueDate.value != null &&
      dueDate.value != ""
    ) {
      let continueEE = false
      const asignee = Number(employeeIDtag.value)
      for (const employee of employees) {
        if (employee.ID === asignee && employee.isDeleted == false) {
          continueEE = true
          break
        }
      }
      if (isNaN(employeeIDtag.value)) {
        continueEE = false
      }

      if (continueEE) {
        const dueDateTas = new Date(dueDate.value)
        const newTAsk = new Task(
          titleInput.value,
          decriptionAreaTag.value,
          asignee,
          dueDateTas
        )

        newTAsk.ID = tasks.length
        tasks.push(newTAsk)
        DisplayTasks(MainContainerTasks, tasks, templateTAskRow)
        SaveTasks(tasks)
        FeedBackP.textContent = "You have added a new task!"
      } else {
        FeedBackP.textContent = "Please enter a real employeeID!"
      }
    } else {
      FeedBackP.textContent = "Please fill all the fields!"
      FeedBackP.style.backgroundColor = "rgb(255, 100, 100)"
    }
  })
}

function SaveEmployees(employees) {
  localStorage.setItem("employee", JSON.stringify(employees))
}
function SaveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function SetUpUpdateEmployeeButton() {
  const ButtonUpdateEmployee = MOdalUpdateEmployee.querySelector(
    "[data-UpdateEmButton]"
  )

  const FirstnameInput = MOdalUpdateEmployee.querySelector(
    "[data-UpdateEmFirstName]"
  )
  const LastnameInput = MOdalUpdateEmployee.querySelector(
    "[data-UpdateEmLastName]"
  )
  const EmailInput = MOdalUpdateEmployee.querySelector("[data-UpdateEmEmail]")
  const PhoneInput = MOdalUpdateEmployee.querySelector("[data-UpdateEmPhone]")
  const SalaryInput = MOdalUpdateEmployee.querySelector("[data-UpdateEmSalary]")
  const DateInput = MOdalUpdateEmployee.querySelector("[data-UpdateEmBithDate]")
  const FeedBackP = MOdalUpdateEmployee.querySelector("[data-UpdateEmFeedback]")

  ButtonUpdateEmployee.addEventListener("pointerdown", () => {
    const emID = MOdalUpdateEmployee.dataset.Target

    if (
      FirstnameInput.value != null &&
      FirstnameInput.value != "" &&
      LastnameInput.value != null &&
      LastnameInput.value != "" &&
      EmailInput.value != null &&
      EmailInput.value != "" &&
      PhoneInput.value != null &&
      PhoneInput.value != "" &&
      SalaryInput.value != "" &&
      SalaryInput.value != null &&
      DateInput.value != null &&
      DateInput.value != ""
    ) {
      FeedBackP.style.backgroundColor = "#4EE1AD"
      FeedBackP.textContent = `You have updated employee with ID${emID}!`

      UpdateEmployee(
        emID,
        FirstnameInput.value,
        LastnameInput.value,
        EmailInput.value,
        PhoneInput.value,
        SalaryInput.value,
        DateInput.value
      )

      DisplayEmployees(MainContainerEmployees, employees, templateEmployRow)
      SaveEmployees(employees)
    } else {
      FeedBackP.textContent = "Please fill all the fields!"
      FeedBackP.style.backgroundColor = "rgb(255, 100, 100)"
    }
  })
}

function UpdateEmployee(
  employeID,
  FirtName,
  Lastname,
  Email,
  Phone,
  Salary,
  BirthDate
) {
  let employee = {}

  for (const em of employees) {
    if (em.ID == employeID) {
      employee = em
      break
    }
  }
  employee.fullName = [FirtName, Lastname]
  employee.email = Email
  employee.phone = Phone
  employee.salary = Salary
  employee.birthDate = new Date(BirthDate)
}

function SetUpUpdateTaskButton() {
  const spanID = ModalUpdateTask.querySelector("[data-UpdateTaskID]")
  const titleInput = ModalUpdateTask.querySelector(
    "[data-UpdateTaskInputTitle]"
  )
  const employeeIDtag = ModalUpdateTask.querySelector(
    "[data-UpdateTaskInputEmployee]"
  )
  const decriptionAreaTag = ModalUpdateTask.querySelector(
    "[data-UpdateTaskTextAread]"
  )
  const ChackBoxInput = ModalUpdateTask.querySelector("[data-checkboxUpdate]")
  const dueDate = ModalUpdateTask.querySelector("[data-UpdateTaskDueDate]")
  const FeedBackP = ModalUpdateTask.querySelector("[data-UpdateTaskFeedBack]")
  const ButtonUpdateTask = ModalUpdateTask.querySelector(
    "[data-UpdateTaskButton]"
  )

  ButtonUpdateTask.addEventListener("pointerdown", () => {
    const taskID = ModalUpdateTask.dataset.Target

    if (
      titleInput.value != null &&
      titleInput.value != "" &&
      employeeIDtag.value != null &&
      employeeIDtag.value != "" &&
      decriptionAreaTag.value != null &&
      decriptionAreaTag.value != "" &&
      dueDate.value != null &&
      dueDate.value != ""
    ) {
      let toContinue = false
      const employeeID = Number(employeeIDtag.value)
      for (const em of employees) {
        if (em.ID == employeeID && em.isDeleted == false) {
          toContinue = true
        }
      }
      if (toContinue) {
        UpdateTask(
          taskID,
          titleInput.value,
          employeeID,
          decriptionAreaTag.value,
          dueDate.value,
          ChackBoxInput
        )
        FeedBackP.textContent = `You have updated task with ID${taskID}`
        DisplayTasks(MainContainerTasks, tasks, templateTAskRow)
        SaveTasks(tasks)
      } else {
        FeedBackP.textContent = "Please enter real employee ID!"
        FeedBackP.style.backgroundColor = "rgb(255, 100, 100)"
      }
    } else {
      FeedBackP.textContent = "Please fill all the fields!"
      FeedBackP.style.backgroundColor = "rgb(255, 100, 100)"
    }
  })
}

function UpdateTask(taskID, title, assignee, decription, dueDate, isFinished) {
  let task = {}
  for (const Task of tasks) {
    if (Task.ID == taskID) {
      task = Task
      break
    }
  }

  task.title = title
  task.assignee = assignee
  task.decription = decription
  task.dueDate = new Date(dueDate)
  if (isFinished.checked) {
    task.finished = true
    task.finishDate = new Date()
  } else {
    task.finished = false
  }
}

function SetUpDeleteModule() {
  const btnDeleteModulAsk = modalAsk.querySelector(
    "[data-DeleteTargetedModalButton]"
  )

  btnDeleteModulAsk.addEventListener("pointerdown", () => {
    const pFeedback = modalAsk.querySelector("[data-HeadDeleteModal]")
    const type = modalAsk.dataset.TypeTarget
    const idOfTarget = modalAsk.dataset.Target

    if (type == "employee") {
      DeleteEmployee(idOfTarget)
      pFeedback.textContent = `You have deleted employee with ID${idOfTarget}`
      btnDeleteModulAsk.classList.add("hiden")
    } else if (type == "task") {
      DeleteTask(idOfTarget)
      pFeedback.textContent = `You have deleted task with ID${idOfTarget}`
      btnDeleteModulAsk.classList.add("hiden")
    }
    DisplayEmployees(MainContainerEmployees, employees, templateEmployRow)
    DisplayTasks(MainContainerTasks, tasks, templateTAskRow)
    SaveEmployees(employees)
    SaveTasks(tasks)
  })
}

function DeleteEmployee(id) {
  for (const employee of employees) {
    if (employee.ID == id) {
      employee.isDeleted = true
      break
    }
  }
  for (const task of tasks) {
    if (task.assignee == id) {
      task.isDeleted = true
    }
  }
}

function DeleteTask(id) {
  for (const task of tasks) {
    if (task.ID == id) {
      task.isDeleted = true
      break
    }
  }
}

function SetUpStatisticsTop5() {
  btnStatisticsTop5.addEventListener("pointerdown", () => {
    MakeModalApear(modalStatisticsTop5, OvarLay)
    DisplayStatisticsTop5(
      modalStatisticsTop5,
      employees,
      tasks,
      teamplateRowStatistic
    )
  })
}

function formatDate(data) {
  const date = data.getDate()
  let month = data.getMonth()
  const year = data.getFullYear()
  if (month == 1) {
    month = "January"
  } else if (month == 2) {
    month = "February"
  } else if (month == 3) {
    month = "March"
  } else if (month == 4) {
    month = "April"
  } else if (month == 5) {
    month = "May"
  } else if (month == 6) {
    month = "June"
  } else if (month == 7) {
    month = "July"
  } else if (month == 8) {
    month = "August"
  } else if (month == 9) {
    month = "September"
  } else if (month == 10) {
    month = "October"
  } else if (month == 11) {
    month = "November"
  } else if (month == 12) {
    month = "December"
  }
  return `${date} ${month} ${year}`
}

function getElementsFromDom(document) {
  const MainContainerEmployees = document.querySelector(
    "[data-MainEmployeeContainer]"
  )
  const MainContainerTasks = document.querySelector("[data-MainTaskContainer]")

  const ModalAddEmployee = document.querySelector("[data-ModalAddEm]")
  const MOdalUpdateEmployee = document.querySelector(
    "[data-UpdateEmployeeModal]"
  )
  const ModalReadEmployee = document.querySelector("[data-ReadEmModal]")
  const ModalReadCask = document.querySelector("[data-ReadTaskModal]")
  const ModalAddTask = document.querySelector("[data-AddTaskModal]")
  const ModalUpdateTask = document.querySelector("[data-UpdateTaskModal]")

  const AddEmployeeButton = document.querySelector("[data-AddEmMainBTN]")
  const AddTaskButton = document.querySelector("[data-AddTaskMainBTN]")

  const templateEmployRow = document.querySelector("[data-RowEmployee]")
  const templateTAskRow = document.querySelector("[data-RowTask]")
  const templateEmployeeRowForRead = document.querySelector(
    "[data-RowEmployeeReadTask]"
  )
  const templateTaskRowForRead = document.querySelector(
    "[data-RowTaskReadEmployee]"
  )
  const modalAsk = document.querySelector("[data-DeleteModal]")
  const btnStatisticsTop5 = document.querySelector("[data-BtnStatistics]")
  const modalStatisticsTop5 = document.querySelector("[data-ModalStatistics]")
  const teamplateRowStatistic = document.querySelector("[data-RowStatistics]")
  const btnPieChart = document.querySelector("[data-BtnStatisticsPie]")
  const ModalPieChart = document.querySelector("[data-ModalPieChart]")
  const btnClearData = document.querySelector("[data-clearData]")
  return [
    MainContainerEmployees,
    MainContainerTasks,
    ModalAddEmployee,
    MOdalUpdateEmployee,
    ModalReadEmployee,
    ModalReadCask,
    ModalAddTask,
    ModalUpdateTask,
    AddEmployeeButton,
    AddTaskButton,
    templateEmployRow,
    templateTAskRow,
    templateEmployeeRowForRead,
    templateTaskRowForRead,
    modalAsk,
    btnStatisticsTop5,
    modalStatisticsTop5,
    teamplateRowStatistic,
    btnPieChart,
    ModalPieChart,
    btnClearData,
  ]
}

function ResetValuesAddEmployee(ModalAddEmployee) {
  ModalAddEmployee.querySelector("[data-AddEmFirstName]").value = ""
  ModalAddEmployee.querySelector("[data-AddEmLastName]").value = ""
  ModalAddEmployee.querySelector("[data-AddEmEmail]").value = ""
  ModalAddEmployee.querySelector("[data-AddEmPhone]").value = ""
  ModalAddEmployee.querySelector("[data-AddEmBithDate]").value = ""
  ModalAddEmployee.querySelector("[data-AddEmSalary]").value = ""
  const FeedBackP = ModalAddEmployee.querySelector("[data-AddEmFeedback]")
  FeedBackP.textContent =
    "Enter all fields and click the button to add a new employee"
  FeedBackP.style.backgroundColor = "#4EE1AD"
}

function ResetValuesAddTask(ModalAddTask) {
  ModalAddTask.querySelector("[data-AddTaskInputTitle]").value = ""
  ModalAddTask.querySelector("[data-AddTaskInputEmployee]").value = ""
  ModalAddTask.querySelector("[data-AddTaskTextAread]").value = ""
  ModalAddTask.querySelector("[data-AddTaskDueDate]").value = ""

  const FeedBackP = ModalAddTask.querySelector("[data-AddTaskFeedBack]")

  FeedBackP.textContent =
    "Enter all fields and click the button to add a new task"
  FeedBackP.style.backgroundColor = "#4EE1AD"
}

function SetModalReadEmployee(employee, modal, tasks, template) {
  const date = new Date(employee.birthDate)
  const fullName = `${employee.fullName[0]} ${employee.fullName[1]}`
  modal.querySelector("[data-ReadEmName]").textContent = fullName
  modal.querySelector("[data-ReadEmPhone]").textContent = employee.phone
  modal.querySelector("[data-ReadEmEmail]").textContent = employee.email

  modal.querySelector("[data-ReadEmBithDate]").textContent = formatDate(date)
  modal.querySelector("[data-ReadEmSalary]").textContent = `${employee.salary}$`
  const containerOfREadTasks = modal.querySelector("[data-ReadEmTaskContainer]")
  containerOfREadTasks.innerHTML = ""

  if (tasks.length > 0) {
    for (const task of tasks) {
      const row = template.content.cloneNode(true).children[0]
      const title = row.querySelector("[data-ReadEmTaskTitle]")
      const asigneetag = row.querySelector("[data-ReadEmTaskAsignee]")
      const statusSpan = row.querySelector("[data-ReadEmTaskStatus]")
      const spanID = row.querySelector("[data-ReadEmTaskID]")
      title.textContent = task.title
      asigneetag.textContent = fullName
      if (task.finished) {
        statusSpan.textContent = "finished"
        statusSpan.style.color = "#4EE1AD"
      } else if (task.isDue) {
        statusSpan.textContent = "due date"
        statusSpan.style.color = "rgb(255, 100, 100)"
      } else {
        statusSpan.textContent = "working..."
        statusSpan.style.color = "#4bfff6"
      }
      spanID.textContent = `ID${task.ID}`
      containerOfREadTasks.appendChild(row)
    }
  } else {
    const p = document.createElement("p")
    p.textContent = "No Tasks Yet"
    p.style.textAlign = "center"
    containerOfREadTasks.appendChild(p)
  }
}
function SetModalReadTask(task, modal, employee, template) {
  const dueDate = new Date(task.dueDate)
  const statusSpan = modal.querySelector("[data-ReadTaskStatus]")
  modal.querySelector("[data-ReadTaskTitle]").textContent = task.title
  modal.querySelector("[data-ReadTaskDescription]").textContent =
    task.decription
  modal.querySelector("[data-ReadTaskDuedate]").textContent =
    formatDate(dueDate)
  const employeeContainer = modal.querySelector("[data-ReadTaskContainer]")
  if (task.finished) {
    statusSpan.textContent = "finished"
    statusSpan.style.color = "#4EE1AD"
  } else if (task.isDue) {
    statusSpan.textContent = "due date"
    statusSpan.style.color = "rgb(255, 100, 100)"
  } else {
    statusSpan.textContent = "working..."
    statusSpan.style.color = "#4bfff6"
  }
  employeeContainer.innerHTML = ""
  for (const em of employee) {
    const row = template.content.cloneNode(true).children[0]
    const name = row.querySelector("[data-emName]")
    name.textContent = `${em.fullName[0]} ${em.fullName[1]}`
    row.querySelector("[data-emEmail]").textContent = em.email
    row.querySelector("[data-emID]").textContent = `ID${em.ID}`
    employeeContainer.appendChild(row)
  }
}

function MakeModalApear(modal, OvarLay) {
  modal.classList.add("active")
  OvarLay.classList.add("active")
}

function MakeUpdateEmployeeWork(modal, employee) {
  const FirstnameInput = modal.querySelector("[data-UpdateEmFirstName]")
  const LastnameInput = modal.querySelector("[data-UpdateEmLastName]")
  const EmailInput = modal.querySelector("[data-UpdateEmEmail]")
  const PhoneInput = modal.querySelector("[data-UpdateEmPhone]")
  const SalaryInput = modal.querySelector("[data-UpdateEmSalary]")
  const DateInput = modal.querySelector("[data-UpdateEmBithDate]")
  const FeedBackP = modal.querySelector("[data-UpdateEmFeedback]")
  const idSpan = modal.querySelector("[data-UpdateEmployeeID]")

  FirstnameInput.value = employee.fullName[0]
  LastnameInput.value = employee.fullName[1]
  EmailInput.value = employee.email
  PhoneInput.value = employee.phone
  SalaryInput.value = employee.salary
  idSpan.textContent = `ID${employee.ID}`

  DateInput.valueAsDate = new Date(employee.birthDate)
  FeedBackP.textContent =
    "Change the data in the fields to update the information about this emplyee"
  FeedBackP.style.backgroundColor = "#4EE1AD"
}

function MakeUpdateTaskWork(modal, task) {
  const spanID = modal.querySelector("[data-UpdateTaskID]")
  const titleInput = modal.querySelector("[data-UpdateTaskInputTitle]")
  const employeeIDtag = modal.querySelector("[data-UpdateTaskInputEmployee]")
  const decriptionAreaTag = modal.querySelector("[data-UpdateTaskTextAread]")
  const ChackBoxInput = modal.querySelector("[data-checkboxUpdate]")
  const dueDate = modal.querySelector("[data-UpdateTaskDueDate]")
  const FeedBackP = modal.querySelector("[data-UpdateTaskFeedBack]")

  spanID.textContent = `ID${task.ID}`
  titleInput.value = task.title
  employeeIDtag.value = task.assignee
  decriptionAreaTag.value = task.decription
  dueDate.valueAsDate = new Date(task.dueDate)
  if (task.finished) {
    ChackBoxInput.checked = true
  }
  FeedBackP.textContent =
    "Change any of the fields and then click Update to update the Task"
  FeedBackP.style.backgroundColor = "#4EE1AD"
}
function checkIfExpired(date) {
  const now = new Date()
  const dueDate = new Date(date)
  if (now > dueDate) {
    return true
  }
  return false
}

function DisplayStatisticsTop5(modal, employees, tasks, template) {
  let AllFinishedTasks = 0
  const allFinishedTasksArayLast30Days = []
  for (const task of tasks) {
    if (task.isDeleted != true && task.finished) {
      if (CheckIfDateIsIn30DAYS(task.finishDate)) {
        allFinishedTasksArayLast30Days.push(task)
        AllFinishedTasks++
      }
    }
  }

  const container = modal.querySelector("[data-ContainerStatistics]")
  container.innerHTML = ""
  const employeesTasks = {}
  const mainRow = template.content.cloneNode(true).children[0]

  if (AllFinishedTasks > 0) {
    const NumberOFAll = mainRow.querySelector("[data-StatNum]")
    NumberOFAll.textContent = AllFinishedTasks
    container.appendChild(mainRow)
    for (const task of allFinishedTasksArayLast30Days) {
      if (employeesTasks[task.assignee] > 0) {
        employeesTasks[task.assignee]++
      } else {
        employeesTasks[task.assignee] = 1
      }
    }
    const employeesTasksArray = Object.entries(employeesTasks)

    employeesTasksArray.sort((a, b) => b[1] - a[1])

    if (employeesTasksArray.length > 5) {
      employeesTasksArray = employeesTasksArray.slice(0, 5)
    }

    for (const employee of employeesTasksArray) {
      const em = findeEmplyee(employee[0], employees)

      const row = template.content.cloneNode(true).children[0]
      const nameP = row.querySelector("[data-nameStat]")
      const NumP = row.querySelector("[data-StatNum]")
      const Bar = row.querySelector("[data-BarStat]")

      NumP.textContent = employee[1]
      nameP.textContent = `${em.fullName[0]} ${em.fullName[1]} ID${em.ID}`
      const percent = (employee[1] / AllFinishedTasks) * 100
      Bar.style.width = `${percent}%`
      container.appendChild(row)
    }
    function findeEmplyee(id, employees) {
      for (const EmplyeeEm of employees) {
        if (id == EmplyeeEm.ID) {
          return EmplyeeEm
        }
      }
    }
  } else {
    const Num = mainRow.querySelector("[data-StatNum]")
    const Mesage = mainRow.querySelector("[data-nameStat]")
    Num.textContent = "0"
    Mesage.textContent = "Finished tasks this month"
    container.appendChild(mainRow)
  }
}

function CheckIfDateIsIn30DAYS(data) {
  const curentDate = new Date()
  const date = new Date(data)
  const differenceInTime = curentDate.getTime() - date.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  if (differenceInDays <= 30) {
    return true
  }
  return false
}

function SetUpPieChart() {
  btnPieChart.addEventListener("pointerdown", () => {
    MakeModalApear(ModalPieChart, OvarLay)
    const [numDue, numWorking, numFinished] = getTasks()

    const canvas = document.getElementById("pie-char")
    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    const data = [numDue, numWorking, numFinished]

    const colors = ["#FF6384", "#36A2EB", "#4EE1AD"]
    const total = data.reduce((sum, value) => sum + value, 0)
    let currentAngle = -0.5 * Math.PI
    const messageDiv = document.getElementById("message")
    messageDiv.innerHTML = "No data to display."
    if (total === 0) {
      messageDiv.style.textAlign = "center"
      messageDiv.style.marginTop = "50px"
    } else {
      messageDiv.innerHTML = ""
      data.forEach((value, i) => {
        if (value === 0) return
        const sliceAngle = (2 * Math.PI * value) / total
        ctx.fillStyle = colors[i]
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(
          centerX,
          centerY,
          radius,
          currentAngle,
          currentAngle + sliceAngle
        )
        ctx.closePath()
        ctx.fill()
        currentAngle += sliceAngle
      })

      currentAngle = -0.5 * Math.PI
      data.forEach((value, i) => {
        if (value === 0) return
        const sliceAngle = (2 * Math.PI * value) / total
        const labelX =
          centerX + (radius / 2) * Math.cos(currentAngle + sliceAngle / 2)
        const labelY =
          centerY + (radius / 2) * Math.sin(currentAngle + sliceAngle / 2)
        ctx.fillStyle = "black"
        ctx.font = "14px sans-serif"
        ctx.fillText(value, labelX, labelY)
        currentAngle += sliceAngle
      })
    }
  })
}

function getTasks() {
  let [numDue, numWorking, numFinished] = [0, 0, 0]

  for (const task of tasks) {
    if (CheckIfDateIsIn30DAYS(task.dateOfCreation)) {
      if (task.isDeleted == false && task.finished) {
        numFinished++
      } else if (task.isDeleted == false && task.isDue == false) {
        numWorking++
      } else if (task.isDeleted == false && task.isDue == true) {
        numDue++
      }
    }
  }
  return [numDue, numWorking, numFinished]
}

class Task {
  constructor(title, decription, assignee, dueDate) {
    this.title = title
    this.decription = decription
    this.assignee = assignee
    this.dueDate = dueDate
    this.isDeleted = false
    this.finishDate = "not yet"
    this.finished = false
    this.isDue = false
    this.dateOfCreation = new Date()
  }
  deleteTask() {
    this.isDeleted = true
  }
  finishTask() {
    this.finished = true
    this.finishDate = new Date()
  }
}

class Employee {
  constructor(firstName, lastName, email, phone, birthDate, salary, hireDate) {
    this.fullName = [firstName, lastName]
    this.phone = phone
    this.email = email
    this.birthDate = birthDate
    this.salary = salary
    this.isDeleted = false
    this.hireDate = hireDate
  }
  deleteEmployee() {
    this.isDeleted = true
  }
}
