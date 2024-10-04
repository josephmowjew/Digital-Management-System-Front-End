class NotariesHandler {
  constructor() {
    this.hideSpinner();
    this.bindEvents();
    //this.bindCheckboxEvents();
    this.form = document.querySelector("#submit_notariesPublicSubmission_modal form");
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
    const submitNotaryBtn = document.querySelector(
      "#submit_notariesPublicSubmission_modal button[name='submit_notaries_public_btn']"
    );
    if (submitNotaryBtn) {
      submitNotaryBtn.addEventListener("click", this.onCreateClick.bind(this));
    }

    const updatePenaltyBtn = document.querySelector(
      "#edit_penalty_modal button[name='update_penalty_btn']"
    );
    if (updatePenaltyBtn) {
      updatePenaltyBtn.addEventListener("click", this.updateClicked.bind(this));
    }

    const deletePenaltyBtn = document.querySelector(
      "#submit_notariesPublicSubmission_modal button[name='delete_penalty_btn']"
    );
    if (deletePenaltyBtn) {
      deletePenaltyBtn.addEventListener("click", this.deleteClicked.bind(this));
    }
  }

  onCreateClick() {
    this.showSpinner();

    const form = document.querySelector("#submit_notariesPublicSubmission_modal form");


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
        `${host}/api/NotaryPublic/SubmitNotaryPublicDocument`,
        this.handleSubmitNotarySuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }

  EditForm(id, token, area = "") {
    //get the record from the database
    this.showSpinner();

    $.ajax({
      url: `${host}/api/NotaryPublic/GetNotaryPublicById/` + id,
      type: 'GET',
      headers: {
        'Authorization': "Bearer " + token
      }

    }).done((data) => {

      this.hideSpinner();

      const editform = document.querySelector("#edit_notariesPublicSubmission_modal form");
      //const data = JSON.parse(response);
      const fieldMap = this.createFieldMap(data);
      const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')];

      editformElements.forEach(element => {
        const fieldName = element.getAttribute('name');
        const dataKey = fieldMap[fieldName];
        let fieldValue = data[dataKey];

        if (element.type === 'checkbox') {
          this.setCheckboxValue(element, fieldValue);
        } else if (element.type === 'file') {
          //console.log("I'm here")
          this.handleFileUpload(element, data.attachments, fieldName);
        }
        else {
          element.value = fieldValue;
        }
      });

      // Hook up event to the update user button
      $("#edit_notariesPublicSubmission_modal button[name='update_notaries_public_btn']").unbind().click(() => this.updateApplication(token));

      // Reset validation
      var validator = $("#edit_notariesPublicSubmission_modal form").validate();
      validator.resetForm();

      // Show modal
      $("#edit_notariesPublicSubmission_modal").modal("show");

    })
  }

  delete(id, token) {
    bootbox.confirm("Are you sure you want to delete this Notaries Public Submission?", result => {
      if (result) {
        this.sendAjaxRequest(null, 'DELETE', `${host}/api/NotaryPublic/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
          'Authorization': `Bearer ${token}`
        });
      }
    });
  }

  handleDeleteSuccess(response) {
    toastr.success("Notaries Public Submission has been deleted successfully");
    const dataTable = $('#members_table').DataTable();
    dataTable.ajax.reload();
  }

  handleFileUpload(fileInput, attachments, fieldName) {
    const attachment = attachments.find(attachment => attachment.propertyName === fieldName);


    if (attachment) {

      //console.log("attachment description: ",attachment)
      const fileURL = attachment.filePath.replace(/\\/g, '/');
      const newFileURL = `${host}${fileURL}`;

      // Create a mock file
      const mockFile = new File([""], attachment.propertyName, { type: attachment.fileType });

      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(mockFile);

      // Set the file input's files
      fileInput.files = dataTransfer.files;

      // Create and dispatch a change event
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);

      // Update any related UI elements or perform additional actions
      //console.log(`File ${attachment.fileName} added to input field`);

      // Optionally, you can store the actual file URL as a data attribute
      fileInput.dataset.actualFileUrl = newFileURL;
    }
  }

  updateApplication(token) {
    toastr.clear()

    //get the authorisation token
    //updateApplication
    var authenticationToken = $("#edit_notariesPublicSubmission_modal input[name='__RequestVerificationToken']").val(token);

    //console.log("this is the form",$("#edit_application_modal form")[0])
        
    // Get the form itself
    var form = $("#edit_notariesPublicSubmission_modal form")[0];

    //console.log(form)
    // Create a new FormData object
    var formData = new FormData();

    // Append the form field values
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData.append(fieldName, fieldValue);
    });

     let id = $("#edit_notariesPublicSubmission_modal input[name='Id']").val()


    // Append the file attachments
    var attachments = $("#edit_notariesPublicSubmission_modal input[name='Attachments']")[0].files;
    for (var i = 0; i < attachments.length; i++) {
        formData.append("Attachments", attachments[i]);
    }
    //send the request

    $.ajax({
        url: `${host}/api/NotaryPublic/`+id,
        type: 'PUT',
        data: formData,
        processData: false, // Set processData to false to prevent automatic serialization
        contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
        headers: {
            'Authorization': "Bearer "+ token
        },
        success: (data) => {
                //show success message to the user
                var dataTable = $('#my_table').DataTable();

                toastr.success("Notaries Public submission updated successfully")

                $("#edit_notariesPublicSubmission_modal").modal("hide")

                dataTable.ajax.reload();
        },
        error: (xhr, ajaxOtions, thrownError) => {

            this.hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                   
                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#edit_notariesPublicSubmission_modal").find("form :input[name='" + (elementName || '') + "']");
                    
                    if (element && element.length) {
                      element.siblings("span.text-danger").text(message);
                    }
 
                });
            });
        }

    });


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

  handleSubmitNotarySuccess(response) {
    this.hideSpinner();
    const dataTable = $("#members_table").DataTable();
    toastr.success("Notary Submission successful");
    $("#submit_notariesPublicSubmission_modal").modal("hide");
    dataTable.ajax.reload();
    this.form.reset();
  }
  handleError(xhr) {
    this.hideSpinner();
    const errorResponse = JSON.parse(xhr.responseText);
    $.each(errorResponse, (key, value) => {
      $.each(value, (index, message) => {
        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
        const element = elementName
          ? document.querySelector(
            `#submit_notariesPublicSubmission_modal form input[name="${elementName}"], #submit_notariesPublicSubmission_modal form textarea[name="${elementName}"], #submit_notariesPublicSubmission_modal form select[name="${elementName}"]`
          )
          : null;

        console.log(key.charAt(0).toUpperCase() + key.slice(1));

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

  denyForm(id, token) {
    //get the input field inside the edit role modal form

    console.log(id);

    $("#deny_notary_submission_modal input[name ='NotaryPublicId']").val(id);

    //hook up an event to the update role button

    $("#deny_notary_submission_modal button[name='deny_notary_submission_btn']").unbind().click(() => this.DenyApplication());

    $("#deny_notary_submission_modal").modal("show");
  }


  DenyApplication() {
    this.showSpinner();

    toastr.clear();

    var form = $("#deny_notary_submission_modal form")[0];

    // Create a new FormData object
    var formData = new FormData();

    // Append the form field values
    $(form).find('input, select, textarea').each(function (index, element) {
      var field = $(element);
      var fieldName = field.attr('name');
      var fieldValue = field.val();
      console.log(fieldName, fieldValue);
      formData.append(fieldName, fieldValue);
    });
    //send the request
    $.ajax({
      url: `${host}/api/NotaryPublic/denyApplication`,
      type: 'POST',
      data: formData, // Convert formData object to JSON string
      processData: false, // Set processData to false to prevent automatic serialization
      contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
      headers: {
        'Authorization': "Bearer " + tokenValue
      },
      success: () => {
        this.hideSpinner();
        //show success message to the user
        var dataTable = $('#members_table').DataTable();
        toastr.success("Notaries Public Submission has been Denied");
        $("#deny_notary_submission_modal").modal("hide")
        dataTable.ajax.reload();
      },
      error: (xhr, ajaxOtions, thrownError) => {
        this.hideSpinner();
        var errorResponse = JSON.parse(xhr.responseText);
        $.each(errorResponse, function (key, value) {
          $.each(value, function (index, message) {

            const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
            const element = $("#deny_notary_submission_modal").find("form :input[name='" + (elementName || '') + "']");

            if (element && element.length) {
              element.siblings("span.text-danger").text(message);
            }

          });
        });
      }

    });
  }

  Activate(id, token) {

    bootbox.confirm("Are you sure you want to accept this application?", (result) => {


      if (result) {

        this.showSpinner()
        $.ajax({
          url: `${host}/api/NotaryPublic/activate/` + id,
          type: 'Get',
          headers: {
            'Authorization': "Bearer " + token
          }

        }).done((data) => {


          toastr.success("application has been accepted sucessfully")

          datatable.ajax.reload();

          this.hideSpinner();


        }).fail((response) => {

          this.hideSpinner();

          toastr.error("failed to accept application")

          datatable.ajax.reload();
        });
      }


    });
  }


  handleEditError(xhr) {
    this.hideSpinner();
    const errorResponse = JSON.parse(xhr.responseText);
    $.each(errorResponse, (key, value) => {
      $.each(value, (index, message) => {
        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
        const element = elementName
          ? document.querySelector(
            `#edit_penalty_modal form input[name="${elementName}"], #edit_penalty_modal form textarea[name="${elementName}"], #edit_penalty_modal form select[name="${elementName}"]`
          )
          : null;

        console.log(key.charAt(0).toUpperCase() + key.slice(1));

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

window.notariesHandler = new NotariesHandler();
