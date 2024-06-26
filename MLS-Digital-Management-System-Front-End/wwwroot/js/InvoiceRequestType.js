class InvoiceRequestTypeHandler {
    constructor() {
      this.init();
      this.bindEvents();
    }
  
    init() {
      this.spinner = document.getElementById("spinner");
      this.hideSpinner();
      this.createForm = document.querySelector("#create_invoiceRequestType_modal form");
      this.editForm = document.querySelector("#edit_invoiceRequestType_modal form");
      this.createModal = new bootstrap.Modal(document.getElementById('create_invoiceRequestType_modal'));
      this.editModal = new bootstrap.Modal(document.getElementById('edit_invoiceRequestType_modal'));
    }
  
    bindEvents() {
      const createBtn = document.querySelector(
        "#create_invoiceRequestType_modal button[name='create_invoiceRequestType_btn']"
      );
      if (createBtn) {
        createBtn.addEventListener("click", this.onCreateClick.bind(this));
      }
  
      const updateBtn = document.querySelector(
        "#edit_invoiceRequestType_modal button[name='update_invoiceRequestType_btn']"
      );


      if (updateBtn) {
       
        updateBtn.addEventListener("click", this.onUpdateClick.bind(this));
      }
    }
  
    onCreateClick() {
      this.showSpinner();
      if (!this.createForm.checkValidity()) {
        this.hideSpinner();
        this.displayFormErrors(this.createForm);
        return;
      }
      const formData = new FormData(this.createForm);
      this.sendAjaxRequest(
        formData,
        "POST",
        `${host}/api/InvoiceRequestType`,
        this.handleCreateSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  
    onUpdateClick() {
      this.showSpinner();
      if (!this.editForm.checkValidity()) {
        this.hideSpinner();
        this.displayFormErrors(this.editForm);
        return;
      }
      const id = this.editForm.querySelector("input[name='Id']").value;
      const formData = new FormData(this.editForm);
      this.sendAjaxRequest(
        formData,
        "PUT",
        `${host}/api/InvoiceRequestType/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  
    onEditForm(id, token) {
      this.showSpinner();
      this.sendAjaxRequest(
        null,
        "GET",
        `${host}/api/InvoiceRequestType/${id}`,
        this.handleEditFormSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  
    handleEditFormSuccess(response) {
      const data = JSON.parse(response);

      for (const key in data) {
        const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
        const element = this.editForm.querySelector(`[name='${pascalCaseKey}']`);
    
        // Set the value of the corresponding form field
        if (element) {
          element.value = data[key];
        }
      }
      this.editModal.show();
      this.hideSpinner();
    }
  
    delete(id, token) {
      bootbox.confirm("Are you sure you want to delete this Invoice Request Type?", result => {
        if (result) {
          this.sendAjaxRequest(
            null,
            "DELETE",
            `${host}/api/InvoiceRequestType/${id}`,
            this.handleDeleteSuccess.bind(this),
            this.handleError.bind(this),
           
          );
        }
      });
    }
  
    handleCreateSuccess(response) {
      this.hideSpinner();
      toastr.success("Invoice Request Type created successfully");
      this.createModal.hide();
      $('#my_table').DataTable().ajax.reload();
      this.createForm.reset();
    }
  
    handleUpdateSuccess(response) {
      this.hideSpinner();
      toastr.success("Invoice Request Type updated successfully");
      this.editModal.hide();
      $('#my_table').DataTable().ajax.reload();
    }
  
    handleDeleteSuccess(response) {
      toastr.success("Invoice Request Type deleted successfully");
      $('#my_table').DataTable().ajax.reload();
    }
  
    handleError(xhr) {
      this.hideSpinner();
      const errorResponse = JSON.parse(xhr.responseText);
      this.displayFormErrors(this.createForm, errorResponse);
    }
  
    displayFormErrors(form, errorResponse = null) {
      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach(errorMessage => errorMessage.remove());
  
      if (errorResponse) {
        for (const [key, messages] of Object.entries(errorResponse)) {
          const field = form.querySelector(`[name='${key}']`);
          if (field) {
            messages.forEach(message => {
              const errorMessage = document.createElement("div");
              errorMessage.innerHTML = message;
              errorMessage.classList.add("error-message");
              errorMessage.style.color = "red";
              field.after(errorMessage);
            });
          }
        }
      }
    }
  
    sendAjaxRequest(formData, method, url, successCallback, errorCallback, headers = {}) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Authorization", `Bearer ${tokenValue}`);
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
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
  
    showSpinner() {
      if (this.spinner) {
        this.spinner.style.display = "block";
      }
    }
  
    hideSpinner() {
      if (this.spinner) {
        this.spinner.style.display = "none";
      }
    }
  }
  
  window.invoiceRequestTypeHandler = new InvoiceRequestTypeHandler();
  
  function EditForm(id, token) {
    window.invoiceRequestTypeHandler.onEditForm(id, token);
  }
  
  function Delete(id, token) {
    window.invoiceRequestTypeHandler.delete(id, token);
  }
  