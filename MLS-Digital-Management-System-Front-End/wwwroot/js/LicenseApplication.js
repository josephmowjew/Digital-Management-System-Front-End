$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createApplicationButton = $("#create_application_modal button[name='create_application_btn']").unbind().click(OnCreateClick);


    function OnCreateClick() {

        showSpinner();
       
        
       
    // Get the form itself
    var form = $("#create_application_modal form")[0];

    //Clear any existing error messages
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(function(errorMessage) {
      errorMessage.remove();
    });

      if (!form.checkValidity()) {
      
        //hide spinner
        hideSpinner();
        //If the form is not valid, display error messages for invalid fields
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(function(field) {
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = field.validationMessage;
        errorMessage.classList.add('error-message'); // Add a class to the error message
        errorMessage.style.color = 'red';
        field.after(errorMessage);

        // Set focus and cursor to the last error message
        const lastErrorMessage = form.querySelectorAll('.error-message')[form.querySelectorAll('.error-message').length - 1];
        lastErrorMessage.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(lastErrorMessage);
        selection.removeAllRanges();
        selection.addRange(range);
        });

      }
      else{
    
            // Create a new FormData object
            var formData = new FormData();

            // Append the form field values and make sure there are not duplicates
            //Make sure there are no duplicates being added
            var seen = {};
            $(form).find('input, select, textarea').each(function(index, element) {
              var field = $(element);
              var fieldName = field.attr('name');
              
              // Check if it's a file input
              if (field.attr('type') === 'file') {
                  var files = field.prop('files');
                  if (files.length > 0) {
                      for (var i = 0; i < files.length; i++) {
                          formData.append(fieldName, files[i]);
                      }
                  }
              } else {
                  var fieldValue = field.val();
                  if (!seen[fieldName]) {
                      formData.append(fieldName, fieldValue);
                      seen[fieldName] = true;
                  }
              }
          });
           
    
            // // Append the file attachments
            // var attachments = $("#create_application_modal input[name='Attachments']")[0].files;
            // for (var i = 0; i < attachments.length; i++) {
            //     formData.append("Attachments", attachments[i]);
            // }
    
            //send the request
    
            $.ajax({
                url:  "http://localhost:5043/api/LicenseApplications",
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
    
                        toastr.success("New license addded successfully")
    
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


    }


})// Wait for the DOM to load
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Get all file attachment fields
  const attachmentFields = document.querySelectorAll('div input[type="file"]');

  // Hide all file attachment fields and their labels by default
  attachmentFields.forEach(function(field) {
      field.style.display = 'none';
      field.required = false;
      const label = field.previousElementSibling;
      if (label) {
          label.style.display = 'none';
      }
  });

  // Get all explanation fields
  const explanationFields = document.querySelectorAll('input[type="text"], textarea');

  // Show all explanation fields and their labels by default
  explanationFields.forEach(function(field) {
      field.style.display = 'block';
      field.required = true;
      const label = field.previousElementSibling;
      if (label) {
          label.style.display = 'inline-block';
      }
  });

  // Get all checkbox elements
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Add event listeners to checkboxes
  checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', toggleAttachmentField);
  });

  // Function to toggle attachment field visibility
  function toggleAttachmentField() {
      const attachmentFieldName = this.name + 'Attachment';
      const attachmentField = document.querySelector(`input[name="${attachmentFieldName}"]`);
      const attachmentFieldLabel = attachmentField.previousElementSibling;
      const explanationFieldContainer = this.closest('.form-check').nextElementSibling;

      let explanationField = null;
      let explanationFieldLabel = null;

      if (explanationFieldContainer) {
          explanationField = explanationFieldContainer.querySelector('input[type="text"], textarea');
          if (explanationField) {
              explanationFieldLabel = explanationField.previousElementSibling;
          }
      }

      if (this.checked) {
          attachmentField.style.display = 'block';
          attachmentField.required = true;
          attachmentFieldLabel.style.display = 'inline-block';
          if (explanationField) {
              explanationField.style.display = 'none';
              explanationField.required = false;
              explanationFieldLabel.style.display = 'none';
              explanationField.value = ''; // Clear the explanation field value
          }
      } else {
          attachmentField.style.display = 'none';
          attachmentField.required = false;
          attachmentFieldLabel.style.display = 'none';
          attachmentField.value = ''; // Clear the attachment field value
          if (explanationField) {
              explanationField.style.display = 'block';
              explanationField.required = true;
              if (explanationFieldLabel) {
                  explanationFieldLabel.style.display = 'inline-block';
              }
          }
      }
  }
});
function EditForm(id,token, area = "") {

   
    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: "http://localhost:5043/api/licenseapplication/getapplication/"+ id,
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
                url: 'http://localhost:5043/api/licenseapplication/' + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("application has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function Activate(id,token) {

    bootbox.confirm("Are you sure you want to accept this application?", function (result) {

        
        if (result) {

            showSpinner()
            $.ajax({
                url: 'http://localhost:5043/api/licenseapplication/accept/'+id,
                type: 'GET',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

               
                toastr.success("application has been accepted sucessfully")
              
                datatable.ajax.reload();

                hideSpinner();


            }).fail(function (response) {

                hideSpinner();

                toastr.error("failed to accept application")

                datatable.ajax.reload();
            });
        }


    });
}
function DenyForm(id,token) { 
    
    
    //get the input field inside the edit role modal form

    $("#deny_license_application_modal input[name ='LicenseApplicationId']").val(id)

    //hook up an event to the update role button

    $("#deny_license_application_modal button[name='deny_license_application_btn']").unbind().click(function () { DenyApplication() })


    
    $("#deny_license_application_modal").modal("show");
  }

  function DenyApplication() {

    showSpinner();

    toastr.clear()

    //send the request



    var form = $("#deny_license_application_modal form")[0];

    // Create a new FormData object
    var formData = new FormData();
  
          // Append the form field values
          $(form).find('input, select, textarea').each(function(index, element) {
              var field = $(element);
              var fieldName = field.attr('name');
              var fieldValue = field.val();
              formData.append(fieldName, fieldValue);
          });
  
  
          //send the request
  
          $.ajax({
              url:  "http://localhost:5043/api/licenseapplication/denyApplication",
              type: 'POST',
              data: formData, // Convert formData object to JSON string
              processData: false, // Set processData to false to prevent automatic serialization
              contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
              headers: {
                  'Authorization': "Bearer "+ tokenValue
              },
              success: function (data) {

  
                  hideSpinner();
  
                 
                      //show success message to the user
                      var dataTable = $('#my_table').DataTable();
  
                      toastr.success("Application has been denied")
  
                      $("#deny_license_application_modal").modal("hide")
  
                      dataTable.ajax.reload();
  
                  
  
  
              },
              error: function (xhr, ajaxOtions, thrownError) {
                  hideSpinner();
                  var errorResponse = JSON.parse(xhr.responseText);
                  $.each(errorResponse, function (key, value) {
                      $.each(value, function (index, message) {
                         
                          const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                          const element = $("#deny_probono_application_modal").find("form :input[name='" + (elementName || '') + "']");
                          
                          if (element && element.length) {
                            element.siblings("span.text-danger").text(message);
                          }
       
                      });
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
        url: "http://localhost:5043/api/licenseapplication/"+id,
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



