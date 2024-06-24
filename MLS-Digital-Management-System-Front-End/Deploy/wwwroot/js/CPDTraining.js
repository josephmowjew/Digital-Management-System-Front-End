class CPDTrainingHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    this.bindCheckboxEvents();
    this.form = document.querySelector("#create_cpd_modal form");
    if (this.form) {
      this.formElements = this.form.querySelectorAll("input, select, textarea");
      this.setupFormBehavior();
    }
    this.selectedCPDTrainingIds = []; // Initialize the array
    this.fileUploadHandler = new FileUploadHandler(`${host}`);
 
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

    const registerCPDTrainingBtn = document.querySelector(
      "#register_cpd_training_modal button[name='register_training_btn']"
    );
    if (registerCPDTrainingBtn) {
      registerCPDTrainingBtn.addEventListener("click", this.registerTrainingClicked.bind(this));
    }

   
  }

  bindCheckboxEvents() {
    $('#cpd_table').on('change', '.cpdTrainingCheckbox', function() {
        const checkbox = $(this);
        const cpdTrainingId = checkbox.data('id');
        const isChecked = checkbox.is(':checked');

        if (isChecked) {
            cpdTrainingHandler.selectedCPDTrainingIds.push(cpdTrainingId);
        } else {
            cpdTrainingHandler.selectedCPDTrainingIds = cpdTrainingHandler.selectedCPDTrainingIds.filter(id => id !== cpdTrainingId);
        }

    });
}
markAttendance() {
  const selectedCount = this.selectedCPDTrainingIds.length;

  if (selectedCount < 1) {
      bootbox.alert("You cannot proceed to marking attendance with no selected members.");
  } else {
      bootbox.confirm(`Do you want to proceed with marking attendance of the selected ${selectedCount} members as present?`, (result) => {
          if (result) {
              const formData = new FormData();
             
              formData.append('ids', JSON.stringify(this.selectedCPDTrainingIds));
             
              this.sendAjaxRequest(
                  formData,
                  "POST",
                  "${host}/api/CPDTrainingRegistrations/MarkAttendance",
                  this.handleMarkAttendanceSuccess.bind(this),
                  this.handleError.bind(this),
                  { 'Authorization': `Bearer ${tokenValue}` }
              );
          }
      });
  }
}
handleMarkAttendanceSuccess(response) {
  this.hideSpinner();
  toastr.success("Attendance marked successfully");
  const dataTable = $('#cpd_table').DataTable();
  dataTable.ajax.reload();
  this.selectedCPDTrainingIds = []; // Clear the selected IDs
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
        `${host}/api/CPDTrainings`,
        this.handleCreateCPDSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  editForm(id, token) {
    this.showSpinner();

    if (id > 0) {
      this.sendAjaxRequest(null, 'GET', `${host}/api/CPDTrainings/GetCPDTrainingById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
        'Authorization': `Bearer ${token}`
      });
    }
  }

  handleEditFormSuccess(response) {

    this.hideSpinner();
    
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
          //this.handleFileUpload(element, data.attachments, fieldName);
          this.fileUploadHandler.handleFileUpload(element, data.attachments, fieldName);
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

  registerForm(trainingId, trainingFee) {
    const cpdRegisterform = document.querySelector("#register_cpd_training_modal form");
    const trainingIdInput = cpdRegisterform.querySelector('input[name="CPDTrainingId"]');
    trainingIdInput.value = trainingId;

    // Log the trainingId for debugging purposes
    const trainingData = JSON.parse(trainingFee);

    // Destructure the different fees from the trainingFee object
    const { 
      memberPhysicalAttendanceFee, 
      memberVirtualAttendanceFee, 
      nonMemberPhysicalAttendanceFee, 
      nonMemberVirtualAttandanceFee 
    } = trainingData;


    
    // Check if all fees are zero or null
    const isFree = [memberPhysicalAttendanceFee, memberVirtualAttendanceFee, nonMemberPhysicalAttendanceFee, nonMemberVirtualAttandanceFee]
      .every(fee => fee === null || fee <= 0);

    const displayFee = (fee) => {
      
      if(typeof(fee) == "number")
        {
          if (fee > 0) {
            cpdRegisterform.querySelector("#cpd_training_amount").innerHTML = `<strong>MWK${fee} </strong>`;
          } else {
            cpdRegisterform.querySelector("#cpd_training_amount").innerHTML = `<strong>Free CPD</strong>`;
          }
        }
        else{
          cpdRegisterform.querySelector("#cpd_training_amount").innerHTML = `<strong>Pending....Please select attendance mode</strong>`;
        }
       
    };

    const modeOfAttendanceSelect = cpdRegisterform.querySelector('select[name="AttendanceMode"]');
   
    modeOfAttendanceSelect.addEventListener('change', () => {

     
      const selectedMode = modeOfAttendanceSelect.value;
      let fee = 0;
      if (selectedMode === 'Physical') {
        fee = memberPhysicalAttendanceFee || 0;
      } else if (selectedMode === 'Virtual') {
        fee = memberVirtualAttendanceFee || 0;
      }
      displayFee(fee);
    });
    if (isFree) {
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "none";
      const attachmentsField = cpdRegisterform.querySelector('div input[type="file"]');
      attachmentsField.style.display = "none";
      const label = attachmentsField.previousElementSibling;
      if (label) {
        label.style.display = "none";
      }
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "block";


    } 
    else {
      displayFee(trainingFee);
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "none";
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "block";
    }

    $("#register_cpd_training_modal").modal("show");
  }




  delete(id, token) {
    bootbox.confirm("Are you sure you want to delete this CPD Training from the system?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'DELETE', `${host}/api/CPDTrainings/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
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

  registerTrainingClicked() {
    const form = document.querySelector("#register_cpd_training_modal form");
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
        "POST",
        `${host}/api/CPDTrainingRegistrations`,
        this.handleRegisterSuccess.bind(this),
        this.handleRegisterError.bind(this),
        { 'Authorization': `Bearer ${tokenValue}` }
      );
    }
  }

  handleRegisterError(xhr) {

  
    this.hideSpinner();
    
    // Parse the error response
    const errorResponse = JSON.parse(xhr.responseText);
    const form = document.querySelector("#register_cpd_training_modal form");

   
    // Remove any existing error messages
    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach(errorMessage => errorMessage.remove());
  
    // Display new error messages
    for (const [key, messages] of Object.entries(errorResponse)) {
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
        `${host}/api/CPDTrainings/${id}`,
        this.handleUpdateSuccess.bind(this),
        this.handleError.bind(this),
        { 'Authorization': `Bearer ${tokenValue}` }
      );
    }
  }

  handleRegisterSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#cpd_table").DataTable();
    toastr.success("CPD Training Registration successful");
    $("#register_cpd_training_modal").modal("hide");
    dataTable.ajax.reload();
  }

  handleUpdateSuccess(response) {
    this.hideSpinner();
    const dataTable = $("#cpd_table").DataTable();
    toastr.success("CPD Training updated successfully");
    $("#edit_cpd_modal").modal("hide");
      //dataTable.ajax.reload();
      location.reload()
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

  acceptRegistration(id) {
    const registrationId = id
    bootbox.confirm("Are you sure you want to accept this CPD Training Registration?", result => {
      if (result) {
        this.showSpinner();
        this.sendAjaxRequest(
          null,
          "GET",
          `${host}/api/CPDTrainingRegistrations/AcceptCPDTrainingRegistration/${registrationId}`,
          (response) => {
            this.hideSpinner();
            toastr.success("CPD Training Registration accepted");
            $("#register_cpd_training_modal").modal("hide");
            const dataTable = $("#cpd_table").DataTable();
            dataTable.ajax.reload();
          },
          this.handleError.bind(this),
          { 'Authorization': `Bearer ${tokenValue}` }
        );
      }
    });
  }

  denyRegistration(id) {

    bootbox.prompt({
      title: "Provide a reason for denying this CPD Training Registration:",
      inputType: 'textarea',
      callback: (result) => {
        if (result === null) {
          // User clicked Cancel
          return;
        }

        if (result.length > 0) {
          const registrationId = id
          this.showSpinner();
          const formData = new FormData();
          formData.append('reason', result);
          formData.append('Id', registrationId);
          this.sendAjaxRequest(
            formData,
            "PUT",
            `${host}/api/CPDTrainingRegistrations/RejectCPDTrainingRegistration/${id}`,
            (response) => {
              this.hideSpinner();
              toastr.success("CPD Training Registration denied");
              $("#register_cpd_training_modal").modal("hide");
              const dataTable = $("#cpd_table").DataTable();
              dataTable.ajax.reload();
            },
            this.handleError.bind(this),
            { 'Authorization': `Bearer ${tokenValue}` }
          );
        }
        else {
          // Display an error message within the prompt
          bootbox.alert({
            title: "Error",
            message: "You must provide a reason for denial.",
            callback: () => {
              this.denyRegistration(); // Re-open the prompt
            }
          });
        }
      }
    });
  }
}

window.cpdTrainingHandler = new CPDTrainingHandler();
