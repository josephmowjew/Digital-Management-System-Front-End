$(function () {

    hideSpinner();
    //hook up a click event to the login button

    var createApplicationButton = $("#create_report_modal button[name='create_probono_report_btn']").unbind().click(OnCreateClick);


    function OnCreateClick() {

        showSpinner();
       
       
        // Get the form itself
        var form = $("#create_report_modal form")[0];

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
        var attachments = $("#create_report_modal input[name='Attachments']")[0].files;
        for (var i = 0; i < attachments.length; i++) {
            formData.append("Attachments", attachments[i]);
        }

      

        //send the request

        $.ajax({
            url:  "http://18.217.103.30/api/probonoreports",
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

                    toastr.success("New pro bono report addded successfully")

                    $("#create_report_modal").modal("hide")

                    dataTable.ajax.reload();

                


            },
            error: function (xhr, ajaxOtions, thrownError) {
                hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                       
                        const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                        const element = $("#create_report_modal").find("form :input[name='" + (elementName || '') + "']");
                        
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
        url: "http://18.217.103.30/api/probonoreports/getprobonoreport/"+ id,
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
        $("#edit_report_modal form").find('input, select, textarea').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });


   

    // Hook up event to the update user button
    $("#edit_report_modal button[name='update_probono_report_btn']").unbind().click(function () { updateApplication(token) });

    // Reset validation
    var validator = $("#edit_report_modal form").validate();
    validator.resetForm();

    // Show modal
    $("#edit_report_modal").modal("show");

    })
}
function Delete(id,token) {

    bootbox.confirm("Are you sure you want to delete this report from the system?", function (result) {


        if (result) {
            $.ajax({
                url: 'http://18.217.103.30/api/probonoreports/' + id,
                type: 'DELETE',
                headers: {
                    'Authorization': "Bearer "+ token
                }

            }).done(function (data) {

              
                    toastr.success("Pro bono report has been deleted sucessfully")
              
                datatable.ajax.reload();


            }).fail(function (response) {

                toastr.error(response.responseText)

                datatable.ajax.reload();
            });
        }


    });
}

function AcceptForm(id,token) {


    //get the record from the database
    showSpinner();
    
    $.ajax({
        url: "http://18.217.103.30/api/probonoreports/getprobonoreport/"+ id,
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
        $("#accept_report_modal form").find('input, select, textarea').each(function(index, element) {
            var field = $(element);
            var fieldName = field.attr('name');
            var dataKey = fieldMap[fieldName]; // Get corresponding key from data
            var fieldValue = data[dataKey]; // Get value from data based on key
            field.val(fieldValue); // Set field value
        });

        
        $("#accept_report_modal input[name ='ProBonoReportId']").val(id)

    })

 //get the input field inside the accept report modal form


 //hook up an event to the update  button

 $("#accept_report_modal button[name='accept_probono_report_btn']").unbind().click(function () { AcceptReport() })



 
 $("#accept_report_modal").modal("show");

}
function DenyForm(id,token) { 
    
   
    
    //get the input field inside the deny report modal form

    $("#deny_probono_report_modal input[name ='ProBonoReportId']").val(id)

    //hook up an event to the update  button

    $("#deny_probono_report_modal button[name='deny_probono_report_btn']").unbind().click(function () { DenyReport() })


    
    $("#deny_probono_report_modal").modal("show");
  }

  function AcceptReport() {

    showSpinner();

    toastr.clear()

    //send the request

    var form = $("#accept_report_modal form")[0];

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
          url:  "http://18.217.103.30/api/probonoreports/acceptReport",
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

                  toastr.success("Pro bono report has been accepted sucessfully")

                  $("#accept_report_modal").modal("hide")

                  dataTable.ajax.reload();

              


          },
          error: function (xhr, ajaxOtions, thrownError) {
              hideSpinner();
              var errorResponse = JSON.parse(xhr.responseText);
              $.each(errorResponse, function (key, value) {
                  $.each(value, function (index, message) {
                     
                      const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                      const element = $("#accept_report_modal").find("form :input[name='" + (elementName || '') + "']");
                      
                      if (element && element.length) {
                        element.siblings("span.text-danger").text(message);
                      }
   
                  });
              });
          }

      });


}

  function DenyReport() {

        showSpinner();

        toastr.clear()

        //send the request

        var form = $("#deny_probono_report_modal form")[0];

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
              url:  "http://18.217.103.30/api/probonoreports/denyreport",
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
  
                      toastr.success("Pro bono report has been denied")
  
                      $("#deny_probono_report_modal").modal("hide")
  
                      dataTable.ajax.reload();
  
                  
  
  
              },
              error: function (xhr, ajaxOtions, thrownError) {
                  hideSpinner();
                  var errorResponse = JSON.parse(xhr.responseText);
                  $.each(errorResponse, function (key, value) {
                      $.each(value, function (index, message) {
                         
                          const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                          const element = $("#deny_probono_report_modal").find("form :input[name='" + (elementName || '') + "']");
                          
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
    var authenticationToken = $("#edit_report_modal input[name='__RequestVerificationToken']").val();


        
    // Get the form itself
    var form = $("#edit_report_modal form")[0];

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
    var attachments = $("#create_report_modal input[name='Attachments']")[0].files;
    for (var i = 0; i < attachments.length; i++) {
        formData.append("Attachments", attachments[i]);
    }

     let id = $("#edit_report_modal input[name='Id']").val()


   
    //send the request

    $.ajax({
        url: "http://18.217.103.30/api/ProBonoReports/"+id,
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

                toastr.success("Pro bono report updated successfully")

                $("#edit_report_modal").modal("hide")

                dataTable.ajax.reload();

            



        },
        error: function (xhr, ajaxOtions, thrownError) {

            hideSpinner();
            var errorResponse = JSON.parse(xhr.responseText);
            $.each(errorResponse, function (key, value) {
                $.each(value, function (index, message) {
                   
                    const elementName = key ? key.charAt(0).toUpperCase() + key.slice(1) : null;
                    const element = $("#edit_report_modal").find("form :input[name='" + (elementName || '') + "']");
                    
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



