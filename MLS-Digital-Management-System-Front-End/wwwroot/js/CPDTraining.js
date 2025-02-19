class CPDTrainingHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    this.bindCheckboxEvents();
    this.setupFeeToggle();
    this.fee = 0
    this.form = document.querySelector("#create_cpd_modal form");
    if (this.form) {
      this.formElements = this.form.querySelectorAll("input, select, textarea");
      this.setupFormBehavior();
    }
    this.selectedCPDTrainingIds = []; // Initialize the array
    this.fileUploadHandler = new FileUploadHandler(`${host}`);
    this.selectedFirmMembers = []; // Initialize selected firm members array
    //this.currentTraining = null; // Add this line

    // Bind modal shown event to initialize Select2
    $(document).on('shown.bs.modal', '#cpd_invoice_modal', () => {
      this.initializeSelect2();
    });

    // Bind Select2 change event using event delegation
    $(document).on('change', '#firmMembers', (e) => {
      console.log('Select2 change event triggered');
      const selectedValues = $(e.target).val();
      console.log('Selected values:', selectedValues);
      this.selectedFirmMembers = selectedValues || [];
    });
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

    const requestInvoiceBtn = document.querySelector("#request_invoice_btn");
    if (requestInvoiceBtn) {
      requestInvoiceBtn.addEventListener("click", this.requestInvoice.bind(this));
    }

    // Add event listener for request type change
    const requestTypeSelect = document.querySelector("#requestType");
    if (requestTypeSelect) {
      requestTypeSelect.addEventListener("change", this.handleRequestTypeChange.bind(this));
    }
  }

  bindCheckboxEvents() {
    $('#cpd_table').on('change', '.cpdTrainingCheckbox', function () {
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

  handleRequestTypeChange(event) {
    const requestType = event.target.value;
    const firmMembersSection = document.querySelector("#firmMembersSection");
    const firmMembersSelect = document.querySelector("#firmMembers");

    if (requestType === "Firm") {
      firmMembersSection.style.display = "block";
      firmMembersSelect.disabled = false;
      this.loadFirmMembers();
    } else {
      firmMembersSection.style.display = "none";
      firmMembersSelect.disabled = true;
      this.selectedFirmMembers = [];
      $('#firmMembers').val(null).trigger('change');
    }
  }

  loadFirmMembers() {
    this.showSpinner();
    this.sendAjaxRequest(
      null,
      "GET",
      `${host}/api/Members/getFirmMembers`,
      this.handleLoadFirmMembersSuccess.bind(this),
      this.handleError.bind(this),
      { 'Authorization': `Bearer ${tokenValue}` }
    );
  }

  handleLoadFirmMembersSuccess(response) {
    try {
      const firmMembers = typeof response === 'string' ? JSON.parse(response) : response;
      const $firmMembers = $('#firmMembers');

      // Clear existing options and selections
      $firmMembers.empty();
      this.selectedFirmMembers = [];

      // Add new options
      firmMembers.forEach(member => {
        const option = new Option(
          member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown Name',
          member.id,
          false,
          false
        );
        $(option).data('member', member);
        $firmMembers.append(option);
      });

      // Re-initialize Select2
      this.initializeSelect2();

      // Enable the select
      $firmMembers.prop('disabled', false).trigger('change');

    } catch (error) {
      console.error('Error handling firm members:', error);
      this.handleError({ responseText: JSON.stringify({ error: 'Failed to load firm members' }) });
    }
  }

  requestInvoice() {
    const requestType = $('#requestType').val();
    if (!requestType) {
      toastr.error("Please select a request type");
      return;
    }

    if (requestType === "Firm") {
      // Get selected members directly from Select2
      const selectedMembers = $('#firmMembers').select2('data').map(item => item.id);
      console.log('Selected members before submit:', selectedMembers);

      if (!selectedMembers || selectedMembers.length === 0) {
        toastr.error("Please select at least one firm member");
        $('#firmMembersError').show();
        return;
      }
      this.selectedFirmMembers = selectedMembers;
      $('#firmMembersError').hide();
    }

    bootbox.confirm("Are you sure you want to request an invoice?", (result) => {
      if (result) {
        this.showSpinner();
        const trainingId = document.querySelector("#cpd_invoice_modal input[name='CPDTrainingId']").value;

        const formData = new FormData();
        formData.append("ReferencedEntityType", "CPDTrainings");
        formData.append("Amount", this.fee);
        formData.append("ReferencedEntityId", trainingId);
        formData.append("Description", "MLS");
        formData.append("RequestType", requestType);

        // Add firm members if this is a firm request
        if (requestType === "Firm" && this.selectedFirmMembers.length > 0) {
          console.log('Sending selected members:', this.selectedFirmMembers);
          formData.append("FirmMembers", JSON.stringify(this.selectedFirmMembers));
        }

        // Add attendance mode
        const attendanceMode = $('#AttendanceMode').val();
        formData.append("AttendanceMode", attendanceMode);

        $.ajax({
          url: `${host}/api/InvoiceRequest`,
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          headers: {
            'Authorization': `Bearer ${tokenValue}`
          },
          success: (response) => {
            this.hideSpinner();
            document.getElementById("request_invoice_btn").style.display = "none";
            toastr.success("Invoice requested successfully");
            $("#cpd_invoice_modal").modal("hide");
            // Optionally reload the table if you have one
            if ($.fn.DataTable && $('#cpd_table').length) {
              $('#cpd_table').DataTable().ajax.reload();
            }
          },
          error: (xhr) => {
            this.hideSpinner();
            const errorMessage = xhr.responseJSON?.message || "Failed to request invoice";
            toastr.error(errorMessage);
            console.error('Request failed:', xhr); // Debug log
          }
        });
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
            `${host}/api/CPDTrainingRegistrations/MarkAttendance`,
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

    // Handle the categorization checkbox first and trigger its change event
    const categorizationCheckbox = editform.querySelector('#categorizeMemberFees');
    if (categorizationCheckbox) {
      categorizationCheckbox.checked = data.isCategorizedForMembers;
      $(categorizationCheckbox).trigger('change'); // Trigger the change event using jQuery
    }

    const editformElements = [...editform.querySelectorAll('input, select, textarea')];
    editformElements.forEach(element => {
      if (element === categorizationCheckbox) return; // Skip the checkbox as we already handled it

      const fieldName = element.getAttribute('name');
      if (!fieldName) return;

      // Handle different types of fields
      if (element.type === 'file') {
        this.fileUploadHandler.handleFileUpload(element, data.attachments, fieldName);
        return;
      }
      else if (fieldName == "CPDUnitsAwarded") {
        element.value = data.cpdUnitsAwarded;
      }

      // Convert fieldName to camelCase for matching with API response
      const dataKey = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
      const fieldValue = data[dataKey];

      // Skip if the field is in the hidden fees section
      const isInRegularFees = element.closest('#regularMemberFees');
      const isInCategorizedFees = element.closest('#categorizedFees');

      if ((isInRegularFees && data.isCategorizedForMembers) ||
        (isInCategorizedFees && !data.isCategorizedForMembers)) {
        element.value = '';
        return;
      }

      // Set the value if it exists
      if (fieldValue !== undefined && fieldValue !== null) {
        element.value = fieldValue;
      }
    });

    $("#edit_cpd_modal").modal("show");
  }

  registerForm(trainingId, trainingFee) {
    const cpdRegisterform = document.querySelector("#register_cpd_training_modal form");
    const trainingIdInput = cpdRegisterform.querySelector('input[name="CPDTrainingId"]');
    trainingIdInput.value = trainingId;

    //get invoice request id from the data attribute on the clicked button 

    //set the value of an element with a specified id InvoiceRequestId to the incoming invoiceRequestId
    const invoiceRequestIdInput = cpdRegisterform.querySelector('input[name="InvoiceRequestId"]');


    // Log the trainingId for debugging purposes
    const trainingData = JSON.parse(trainingFee);

    // Destructure the different fees from the trainingFee object
    const {
      seniorLawyerPhysicalAttendanceFee,
      seniorLawyerVirtualAttendanceFee,
      juniorLawyerPhysicalAttendanceFee,
      juniorLawyerVirtualAttendanceFee,
      memberPhysicalAttendanceFee,
      memberVirtualAttendanceFee,
      nonMemberPhysicalAttendanceFee,
      nonMemberVirtualAttandanceFee,
      //invoiceRequestId,
      invoiceRequests,
    } = trainingData;


    // Filter invoiceRequests based on createdById
    const filteredInvoiceRequests = trainingData.invoiceRequests?.filter(request => {
      const firmMembers = JSON.parse(request.firmMembers || '[]');
      return request.createdById === userIdGlobal || firmMembers.includes(memberIdGlobal);
    });

    // Use the first matching invoiceRequest if available
    const invoiceRequest = filteredInvoiceRequests?.length > 0 ? filteredInvoiceRequests[0] : null;

    //console.log(invoiceRequest?.id ?? 0);



    //set the value of an element with a specified id InvoiceRequestId to the incoming invoiceRequestId making sure the value is not null
    invoiceRequestIdInput.value = invoiceRequest?.id ?? 0;

    // Check if all fees are zero or null
    const isFree = (invoiceRequest == null || invoiceRequest.amount < 1);

    const displayFee = (invoiceRequest) => {

      let ParentinvoiceData = JSON.parse(invoiceRequest);

      let invoiceData = ParentinvoiceData.invoiceRequests?.filter(request => {
        const firmMembers = JSON.parse(request.firmMembers || '[]');
        return request.createdById === userIdGlobal || firmMembers.includes(memberIdGlobal);
      });
      //set the fee to the class member
      let fee = invoiceData[0].amount;

      const amountElement = cpdRegisterform.querySelector("#cpd_training_amount");
      const requestInvoiceButton = document.querySelector("#request_invoice_btn");

      if (typeof (fee) === "number") {
        if (fee > 0) {

          amountElement.innerHTML = `<strong>MWK${fee} </strong>`;
          requestInvoiceButton.style.display = "block"; // Show the button when amount is set
        } else {
          amountElement.innerHTML = `<strong>Free CPD</strong>`;
          requestInvoiceButton.style.display = "none"; // Hide the button for free events
        }
      } else {
        amountElement.innerHTML = `<strong>0`;
        requestInvoiceButton.style.display = "none"; // Hide the button when amount is pending
      }
    };


    if (isFree) {
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "none";
      const attachmentsField = cpdRegisterform.querySelector('div input[type="file"]');
      attachmentsField.style.display = "none";
      const label = attachmentsField.previousElementSibling;
      if (label) {
        label.style.display = "none";
      }
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "block";
      document.querySelector("#request_invoice_btn").style.display = "none"; // Hide the button for free events
    } else {

      displayFee(trainingFee);
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "none";
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "block";
    }

    $("#register_cpd_training_modal").modal("show");
  }

  invoiceForm(trainingId, trainingFee) {
    const cpdRegisterform = document.querySelector("#cpd_invoice_modal form");
    const trainingIdInput = cpdRegisterform.querySelector('input[name="CPDTrainingId"]');
    trainingIdInput.value = trainingId;

    const trainingData = JSON.parse(trainingFee);

    // Destructure the different fees from the trainingFee object
    const {
      seniorLawyerPhysicalAttendanceFee,
      seniorLawyerVirtualAttendanceFee,
      juniorLawyerPhysicalAttendanceFee,
      juniorLawyerVirtualAttendanceFee,
      memberPhysicalAttendanceFee,
      memberVirtualAttendanceFee,
      nonMemberPhysicalAttendanceFee,
      nonMemberVirtualAttandanceFee
    } = trainingData;

    // Check if all fees are zero or null
    const isFree = [memberPhysicalAttendanceFee, memberVirtualAttendanceFee, nonMemberPhysicalAttendanceFee, nonMemberVirtualAttandanceFee, seniorLawyerPhysicalAttendanceFee, seniorLawyerVirtualAttendanceFee, juniorLawyerPhysicalAttendanceFee, juniorLawyerVirtualAttendanceFee]
      .every(fee => fee === null || fee <= 0);

    const displayFee = (fee) => {

      //set the fee to the class member
      this.fee = fee
      const amountElement = cpdRegisterform.querySelector("#cpd_training_amount");
      const requestInvoiceButton = document.querySelector("#request_invoice_btn");

      if (typeof (fee) === "number") {
        if (fee > 0) {
          amountElement.innerHTML = `<strong>MWK${fee} </strong>`;
          requestInvoiceButton.style.display = "block"; // Show the button when amount is set
        } else {
          amountElement.innerHTML = `<strong>Free CPD</strong>`;
          requestInvoiceButton.style.display = "none"; // Hide the button for free events
        }
      } else {
        if (trainingData.isCategorizedForMembers) {
          amountElement.innerHTML = `<strong>Pending....Please select attendance mode and seniority level</strong>`;
        } else {
          amountElement.innerHTML = `<strong>Pending....Please select attendance mode</strong>`;
        }
        // Hide the button when amount is pending
      }
    };

    const modeOfAttendanceSelect = cpdRegisterform.querySelector('select[name="AttendanceMode"]');
    modeOfAttendanceSelect.addEventListener('change', () => {
      const selectedMode = modeOfAttendanceSelect.value;

      // Check if training is categorized for members
      if (trainingData.isCategorizedForMembers) {
        // Show seniority level selection
        const seniorityContainer = document.querySelector('#seniorityLevelContainer');
        seniorityContainer.style.display = 'block';

        // Reset seniority selection when mode changes
        const senioritySelect = document.querySelector('#seniorityLevel');
        senioritySelect.value = '';

        // Display pending message until seniority is selected
        const amountElement = document.querySelector("#cpd_training_amount");
        amountElement.innerHTML = '<strong>Pending....Please select seniority level</strong>';
        document.querySelector("#request_invoice_btn").style.display = "none";

        // Add event listener for seniority selection
        senioritySelect.addEventListener('change', () => {
          const selectedSeniority = senioritySelect.value;
          let fee = 0;

          if (selectedSeniority === 'Senior') {
            fee = selectedMode === 'Physical'
              ? trainingData.seniorLawyerPhysicalAttendanceFee
              : trainingData.seniorLawyerVirtualAttendanceFee;
          } else if (selectedSeniority === 'Junior') {
            fee = selectedMode === 'Physical'
              ? trainingData.juniorLawyerPhysicalAttendanceFee
              : trainingData.juniorLawyerVirtualAttendanceFee;
          }

          displayFee(fee);
        });
      } else {
        // For non-categorized trainings, hide seniority container and calculate fee directly
        const seniorityContainer = document.querySelector('#seniorityLevelContainer');
        seniorityContainer.style.display = 'none';

        let fee = 0;
        if (selectedMode === 'Physical') {
          fee = trainingData.memberPhysicalAttendanceFee || 0;
        } else if (selectedMode === 'Virtual') {
          fee = trainingData.memberVirtualAttendanceFee || 0;
        }
        displayFee(fee);
      }
    });

    if (isFree) {
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "none";
      const label = attachmentsField.previousElementSibling;
      if (label) {
        label.style.display = "none";
      }
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "block";
      document.querySelector("#request_invoice_btn").style.display = "none"; // Hide the button for free events
    } else {
      displayFee(trainingFee);
      cpdRegisterform.querySelector("#cpd_training_no_payment_alert").style.display = "none";
      cpdRegisterform.querySelector("#cpd_training_payment_alert").style.display = "block";
    }

    $("#cpd_invoice_modal").modal("show");
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

  generateCertificate(trainingId) {
    // Open a new window with the certificate template
    var certificateWindow = window.open(`/Member/CPDTrainings/CDPCertificate/${trainingId}`, '_blank');

    // Wait for the new window to load
    certificateWindow.onload = function () {

      // Use html2pdf to convert the certificate to PDF
      html2pdf().from(certificateWindow.document.body).save('Certificate_of_Attendance.pdf');
    };
  }

  initializeSelect2() {
    const $firmMembers = $('#firmMembers');

    // Destroy existing Select2 instance if it exists
    if ($firmMembers.hasClass('select2-hidden-accessible')) {
      $firmMembers.select2('destroy');
    }

    // Initialize Select2
    $firmMembers.select2({
      placeholder: 'Search and select members',
      allowClear: true,
      width: '100%',
      dropdownParent: $('#cpd_invoice_modal'),
      templateResult: this.formatMemberOption.bind(this),
      templateSelection: this.formatMemberSelection.bind(this)
    }).on('select2:select select2:unselect', (e) => {
      // Update selectedFirmMembers whenever selection changes
      this.selectedFirmMembers = $firmMembers.val() || [];
      console.log('Selection changed:', this.selectedFirmMembers);
    });
  }

  formatMemberOption(member) {
    if (!member.id) {
      return member.text;
    }

    // Access the full member data from the element
    const memberData = member.element ? $(member.element).data('member') : member;
    if (!memberData) return member.text;

    const userName = memberData.user ?
      `${memberData.user.firstName} ${memberData.user.lastName}` :
      'Unknown Name';

    const licenseNumber = memberData.currentLicense ?
      memberData.currentLicense.licenseNumber :
      'No License';

    return $(`
      <div class="d-flex flex-column">
        <strong>${userName}</strong>
        <small class="text-muted">License: ${licenseNumber}</small>
        ${memberData.firm ? `<small class="text-muted">Firm: ${memberData.firm.name}</small>` : ''}
      </div>
    `);
  }

  formatMemberSelection(member) {
    if (!member.id) {
      return member.text;
    }

    // Access the full member data from the element
    const memberData = member.element ? $(member.element).data('member') : member;
    if (!memberData) return member.text;

    const userName = memberData.user ?
      `${memberData.user.firstName} ${memberData.user.lastName}` :
      'Unknown Name';

    return userName;
  }

  setupFeeToggle() {
    // Set initial state of required fields
    const regularFees = $('#uncategorized-fees');
    const categorizedFees = $('#categorized-fees');

    // Make regular fees required by default
    regularFees.find('input').prop('required', true);
    categorizedFees.find('input').prop('required', false);

    // Add event listener for checkbox changes
    $(document).on('change', '#categorizeMemberFees', function () {
      const isChecked = $(this).is(':checked');

      if (isChecked) {
        regularFees.hide();
        categorizedFees.show();
        // Update required fields
        regularFees.find('input').prop('required', false);
        categorizedFees.find('input').prop('required', true);
      } else {
        regularFees.show();
        categorizedFees.hide();
        // Update required fields
        regularFees.find('input').prop('required', true);
        categorizedFees.find('input').prop('required', false);
      }
    });
  }
}

$(document).ready(function () {
  window.cpdTrainingHandler = new CPDTrainingHandler();

});
