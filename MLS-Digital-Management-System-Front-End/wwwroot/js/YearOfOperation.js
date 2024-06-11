$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createyearOfOperationButton = $("#create_yearOfOperation_modal button[name='create_yearOfOperation_btn']").unbind().click(OnCreateClick);

    function OnCreateClick() {

        showSpinner();
       
        //get the form itself 
        var form = $("#create_yearOfOperation_modal form");

        
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
            url:  `${host}/api/YearOfOperations`,
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

               
                    //show success message to the yearOfOperation
                    var dataTable = $('#my_table').DataTable();

                    toastr.success("New Year of Operation added successfully")

                    $("#create_yearOfOperation_modal").modal("hide")

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


})


function EditForm(id,token, area = "") {

    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: `${host}/api/yearOfOperations/getyearofoperation/`+ id,
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
        $("#edit_yearOfOperation_modal form").find('input, select').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });

    // Hook up event to the update yearOfOperation button
    $("#edit_yearOfOperation_modal button[name='update_yearOfOperation_btn']").unbind().click(function () { updateYearOfOperation(token) });

    // Reset validation
    var validator = $("#edit_yearOfOperation_modal form").validate();
    validator.resetForm();

    // Show modal
    $("#edit_yearOfOperation_modal").modal("show");

    })
}
function Delete(id,token) {

    bootbox.confirm("Are you sure you want to delete this year of operation from the system?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/yearOfOperations/` + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("Year of operation has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}


function updateYearOfOperation(token) {
    toastr.clear()

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_yearOfOperation_modal input[name='__RequestVerificationToken']").val();

     //get the form itself 
     var form = $("#edit_yearOfOperation_modal form");

        
     var formData = {};

     // Iterate over the form's elements and build the formData object dynamically
     $(form).find('input, select, textarea').each(function(index, element) {
         var field = $(element);
         var fieldName = field.attr('name');
         var fieldValue = field.val();
         formData[fieldName] = fieldValue;
     });

     let id = $("#edit_yearOfOperation_modal input[name='Id']").val()

     // Convert formData object to an array of key-value pairs
    const formDataEntries = Object.entries(formData);

    // Convert the array of key-value pairs back to an object
    const formDataObject = Object.fromEntries(formDataEntries);

    // Stringify the formDataObject
    const formDataJson = JSON.stringify(formDataObject);


   
    //send the request

    $.ajax({
        url: `${host}/api/yearOfOperations/`+id,
        type: 'PUT',
        data: formDataJson,
        contentType: 'application/json',
        headers: {
            'Authorization': "Bearer "+ token
        },
        success: function (data) {


            //parse whatever comes back to html

            var parsedData = $.parseHTML(data)



            //check if there is an error in the data that is coming back from the yearOfOperation

            var isInvalid = $(parsedData).find("input[name='DataInvalid']").val() == "true"


           

                //show success message to the yearOfOperation
                var dataTable = $('#my_table').DataTable();

                toastr.success("Year of operation updated successfully")

                $("#edit_yearOfOperation_modal").modal("hide")

                dataTable.ajax.reload();

            



        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                   
                    const elementName = key.charAt(0).toUpperCase() + key.slice(1); // Replace with the desired element name
                    const element = $("#edit_yearOfOperation_modal").find("form :input[name='" + elementName + "']");
                   console.log(element)
                   element.siblings("span.text-danger").text(message);
                   
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



