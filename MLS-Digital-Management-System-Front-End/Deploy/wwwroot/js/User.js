$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createUserButton = $("#create_user_modal button[name='create_user_btn']").unbind().click(OnCreateClick);

    var edit_passwordButton = $("#edit_password_btn").unbind().click(EditPasswordModalPopUp);

    var update_passwordButton = $("#update_password_btn").unbind().click(UpdatePassword);

    function OnCreateClick() {

        showSpinner();

        //get the form itself 
        var form = $("#create_user_modal form");


        var formData = {};

        // Iterate over the form's elements and build the formData object dynamically
        $(form).find('input, select, textarea').each(function (index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var fieldValue = field.val();
            formData[fieldName] = fieldValue;
        });

        //send the request

        $.ajax({
            url: `${host}/api/auth/register`,
            type: 'POST',
            data: JSON.stringify(formData), // Convert formData object to JSON string
            contentType: 'application/json', // Set content type to JSON
            headers: {
                'Authorization': "Bearer " + tokenValue
            },
            success: function (data) {

                //parse whatever comes back to html

                var parsedData = $.parseHTML(data)

                hideSpinner();


                //show success message to the user
                var dataTable = $('#my_table').DataTable();

                toastr.success("New User addded successfully")

                $("#create_user_modal").modal("hide")

                dataTable.ajax.reload();




            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {

                        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                        const element = $("#create_user_modal").find("form :input[name='" + (elementName || '') + "']");

                        if (element && element.length) {
                            element.siblings("span.text-danger").text(message);
                        }

                    });
                });
            }

        });
    }
})


function UpdatePassword() {

    var userId = $("#edit_user_modal input[name='Id']").val()
    //var id = $("#edit_password_modal input[name='Id']").val();
    var newPassword = $("#edit_password_modal input[name='NewPassword']").val();
    var authenticationToken = $("#edit_password_modal input[name='__RequestVerificationToken']").val();
    var form_url = $("#edit_password_modal form").attr("action");

    var userInput = {
        __RequestVerificationToken: authenticationToken,
        Id: userId,
        NewPassword: newPassword
    }

    $.ajax({
        url: form_url,
        type: 'POST',
        data: userInput,
        headers: {
            'Authorization': "Bearer " + tokenValue
        },
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)


            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"


            if (isInvalid == true) {

                //replace the form data with the data retrieved from the server
                $("#edit_password_modal").html(data)


                //rewire the onclick event on the form

                $("#edit_password_modal button[name='update_password_btn']").unbind().click(function () { UpdatePassword() });

                var form = $("#edit_password_modal")

                $(form).removeData("validator")
                $(form).removeData("unobtrusiveValidation")
                $.validator.unobtrusive.parse(form)


            }
            else {


                //show success message to the user
                //var dataTable = $('#my_table').DataTable();

                toastr.success(data.message)

                $("#edit_password_modal").modal("hide")

                //dataTable.ajax.reload();

            }



        },
        error: function (xhr, ajaxOtions, thrownError) {

            console.error(thrownError + "r\n" + xhr.statusText + "r\n" + xhr.responseText)
        }

    });


}


function EditPasswordModalPopUp() {

    $("#edit_password_modal input[name='Id']").val($("#edit_user_modal input[name='Id']").val())

    $("#edit_password_modal").modal("show");
}

function EditForm(id, token, area = "") {

    //get the record from the database
    showSpinner();

    $.ajax({
        url: `${host}/api/users/` + id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer " + token
        }

    }).done(function (data) {

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
        $("#edit_user_modal form").find('input, select').each(function (index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });
        // Set additional fields like DateOfBirth
        var currentDate = new Date(data.dateOfBirth);
        var day = ("0" + currentDate.getDate()).slice(-2);
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        var date = currentDate.getFullYear() + "-" + (month) + "-" + (day);
        $("#edit_user_modal input[name ='DateOfBirth']").val(date);

        // Hook up event to the update user button
        $("#edit_user_modal button[name='update_user_btn']").unbind().click(function () { upDateUser(token) });

        // Reset validation
        var validator = $("#edit_user_modal form").validate();
        validator.resetForm();

        // Show modal
        $("#edit_user_modal").modal("show");

    })
}

function Delete(id, token) {

    bootbox.confirm("Are you sure you want to delete this user from the system?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/users/` + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("User has been deleted sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function ConfirmUser(id) {

    bootbox.confirm("Are you sure you want to confirm this user from the system?", function (result) {


        if (result) {
            $.ajax({
                url: 'users/ConfirmUser/' + id,
                type: 'POST',

            }).done(function (data) {

                if (data.status == "success") {

                    toastr.success(data.message)
                }
                else {
                    toastr.error(data.message)
                }




                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function Reactivate(id, token) {

    bootbox.confirm("Are you sure you want to reactivate this user account?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: `${host}/api/Users/activate/` + id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("User has been activated sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to activate user")

                datatable.ajax.reload();
            });
        }


    });
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

            var parsedData = $.parseHTML(data)

            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"

            //show success message to the user
            var dataTable = $('#my_table').DataTable();

            toastr.success("User updated successfully")

            $("#edit_user_modal").modal("hide")

            dataTable.ajax.reload();
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


function EditMemberForm(id, tokenValue) {

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
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
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

         // Hook up event to the update member button
         $("#edit_user_modal button[name='update_user_btn']").unbind().click(function () {
            updateMember(tokenValue);
        });

        // Show modal
        $("#edit_user_modal").modal("show");
    })
}

function updateMember(token) {
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


function uploadExcelFile(file, host, tokenValue) {
    var formData = new FormData();
    formData.append('uploadedFile', file);  // Change 'file' to 'uploadedFile'

    return $.ajax({
        url: host + '/api/Members/bulk-register',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + tokenValue
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    $('.progress-bar').width(percentComplete * 100 + '%');
                    $('.progress-bar').text(Math.round(percentComplete * 100) + '%');

                    if (percentComplete === 1) {
                        $('.progress').hide();
                        $('#processingMessage').text('File uploaded. Waiting for server response...');
                        $('#processingMessage').show();
                    }
                }
            }, false);
            return xhr;
        }
    });
}

function validateExcelFile(file) {
    var validExtensions = ['xlsx', 'xls'];
    var fileName = file.name;
    var fileExtension = fileName.split('.').pop().toLowerCase();
    return validExtensions.indexOf(fileExtension) > -1;
}



