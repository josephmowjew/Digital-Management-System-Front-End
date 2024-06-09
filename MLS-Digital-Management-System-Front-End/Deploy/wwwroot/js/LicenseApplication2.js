class FormHandler {
    constructor() {
        this.hideSpinner();
        
        this.bindEvents();
      
       
         this.form = document.querySelector("#create_application_modal form");
        if (this.form) {
            this.formElements = this.form.querySelectorAll('input, select, textarea, checkbox');
            this.setupFormBehavior();
            this.hideFormFields();
        }
       
    }

    setupFormBehavior() {
        document.addEventListener('DOMContentLoaded', () => {
            const attachmentFields = document.querySelectorAll('div input[type="file"]');
            const explanationFields = document.querySelectorAll('input[type="text"], textarea');
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');

            attachmentFields.forEach(field => {
                field.style.display = 'none';
                field.required = false;
                const label = field.previousElementSibling;
                if (label) {
                    label.style.display = 'none';
                }
            });

            explanationFields.forEach(field => {
                field.style.display = 'block';
                field.required = true;
                const label = field.previousElementSibling;
                if (label) {
                    label.style.display = 'inline-block';
                }
            });

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', this.toggleAttachmentField.bind(this));
            });
        });
    }

    toggleAttachmentField(event) {
        const attachmentFieldName = event.target.name + 'Attachment';
        const attachmentField = document.querySelector(`input[name="${attachmentFieldName}"]`);
        const attachmentFieldLabel = attachmentField.previousElementSibling;
        const explanationFieldContainer = event.target.closest('.form-check').nextElementSibling;

        let explanationField = null;
        let explanationFieldLabel = null;

        if (explanationFieldContainer) {
            explanationField = explanationFieldContainer.querySelector('input[type="text"], textarea');
            if (explanationField) {
                explanationFieldLabel = explanationField.previousElementSibling;
            }
        }

        if (event.target.checked) {
            attachmentField.style.display = 'block';
            attachmentField.required = true;
            attachmentFieldLabel.style.display = 'inline-block';
            if (explanationField) {
                explanationField.style.display = 'none';
                explanationField.required = false;
                explanationFieldLabel.style.display = 'none';
                explanationField.value = '';
            }
        } else {
            attachmentField.style.display = 'none';
            attachmentField.required = false;
            attachmentFieldLabel.style.display = 'none';
            attachmentField.value = '';
            if (explanationField) {
                explanationField.style.display = 'block';
                explanationField.required = true;
                if (explanationFieldLabel) {
                    explanationFieldLabel.style.display = 'inline-block';
                }
            }
        }
    }

    bindEvents() {
        const createApplicationBtn = document.querySelector("#create_application_modal button[name='create_application_btn']");
        const saveApplicationBtn = document.querySelector("#create_application_modal button[name='save_application_btn']");
        
        
        if (createApplicationBtn) {
            createApplicationBtn.addEventListener('click', this.onCreateClick.bind(this));
        }
        
        if (saveApplicationBtn) {
            saveApplicationBtn.addEventListener('click', this.onSaveDraft.bind(this));
        }
    }

    onCreateClick() {
        this.showSpinner();

        const form = document.querySelector("#create_application_modal form");
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(errorMessage => errorMessage.remove());

        if (!form.checkValidity()) {
            this.hideSpinner();
            const invalidFields = document.querySelectorAll(':invalid');

            invalidFields.forEach(field => {
                const validationMessage = field.validationMessage;

                if (validationMessage) {
                    const errorMessage = document.createElement('div');
                    errorMessage.innerHTML = validationMessage;
                    errorMessage.classList.add('error-message');
                    errorMessage.style.color = 'red';
                    field.after(errorMessage);

                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();

                    const tab = field.closest('.tab-pane');
                    if (tab) {
                        const tabId = tab.id;
                        const tabButton = document.querySelector(`[data-bs-target="#${tabId}"]`);
                        tabButton.click();
                    }
                }
            });
        } else {
            const formData = new FormData(form);
            const id = form.querySelector('input[name="Id"]').value;
            const stringToBoolean = (str) => str === "True" ? true : false;
            let hasPreviousLicenseApplication = stringToBoolean(hasPreviousLicenseApplicationVar);
            formData.append("hasPreviousLicenseApplication", hasPreviousLicenseApplication);
            formData.append("actionType", "Submit");
            formData.append("Id", id);

            this.sendAjaxRequest(formData, 'POST', "http://18.217.103.30/api/LicenseApplications", this.handleCreateApplicationSuccess.bind(this), this.handleError.bind(this));
        }
    }

    onSaveDraft() {
        this.showSpinner();

        const form = document.querySelector("#create_application_modal form");
        const id = form.querySelector('input[name="Id"]').value;
        const formData = new FormData(form);
        const stringToBoolean = (str) => str === "True" ? true : false;
        let hasPreviousLicenseApplication = stringToBoolean(hasPreviousLicenseApplicationVar);
        formData.append("hasPreviousLicenseApplication", hasPreviousLicenseApplication);
        formData.append("actionType", "Draft");
        formData.append("Id", id);
        

        this.sendAjaxRequest(formData, 'POST', "http://18.217.103.30/api/LicenseApplications", this.handleSaveDraftSuccess.bind(this), this.handleError.bind(this));
    }

    sendAjaxRequest(formData, method, url, successCallback, errorCallback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${tokenValue}`);
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

    handleCreateApplicationSuccess(response) {
        this.hideSpinner();
        const dataTable = $('#my_table').DataTable();
        toastr.success("New license added successfully");
        $("#create_application_modal").modal("hide");
        dataTable.ajax.reload();
    }

    handleSaveDraftSuccess(response) {
        this.hideSpinner();
        const dataTable = $('#my_table').DataTable();
        toastr.success("Application saved successfully");
        $("#create_application_modal").modal("hide");
        dataTable.ajax.reload();
    }

    handleError(xhr) {
        this.hideSpinner();
        this.hideLicenseApplicationButtons();
        const errorResponse = JSON.parse(xhr.responseText);
     
        $.each(errorResponse, (key, value) => {
            $.each(value, (index, message) => {
                
                const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                const element = null;
                if(elementName != null)
                {
                    element = document.querySelector(`#create_application_modal form :input[name="${elementName || ''}"]`);

                }

                if (element) {
                    const errorSpan = element.nextElementSibling;
                    if (errorSpan && errorSpan.classList.contains('text-danger')) {
                        errorSpan.textContent = message;
                    } else {
                        const newErrorSpan = document.createElement('span');
                        newErrorSpan.textContent = message;
                        newErrorSpan.classList.add('text-danger');
                        element.after(newErrorSpan);
                    }
                }else{
                    // If elementName is null, create a new element at the bottom of the form (second tab)
                    const newErrorDiv = document.createElement('div');
                    newErrorDiv.textContent = message;
                    newErrorDiv.classList.add('text-danger');
                    const secondTab = document.querySelector('#professional');
                    secondTab.appendChild(newErrorDiv);

                    // Scroll to the new error element and focus on it
                    newErrorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    newErrorDiv.focus();

                    // Switch to the second tab
                    const secondTabButton = document.querySelector(`[data-bs-target="#professional"]`);
                    secondTabButton.click();
                }
            });
        });
    }

    showSpinner() {
        const spinnerElement = document.getElementById('spinner');
        if (spinnerElement) {
            spinnerElement.style.display = 'block';
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    hideSpinner() {
        const spinnerElement = document.getElementById('spinner');
        if (spinnerElement) {
            spinnerElement.style.display = 'none';
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    editForm(id, token, area = "") {
        this.showSpinner();

        if (id > 0) {
            this.sendAjaxRequest(null, 'GET', `http://18.217.103.30/api/LicenseApplications/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
                'Authorization': `Bearer ${token}`
            });
        }
    }

    handleEditFormSuccess(response) {
        this.hideSpinner();
        const data = JSON.parse(response);
        const fieldMap = this.createFieldMap(data);
    
        this.formElements.forEach(element => {
          const fieldName = element.getAttribute('name');
          const dataKey = fieldMap[fieldName];
          let fieldValue = data[dataKey];
    
          if (fieldName === "FirmId") {
            fieldValue = (data.member.firmId !== null && data.member.firmId !== 0) ? data.member.firmId : "";
          }
    
          if (element.type === 'checkbox') {
            this.setCheckboxValue(element, fieldValue);
          } else if (element.type === 'file') {
            this.handleFileUpload(element, data.attachments, fieldName);
          } else {
            element.value = fieldValue;
          }
        });
    
        const certificateOfAdmissionAttachment = data.attachments.find(attachment => attachment.propertyName === "CertificateOfAdmissionAttachment");
        if (certificateOfAdmissionAttachment) {
          this.setCheckboxValue(this.form.querySelector('input[name="CertificateOfAdmission"]'), true);
        }
    
        // Reset validation
        const validator = $("#create_application_modal form").validate();
        validator.resetForm();
    
        // Show modal
        $("#create_application_modal").modal("show");
      }
    
      createFieldMap(data) {
        return Object.entries(data).reduce((map, [key, value]) => {
          const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
          map[formFieldName] = key;
          return map;
        }, {});
      }
    
      setCheckboxValue(checkbox, value) {
        checkbox.checked = value === true || value === 'true';
        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
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
    delete(id, token) {
        bootbox.confirm("Are you sure you want to delete this application from the system?", result => {
            if (result) {
                this.sendAjaxRequest(null, 'DELETE', `http://18.217.103.30/api/licenseapplication/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this), {
                    'Authorization': `Bearer ${token}`
                });
            }
        });
    }

    handleDeleteSuccess(response) {
        toastr.success("application has been deleted successfully");
        const dataTable = $('#my_table').DataTable();
        dataTable.ajax.reload();
    }

    acceptApplication(id) {
        
        bootbox.confirm("Are you sure you want to accept this application?", result => {
            
            if (result) {
                this.showSpinner();
                this.hideLicenseApplicationButtons();
                this.sendAjaxRequest(null, 'GET', `http://18.217.103.30/api/LicenseApplications/accept/${id}`, this.handleAcceptApplicationSuccess.bind(this), this.handleError.bind(this), {
                    'Authorization': `Bearer ${tokenValue}`
                });
            }
        });
    }

    handleAcceptApplicationSuccess(response) {
        this.hideSpinner();
        toastr.success("application has been approved accepted successfully");

       
       
       
    }

    denyForm(id) {
        const denyModal = document.querySelector("#deny_license_application_modal");
        const denyInput = denyModal.querySelector('input[name="LicenseApplicationId"]');
        const denyButton = denyModal.querySelector('button[name="deny_license_application_btn"]');

        denyInput.value = id;
        denyButton.removeEventListener('click', this.denyApplication.bind(this));
        denyButton.addEventListener('click', this.denyApplication.bind(this));
        
        $("#deny_license_application_modal").modal("show");
    }

    hideLicenseApplicationButtons() {
        const $approveLicenseButton = $('#approve_license_application_btn');
        const $rejectLicenseButton = $('#reject_license_application_btn');

        if ($approveLicenseButton.length) {
            $approveLicenseButton.hide();
        }

        if ($rejectLicenseButton.length) {
            $rejectLicenseButton.hide();
        }
    }

    showLicenseApplicationButtons() {
        const $approveLicenseButton = $('#approve_license_application_btn');
        const $rejectLicenseButton = $('#reject_license_application_btn');

        if ($approveLicenseButton.length) {
            $approveLicenseButton.show();
        }

        if ($rejectLicenseButton.length) {
            $rejectLicenseButton.show();
        }
    }

    denyApplication() {
        this.showSpinner();
        toastr.clear();

        const denyModal = document.querySelector("#deny_license_application_modal");
        const form = denyModal.querySelector('form');
        const formData = new FormData(form);

        this.sendAjaxRequest(formData, 'POST', "http://18.217.103.30/api/licenseapplications/deny", this.handleDenyApplicationSuccess.bind(this), this.handleError.bind(this), {
            'Authorization': `Bearer ${tokenValue}`
        });
    }

    handleDenyApplicationSuccess(response) {
        this.hideSpinner();
        toastr.success("Application has been denied");

        $("#deny_license_application_modal").modal("hide");
        

    }

    updateApplication(token) {
        toastr.clear();

        const editModal = document.querySelector("#edit_application_modal");
        const form = editModal.querySelector('form');
        const formData = new FormData(form);
        const id = formData.get('Id');

        this.sendAjaxRequest(formData, 'PUT', `http://18.217.103.30/api/licenseapplication/${id}`, this.handleUpdateApplicationSuccess.bind(this), this.handleError.bind(this), {
            'Authorization': `Bearer ${token}`
        });
    }

    handleUpdateApplicationSuccess(response) {
        const dataTable = $('#my_table').DataTable();
        toastr.success("Pro bono application updated successfully");
        const editModal = document.querySelector("#edit_application_modal");
        editModal.style.display = 'none';
        dataTable.ajax.reload();
    }

    hideFormFields()
    {
        //get the form
        const form = document.querySelector("#create_application_modal form");

        

        const stringToBoolean = (str) => str === "True" ? true : false;

        let hasPreviousLicenseApplication = stringToBoolean(hasPreviousLicenseApplicationVar);
        

        const formElements = [...form.querySelectorAll('input, select, textarea, checkbox, label, textarea')];
        const newApplicationList = ["CertificateOfAdmission","ContributionToMLSBuildingProjectFund","ContributionToFidelityFund","AnnualSubscriptionToSociety","FirmId"]

        let applicationElements = null;

        if(hasPreviousLicenseApplication == false)
        {
            applicationElements = formElements.filter(element => {
            if (element.tagName === 'LABEL') {
                return newApplicationList.some(item => element.htmlFor.includes(item));
            } else {
            return (element.name && newApplicationList.some(item => element.name.includes(item))) || (element.id && newApplicationList.some(item => element.id.includes(item)));
            }
        });

        }else{
            applicationElements = formElements.filter(element => {
            if (element.tagName === 'LABEL') {
            return !element.htmlFor.includes('CertificateOfAdmission');
            } else {
            return !(element.name && element.name.includes('CertificateOfAdmission')) && !(element.id && element.id.includes('CertificateOfAdmission'));
            }
        });
        }
        
      
    //display only the elements in the applicationElements list from the formElements
    formElements.forEach(element => {
        if (applicationElements.includes(element)) {
        element.hidden = false; // show the element
        element.disabled = false; // set disabled to true
        } else {
        element.hidden = true; // hide the element
        element.required = false; // set required to false
        element.disabled = true; // set disabled to true
        }
    });
            
      

    }
}

// expose-form-handler.js
window.formHandler = new FormHandler();

