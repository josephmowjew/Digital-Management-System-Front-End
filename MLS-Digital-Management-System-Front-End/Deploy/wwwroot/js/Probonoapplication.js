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
            url:  `${host}/api/probonoapplications`,
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
                dataTable.ajax.reload()
                form.reset()
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
        url: `${host}/api/probonoapplications/getprobonoapplication/`+ id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer "+ token
        }

    }).done(function (data) {
        
        hideSpinner();

        const editform = document.querySelector("#edit_application_modal form");
        //const data = JSON.parse(response);
        const fieldMap = createFieldMap(data);
        const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')];

        editformElements.forEach(element => {
            const fieldName = element.getAttribute('name');
            const dataKey = fieldMap[fieldName];
            let fieldValue = data[dataKey];

            if (element.type === 'checkbox') {
                this.setCheckboxValue(element, fieldValue);
            } else if (element.type === 'file') {
                //console.log("I'm here")
                handleFileUpload(element, data.attachments, fieldName);
            }
            else {
                element.value = fieldValue;
            }
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
                url: `${host}/api/probonoapplications/` + id,
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

    bootbox.confirm("Are you sure you want to accept this application?", function (result) {

        
        if (result) {

            showSpinner()
            $.ajax({
                url: `${host}/api/probonoapplications/activate/`+id,
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

    $("#deny_probono_application_modal input[name ='ProBonoApplicationId']").val(id)

    //hook up an event to the update role button

    $("#deny_probono_application_modal button[name='deny_probono_application_btn']").unbind().click(function () { DenyApplication() })


    
    $("#deny_probono_application_modal").modal("show");
  }


function DenyApplication() {

    showSpinner();

    toastr.clear()

    //send the request



    var form = $("#deny_probono_application_modal form")[0];

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
              url:  `${host}/api/probonoapplications/denyApplication`,
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
  
                      toastr.success("Pro bono application has been denied")
  
                      $("#deny_probono_application_modal").modal("hide")
  
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

    //console.log("this is the form",$("#edit_application_modal form")[0])
        
    // Get the form itself
    var form = $("#edit_application_modal form")[0];

    //console.log(form)
    // Create a new FormData object
    var formData = new FormData();

    // Append the form field values
    $(form).find('input, select, textarea').each(function (index, element) {
        var field = $(element);
        var fieldName = field.attr('name');
        var fieldValue = field.val();
        formData.append(fieldName, fieldValue);
    });

     let id = $("#edit_application_modal input[name='Id']").val()


    // Append the file attachments
    var attachments = $("#edit_application_modal input[name='Attachments']")[0].files;
    for (var i = 0; i < attachments.length; i++) {
        formData.append("Attachments", attachments[i]);
    }
    //send the request

    $.ajax({
        url: `${host}/api/probonoapplications/`+id,
        type: 'PUT',
        data: formData,
        processData: false, // Set processData to false to prevent automatic serialization
        contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
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

function openClientDetailsModal(id)
{
    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: `${host}/api/probonoclients/getclient/`+ id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer "+ tokenValue
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

        

        $("#view_client_modal form").find('input, select').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
            field.prop('disabled', true); // Disable the field
        });
   


    // Show modal
    $("#view_client_modal").modal("show");

    })
}

function handleFileUpload(fileInput, attachments, fieldName) {
    const attachment = attachments.find(attachment => attachment.propertyName === fieldName);

    if (attachment) {

        //console.log("attachment description: ",attachment)
        const fileURL = attachment.filePath.replace(/\\/g, '/');
        const newFileURL = `${host}${fileURL}`;

        // Create a mock file
        const mockFile = new File([""], attachment.propertyName, { type: attachment.fileType });

        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);

        // Set the file input's files
        fileInput.files = dataTransfer.files;

        // Create and dispatch a change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);

        // Update any related UI elements or perform additional actions
        //console.log(`File ${attachment.fileName} added to input field`);

        // Optionally, you can store the actual file URL as a data attribute
        fileInput.dataset.actualFileUrl = newFileURL;
    }
}

function createFieldMap(data) {
    return Object.entries(data).reduce((map, [key, value]) => {
        const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
        map[formFieldName] = key;
        return map;
    }, {})
}
function createFieldMap(data) {
    return Object.entries(data).reduce((map, [key, value]) => {
        const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
        map[formFieldName] = key;
        return map;
    }, {})
}


