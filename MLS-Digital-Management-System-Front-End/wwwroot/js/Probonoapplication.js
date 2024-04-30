$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createApplicationButton = $("#create_application_modal button[name='create_application_btn']").unbind().click(OnCreateClick);


    function OnCreateClick() {

        showSpinner();
       
        
       
  // Get the form itself
  var form = $("#create_application_modal form")[0];

  // Create a new FormData object
  var formData = new FormData();

        // Append the form field values
        $(form).find('input, select, textarea').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var fieldValue = field.val();
            formData.append(fieldName, fieldValue);
        });

        // Append the file attachments
        var attachments = $("#create_application_modal input[name='Attachments']")[0].files;
        for (var i = 0; i < attachments.length; i++) {
            formData.append("Attachments", attachments[i]);
        }

        //send the request

        $.ajax({
            url:  "http://localhost:5043/api/probonoapplications",
            type: 'POST',
            data: formData, // Convert formData object to JSON string
            processData: false, // Set processData to false to prevent automatic serialization
            contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
            headers: {
                'Authorization': "Bearer "+ tokenValue
            },
            success: function (data) {

                //parse whatever comes back to html

                //var parsedData = $.parseHTML(data)

                hideSpinner();

               
                    //show success message to the user
                    var dataTable = $('#my_table').DataTable();

                    toastr.success("New pro bono case addded successfully")

                    $("#create_application_modal").modal("hide")

                    dataTable.ajax.reload();

                


            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                       
                        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                        const element = $("#create_application_modal").find("form :input[name='" + (elementName || '') + "']");
                        
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
        url: "http://localhost:5043/api/probonoapplications/getprobonoapplication/"+ id,
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
        $("#edit_application_modal form").find('input, select, textarea').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });


   

    // Hook up event to the update user button
    $("#edit_application_modal button[name='update_application_btn']").unbind().click(function () { updateApplication(token) });

    // Reset validation
    var validator = $("#edit_application_modal form").validate();
    validator.resetForm();

    // Show modal
    $("#edit_application_modal").modal("show");

    })
}
function Delete(id,token) {

    bootbox.confirm("Are you sure you want to delete this application from the system?", function (result) {


        if (result) {
            $.ajax({
                url: 'http://localhost:5043/api/probonoapplications/' + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("Pro bono application has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function Activate(id,token) {

    bootbox.confirm("Are you sure you want to activate this application account?", function (result) {

        console.log(token)
        if (result) {
            $.ajax({
                url: 'http://localhost:5043/api/probonoapplications/activate/'+id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

               
                    toastr.success("application has been activated sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error("failed to activate user")

                datatable.ajax.reload();
            });
        }


    });
}
function updateApplication(token) {
    toastr.clear()

    //get the authorisation token
    //updateApplication
    var authenticationToken = $("#edit_application_modal input[name='__RequestVerificationToken']").val();

     //get the form itself 
     var form = $("#edit_application_modal form");

        
     var formData = {};

     // Iterate over the form's elements and build the formData object dynamically
     $(form).find('input, select, textarea').each(function(index, element) {
         var field = $(element);
         var fieldName = field.attr('name');
         var fieldValue = field.val();
         formData[fieldName] = fieldValue;
     });

     let id = $("#edit_application_modal input[name='Id']").val()

     // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);


   
    //send the request

    $.ajax({
        url: "http://localhost:5043/api/probonoapplications/"+id,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer "+ token
        },
        success: function (data) {




           

                //show success message to the user
                var dataTable = $('#my_table').DataTable();

                toastr.success("Pro bono application updated successfully")

                $("#edit_application_modal").modal("hide")

                dataTable.ajax.reload();

            



        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                   
                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#edit_application_modal").find("form :input[name='" + (elementName || '') + "']");
                    
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



