class InvoiceRequestHandler {
  constructor(host, tokenValue) {
    this.host = host;
    this.tokenValue = tokenValue;
    this.spinner = document.getElementById("spinner");
    this.hideSpinner();
    this.bindEvents();
    this.initDataTables();
    
    }

    bindEvents() {
    const requestInvoiceBtn = document.querySelector("#create_invoice_request_btn");
    if (requestInvoiceBtn) {
        requestInvoiceBtn.addEventListener("click", this.onCreateClick.bind(this));
    }
  }

    onCreateClick() {
        this.showSpinner();
       
        //get the form itself 
        var form = $("#create_invoice_request_modal form");

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
            data: formData,
            url: `${this.host}/api/InvoiceRequest`,
            type: 'POST',
            headers: {
                'Authorization': "Bearer " + this.tokenValue
            },
            success: (data) => {
                //parse whatever comes back to html
                var parsedData = $.parseHTML(data);

                this.hideSpinner();

                //show success message
                toastr.success("Invoice requested successfully");

                $("#create_invoice_request_modal").modal("hide");
                $("#create_invoice_request_modal form")[0].reset()

                var dataTable = $('#invoices_requested_table').DataTable();
                dataTable.ajax.reload();
            },
            error: (xhr, ajaxOptions, thrownError) => {
                this.hideSpinner();
                var errorResponse = JSON.parse(xhr.responseText);
                $.each(errorResponse, function (key, value) {
                    $.each(value, function (index, message) {
                        $("#" + key).siblings("span.text-danger").text(message);
                    });
                });
            }
        });
    }


    showSpinner() {
        if (this.spinner) {
            this.spinner.style.display = "block";
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    hideSpinner() {
        if (this.spinner) {
            this.spinner.style.display = "none";
        } else {
            console.error('Spinner element with id "spinner" was not found');
        }
    }

    initDataTables() {
        $(document).ready(() => {
            const tableConfigs = {
                'invoice_requests_table': {
                    url: `${this.host}/api/InvoiceRequest/cpdtrainings?cpdTrainingId=${cpdTrainingId}`,
                    columns: [
                        {
                            data: "customer.customerName",
                            name: "CustomerId",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "referencedEntity.title",
                            name: "referencedEntity",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "amount",
                            name: "amount",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                return data.toLocaleString('en-MW', { style: 'currency', currency: 'MWK' })
                            }
                        },
                        {
                            data: "createdDate",
                            name: "createdDate",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                if (data) {
                                    const date = new Date(data);
                                    const day = ("0" + date.getDate()).slice(-2);
                                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                                    const year = date.getFullYear();
                                    return `${year}-${month}-${day}`;
                                }
                                return '';
                            }
                        },
                        {
                            data: "status",
                            name: "status",
                            "orderable": true,
                            render: function (data) {
                                switch (data) {
                                    case "Approved":
                                        return "<span class='badge bg-success bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Pending":
                                        return "<span class='badge bg-secondary bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Rejected":
                                        return "<span class='badge bg-danger bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    default:
                                        return "<span class='badge bg-warning bg-opacity-85 rounded-pill'>" + data + "</span>";
                                }
                            }
                        },
                        {
                            data: "id",
                            name: "id",
                            "orderable": false,
                            render: (data, type, row) => {
                                let buttonsHtml = `<div class="d-flex justify-content-center">`;

                                if (row.status === "Pending") {
                                    buttonsHtml += `
                                        <button class='btn btn-warning btn-sm mx-2' onclick='invoiceRequestHandler.markAsGenerated(${data})'>Mark as Generated</button>
                                    `;
                                } else if (row.status === "Generated") {
                                    buttonsHtml += `
                                        <button class='btn btn-success btn-sm mx-2' onclick='invoiceRequestHandler.markAsPaid(${data})'>Mark as Paid</button>
                                    `;
                                }

                                // Always add the View button with spacing
                                buttonsHtml += `
                                    <a href='ViewInvoiceRequest?invoiceRequestId=${data}' class='btn btn-primary btn-sm mx-2'>View</a>
                                `;

                                buttonsHtml += `</div>`;

                                return buttonsHtml;
                            }
                        }


                    ],
                },
                'invoices_requested_table': {
                    url: `${this.host}/api/InvoiceRequest/byMember`,
                    columns: [
                        {
                            data: "customer.customerName",
                            name: "CustomerId",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "referencedEntityType",
                            name: "referencedEntityType",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "createdDate",
                            name: "createdDate",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                if (data) {
                                    const date = new Date(data);
                                    const day = ("0" + date.getDate()).slice(-2);
                                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                                    const year = date.getFullYear();
                                    return `${year}-${month}-${day}`;
                                }
                                return '';
                            }
                        },
                        {
                            data: "status",
                            name: "status",
                            "orderable": true,
                            render: function (data) {
                                switch (data) {
                                    case "Approved":
                                        return "<span class='badge bg-success bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Pending":
                                        return "<span class='badge bg-secondary bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Rejected":
                                        return "<span class='badge bg-danger bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    default:
                                        return "<span class='badge bg-warning bg-opacity-85 rounded-pill'>" + data + "</span>";
                                }
                            }
                        },
                        {
                            data: "id",
                            name: "id",
                            "orderable": false,
                            render: (data, type, row) => {
                                let buttonsHtml = `<div class="d-flex justify-content-center">`;
                                // Always add the View button with spacing
                                buttonsHtml += `
                                    <a href='/Member/InvoiceRequests/ViewInvoiceRequest?invoiceRequestId=${data}' class='btn btn-primary btn-sm mx-2'>View</a>
                                `;

                                buttonsHtml += `</div>`;

                                return buttonsHtml;
                            }
                        }
                    ]
                },
                'invoices_requests': {
                    url: `${this.host}/api/InvoiceRequest/paged`,
                    columns: [
                        {
                            data: "customer.customerName",
                            name: "CustomerId",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "referencedEntityType",
                            name: "referencedEntityType",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "createdDate",
                            name: "createdDate",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                if (data) {
                                    const date = new Date(data);
                                    const day = ("0" + date.getDate()).slice(-2);
                                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                                    const year = date.getFullYear();
                                    return `${year}-${month}-${day}`;
                                }
                                return '';
                            }
                        },
                        {
                            data: "status",
                            name: "status",
                            "orderable": true,
                            render: function (data) {
                                switch (data) {
                                    case "Approved":
                                        return "<span class='badge bg-success bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Pending":
                                        return "<span class='badge bg-secondary bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    case "Rejected":
                                        return "<span class='badge bg-danger bg-opacity-85 rounded-pill'>" + data + "</span>";
                                    default:
                                        return "<span class='badge bg-warning bg-opacity-85 rounded-pill'>" + data + "</span>";
                                }
                            }
                        },
                        {
                            data: "id",
                            name: "id",
                            "orderable": false,
                            render: (data, type, row) => {
                                let buttonsHtml = `<div class="d-flex justify-content-center">`;

                                if (row.status === "Pending") {
                                    buttonsHtml += `
                                        <button class='btn btn-warning btn-sm mx-2' onclick='invoiceRequestHandler.markAsGenerated(${data})'>Mark as Generated</button>
                                    `;
                                } else if (row.status === "Generated") {
                                    buttonsHtml += `
                                        <button class='btn btn-success btn-sm mx-2' onclick='invoiceRequestHandler.markAsPaid(${data})'>Mark as Paid</button>
                                    `;
                                }
                                // Always add the View button with spacing
                                buttonsHtml += `
                                    <a href='/Finance/InvoiceRequests/ViewInvoiceRequest?invoiceRequestId=${data}' class='btn btn-primary btn-sm mx-2'>View</a>
                                `;

                                buttonsHtml += `</div>`;

                                return buttonsHtml;
                            }
                        }
                    ]
                },
                'qb_invoices_table': {
                    url: `${this.host}/api/InvoiceRequest/processed`,
                    columns: [  
                        {
                            data: "invoiceDate",
                            name: "invoiceDate",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "invoiceAmount",
                            name: "invoiceAmount",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                return data.toLocaleString('en-MW', { style: 'currency', currency: 'MWK' })
                            }
                        },
                        {
                            data: "createdDate",
                            name: "createdDate",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                if (data) {
                                    const date = new Date(data);
                                    const day = ("0" + date.getDate()).slice(-2);
                                    const month = ("0" + (date.getMonth() + 1)).slice(-2);
                                    const year = date.getFullYear();
                                    return `${year}-${month}-${day}`;
                                }
                                return '';
                            }
                        },
                        {
                            data: "id",
                            name: "id",
                            "orderable": false,
                            render: (data, type, row) => {
                                let buttonsHtml = `<div class="d-flex justify-content-center">`;
                                // Always add the View button with spacing
                                buttonsHtml += `
                                    <a href='/Member/InvoiceRequests/ViewInvoiceRequest?invoiceRequestId=${data}' class='btn btn-primary btn-sm mx-2'>View</a>
                                `;

                                buttonsHtml += `</div>`;

                                return buttonsHtml;
                            }
                        }
                    ]
                }
            };

            Object.keys(tableConfigs).forEach(tableId => {
                const $table = $(`#${tableId}`);
                if ($table.length) {
                    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                        $table.DataTable().destroy();
                    }

                    $table.DataTable({
                        processing: true,
                        serverSide: true,
                        order: [[0, "desc"]],
                        ajax: {
                            url: tableConfigs[tableId].url,
                            type: 'get',
                            datatype: 'Json',
                            headers: {
                                'Authorization': `Bearer ${this.tokenValue}`
                            }
                        },
                        columnDefs: [
                            {
                                defaultContent: "",
                                targets: "_all",
                                'orderable': true
                            },
                        ],
                        columns: tableConfigs[tableId].columns,
                        responsive: true,
                        autoWidth: false,
                    });
                }
            });
        });
    }

  markAsGenerated(id) {
    this.confirmAndSendRequest(
      "Are you sure you want to mark this invoice as generated?",
      `${this.host}/api/InvoiceRequest/MarkAsGenerated/${id}`,
      "Invoice marked as generated successfully"
    );
  }

  handleResponse(data, formSelector, retryFunction) {
      const parsedData = new DOMParser().parseFromString(data, 'text/html');
      const isInvalid = parsedData.querySelector("input[name='DataInvalid']")?.value === "true";

      if (isInvalid) {
          document.querySelector(formSelector).innerHTML = data;
          toastr.error(parsedData.querySelector("input[name='message']").value);
          this.rewireFormEvents(formSelector, retryFunction);
      } else {
          toastr.success(parsedData.querySelector("input[name='message']").value);
      }
  }

  sendAjaxRequest(formData, method, url, successCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${this.tokenValue}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.hideSpinner();
        if (xhr.status === 200 || xhr.status === 201) {
          successCallback(xhr.response);
        } else {
          toastr.error("An error occurred while processing your request");
        }
      }
    };
    xhr.send(formData);
  }
}

// Initialize the handler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.invoiceRequestHandler = new InvoiceRequestHandler(host, tokenValue);
});