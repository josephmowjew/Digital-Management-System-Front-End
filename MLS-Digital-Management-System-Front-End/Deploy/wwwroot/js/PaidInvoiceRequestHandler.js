class InvoiceRequestHandler {
  constructor(host, tokenValue) {
    this.host = host;
    this.tokenValue = tokenValue;
    this.spinner = document.getElementById("spinner");
    this.hideSpinner();
    this.initDataTable();
  }

  showSpinner() {
    if (this.spinner) {
      this.spinner.style.display = "block";
    }
  }

  hideSpinner() {
    if (this.spinner) {
      this.spinner.style.display = "none";
    }
  }

  initDataTable() {
    $(document).ready(() => {
      if ($.fn.DataTable.isDataTable('#invoice_requests_table')) {
        $('#invoice_requests_table').DataTable().destroy();
      }

      $('#invoice_requests_table').DataTable({
        processing: true,
        serverSide: true,
        order: [[0, "desc"]],
        ajax: {
          url: `${this.host}/api/InvoiceRequest/PaidCpdTrainings?cpdTrainingId=${cpdTrainingId}`,
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
              return  data.toLocaleString('en-MW', { style: 'currency', currency: 'MWK' })
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
        responsive: true,
        "autoWidth": false,
        dom: 'Bfrtip', // Add this line
        buttons: [ // Add this block
            {
              extend: 'excelHtml5',
                title: 'Invoice Requests',
                exportOptions: {
                    columns: ':not(:last-child)' // Exclude the last column (Actions column)
                }
            }
        ]
      });
    });
  }

  markAsGenerated(id) {
    bootbox.confirm("Are you sure you want to mark this invoice as generated?", (result) => {
      if (result) {
        this.showSpinner();
        this.sendAjaxRequest(
          null,
          "POST",
          `${this.host}/api/InvoiceRequest/MarkAsGenerated/${id}`,
          () => {
            this.hideSpinner();
            toastr.success("Invoice marked as generated successfully");
            $('#invoice_requests_table').DataTable().ajax.reload();
          }
        );
      }
    });
  }

  markAsPaid(id) {
    bootbox.confirm("Are you sure you want to mark this invoice as paid?", (result) => {
      if (result) {
        this.showSpinner();
        this.sendAjaxRequest(
          null,
          "POST",
          `${this.host}/api/InvoiceRequest/MarkAsPaid/${id}`,
          () => {
            this.hideSpinner();
            toastr.success("Invoice marked as paid successfully");
            $('#invoice_requests_table').DataTable().ajax.reload();
          }
        );
      }
    });
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

window.invoiceRequestHandler = new InvoiceRequestHandler(host, tokenValue);
