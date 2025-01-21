$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createFirmButton = $("#create_firm_modal button[name='create_firm_btn']").unbind().click(OnCreateClick);

    function OnCreateClick() {

        showSpinner();

        //get the form itself 
        var form = $("#create_firm_modal form");

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
            url: `${host}/api/InstitutionTypes`,
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

                //show success message to the firm
                var dataTable = $('#my_table').DataTable();

                toastr.success("New Institution Type added successfully")

                $("#create_firm_modal").modal("hide")

                dataTable.ajax.reload();
            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                        $("#" + key).siblings("span.text-danger").text(message);
                    });
                });
            }

        });
    }

    var declareLevyButton = $("#create_levy_Declaration_modal button[name='declare_levy_btn']").unbind().click(OnDeclareLevyClick);

    function OnDeclareLevyClick() {
        showSpinner();

        var form = $("#create_levy_Declaration_modal form")[0];
        var formData = new FormData(form);

        // Add FirmId to formData
        formData.append('FirmId', firmIdForLevy);

        // Create the levyDeclarationDTO object
        /*var levyDeclarationDTO = {
            Revenue: formData.get('Revenue'),
            Month: formData.get('Month'),
            FirmId: firmId
        };*/

        // Append the levyDeclarationDTO as a JSON string
        //formData.append('levyDeclarationDTO', JSON.stringify(levyDeclarationDTO));

        $.ajax({
            url: `${host}/api/LevyDeclaration`,
            type: 'POST',
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            headers: {
                'Authorization': "Bearer " + tokenValue
            },
            success: function (data) {
                hideSpinner();
                var dataTable = $('#levy_table').DataTable();
                toastr.success("Levy declared successfully");
                $("#create_levy_Declaration_modal").modal("hide");
                dataTable.ajax.reload();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    if (Array.isArray(value)) {
                        value.forEach(function (message) {
                            toastr.error(message);
                        });
                    } else {
                        toastr.error(value);
                    }
                });
            }
        });

    }


})


function EditForm(id, token, area = "") {

    //console.log(host)
    //get the record from the database
    showSpinner();

    $.ajax({
        url: `${host}/api/InstitutionTypes/${id}`,
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
        $("#edit_firm_modal form").find('input, select').each(function (index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            if (fieldName === 'CustomerId') {

                // If the field is Customer Id, set the value and trigger EnhancedSelect with the retrieved Customer ID
                field.val(data[dataKey]);
                if (data.customer != null) {
                    new EnhancedSelect({
                        url: `${host}/api/Customers`,
                        hiddenFieldId: "CustomerId",
                        pageSize: 20,
                        initialSearchValue: data.customer.id,
                    }, "edit_firm_modal");
                }
                else {
                    new EnhancedSelect({
                        url: `${host}/api/Customers`,
                        hiddenFieldId: "CustomerId",
                        pageSize: 20,
                        initialSearchValue: "",
                    }, "edit_firm_modal");
                }
            } else {
                // For other fields, set the value as usual
                field.val(data[dataKey]);
            }

        });

        // Hook up event to the update firm button
        $("#edit_firm_modal button[name='update_firm_btn']").unbind().click(function () { upDateFirm(token) });

        // Reset validation
        var validator = $("#edit_firm_modal form").validate();
        validator.resetForm();

        // Show modal
        $("#edit_firm_modal").modal("show");

    })
}
function Delete(id, token) {

    bootbox.confirm("Are you sure you want to delete this institution type from the system?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/InstitutionTypes/${id}`,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + token
                }

            }).done(function (data) {


                toastr.success("Institution Type has been deleted sucessfully")

                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function upDateFirm(token) {
    toastr.clear()

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_firm_modal input[name='__RequestVerificationToken']").val();

    //get the form itself 
    var form = $("#edit_firm_modal form");


    var formData = {};

    // Iterate over the form's elements and build the formData object dynamically
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData[fieldName] = fieldValue;
    });

    let id = $("#edit_firm_modal input[name='Id']").val()

    // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);



    //send the request

    $.ajax({
        url: `${host}/api/InstitutionTypes/${id}`,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function (data) {

            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)

            //check if there is an error in the data that is coming back from the firm

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"
            //show success message to the firm
            var dataTable = $('#my_table').DataTable();

            toastr.success("Institution Type updated successfully")

            $("#edit_firm_modal").modal("hide")

            dataTable.ajax.reload();
        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                    //console.log("joseph")

                    const elementName = key.charAt(0).toUpperCase() + key.slice(1); // Replace with the desired element name
                    const element = $("#edit_firm_modal").find("form :input[name='" + elementName + "']");
                    console.log(element)
                    element.siblings("span.text-danger").text(message);
                    //$("#edit_firm_modal input[name='" + key+']').siblings("span.text-danger").text(message);
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



