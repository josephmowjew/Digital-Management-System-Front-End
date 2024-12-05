// SubcommitteeHandler class

class SubcommitteeHandler {
  constructor() {
    this.hideSpinner()
    this.bindEvents()
    this.form = document.querySelector("#create_subcommittee_modal form")
    if (this.form) {
      this.formElements = this.form.querySelectorAll("input, select, textarea")
    }
  }

  bindEvents() {
    const createSubcommitteeBtn = document.querySelector(
      "#create_subcommittee_modal button[name='create_subcommittee_btn']"
    )

    if (createSubcommitteeBtn) {
      createSubcommitteeBtn.addEventListener("click", this.onCreateClick.bind(this))
    }

    const updateSubcommitteeBtn = document.querySelector(
      "#edit_subcommittee_modal button[name='update_subcommittee_btn']"
    )
    if (updateSubcommitteeBtn) {
      updateSubcommitteeBtn.addEventListener("click", this.updateClicked.bind(this))
    }

    const deleteSubcommitteeBtns = document.querySelectorAll(
      ".delete-subcommittee-btn"
    )
    deleteSubcommitteeBtns.forEach(btn => {
      btn.addEventListener("click", this.delete.bind(this))
    })

    const joinSubcommitteeBtns = document.querySelectorAll(".join-subcommittee-btn")
    joinSubcommitteeBtns.forEach(btn => {
      btn.addEventListener("click", this.joinSubcommittee.bind(this))
    })

    const exitSubcommitteeBtns = document.querySelectorAll(".exit-subcommittee-btn")
    exitSubcommitteeBtns.forEach(btn => {
      btn.addEventListener("click", this.exitSubcommittee.bind(this))
    })
  }

  onCreateClick() {
    this.showSpinner()
    const form = document.querySelector("#create_subcommittee_modal form")
    const errorMessages = form.querySelectorAll(".error-message")
    errorMessages.forEach(errorMessage => errorMessage.remove())

    if (!form.checkValidity()) {
      this.hideSpinner()
      this.displayValidationErrors(form)
    } else {
      const formData = new FormData(form)

      this.sendAjaxRequest(
        formData,
        "POST",
        `${host}/api/Subcommittees`,
        this.handleCreateSuccess.bind(this),
        this.handleError.bind(this, form),
        {
          'Authorization': "Bearer " + tokenValue
        }
      )
    }
  }

