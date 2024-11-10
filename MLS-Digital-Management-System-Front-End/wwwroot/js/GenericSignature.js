class SignatureHandler {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $("#save_generic_signature_btn").click(() => this.createSignature());
        $("#update_generic_signature_btn").click(() => this.updateSignature());
    }

    createSignature() {
        const form = document.getElementById('createSignatureForm');
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
                datatable.ajax.reload();
            },
            error: this.handleError
        });
    }

    editForm(id) {
        const form = document.getElementById('editSignatureForm');
        form.reset();
        $(".signature-validation").text("");
        $('.signature-preview').empty();
        
        showSpinner();
        
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
                hideSpinner();
                $('#edit_signature_modal').modal('show');
            },
            error: (xhr) => {
                hideSpinner();
                toastr.error('Failed to fetch signature data');
            }
        });
    }

    updateSignature() {
        const form = document.getElementById('editSignatureForm');
        const formData = new FormData(form);
        const id = form.querySelector('[name="Id"]').value;
        
        if (!id) {
            toastr.error('Invalid signature ID');
            return;
        }
        
        // Only include file if a new one was selected
        const fileInput = form.querySelector('[name="Attachments"]');
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
            error: this.handleError
        });
    }

    delete(id) {
        if (confirm('Are you sure you want to delete this signature?')) {
            $.ajax({
                url: `${host}/api/GenericSignatures/${id}`,
                type: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenValue}`
                },
                success: () => {
                    toastr.success('Signature deleted successfully');
                    datatable.ajax.reload();
                },
                error: this.handleError
            });
        }
    }

    activate(id) {
        $.ajax({
            url: `${host}/api/GenericSignatures/activate/${id}`,
            type: 'PUT',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: () => {
                toastr.success('Signature activated successfully');
                datatable.ajax.reload();
            },
            error: this.handleError
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
}

window.signatureHandler = new SignatureHandler(); 