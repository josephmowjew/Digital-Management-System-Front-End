class MessageHandler {
    constructor() {
        this.form = document.querySelector("#chatForm");
        this.messagesRetrieved = 0;
        this.noMoreMessages = false;
        this.getChatMessages(threadId, 5, 0);
        if (this.form) {
            this.formElements = this.form.querySelectorAll("input, select, textarea");
        }
        this.bindEvents();
    }

    bindEvents() {
        const createMessageBtn = document.querySelector("#chatForm button[name='create_message_btn']");
        if (createMessageBtn) {
            createMessageBtn.addEventListener("click", this.onCreateClick.bind(this));
        }

        const deleteMessageBtns = document.querySelectorAll(".delete-message-btn");
        deleteMessageBtns.forEach(btn => {
            btn.addEventListener("click", this.delete.bind(this));
        });

        const loadMoreMessagesBtn = document.querySelector("#loadMoreMessagesBtn");
        if (loadMoreMessagesBtn) {
            loadMoreMessagesBtn.addEventListener("click", () => {
                const skip = this.messagesRetrieved;
                this.getChatMessages(threadId, 5, skip);
            });
        }

        const messagesList = document.getElementById('messagesList');
        this.observeFirstMessage(messagesList);
    }

    observeFirstMessage(messagesList) {
        const firstMessage = messagesList.querySelector('.message:first-child');
        if (firstMessage) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !this.noMoreMessages) {
                    const skip = this.messagesRetrieved;
                    this.getChatMessages(threadId, 5, skip);
                }
            }, { threshold: 1.0 });
            observer.observe(firstMessage);
        }
    }

    onCreateClick() {
        const form = document.querySelector("#chatForm");

        if (!form.checkValidity()) {
            this.displayValidationErrors(form);
        } else {
            const formData = new FormData(form);
            this.sendAjaxRequest(
                formData,
                "POST",
                "http://localhost:5043/api/Messages",
                this.handleCreateSuccess.bind(this),
                this.handleError.bind(this, form),
                {
                    'Authorization': "Bearer " + tokenValue
                }
            );
        }
    }

    updateClicked() {
        const form = document.querySelector("#edit_message_modal form");
        const id = document.querySelector("#edit_message_modal form input[name='Id']").value;
        const errorMessages = form.querySelectorAll(".error-message");
        errorMessages.forEach(errorMessage => errorMessage.remove());

        if (!form.checkValidity()) {
            this.displayValidationErrors(form);
        } else {
            const formData = new FormData(form);
            this.sendAjaxRequest(
                formData,
                "PUT",
                `http://localhost:5043/api/Messages/${id}`,
                this.handleUpdateSuccess.bind(this),
                this.handleError.bind(this, form),
                {
                    'Authorization': "Bearer " + tokenValue
                }
            );
        }
    }

    editForm(id, token) {
        if (id > 0) {
            this.sendAjaxRequest(null, 'GET', `http://localhost:5043/api/Messages/GetMessageById/${id}`, this.handleEditFormSuccess.bind(this), this.handleError.bind(this), {
                'Authorization': `Bearer ${token}`
            });
        }
    }

    handleEditFormSuccess(response) {
        const editform = document.querySelector("#edit_message_modal form");
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
        $("#edit_message_modal").modal("show");
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

        bootbox.confirm("Are you sure you want to delete this message?", result => {
            if (result) {
                this.sendAjaxRequest(null, 'DELETE', `http://localhost:5043/api/Messages/${id}`, this.handleDeleteSuccess.bind(this), this.handleError.bind(this, null), {
                    'Authorization': `Bearer ${token}`
                });
            }
        });
    }

    handleCreateSuccess(response) {
        let messageObject = JSON.parse(response);
        this.displayMessages(messageObject);
    }

    handleUpdateSuccess(response) {
        const dataTable = $("#message_table").DataTable();
        toastr.success("Message updated successfully");
    }

    handleDeleteSuccess(response) {
        toastr.success("Message has been deleted successfully");
    }

    getChatMessages(threadId, numMessages, skip = 0) {
        const url = `http://localhost:5043/api/Messages/GetMessageByRange/${threadId}/${numMessages}/${skip}`;
        const messagesList = document.getElementById("messagesList");
        const previousScrollHeight = messagesList.scrollHeight;
        const previousScrollTop = messagesList.scrollTop;

        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': "Bearer " + tokenValue
          }
        })
          .then(response => response.json())
          .then(messages => {
            if (messages.length === 0) {
                this.noMoreMessages = true;
                const caughtUpNotice = document.createElement("div");
                caughtUpNotice.id = "caughtUpNotice";
                caughtUpNotice.innerHTML = "You are all caught up.";
                messagesList.insertAdjacentElement("afterbegin", caughtUpNotice);
            } else {
                this.noMoreMessages = false;
                console.log(messages);
                messages.reverse().forEach(message => this.displayMessagesAddedToTop(message));
                
                // Adjust the scroll position to keep the view stable
                const newScrollHeight = messagesList.scrollHeight;
                messagesList.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;

                // Re-observe the first message
                this.observeFirstMessage(messagesList);
            }
          })
          .catch(error => console.error(error));
    }

    displayMessages(messageObject) {
        this.messagesRetrieved += 1;
        let messageList = document.getElementById("messagesList");
        const formattedDate = new Date(messageObject.timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const className = messageObject.createdBy.id === userId ? 'sender' : 'receiver';
        
        messageList.insertAdjacentHTML('beforeend', `<div class="message ${className}">
                                  <div class="message-header">${messageObject.createdBy.firstName} ${messageObject.createdBy.lastName}</div>
                                  <div class="message-text">${messageObject.content}</div>
                                  <div class="message-timestamp">${formattedDate}</div>
                              </div>`);
    }

    displayMessagesAddedToTop(messageObject) {
        this.messagesRetrieved += 1;
        let messageList = document.getElementById("messagesList");
        const formattedDate = new Date(messageObject.timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const className = messageObject.createdBy.id === userId ? 'sender' : 'receiver';
        
        messageList.insertAdjacentHTML('afterbegin', `<div class="message ${className}">
                                    <div class="message-header">${messageObject.createdBy.firstName} ${messageObject.createdBy.lastName}</div>
                                    <div class="message-text">${messageObject.content}</div>
                                    <div class="message-timestamp">${formattedDate}</div>
                                </div>`);
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
                    errorCallback(xhr);
                }
            }
        };
        xhr.send(formData);
    }

    handleError(form, xhr) {
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

window.messageHandler = new MessageHandler();
