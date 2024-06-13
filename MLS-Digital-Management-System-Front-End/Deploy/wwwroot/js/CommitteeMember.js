// CommitteeMemberHandler.js

class CommitteeMemberHandler {
    constructor() {
        this.hideSpinner();
        this.bindEvents();
        this.form = document.querySelector("#create_committee_member_modal form");
        if (this.form) {
            this.formElements = this.form.querySelectorAll("input, select, textarea");
            
        }
    }



    bindEvents() {
        const createCommitteeMemberBtn = document.querySelector("#create_committee_member_btn");

        if (createCommitteeMemberBtn) {
            createCommitteeMemberBtn.addEventListener("click", this.onCreateClick.bind(this));
        }

        const deleteCommitteeMemberBtns = document.querySelectorAll(".delete-committee-member-btn");
        deleteCommitteeMemberBtns.forEach(btn => {
            btn.addEventListener("click", this.delete.bind(this));
        });
    }

    onCreateClick() {
        this.showSpinner();
        const form = document.querySelector("#create_committee_member_modal form");
        const errorMessages = form.querySelectorAll(".error-message");
        errorMessages.forEach(errorMessage => errorMessage.remove());

        if (!form.checkValidity()) {
            this.hideSpinner();
            this.displayValidationErrors(form);
        } else {
            const formData = new FormData(form);
            this.sendAjaxRequest(
                formData,
                "POST",
                `${host}/api/CommitteeMembers`,
                this.handleCreateSuccess.bind(this),
                this.handleError.bind(this, form),  // Pass the form reference
                {
                    'Authorization': "Bearer " + tokenValue
                }
            );
        }
    }

    delete(event) {
        const button = event.currentTarget;
        const id = button.getAttribute("data-id");
        const token = button.getAttribute("data-token");

        bootbox.confirm("Are you sure you want to delete this committee member?", result => {
            if (result) {
                this.sendAjaxRequest(null, 'DELETE', `${host}/api/CommitteeMembers/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this, null), {
                    'Authorization': `Bearer ${token}`
                });
            }
        });
    }

    handleCreateSuccess(response) {
        this.hideSpinner();
        const dataTable = $("#my_table").DataTable();
        toastr.success("New committee member added successfully");
        $("#create_committee_member_modal").modal("hide");
        dataTable.ajax.reload();
    }

    handleDeleteSuccess(response) {
        toastr.success("Committee member has been deleted successfully");
        const dataTable = $('#my_table').DataTable();
        dataTable.ajax.reload();
    }

    displayValidationErrors(form) {
        const invalidFields = form.querySelectorAll(":invalid");
        invalidFields.forEach(field => {
            const validationMessage = field.validationMessage;
            if (validationMessage) {
                const errorMessage = document.createElement("div");
                errorMessage.innerHTML = validationMessage;
                errorMessage.classList.add("error-message");
                errorMessage.style.color = "red";
                field.after(errorMessage);
                field.scrollIntoView({ behavior: "smooth", block: "center" });
                field.focus();
            }
        });
    }

    sendAjaxRequest(formData, method, url, successCallback, errorCallback, headers = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 || xhr.status === 201) {
                    successCallback(xhr.response);
                } else {
                    errorCallback(xhr);  // Pass the xhr object to the error handler
                }
            }
        };
        xhr.send(formData);
    }

    handleError(form, xhr) {  // Form is passed as the first parameter
        this.hideSpinner();
        const errorResponse = JSON.parse(xhr.responseText);

        if (form) {
            const errorMessages = form.querySelectorAll(".error-message");
            errorMessages.forEach(errorMessage => errorMessage.remove());

            Object.entries(errorResponse).forEach(([key, messages]) => {
                const elementName = key.charAt(0).toUpperCase() + key.slice(1);
                const element = form.querySelector(`[name="${elementName}"]`);

                if (element) {
                    messages.forEach(message => {
                        const errorMessage = document.createElement("div");
                        errorMessage.innerHTML = message;
                        errorMessage.classList.add("error-message");
                        errorMessage.style.color = "red";
                        element.after(errorMessage);
                    });
                }
            });
        }
    }

    showSpinner() {
        const spinnerElement = document.getElementById("spinner");
        if (spinnerElement) {
            spinnerElement.style.display = "block";
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    hideSpinner() {
        const spinnerElement = document.getElementById("spinner");
        if (spinnerElement) {
            spinnerElement.style.display = "none";
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }
}

window.committeeMemberHandler = new CommitteeMemberHandler();
