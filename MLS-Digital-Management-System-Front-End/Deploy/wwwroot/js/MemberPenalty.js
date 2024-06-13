class PenaltyHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    //this.bindCheckboxEvents();
    this.form = document.querySelector("#create_penalty_modal form");
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
    const makePenaltyPaymentBtn = document.querySelector(
      "#make_penaltyPayment_modal button[name='make_penaltyPayment_btn']"
    );
    if (makePenaltyPaymentBtn) {
      makePenaltyPaymentBtn.addEventListener("click", this.onCreateClick.bind(this));
    }
  }

  onCreateClick() {
    this.showSpinner();
    const form = document.querySelector("#make_penaltyPayment_modal form");
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
        "http://localhost:5043/api/PenaltyPayments",
        this.handleCreatePenaltyPaymentSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
    }

  penaltyPaymentForm() {

  }

  editForm(id, token) {
    this.showSpinner();

    if (id > 0) {
        this.sendAjaxRequest(null, 'GET', `http://localhost:5043/api/Penalties/GetPenaltyById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      });
    }
  }

  handleEditFormSuccess(response) {
    const editform = document.querySelector("#make_penaltyPayment_modal form");
    const data = JSON.parse(response);
    const fieldMap = this.createFieldMap(data);
    const editformElements = [...editform.querySelectorAll('select')];
    editformElements.forEach(element => {
    const fieldName = element.getAttribute('name');
    const dataKey = fieldMap[fieldName];
    let fieldValue = data[dataKey];
    if (element.type === 'checkbox') {
        this.setCheckboxValue(element, fieldValue);
    }else if (element.type === 'file') {
        this.handleFileUpload(element, data.attachments, fieldName);
    }
    else {
       element.value = fieldValue;
    }
    })
      const penaltyIdField = editform.querySelector('input[name="penaltyId"]');
  
    if (penaltyIdField) {
        penaltyIdField.value = data.id;
    }

    // Show modal
    $("#make_penaltyPayment_modal").modal("show");
    this.hideSpinner()
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

  handleCreatePenaltyPaymentSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#penalty_table").DataTable();
    toastr.success("Payment successful");
    $("#make_penaltyPayment_modal").modal("hide");
      dataTable.ajax.reload();
      this.form.reset();
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
