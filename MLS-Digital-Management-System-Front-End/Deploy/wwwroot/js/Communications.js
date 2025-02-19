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
        const includeSignatureCheckbox = document.getElementById('includeSignature');
        const signaturePreview = document.getElementById('signaturePreview');

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

        if (includeSignatureCheckbox) {
            includeSignatureCheckbox.addEventListener('change', () => {
                if (includeSignatureCheckbox.checked) {
                    signaturePreview.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
                    signaturePreview.style.display = 'block';

                    fetch(`${host}/api/Users/signature/html`, {
                        headers: {
                            'Authorization': `Bearer ${tokenValue}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to fetch signature');
                        return response.json();
                    })
                    .then(data => {
                        signaturePreview.innerHTML = data.html;
                    })
                    .catch(error => {
                        signaturePreview.innerHTML = '<div class="text-danger">Failed to load signature</div>';
                        console.error('Signature fetch error:', error);
                    });
                } else {
                    signaturePreview.style.display = 'none';
                    signaturePreview.innerHTML = '';
                }
            });
        }

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
            } else if (key === 'SendToAllUsers' || key === 'includeSignature') {
                jsonData[key] = value === 'on';
            } else {
                jsonData[key] = value;
            }
        });
        return jsonData;
    }

    sendMessageData() {
        const formData = new FormData();

        // Add basic form fields
        formData.append('Subject', this.form.querySelector('#Subject').value);
        formData.append('Body', this.form.querySelector('#Body').value);

        // Handle multi-select fields
        const departmentIds = $('#DepartmentIds').val() || [];
        departmentIds.forEach(id => formData.append('DepartmentIds', id));

        const roleNames = $('#RoleNames').val() || [];
        roleNames.forEach(role => formData.append('RoleNames', role));

        // Handle checkboxes
        formData.append('SendToAllUsers', this.form.querySelector('#SendToAllUsers').checked);
        formData.append('includeSignature', this.form.querySelector('#includeSignature').checked);
        
        // Handle multiple attachments
        const fileInput = this.form.querySelector('#attachments');
        if (fileInput && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => {
                formData.append('Attachments', file);
            });
        }

        fetch(`${host}/api/Communications/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
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