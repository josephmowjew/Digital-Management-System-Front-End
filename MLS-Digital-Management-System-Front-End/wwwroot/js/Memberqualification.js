$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createFirmButton = $("#create_member_qualification_modal button[name='create_member_qualification_btn']").unbind().click(OnCreateClick);

    //add event listener to the edit button

    function OnCreateClick() {

        showSpinner();
       

        
        var form = $("#create_member_qualification_modal form")[0];

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
              var attachments = $("#create_member_qualification_modal input[name='Attachments']")[0].files;
              for (var i = 0; i < attachments.length; i++) {
                  formData.append("Attachments", attachments[i]);
              }
      
        //send the request

        $.ajax({
            url:  `${host}/api/memberqualifications`,
            type: 'POST',
            data: formData, // Convert formData object to JSON string
            processData: false, // Set processData to false to prevent automatic serialization
            contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
            headers: {
                'Authorization': "Bearer "+ tokenValue
            },
            success: function (data) {
                
                //set the Id of the edit form
               $("#edit_member_qualification_modal input[name='Id']").val(data.id)
                //parse whatever comes back to html

               
                    //show success message to the firm
                    var dataTable = $('#my_table').DataTable();

                    toastr.success("member qualification record added successfully")

                    $("#create_member_qualification_modal").modal("hide")

                    

                    dataTable.ajax.reload();

                    hideSpinner();
            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                       
                        const elementName = key.charAt(0).toUpperCase() + key.slice(1); // Replace with the desired element name
                        const element = $("#create_member_qualification_modal").find("form :input[name='" + elementName + "']");
                       element.siblings("span.text-danger").text(message);
                        //$("#edit_member_qualification_modal input[name='" + key+']').siblings("span.text-danger").text(message);
                    });
                });
            }

        });
    }


})


function EditQualificationForm() {
   const editform = document.querySelector("#edit_member_qualification_modal form");
   let id =  $("#edit_member_modal input[name='Id']").val();
    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: `${host}/api/MemberQualifications/get/`+ id,
        type: 'GET',
        headers: {
            'Authorization': "Bearer "+ tokenValue
        }

    }).done(function (data) {
        hideSpinner();
        // Iterate over the keys of the data object and map them to form field names dynamically
        const fieldMap = createFieldMap(data);
        const editformElements = [...editform.querySelectorAll('input, select, textarea, checkbox, label, textarea')];

        editformElements.forEach(element => {
            const fieldName = element.getAttribute('name');
            const dataKey = fieldMap[fieldName];
            let fieldValue = data[dataKey];

            if (element.type === 'checkbox') {
                this.setCheckboxValue(element, fieldValue);
            } else if (element.type === 'file') {
                handleFileUpload(element, data.attachments, fieldName);
            }
            else {
                element.value = fieldValue;
            }
        });


        // Hook up event to the update firm button
        $("#edit_member_qualification_modal button[name='update_qualification_btn']").unbind().click(function () { UpdateMemberQualification() });

        
        // Reset validation
        var validator = $("#edit_member_qualification_modal form").validate();
        validator.resetForm();

        // Show modal
        $("#edit_member_qualification_modal").modal("show");

        })
}



function UpdateMemberQualification() {

    

    toastr.clear()

  

    //get the authorisation token
    //upDateRole
    var authenticationToken = $("#edit_member_qualification_modal input[name='__RequestVerificationToken']").val();

     //get the form itself 
     var form = $("#edit_member_qualification_modal form")[0];

   

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
  
    var attachments = $("#edit_member_qualification_modal input[name='Attachments']")[0].files;
    for (var i = 0; i < attachments.length; i++) {
        formData.append("Attachments", attachments[i]);
    }


    let id = $("#edit_member_qualification_modal input[name='Id']").val()
    //send the request

    $.ajax({
        url: `${host}/api/MemberQualifications/`+id,
        type: 'PUT',
        data: formData,
        processData: false, // Set processData to false to prevent automatic serialization
        contentType: false, // Prevent jQuery from processing the data (since it's already in FormData format)
        headers: {
            'Authorization': "Bearer "+ tokenValue
        },
        success: function (data) {

                

                //show success message to the firm
                var dataTable = $('#my_table').DataTable();

                toastr.success("Member qualification updated successfully")

                $("#edit_member_qualification_modal").modal("hide")

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
                   
                    const elementName = key.charAt(0).toUpperCase() + key.slice(1); // Replace with the desired element name
                    const element = $("#edit_member_qualification_modal").find("form :input[name='" + elementName + "']");
                   element.siblings("span.text-danger").text(message);
                    //$("#edit_member_qualification_modal input[name='" + key+']').siblings("span.text-danger").text(message);
                });
            });
        }

    });

}


function DeleteQualification(id,token) {

    bootbox.confirm("Are you sure you want to delete this qualification record from the system?", function (result) {


        if (result) {
            $.ajax({
                url: `${host}/api/memberQualifications/` + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("qualification record has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
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
    }, {});
}
