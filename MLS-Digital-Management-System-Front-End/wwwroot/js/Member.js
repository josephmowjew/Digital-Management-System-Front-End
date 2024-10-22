$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createFirmButton = $("#create_member_modal button[name='create_member_btn']").unbind().click(OnMemberCreateClick);

    //add event listener to the edit button

    var editFirmButton = $("#edit_member_btn").unbind().click(EditMemberForm);







    function OnMemberCreateClick() {

        showSpinner();

        //get the form itself 
        var form = $("#create_member_modal form");


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
            url: `${host}/api/members`,
            type: 'POST',
            data: JSON.stringify(formData), // Convert formData object to JSON string
            contentType: 'application/json', // Set content type to JSON
            headers: {
                'Authorization': "Bearer " + tokenValue
            },
            success: function (data) {

                //set the Id of the edit form
                $("#edit_member_modal input[name='Id']").val(data.id)
                //parse whatever comes back to html


                //show success message to the firm
                var dataTable = $('#my_table').DataTable();

                toastr.success("member record added successfully")

                $("#create_member_modal").modal("hide")

                hideSpinner();


                //envoke current page refresh after 3 seconds
                setTimeout(function () {

                    location.reload();

                }, 2000);

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


})


function EditMemberForm(id) {
    // Use the id from the parameter if provided, otherwise get it from the form field
    id = id || $("#edit_member_modal input[name='Id']").val();

    // Show spinner while fetching the data
    showSpinner();

    // Get the record from the database
    $.ajax({
        url: `${host}/api/members/get/` + id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer " + tokenValue
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
        $("#edit_member_modal form").find('input, select').each(function (index, element) {
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
                    }, "edit_member_modal");
                } else {
                    new EnhancedSelect({
                        url: `${host}/api/Customers`,
                        hiddenFieldId: "CustomerId",
                        pageSize: 20,
                        initialSearchValue: "",
                    }, "edit_member_modal");
                }


            } else {
                // For other fields, set the value as usual
                field.val(data[dataKey]);
            }
        });

        // Hook up event to the update member button
        $("#edit_member_modal button[name='update_member_btn']").unbind().click(function () {
            UpdateMember();
        });

        // Reset validation
        var validator = $("#edit_member_modal form").validate();
        validator.resetForm();

        // Show modal
        $("#edit_member_modal").modal("show");
    });
}



function UpdateMember() {
    toastr.clear()

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_member_modal input[name='__RequestVerificationToken']").val();

    //get the form itself 
    var form = $("#edit_member_modal form");


    var formData = {};

    // Iterate over the form's elements and build the formData object dynamically
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData[fieldName] = fieldValue;
    });

    let id = $("#edit_member_modal input[name='Id']").val()

    // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);



    //send the request

    $.ajax({
        url: `${host}/api/members/` + id,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer " + tokenValue
        },
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)



            //check if there is an error in the data that is coming back from the firm

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"




            //show success message to the firm
            var dataTable = $('#my_table').DataTable();

            toastr.success("Member data updated successfully")

            $("#edit_member_modal").modal("hide")

            //envoke current page refresh after 3 seconds
            setTimeout(function () {

                location.reload();

            }, 2000);







        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                    //console.log("joseph")

                    const elementName = key.charAt(0).toUpperCase() + key.slice(1); // Replace with the desired element name
                    const element = $("#edit_member_modal").find("form :input[name='" + elementName + "']");
                    console.log(element)
                    element.siblings("span.text-danger").text(message);
                    //$("#edit_member_modal input[name='" + key+']').siblings("span.text-danger").text(message);
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



