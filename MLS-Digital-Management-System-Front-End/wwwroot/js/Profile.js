$(function () {

    hideSpinner();

    EditForm(userIdGlobal)
    //hook up a click event to the login button

    // Add toggle functionality for profile picture
    $('#toggleProfilePicture').change(function() {
        const profilePictureSection = $('#profilePictureSection');
        const profilePictureInput = $('#ProfilePictures');
        
        if ($(this).is(':checked')) {
            profilePictureSection.slideDown();
            // Only make it required when the section is visible
            profilePictureInput.prop('required', true);
        } else {
            profilePictureSection.slideUp();
            // Remove required attribute when hidden
            profilePictureInput.prop('required', false);
            // Clear the file input when hiding
            profilePictureInput.val('');
        }
    });

    var updateUserButton = $("#update_user_form button[name='update_user_btn']").unbind().click(OnUpdateClick);

    function OnUpdateClick() {
        showSpinner();
        
        // Get the form and create FormData object
        var form = $("#update_user_form form")[0];
        var formData = new FormData(form);
        
        // Collect other form data
        $('#update_user_form form input, #update_user_form form select, #update_user_form form textarea').each(function() {
            var field = $(this);
            var fieldName = field.attr('name');
            
            // Skip the file input as we've handled it separately
            if (fieldName && field.attr('type') !== 'file') {
                var fieldValue = field.val();
                formData.append(fieldName, fieldValue);
            }
        });
    
        // Send the data using AJAX
        $.ajax({
            url: `${host}/api/users/` + userIdGlobal,
            type: 'PUT',
            data: formData,
            processData: false,  // Important for FormData
            contentType: false,  // Important for FormData
            headers: {
                'Authorization': 'Bearer ' + tokenValue
            },
            success: function (data) {
                hideSpinner();
                //show success message to the user
                var dataTable = $('#my_table').DataTable();

                toastr.success("User updated successfully");
                toastr.info("You will be logged out in 5 seconds for the changes to take effect...");

                // Add delay before logout
                setTimeout(function() {
                    $.ajax({
                        url: '/home/logout',  // Using a relative URL
                        type: 'GET',  // Changed to GET
                        success: function () {
                            // Redirect to the login page or home page after logout
                            window.location.href = '/';
                        },
                        error: function () {
                            toastr.error("Logout failed. Please try again.");
                        }
                    });
                }, 5000); // 3 second delay
            },
            error: function(xhr, status, error) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {

                        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                        const element = $("#update_user_form").find("form :input[name='" + (elementName || '') + "']");

                        if (element && element.length) {
                            element.siblings("span.text-danger").text(message);
                        }

                    });
                });
            }
        });
    }


})

function EditForm(id) {

    //get the record from the database
    showSpinner();

    $.ajax({
        url: `${host}/api/users/` + id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer " + tokenValue
        }

    }).done(function (data) {

        //console.log(data)

        hideSpinner();
        // Iterate over the keys of the data object and map them to form field names dynamically
        var fieldMap = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var formFieldName = key.charAt(0).toUpperCase() + key.slice(1); // Convert first character to uppercase
                fieldMap[formFieldName] = key; // Map form field name to data key
            }
        }

        // Iterate over the form elements and populate values dynamically
        $("#update_user_form form").find('input, select').each(function (index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            
            // Skip the profile picture field
            if (fieldName !== 'ProfilePictures') {
                var dataKey = fieldMap[fieldName]; // Get corresponding key from data
                var fieldValue = data[dataKey]; // Get value from data based on key
                field.val(fieldValue); // Set field value
            }
        });
        // Set additional fields like DateOfBirth
        var currentDate = new Date(data.dateOfBirth);
        var day = ("0" + currentDate.getDate()).slice(-2);
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        var date = currentDate.getFullYear() + "-" + (month) + "-" + (day);
        $("#update_user_form input[name ='DateOfBirth']").val(date);

        // Hook up event to the update user button
        //$("#edit_user_form button[name='update_user_btn']").unbind().click(function () { OnUpdateClick() });

        // Reset validation
        var validator = $("#update_user_form form").validate();
        validator.resetForm();
    })
}


function upDateUser(token) {
    toastr.clear()

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_user_modal input[name='__RequestVerificationToken']").val();

    //get the form itself 
    var form = $("#edit_user_modal form");

    var formData = {};

    // Iterate over the form's elements and build the formData object dynamically
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData[fieldName] = fieldValue;
    });

    let id = $("#edit_user_modal input[name='Id']").val()

    // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);

    //send the request

    $.ajax({
        url: `${host}/api/users/` + id,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function (data) {

            //parse whatever comes back to html

            var parsedData = $.parseHTML(data);

            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"

            //show success message to the user
            var dataTable = $('#my_table').DataTable();

            toastr.success("User updated successfully");

            $("#edit_user_modal").modal("hide");

            //dataTable.ajax.reload();
            location.reload();
        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {

                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#edit_user_modal").find("form :input[name='" + (elementName || '') + "']");

                    if (element && element.length) {
                        element.siblings("span.text-danger").text(message);
                    }

                });
            });
        }

    });
}

