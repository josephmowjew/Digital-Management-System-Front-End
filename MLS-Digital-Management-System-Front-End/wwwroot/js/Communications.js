class CommunicationsHandler {
    constructor() {
        this.hideSpinner();
        this.bindEvents();
        this.form = document.querySelector("#sendMessageForm");
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

        sendToAllUsersCheckbox.addEventListener('change', function() {
            if (this.checked) {
                targetOptions.style.display = 'none';
            } else {
                targetOptions.style.display = 'block';
            }
        });
    }

    bindEvents() {
        const sendMessageBtn = document.querySelector("#send_message_btn");
        if (sendMessageBtn) {
            sendMessageBtn.addEventListener("click", this.onSendMessageClick.bind(this));
        }
    }

    onSendMessageClick() {
        this.showSpinner();

        if (!this.form.checkValidity()) {
            this.hideSpinner();
            this.form.reportValidity();
        } else {
            const formData = new FormData(this.form);
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

            this.sendFetchRequest(
                JSON.stringify(jsonData),
                "POST",
                `${host}/api/Communications/send`,
                this.handleSendMessageSuccess.bind(this),
                this.handleError.bind(this)
            );
        }
    }

    sendFetchRequest(data, method, url, successCallback, errorCallback) {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValue}`
            },
            body: data
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(successCallback)
        .catch(error => {
            if (error instanceof Response) {
                error.json().then(errorCallback);
            } else {
                errorCallback(error);
            }
        })
        .finally(() => {
            this.hideSpinner();
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

    showSpinner() {
        const spinnerElement = document.getElementById("spinner");
        if (spinnerElement) {
            spinnerElement.classList.remove("hidden");
        }
    }

    hideSpinner() {
        const spinnerElement = document.getElementById("spinner");
        if (spinnerElement) {
            spinnerElement.classList.add("hidden");
        }
    }
}

window.communicationsHandler = new CommunicationsHandler();