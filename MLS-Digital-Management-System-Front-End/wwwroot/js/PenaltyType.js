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
      const attachmentField = document.querySelector('div input[type="file"]');
      attachmentField.style.display = "block";
      attachmentField.required = true;
      const label = attachmentField.previousElementSibling;
      if (label) {
        label.style.display = "inline-block";
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

    /*const updatePenaltyBtn = document.querySelector(
      "#edit_penalty_modal button[name='update_penalty_btn']"
    );
    if (updatePenaltyBtn) {
      updatePenaltyBtn.addEventListener("click", this.updateClicked.bind(this));
      }

    const deletePenaltyBtn = document.querySelector(
          "#create_penalty_modal button[name='delete_penalty_btn']"
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
        "http://localhost:5043/api/Penalties",
        this.handleCreatePenaltySuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  handleCreatePenaltySuccess(response) {
     this.hideSpinner();
     const dataTable = $("#penalty_table").DataTable();
     toastr.success("New Penalty added successfully");
     $("#create_penalty_modal").modal("hide");
     dataTable.ajax.reload();
  }

  /*editForm(id, token) {
    this.showSpinner();

    if (id > 0) {
      this.sendAjaxRequest(null, 'GET', `http://localhost:5043/api/Penalties/GetPenaltyById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      });
    }
  }*/

  /*handleEditFormSuccess(response) {
    const editform = document.querySelector("#edit_penalty_modal form");
    const data = JSON.parse(response);
    console.log(response)

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
      $("#edit_penalty_modal").modal("show");
      this.hideSpinner()
  }*/

  /*delete(id, token) {
    console.log("we here")
    bootbox.confirm("Are you sure you want to delete this Penalty from the system?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'DELETE', `http://localhost:5043/api/Penalties/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
          'Authorization': `Bearer ${token}`
        });
      }
    });
  }

  handleDeleteSuccess(response) {
        console.log(response)
    toastr.success("Penalty has been deleted successfully");
    const dataTable = $('#penalty_table').DataTable();
    dataTable.ajax.reload();
  }*/

  /*handleFileUpload(fileInput, attachments, fieldName) {
    //console.log("We here")
    //console.log(fieldName)
    const attachment = attachments.find(attachment => attachment.propertyName === fieldName);
    //console.log(attachment)
    if (attachment) {
          //console.log(attachment)
          const fileURL = attachment.filePath;
          fetch(fileURL, {
            headers: {
              'Accept': 'application/octet-stream',
              'Access-Control-Request-Method': 'GET',
              'Origin': 'http://localhost:5281'
            }
          })
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], attachment.fileName, attachment.fileType);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          })
          .catch(error => {
            console.error(`Error fetching file ${fileURL}:`, error);
          });
    }
  }*/
  

  /*updateClicked() {
    this.showSpinner();

    const form = document.querySelector("#edit_penalty_modal form");
    const id = document.querySelector("#edit_penalty_modal form input[name='Id']").value;
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
        `http://localhost:5043/api/Penalties/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this),
        { 'Authorization': `Bearer ${tokenValue}` }
      );
    }
  }

  handleUpdateSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#penalty_table").DataTable();
    toastr.success("Penalty updated successfully");
    $("#edit_penalty_modal").modal("hide");
    dataTable.ajax.reload();
  }*/

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

      console.log(formData)
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
              `#create_penalty_modal form input[name="${elementName}"]`
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
