class CommunicationsHandler {
    constructor() {
        this.hideSpinner();
        this.bindEvents();
        this.form = document.querySelector("#sendMessageForm");
        this.sendButton = document.querySelector("#send_message_btn");
        this.processingMessage = document.querySelector("#processingMessage");
        if (this.form) {
            this.setupFormBehavior();
        }
        this.initializeSelect2();
    }

    initializeSelect2() {
        $('.select2').select2({
            theme: 'bootstrap-5',
            width: '100%',
            placeholder: 'Select options',
            allowClear: true
        });
    }

    setupFormBehavior() {
        const sendToAllUsersCheckbox = document.getElementById('SendToAllUsers');
        const targetOptions = document.getElementById('targetOptions');

        const attachDocumentCheckBox = document.getElementById('attachDocument');
        const attachmentInput = document.getElementById('attachmentInput');

        sendToAllUsersCheckbox.addEventListener('change', function () {
            if (this.checked) {
                targetOptions.style.display = 'none';
            } else {
                targetOptions.style.display = 'block';
            }
        });

        attachDocumentCheckBox.addEventListener('change', function () {
            attachmentInput.style.display = this.checked ? 'block' : 'none';
        });

        attachmentInput.style.display = 'none';
    }

    bindEvents() {
        const sendMessageBtn = document.querySelector("#send_message_btn");
        if (sendMessageBtn) {


            sendMessageBtn.addEventListener("click", this.onSendMessageClick.bind(this));
        }
    }

    onSendMessageClick() {
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        this.setProcessingState(true);
        this.sendMessageData();
    }

    prepareJsonData(formData) {
        const jsonData = {};
        formData.forEach((value, key) => {
            if (key === 'DepartmentIds' || key === 'RoleNames') {
                jsonData[key] = $('#' + key).val();
            } else if (key === 'SendToAllUsers') {
                jsonData[key] = value === 'on';
            } else {
                jsonData[key] = value;
            }
        });
        return jsonData;
    }

    sendMessageData() {
        const formData = new FormData(this.form);

        // Handle multi-select fields
        const departmentIds = $('#DepartmentIds').val();
        formData.delete('DepartmentIds');
        departmentIds.forEach(id => formData.append('DepartmentIds', id));

        const roleNames = $('#RoleNames').val();
        formData.delete('RoleNames');
        roleNames.forEach(role => formData.append('RoleNames', role));

        // Handle checkbox
        formData.set('SendToAllUsers', this.form.querySelector('#SendToAllUsers').checked);

        // Handle optional attachment
        const fileInput = this.form.querySelector('#attachments');
        if (fileInput && fileInput.files.length > 0) {
            formData.set('Attachment', fileInput.files[0]);
        } else {
            formData.delete('Attachment');
        }

        fetch(`${host}/api/Communications/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
                // Don't set Content-Type header, let the browser set it for FormData
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(this.handleSendMessageSuccess.bind(this))
        .catch(this.handleError.bind(this))
        .finally(() => {
            this.setProcessingState(false);
        });
    }

    handleSendMessageSuccess(response) {
        toastr.success("Message sent successfully");
        $("#create_communication_modal").modal("hide");
        if (typeof datatable !== 'undefined' && datatable.ajax) {
            datatable.ajax.reload();
        }
    }

    handleError(error) {
        console.error('Error:', error);
        toastr.error(error.message || "An error occurred while sending the message");
    }

    setProcessingState(isProcessing) {
        this.sendButton.disabled = isProcessing;
        this.processingMessage.style.display = isProcessing ? 'block' : 'none';
    }

    hideSpinner() {
        const spinnerElement = document.getElementById("spinner");
        if (spinnerElement) {
            spinnerElement.classList.add("hidden");
        }
    }
}

window.communicationsHandler = new CommunicationsHandler();