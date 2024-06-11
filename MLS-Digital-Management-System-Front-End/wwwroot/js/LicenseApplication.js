setupFormBehavior();

$(function () {

    hideSpinner();
    //hook up a click event to the login button

   $("#create_application_modal button[name='create_application_btn']").unbind().click(onCreateClick);
   $("#create_application_modal button[name='save_application_btn']").unbind().click(onSaveDraft);


    function onCreateClick() {

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
        // If the form is not valid, display error messages for invalid fields
        const invalidFields = document.querySelectorAll(':invalid');

        invalidFields.forEach(function(field) {
        const validationMessage = field.validationMessage;
        
        if (validationMessage) { // Check if the validation message is not empty
            const errorMessage = document.createElement('div');
            errorMessage.innerHTML = validationMessage;
            errorMessage.classList.add('error-message'); // Add a class to the error message
            errorMessage.style.color = 'red';
            field.after(errorMessage);

            // Scroll the invalid field into view
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Focus on the invalid field
            field.focus();

            // Switch to the tab where the error occurs
            const tab = field.closest('.tab-pane'); // Get the tab pane element
            if (tab) {
            const tabId = tab.id; // Get the tab ID
            const tabButton = document.querySelector(`[data-bs-target="#${tabId}"]`); // Get the tab button
            tabButton.click(); // Switch to the tab
            }
        }
        });

      }
      else{

    
            // Create a new FormData object
            var formData = new FormData();

            // Append the form field values and make sure there are not duplicates
            //Make sure there are no duplicates being added
            var seen = {};
            $(form).find('input, select, textarea, checkbox').each(function(index, element) {
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
                } else if (field.attr('type') === 'checkbox') {
                    if (field.prop('checked')) {
                        formData.append(fieldName, 'true');
                    } else {
                        formData.append(fieldName, 'false');
                    }
                } else {
                    var fieldValue = field.val();
                    if (!seen[fieldName]) {
                        formData.append(fieldName, fieldValue);
                        seen[fieldName] = true;
                    }
                }
            });


        //add actionType form data field
        formData.append("actionType", "Submit");
          

           
            //send the request
    
            $.ajax({
                url:  "http://18.217.103.30/api/LicenseApplications",
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


})

function editForm(id,token, area = "") {

   
    //get the record from the database
    showSpinner();
    

    //automatically fetch previous data if the id is greater than 0
    if(id > 0){

        //fetch previous data

        $.ajax({
            url: "http://18.217.103.30/api/LicenseApplications/"+ id,
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
        $("#create_application_modal form").find('input, select, textarea, checkbox').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            
            if (field.is(':checkbox')) {
                field.prop('checked', fieldValue === true || fieldValue === 'true'); // Set checkbox value
                var event = new Event('change');
                field[0].dispatchEvent(event); // Trigger the change event
            } else if (field.is(':file')) {
                
                const attachment = data.attachments.find(attachment => attachment.propertyName === fieldName);
                if (attachment && attachment !== null && attachment !== undefined) {
                    const fileURL = attachment.filePath;
                    fetch(fileURL,{headers: {
                        'Accept': 'application/octet-stream',
                        'Access-Control-Request-Method': 'GET',
                        'Origin': 'http://localhost:5281'
                      }})
                        .then(response => response.blob())
                        .then(blob => { 
                            const file = new File([blob], attachment.fileName, attachment.fileType);
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);
                            const inputElement = field[0]; // Get the underlying input element
                            inputElement.files = dataTransfer.files;
                            const event = new Event('change', { bubbles: true });
                            inputElement.dispatchEvent(event); // Trigger change event
        
                        });
                }
             } else {
                field.val(fieldValue); // Set field value
            }
        });

               // Reset validation
            var validator = $("#create_application_modal form").validate();
            validator.resetForm();

            // Show modal
            $("#create_application_modal").modal("show");


        }).fail(function (xhr, status, error) {
            hideSpinner();
            console.log(error);
        });
       
    }
   
}

function dataURItoBlob(dataURI) {
    const binaryString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([uint8Array], { type: dataURI.split(',')[0].split(':')[1] });
  }
function Delete(id,token) {

    bootbox.confirm("Are you sure you want to delete this application from the system?", function (result) {


        if (result) {
            $.ajax({
                url: 'http://18.217.103.30/api/licenseapplication/' + id,
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

function onSaveDraft() {

    showSpinner();

     // Get the form itself
    var form = $("#create_application_modal form")[0];
    // Create a new FormData object
    var formData = new FormData();

    // Append the form field values and make sure there are not duplicates
    //Make sure there are no duplicates being added
    var seen = {};
    $(form).find('input, select, textarea, checkbox').each(function(index, element) {
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
        } else if (field.attr('type') === 'checkbox') {
            if (field.prop('checked')) {
                formData.append(fieldName, 'true');
            } else {
                formData.append(fieldName, 'false');
            }
        } else {
            var fieldValue = field.val();
            if (!seen[fieldName]) {
                formData.append(fieldName, fieldValue);
                seen[fieldName] = true;
            }
        }
    });


    //add actionType form data field
    formData.append("actionType", "Draft");
    
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

                toastr.success("Application saved successfully")

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

function setupFormBehavior() {
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
  }


