class SignatureHandler {
    constructor() {
        this.hideSpinner();
        this.bindEvents();
        this.isProcessing = false;
        
        $('#create_signature_modal').on('hidden.bs.modal', () => {
            document.getElementById('createSignatureForm').reset();
            $(".signature-validation").text("");
            this.enableButton('#save_generic_signature_btn', 'Save Signature');
        });

        $('#edit_signature_modal').on('hidden.bs.modal', () => {
            document.getElementById('editSignatureForm').reset();
            $(".signature-validation").text("");
            $('.signature-preview').empty();
            this.enableButton('#update_generic_signature_btn', 'Update Signature');
        });
    }

    bindEvents() {
        $("#save_generic_signature_btn").click(() => this.createSignature());
        $("#update_generic_signature_btn").click(() => this.updateSignature());
    }

    createSignature() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.disableButton('#save_generic_signature_btn');
        this.showSpinner();
        
        const form = document.getElementById('createSignatureForm');
        const fileInput = form.querySelector('[name="Attachments"]');
        if (fileInput.files.length && !this.validateFile(fileInput.files[0])) {
            this.isProcessing = false;
            this.enableButton('#save_generic_signature_btn', 'Save Signature');
            this.hideSpinner();
            return;
        }
        const formData = new FormData(form);
        
