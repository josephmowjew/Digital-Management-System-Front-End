class CPDTrainingHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    this.form = document.querySelector("#create_cpd_modal form");
    if (this.form) {
      this.formElements = this.form.querySelectorAll("input, select, textarea");
      this.setupFormBehavior();
    }
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
    const createCPDBtn = document.querySelector(
      "#create_cpd_modal button[name='create_cpd_btn']"
    );
    if (createCPDBtn) {
      createCPDBtn.addEventListener("click", this.onCreateClick.bind(this));
    }

    const updateCPDBtn = document.querySelector(
        "#edit_cpd_modal button[name='update_cpd_btn']"
      );
      if (updateCPDBtn) {
        updateCPDBtn.addEventListener("click", this.updateClicked.bind(this));
      }


  }

  onCreateClick() {
    this.showSpinner();

    const form = document.querySelector("#create_cpd_modal form");
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
      const formData = new FormData(form);
      this.sendAjaxRequest(
        formData,
        "POST",
        "http://localhost:5043/api/CPDTrainings",
        this.handleCreateCPDSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  editForm(id, token) {
    this.showSpinner();

    if (id > 0) {
      this.sendAjaxRequest(null, 'GET', `http://localhost:5043/api/CPDTrainings/GetCPDTrainingById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      });
    }
  }
  
  handleEditFormSuccess(response) {
  
    const editform = document.querySelector("#edit_cpd_modal form");
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
        this.handleFileUpload(element, data.attachments, fieldName);
      } 
      else if(fieldName == "CPDUnitsAwarded")
      {
          element.value = data.cpdUnitsAwarded;
      }
      else {
        element.value = fieldValue;
      }
    });
  
    // Show modal
    $("#edit_cpd_modal").modal("show");
  }

  delete(id, token) {
    bootbox.confirm("Are you sure you want to delete this CPD Training from the system?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'DELETE', `http://localhost:5043/api/CPDTrainings/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
          'Authorization': `Bearer ${token}`
        });
      }
    });
  }
  
  handleDeleteSuccess(response) {
    toastr.success("CPD Training has been deleted successfully");
    const dataTable = $('#cpd_table').DataTable();
    dataTable.ajax.reload();
  }
  

  handleFileUpload(fileInput, attachments, fieldName) {
    const attachment = attachments.find(attachment => attachment.propertyName === fieldName);
    if (attachment) {
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
  }
  
  updateClicked() {
    this.showSpinner();
  
    const form = document.querySelector("#edit_cpd_modal form");
    const id = document.querySelector("#edit_cpd_modal form input[name='Id']").value;
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
        `http://localhost:5043/api/CPDTrainings/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this),
        { 'Authorization': `Bearer ${tokenValue}` }
      );
    }
  }
  
  handleUpdateSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#cpd_table").DataTable();
    toastr.success("CPD Training updated successfully");
    $("#edit_cpd_modal").modal("hide");
    dataTable.ajax.reload();
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

  handleCreateCPDSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#cpd_table").DataTable();
    toastr.success("New CPD Training added successfully");
    $("#create_cpd_modal").modal("hide");
    dataTable.ajax.reload();
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
              `#create_cpd_modal form input[name="${elementName}"]`
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

window.cpdTrainingHandler = new CPDTrainingHandler();
