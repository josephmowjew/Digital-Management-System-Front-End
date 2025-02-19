$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createUserButton = $("#create_client_modal button[name='create_client_btn']").unbind().click(OnCreateClick);



    function OnCreateClick() {

        showSpinner();
       
        //get the form itself 
        var form = $("#create_client_modal form");

        
        var formData = {};

        // Iterate over the form's elements and build the formData object dynamically
        $(form).find('input, select, textarea').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var fieldValue = field.val();
            formData[fieldName] = fieldValue;
        });
        
        //send the request

        $.ajax({
            url:  `${host}/api/probonoclients`,
            type: 'POST',
            data: JSON.stringify(formData), // Convert formData object to JSON string
            contentType: 'application/json', // Set content type to JSON
            headers: {
                'Authorization': "Bearer "+ tokenValue
            },
            success: function (data) {

                //parse whatever comes back to html

                var parsedData = $.parseHTML(data)

                hideSpinner();

               
                    //show success message to the user
                    var dataTable = $('#my_table').DataTable();

                    toastr.success("New client addded successfully")

                    $("#create_client_modal").modal("hide")

                    dataTable.ajax.reload();

                


            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                       
                        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                        const element = $("#create_client_modal").find("form :input[name='" + (elementName || '') + "']");
                        
                        if (element && element.length) {
                          element.siblings("span.text-danger").text(message);
                        }
     
                    });
                });
            }

        });
    }


})


function EditForm(id,token, area = "") {

    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: `${host}/api/probonoclients/getclient/`+ id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer "+ token
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
        $("#edit_client_modal form").find('input, select').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });
   

    // Hook up event to the update user button
    $("#edit_client_modal button[name='update_client_btn']").unbind().click(function () { updateClient(token) });

    // Reset validation
    var validator = $("#edit_client_modal form").validate();
    validator.resetForm();

    // Show modal
    $("#edit_client_modal").modal("show");

    })
}
function Delete(id,token) {

    bootbox.confirm("Are you sure you want to delete/suspend this client from the system?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/probonoclients/` + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("Client has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("Failed to delete client")

                datatable.ajax.reload();
            });
        }


    });
}
function DeleteRequest(id,token) {

    bootbox.confirm("Are you sure you want to request deletion/Suspension of this client?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/probonoclients/deleteRequest/` + id,
                type: 'PUT',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("Request has been sent sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("Failed to send request")

                datatable.ajax.reload();
            });
        }


    });
}
function Activate(id,token) {

    bootbox.confirm("Are you sure you want to activate this client account?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: `${host}/api/probonoclients/activate/`+id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

               
                    toastr.success("client has been activated sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to activate user")

                datatable.ajax.reload();
            });
        }


    });
}

function DenyDeleteRequest(id,token) {

    bootbox.confirm("Are you sure you want to deny deletion of this client account?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: `${host}/api/probonoclients/denyDeletion/`+id,
                type: 'PUT',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

               
                    toastr.success("Deletion has been denied")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to deny the deletion")

                datatable.ajax.reload();
            });
        }


    });
}

function updateClient(token) {
    toastr.clear()

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_client_modal input[name='__RequestVerificationToken']").val();

     //get the form itself 
     var form = $("#edit_client_modal form");

        
     var formData = {};

     // Iterate over the form's elements and build the formData object dynamically
     $(form).find('input, select, textarea').each(function(index, element) {
         var field = $(element);
         var fieldName = field.attr('name');
         var fieldValue = field.val();
         formData[fieldName] = fieldValue;
     });

     let id = $("#edit_client_modal input[name='Id']").val()

     // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);


   
    //send the request

    $.ajax({
        url: `${host}/api/probonoclients/`+id,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer "+ token
        },
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)



            //check if there is an error in the data that is coming back from the user

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"


           

                //show success message to the user
                var dataTable = $('#my_table').DataTable();

                toastr.success("Client has been updated successfully")

                $("#edit_client_modal").modal("hide")

                dataTable.ajax.reload();

            



        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                   
                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#edit_client_modal").find("form :input[name='" + (elementName || '') + "']");
                    
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
    if(spinnerElement){
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



