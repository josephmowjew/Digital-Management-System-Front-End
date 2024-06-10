class PenaltyHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    //this.bindCheckboxEvents();
    this.form = document.querySelector("#create_penaltyType_modal form");
    if (this.form) {
      this.formElements = this.form.querySelectorAll("input, select, textarea");
      this.setupFormBehavior();
    }

    this.selectedPenaltyIds = []; // Initialize the array
  }

  setupFormBehavior() {
    document.addEventListener("DOMContentLoaded", () => {
      const attachmentField = document.querySelector('div input[type="file"] ');
      if (attachmentField) { 
        attachmentField.style.display = "block";
        attachmentField.required = true;
        const label = attachmentField.previousElementSibling;
        if (label) {
           label.style.display = "inline-block";
        }
      }
    });
  }

    bindEvents() {
    const createPenaltyTypeBtn = document.querySelector(
      "#create_penaltyType_modal button[name='create_penaltyType_btn']"
        );
    if (createPenaltyTypeBtn) {
      createPenaltyTypeBtn.addEventListener("click", this.onCreateClick.bind(this));
  }

    const updatePenaltyTypeBtn = document.querySelector(
      "#edit_penaltyType_modal button[name='update_penaltyType_btn']"
    );
    if (updatePenaltyTypeBtn) {
      updatePenaltyTypeBtn.addEventListener("click", this.updateClicked.bind(this));
      }

    /*const deletePenaltyBtn = document.querySelector(
          "#create_penaltyType_modal button[name='delete_penaltyType_btn']"
    );
    if (deletePenaltyBtn) {
      deletePenaltyBtn.addEventListener("click", this.deleteClicked.bind(this));
    }*/
  }

  onCreateClick() {
    this.showSpinner();
    const form = document.querySelector("#create_penaltyType_modal form");
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((errorMessage) => errorMessage.remove());
     
      if (!form.checkValidity()) {
        console.log(form)
      this.hideSpinner();
      const invalidFields = document.querySelectorAll(":invalid");

      invalidFields.forEach((field) => {
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
    } else {
      const formData = new FormData(form)
      this.sendAjaxRequest(
        formData,
        "POST",
        "http://localhost:5043/api/PenaltyType",
        this.handleCreatePenaltyTypeSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  handleCreatePenaltyTypeSuccess(response) {
     this.hideSpinner();
     const dataTable = $("#penaltyType_table").DataTable();
     toastr.success("New Penalty Type added successfully");
     $("#create_penaltyType_modal").modal("hide");
      dataTable.ajax.reload();
      this.form.reset();
  }

  editForm(id, token) {
     this.showSpinner();

    if (id > 0) {
        this.sendAjaxRequest(null, 'GET', `http://localhost:5043/api/PenaltyType/GetPenaltyTypeById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      });
    }
  }

  handleEditFormSuccess(response) {
    const editform = document.querySelector("#edit_penaltyType_modal form");
    const data = JSON.parse(response);
    const fieldMap = this.createFieldMap(data);
    const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')];

    editformElements.forEach(element => {
      const fieldName = element.getAttribute('name');
      const dataKey = fieldMap[fieldName];
      let fieldValue = data[dataKey];

      if (element.type === 'checkbox') {
        this.setCheckboxValue(element, fieldValue);
      } else if (element.type === 'file') {
          console.log(data.attachments)
          this.handleFileUpload(element, data.attachments, fieldName);
      }
      else {
        element.value = fieldValue;
      }
    });

    // Show modal
      $("#edit_penaltyType_modal").modal("show");
      this.hideSpinner()
  }

  delete(id, token) {
    bootbox.confirm("Are you sure you want to delete this Penalty from the system?", result => {
      if (result) {
          this.sendAjaxRequest(null, 'DELETE', `http://localhost:5043/api/PenaltyType/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
          'Authorization': `Bearer ${token}`
        });
      }
    });
  }

  handleDeleteSuccess(response) {
    toastr.success("Penalty has been deleted successfully");
    const dataTable = $('#penaltyType_table').DataTable();
    dataTable.ajax.reload();
  }


  updateClicked() {
    this.showSpinner();

    const form = document.querySelector("#edit_penaltyType_modal form");
    const id = document.querySelector("#edit_penaltyType_modal form input[name='Id']").value;
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach(errorMessage => errorMessage.remove());

    if (!form.checkValidity()) {
      this.hideSpinner();
      const invalidFields = document.querySelectorAll(":invalid");

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
    } else {
      const formData = new FormData(form);
      this.sendAjaxRequest(
        formData,
        "PUT",
        `http://localhost:5043/api/PenaltyType/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this),
        { 'Authorization': `Bearer ${tokenValue}` }
      );
    }
  }

  handleUpdateSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#penaltyType_table").DataTable();
    toastr.success("Penalty Type updated successfully");
    $("#edit_penaltyType_modal").modal("hide");
    dataTable.ajax.reload();
    this.form.reset();
  }

  createFieldMap(data) {
    return Object.entries(data).reduce((map, [key, value]) => {
      const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
      map[formFieldName] = key;
      return map;
    }, {});
  }

  sendAjaxRequest(formData, method, url, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${tokenValue}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          successCallback(xhr.response);
        } else {
          errorCallback(xhr);
        }
      }
    };
    xhr.send(formData);
  }

  handleError(xhr) {
    this.hideSpinner();
    const errorResponse = JSON.parse(xhr.responseText);
    $.each(errorResponse, (key, value) => {
      $.each(value, (index, message) => {
        const elementName = key
          ? key.charAt(0).toUpperCase() + key.slice(1)
          : null;
        const element = elementName
          ? document.querySelector(
              `#create_penaltyType_modal form input[name="${elementName}"]`
            )
          : null;

        if (element) {
          const errorSpan = element.nextElementSibling;
          if (errorSpan && errorSpan.classList.contains("text-danger")) {
            errorSpan.textContent = message;
          } else {
            const newErrorSpan = document.createElement("span");
            newErrorSpan.textContent = message;
            newErrorSpan.classList.add("text-danger");
            element.after(newErrorSpan);
          }
        }
      });
    });
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

window.penaltyHandler = new PenaltyHandler();
