// SubcommitteeMemberHandler.js

class SubcommitteeMemberHandler {
    constructor() {
        this.hideSpinner()
        this.bindEvents()
        this.form = document.querySelector("#create_member_modal form")
        if (this.form) {
            this.formElements = this.form.querySelectorAll("input, select, textarea")
        }
    }

    bindEvents() {
        const createSubcommitteeMemberBtn = document.querySelector("#create_member_btn")

        if (createSubcommitteeMemberBtn) {
            createSubcommitteeMemberBtn.addEventListener("click", this.onCreateClick.bind(this))
        }

        const deleteSubcommitteeMemberBtns = document.querySelectorAll(".delete-member-btn")
        deleteSubcommitteeMemberBtns.forEach(btn => {
            btn.addEventListener("click", this.delete.bind(this))
        })
    }

    onCreateClick() {
        this.showSpinner()
        const form = document.querySelector("#create_member_modal form")
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
                `${host}/api/SubcommitteeMemberships`,
                this.handleCreateSuccess.bind(this),
                this.handleError.bind(this, form),
                {
                    'Authorization': "Bearer " + tokenValue
                }
            )
        }
    }

    delete(event) {
        const button = event.currentTarget
        const id = button.getAttribute("data-id")
        const token = button.getAttribute("data-token")

        bootbox.confirm("Are you sure you want to delete this subcommittee member?", result => {
            if (result) {
                this.sendAjaxRequest(null, 'DELETE', `${host}/api/SubcommitteeMembership/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this, null), {
                    'Authorization': `Bearer ${token}`
                })
            }
        })
    }

    addMember(event) {
        const button = event.currentTarget
        const id = button.getAttribute("data-id")
        const token = button.getAttribute("data-token")

        bootbox.confirm("Are you sure you want to add this member to the subcommittee?", result => {
            if (result) {
                this.sendAjaxRequest(null, 'GET', `${host}/api/SubcommitteeMembership/approve/${id}`, this.handleApprovalSuccess.bind(this), this.handleError.bind(this, null), {
                    'Authorization': `Bearer ${token}`
                })
            }
        })
    }

    handleCreateSuccess(response) {
        this.hideSpinner()
        const dataTable = $("#my_table").DataTable()
        toastr.success("New subcommittee member added successfully")
        $("#create_subcommittee_member_modal").modal("hide")
        dataTable.ajax.reload()
        this.form.reset()
    }

    handleDeleteSuccess(response) {
        toastr.success("Subcommittee member has been removed successfully")
        const dataTable = $('#my_table').DataTable()
        dataTable.ajax.reload()
        location.reload()
    }

    handleApprovalSuccess(response) {
        toastr.success("Accepted successfully")
        const dataTable = $('#my_table').DataTable()
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

window.subcommitteeMemberHandler = new SubcommitteeMemberHandler()