        $.ajax({
            url: `${host}/api/GenericSignatures`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: () => {
                toastr.success('Signature created successfully');
                $('#create_signature_modal').modal('hide');
                form.reset();
                datatable.ajax.reload();
            },
            error: (xhr) => {
                this.handleError(xhr);
            },
            complete: () => {
                this.isProcessing = false;
                this.enableButton('#save_generic_signature_btn', 'Save Signature');
                this.hideSpinner();
            }
        });
    }

    editForm(id) {
        const form = document.getElementById('editSignatureForm');
        form.reset();
        $(".signature-validation").text("");
        $('.signature-preview').empty();
        
        this.showSpinner();
        $.ajax({
            url: `${host}/api/GenericSignatures/${id}`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: (data) => {
                if (data) {
                    Object.keys(data).forEach(key => {
                        const elementName = key.charAt(0).toUpperCase() + key.slice(1);
                        const element = form.querySelector(`[name="${elementName}"]`);
                        if (element && element.type !== 'file') {
                            element.value = data[key];
                        }
                    });
                    
                    if (data.bannerImageUrl) {
                        const previewDiv = form.querySelector('.signature-preview');
                        previewDiv.innerHTML = `
                            <label class="form-label">Current Banner:</label><br>
                            <img src="${data.bannerImageUrl}" alt="Current signature banner" 
                                 style="max-width: 200px; max-height: 100px; object-fit: contain" 
                                 class="mb-2">
                        `;
                        const attachmentInput = form.querySelector('[name="Attachments"]');
                        attachmentInput.removeAttribute('required');
                    }
                }
                this.hideSpinner();
                $('#edit_signature_modal').modal('show');
            },
            error: (xhr) => {
                hideSpinner();
                toastr.error('Failed to fetch signature data');
            }
        });
    }

    updateSignature() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.disableButton('#update_generic_signature_btn');
        this.showSpinner();
        
        const form = document.getElementById('editSignatureForm');
        const fileInput = form.querySelector('[name="Attachments"]');
        if (fileInput.files.length && !this.validateFile(fileInput.files[0])) {
            this.isProcessing = false;
            this.enableButton('#update_generic_signature_btn', 'Update Signature');
            this.hideSpinner();
            return;
        }
        
        const formData = new FormData(form);
        const id = form.querySelector('[name="Id"]').value;
        
        if (!id) {
            toastr.error('Invalid signature ID');
            this.isProcessing = false;
            this.enableButton('#update_generic_signature_btn', 'Update Signature');
            this.hideSpinner();
            return;
        }
        
        if (!fileInput.files.length) {
            formData.delete('Attachments');
        }
        
        $.ajax({
            url: `${host}/api/GenericSignatures/${id}`,
            type: 'PUT',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: () => {
                toastr.success('Signature updated successfully');
                $('#edit_signature_modal').modal('hide');
                datatable.ajax.reload();
            },
            error: this.handleError,
            complete: () => {
                this.isProcessing = false;
                this.enableButton('#update_generic_signature_btn', 'Update Signature');
                this.hideSpinner();
            }
        });
    }

    delete(id) {
        bootbox.confirm({
            title: '<i class="ti ti-alert-triangle text-danger"></i> Delete Signature',
            message: '<p class="text-center">Are you sure you want to delete this signature?</p><p class="text-center text-danger"><small>This action cannot be undone.</small></p>',
            buttons: {
                cancel: {
                    label: '<i class="ti ti-x"></i> Cancel',
                    className: 'btn-secondary'
                },
                confirm: {
                    label: '<i class="ti ti-trash"></i> Delete',
                    className: 'btn-danger'
                }
            },
            centerVertical: true,
            closeButton: false,
            callback: (result) => {
                if (result) {
                    this.showSpinner();
                    $.ajax({
                        url: `${host}/api/GenericSignatures/${id}`,
                        type: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${tokenValue}`
                        },
                        success: () => {
                            this.hideSpinner();
                            toastr.success('Signature deleted successfully');
                            datatable.ajax.reload();
                        },
                        error: (xhr) => {
                            this.hideSpinner();
                            this.handleError(xhr);
                        }
                    });
                }
            }
        });
    }

    activate(id) {
        bootbox.confirm({
            title: '<i class="ti ti-alert-circle"></i> Activate Signature',
            message: '<p class="text-center">Are you sure you want to activate this signature?</p><p class="text-center text-warning"><small>This will deactivate any currently active signature.</small></p>',
            buttons: {
                cancel: {
                    label: '<i class="ti ti-x"></i> Cancel',
                    className: 'btn-secondary'
                },
                confirm: {
                    label: '<i class="ti ti-check"></i> Activate',
                    className: 'btn-success'
                }
            },
            centerVertical: true,
            closeButton: false,
            callback: (result) => {
                if (result) {
                    this.showSpinner();
                    $.ajax({
                        url: `${host}/api/GenericSignatures/activate/${id}`,
                        type: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${tokenValue}`
                        },
                        success: () => {
                            this.hideSpinner();
                            toastr.success('Signature activated successfully');
                            datatable.ajax.reload();
                        },
                        error: (xhr) => {
                            this.hideSpinner();
                            this.handleError(xhr);
                        }
                    });
                }
            }
        });
    }

    handleError(xhr) {
        if (xhr.status === 400) {
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function(key, value) {
                    if (Array.isArray(value)) {
                        value.forEach(message => {
                            const elementName = key.charAt(0).toUpperCase() + key.slice(1);
                            const validationSpan = $(`[data-valmsg-for="${elementName}"]`);
                            if (validationSpan.length) {
                                validationSpan.text(message);
                            }
                        });
                    }
                });
            } catch (e) {
                toastr.error('Operation failed');
            }
        } else {
            toastr.error('Operation failed');
        }
    }

    showSpinner() {
        const spinnerElement = document.getElementById('spinner');
        if(spinnerElement) {
            spinnerElement.style.display = 'block';
        }
    }

    hideSpinner() {
        const spinnerElement = document.getElementById('spinner');
        if(spinnerElement) {
            spinnerElement.style.display = 'none';
        }
    }

    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toastr.error('Please select a valid image file (PNG or JPG)');
            return false;
        }
        return true;
    }

    disableButton(selector, loadingText = 'Processing...') {
        const button = $(selector);
        button.prop('disabled', true)
              .html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${loadingText}`);
    }

    enableButton(selector, originalText) {
        const button = $(selector);
        button.prop('disabled', false).html(originalText);
    }
}

window.signatureHandler = new SignatureHandler(); 