  updateClicked() {
    this.showSpinner()
    const form = document.querySelector("#edit_subcommittee_modal form")
    const id = document.querySelector("#edit_subcommittee_modal form input[name='Id']").value
    const errorMessages = form.querySelectorAll(".error-message")
    errorMessages.forEach(errorMessage => errorMessage.remove())

    if (!form.checkValidity()) {
      this.hideSpinner()
      this.displayValidationErrors(form)
    } else {
      const formData = new FormData(form)
      this.sendAjaxRequest(
        formData,
        "PUT",
        `${host}/api/Subcommittees/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this, form),
        {
          'Authorization': "Bearer " + tokenValue
        }
      )
    }
  }

  editForm(id, token) {
    this.showSpinner()

    if (id > 0) {
      this.sendAjaxRequest(null, 'GET', `${host}/api/Subcommittees/GetSubcommitteeById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      })
    }
  }

  handleEditFormSuccess(response) {
    this.hideSpinner()
    const editform = document.querySelector("#edit_subcommittee_modal form")
    const data = JSON.parse(response)
    const fieldMap = this.createFieldMap(data)
    const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')]

    editformElements.forEach(element => {
      const fieldName = element.getAttribute('name')
      const dataKey = fieldMap[fieldName]
      let fieldValue = data[dataKey]

      element.value = fieldValue
    })

    $("#edit_subcommittee_modal").modal("show")
  }

  createFieldMap(data) {
    return Object.entries(data).reduce((map, [key, value]) => {
      const formFieldName = key.charAt(0).toUpperCase() + key.slice(1)
      map[formFieldName] = key
      return map
    }, {})
  }

  delete(event) {
    const button = event.currentTarget
    const id = button.getAttribute("data-id")
    const token = button.getAttribute("data-token")

    bootbox.confirm("Are you sure you want to delete this subcommittee?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'DELETE', `${host}/api/Subcommittees/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this, null), {
          'Authorization': `Bearer ${token}`
        })
      }
    })
  }

  joinSubcommittee(event) {
    const button = event.currentTarget
    const id = button.getAttribute("data-id")
    const token = button.getAttribute("data-token")

    bootbox.confirm("Are you sure you want to join this subcommittee?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'GET', `${host}/api/SubcommitteeMembership/join/${id}`, this.handleJoinSuccess.bind(this), this.handleError.bind(this, null), {
          'Authorization': `Bearer ${token}`
        })
      }
    })

    const dataTable = $("#subcommittee_table").DataTable();
    dataTable.ajax.reload();
  }

  exitSubcommittee(event) {
    const button = event.currentTarget
    const id = button.getAttribute("data-id")
    const token = button.getAttribute("data-token")

    bootbox.confirm("Are you sure you want to exit this subcommittee?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'GET', `${host}/api/SubcommitteeMembership/exit/${id}`, this.handleExitSuccess.bind(this), this.handleError.bind(this, null), {
          'Authorization': `Bearer ${token}`
        })
      }
    })

    const dataTable = $("#subcommittee_table").DataTable();
    dataTable.ajax.reload();
  }

  handleCreateSuccess(response) {
    this.hideSpinner()
    const dataTable = $("#subcommittee_table").DataTable()
    toastr.success("New subcommittee created successfully")
    $("#create_subcommittee_modal").modal("hide")
    dataTable.ajax.reload()
  }

  handleUpdateSuccess(response) {
    this.hideSpinner()
    const dataTable = $("#subcommittee_table").DataTable()
    toastr.success("Subcommittee updated successfully")
    $("#edit_subcommittee_modal").modal("hide")
    dataTable.ajax.reload()
  }

  handleDeleteSuccess(response) {
    toastr.success("Subcommittee has been deleted successfully")
    const dataTable = $('#subcommittee_table').DataTable()
    dataTable.ajax.reload()
  }

  handleJoinSuccess(response) {
    toastr.success("Your request to join the subcommittee has been sent successfully")
    const dataTable = $('#subcommittee_table').DataTable()
    dataTable.ajax.reload()
  }

  handleExitSuccess(response) {
    toastr.success("Successfully exited the subcommittee")
    const dataTable = $('#subcommittee_table').DataTable()
    dataTable.ajax.reload()
  }

  displayValidationErrors(form) {
    const invalidFields = form.querySelectorAll(":invalid")
    invalidFields.forEach(field => {
      const validationMessage = field.validationMessage
      if (validationMessage) {
        const errorMessage = document.createElement("div")
        errorMessage.innerHTML = validationMessage
        errorMessage.classList.add("error-message")
        errorMessage.style.color = "red"
        field.after(errorMessage)
        field.scrollIntoView({ behavior: "smooth", block: "center" })
        field.focus()
      }
    })
  }

  sendAjaxRequest(formData, method, url, successCallback, errorCallback, headers = {}) {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          successCallback(xhr.response)
        } else {
          errorCallback(xhr)
        }
      }
    }
    xhr.send(formData)
  }

  handleError(form, xhr) {
    this.hideSpinner()
    const errorResponse = JSON.parse(xhr.responseText)

    if (form) {
      const errorMessages = form.querySelectorAll(".error-message")
      errorMessages.forEach(errorMessage => errorMessage.remove())

      Object.entries(errorResponse).forEach(([key, messages]) => {
        const elementName = key.charAt(0).toUpperCase() + key.slice(1)
        const element = form.querySelector(`[name="${elementName}"]`)

        if (element) {
          messages.forEach(message => {
            const errorMessage = document.createElement("div")
            errorMessage.innerHTML = message
            errorMessage.classList.add("error-message")
            errorMessage.style.color = "red"
            element.after(errorMessage)
          })
        }
      })
    }
  }

  showSpinner() {
    const spinnerElement = document.getElementById("spinner")
    if (spinnerElement) {
      spinnerElement.style.display = "block"
    } else {
      console.error('Spinner element with id "spinner" was not found')
    }
  }

  hideSpinner() {
    const spinnerElement = document.getElementById("spinner")
    if (spinnerElement) {
      spinnerElement.style.display = "none"
    } else {
      console.error('Spinner element with id "spinner" was not found')
    }
  }
}

window.subcommitteeHandler = new SubcommitteeHandler()