// Function to start the spinner
function showSpinner() {

    var spinnerElement = document.getElementById('spinner');
    if (spinnerElement) {
        spinnerElement.style.display = 'block';
    } else {
        console.error('Spinner element with id "spinner" was not found');
    }

}

// Function to stop the spinner
function hideSpinner() {

    var spinnerElement = document.getElementById('spinner');
    if (spinnerElement) {
        spinnerElement.style.display = 'none';
    } else {
        console.error('Spinner element with id "spinner" was not found');
    }
}

$(document).ready(function () {
    $("#save_signature_btn").click(function () {
        $(".signature-validation").text("");

        const form = document.getElementById('signatureForm');
        const formData = new FormData(form);

        $.ajax({
            url: `${host}/api/Users/signature`,
            type: 'PUT',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: function (response) {
                toastr.success('Email signature updated successfully');
                $('#signatureModal').modal('hide');
                form.reset();
            },
            error: function (xhr) {
                if (xhr.status === 400) {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        $.each(errorResponse, function (key, value) {
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
                        toastr.error('Failed to update email signature');
                    }
                } else {
                    toastr.error('Failed to update email signature');
                }
            }
        });
    });

    $('#signatureModal').on('show.bs.modal', function () {
        const form = document.getElementById('signatureForm');
        form.reset();
        $(".signature-validation").text("");
        $('.banner-preview').empty();

        showSpinner();

        $.ajax({
            url: `${host}/api/Users/signature`,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: function (data) {
                if (data) {
                    Object.keys(data).forEach(key => {
                        const elementName = key.charAt(0).toUpperCase() + key.slice(1);
                        const element = form.querySelector(`[name="${elementName}"]`);
                        if (element && element.type !== 'file') {
                            element.value = data[key];
                        }
                    });

                    if (data.bannerImageUrl) {
                        $('.banner-preview').html(`
                            <label class="form-label">Current Banner:</label>
                            <div class="d-flex align-items-start gap-3 mb-2">
                                <img src="${data.bannerImageUrl}" alt="Current signature banner" 
                                     style="max-width: 200px; max-height: 100px; object-fit: contain">
                                <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeBanner()">
                                    <i class="ti ti-trash me-1"></i>Remove Banner
                                </button>
                            </div>
                        `);
                        const attachmentInput = form.querySelector('[name="Attachments"]');
                        attachmentInput.removeAttribute('required');
                    }
                }
                hideSpinner();
            },
            error: function (xhr) {
                hideSpinner();
                if (xhr.status !== 404) {
                    toastr.error('Failed to fetch existing signature data');
                }
            }
        });
    });

    $('#changeRequestModal').on('show.bs.modal', function () {
        const form = document.getElementById('changeRequestForm');
        form.reset();
        $(".email-validation").text("");
        $(".phone-number-validation").text("");

        showSpinner();

        $.ajax({
            url: `${host}/api/Users/` + userIdGlobal,
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: function (data) {
                if (data) {
                    Object.keys(data).forEach(key => {
                        const elementName = key.charAt(0).toUpperCase() + key.slice(1);
                        const element = form.querySelector(`[name="${elementName}"]`);
                        
                        if (element && element.type !== 'file') {
                            element.value = data[key];
                        }
                    });
                }
                hideSpinner();
            },
            error: function (xhr) {
                hideSpinner();
                if (xhr.status !== 404) {
                    toastr.error('Failed to fetch existing user data');
                }
            }
        });
    });

    $("#submit_change_request_btn").click(function () {
        $(".email-validation").text("");
        $(".phone-number-validation").text("");

        const form = document.getElementById('changeRequestForm');
        
        // Create JSON object instead of FormData
        const requestData = {
            userId: userIdGlobal,  // Make sure this global variable is available
            Email: form.elements['new_email'].value,
            PhoneNumber: form.elements['phone_number'].value
        };

        $.ajax({
            url: `${host}/api/ApplicationUserChangeRequest`,
            type: 'POST',
            data: JSON.stringify(requestData),  // Convert to JSON string
            contentType: 'application/json',    // Set content type to JSON
            headers: {
                'Authorization': `Bearer ${tokenValue}`
            },
            success: function (response) {
                toastr.success('Change request sent successfully');
                $('#changeRequestModal').modal('hide');
                form.reset();
            },
            error: function (xhr) {
                if (xhr.status === 400) {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        $.each(errorResponse, function (key, value) {
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
                        toastr.error('Failed to send change request');
                    }
                } else {
                    toastr.error('Failed to send change request');
                }
            }
        });
    });
});

// Add this function
function removeBanner() {
    Swal.fire({
        title: 'Remove Banner?',
        text: 'Are you sure you want to remove the banner image?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${host}/api/Users/signature/banner`,
                type: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenValue}`
                },
                success: function (response) {
                    Swal.fire(
                        'Removed!',
                        'Banner has been removed successfully.',
                        'success'
                    );
                    $('#signatureModal').modal('hide');
                    setTimeout(() => $('#signatureModal').modal('show'), 500);
                },
                error: function () {
                    Swal.fire(
                        'Error!',
                        'Failed to remove banner.',
                        'error'
                    );
                }
            });
        }
    });
}



