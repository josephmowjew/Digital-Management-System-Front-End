class ThreadHandler {
    constructor() {
      this.hideSpinner();
      this.bindEvents();
      this.form = document.querySelector("#create_thread_modal form");
      if (this.form) {
        this.formElements = this.form.querySelectorAll("input, select, textarea");
        this.setupFormBehavior();
      }
    }
  
    setupFormBehavior() {
      document.addEventListener("DOMContentLoaded", () => {
        const attachmentField = document.querySelector('div input[type="file"]');
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
      const createThreadBtn = document.querySelector(
        "#create_thread_modal button[name='create_thread_btn']"
      );
  
      if (createThreadBtn) {
        createThreadBtn.addEventListener("click", this.onCreateClick.bind(this));
      }
  
      const updateThreadBtn = document.querySelector(
        "#edit_thread_modal button[name='update_thread_btn']"
      );
      if (updateThreadBtn) {
        updateThreadBtn.addEventListener("click", this.updateClicked.bind(this));
      }
  
      const deleteThreadBtns = document.querySelectorAll(
        ".delete-thread-btn"
      );
      deleteThreadBtns.forEach(btn => {
        btn.addEventListener("click", this.delete.bind(this));
      });
    }
  
    onCreateClick() {
      this.showSpinner();
      const form = document.querySelector("#create_thread_modal form");
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
          `${host}/api/Threads`,
          this.handleCreateSuccess.bind(this),
          this.handleError.bind(this, form),  // Pass the form reference
          {
            'Authorization': "Bearer " + tokenValue
          }
        );
      }
    }
  
    updateClicked() {
      this.showSpinner();
      const form = document.querySelector("#edit_thread_modal form");
      const id = document.querySelector("#edit_thread_modal form input[name='Id']").value;
      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach(errorMessage => errorMessage.remove());
  
      if (!form.checkValidity()) {
        this.hideSpinner();
        this.displayValidationErrors(form);
      } else {
        const formData = new FormData(form);
        this.sendAjaxRequest(
          formData,
          "PUT",
          `${host}/api/Threads/${id}`,
          this.handleUpdateSuccess.bind(this),
          this.handleError.bind(this, form),  // Pass the form reference
          {
            'Authorization': "Bearer " + tokenValue
          }
        );
      }
    }
  
    editForm(id, token) {
      this.showSpinner();
  
      if (id > 0) {
        this.sendAjaxRequest(null, 'GET', `${host}/api/Threads/GetThreadById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
          'Authorization': `Bearer ${token}`
        });
      }
    }
  
    handleEditFormSuccess(response) {
      this.hideSpinner();
      const editform = document.querySelector("#edit_thread_modal form");
      const data = JSON.parse(response);
      const fieldMap = this.createFieldMap(data);
      const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')];
  
      editformElements.forEach(element => {
        const fieldName = element.getAttribute('name');
        const dataKey = fieldMap[fieldName];
        let fieldValue = data[dataKey];
  
        element.value = fieldValue;
      });
  
      // Show modal
      $("#edit_thread_modal").modal("show");
    }
  
    createFieldMap(data) {
      return Object.entries(data).reduce((map, [key, value]) => {
        const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
        map[formFieldName] = key;
        return map;
      }, {});
    }
  
    delete(event) {
      const button = event.currentTarget;
      const id = button.getAttribute("data-id");
      const token = button.getAttribute("data-token");
  
      bootbox.confirm("Are you sure you want to delete this thread?", result => {
        if (result) {
          this.sendAjaxRequest(null, 'DELETE', `${host}/api/Threads/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this, null), {
            'Authorization': `Bearer ${token}`
          });
        }
      });
    }
  
    handleCreateSuccess(response) {
      this.hideSpinner();
      const dataTable = $("#threads_table").DataTable();
      toastr.success("New thread created successfully");
      $("#create_thread_modal").modal("hide");
      dataTable.ajax.reload();
    }
  
    handleUpdateSuccess(response) {
      this.hideSpinner();
      const dataTable = $("#threads_table").DataTable();
      toastr.success("Thread updated successfully");
      $("#edit_thread_modal").modal("hide");
      dataTable.ajax.reload();
    }
  
    handleDeleteSuccess(response) {
      toastr.success("Thread has been deleted successfully");
      const dataTable = $('#threads_table').DataTable();
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
  
  window.threadHandler = new ThreadHandler();
  