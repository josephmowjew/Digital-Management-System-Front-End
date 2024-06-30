class InvoiceRequestHandler {
  constructor(host, tokenValue) {
    this.host = host;
    this.tokenValue = tokenValue;
    this.spinner = document.getElementById("spinner");
    this.dataTable = null;
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
    if (this.dataTable) {
      return; // Exit if already initialized
    }

    this.dataTable = $('#invoice_requests_table').DataTable({
      processing: true,
      serverSide: true,
      order: [[0, "desc"]],
      ajax: {
        url: `${this.host}/api/InvoiceRequest/cpdtrainings`,
        type: 'get',
        data: (d) => {
          d.cpdTrainingId = cpdTrainingId; // Assuming cpdTrainingId is defined globally
        },
        headers: {
          'Authorization': `Bearer ${this.tokenValue}`
        }
      },
      columns: [
        { data: "customer.customerName", name: "CustomerId", orderable: false },
        { data: "referencedEntity.title", name: "referencedEntity", orderable: false },
        {
          data: "amount",
          name: "amount",
          render: (data) => data.toLocaleString('en-MW', { style: 'currency', currency: 'MWK' })
        },
        {
          data: "createdDate",
          name: "createdDate",
          render: (data) => data ? new Date(data).toISOString().split('T')[0] : ''
        },
        {
          data: "status",
          name: "status",
          render: (data) => {
            const statusClasses = {
              Approved: "bg-success",
              Pending: "bg-secondary",
              Rejected: "bg-danger",
              Generated: "bg-warning"
            };
            return `<span class='badge ${statusClasses[data] || "bg-info"} bg-opacity-85 rounded-pill'>${data}</span>`;
          }
        },
        {
          data: "id",
          name: "id",
          orderable: false,
          render: (data, type, row) => this.renderActionButtons(data, row.status)
        }
      ],
      responsive: true,
      autoWidth: false
    });
  }

  renderActionButtons(id, status) {
    let buttonsHtml = `<div class="d-flex justify-content-center">`;
    
    if (status === "Pending") {
      buttonsHtml += `<button class='btn btn-warning btn-sm mx-2' onclick='invoiceRequestHandler.markAsGenerated(${id})'>Mark as Generated</button>`;
    } else if (status === "Generated") {
      buttonsHtml += `<button class='btn btn-success btn-sm mx-2' onclick='invoiceRequestHandler.markAsPaid(${id})'>Mark as Paid</button>`;
    }
    
    buttonsHtml += `<a href='ViewInvoiceRequest?invoiceRequestId=${id}' class='btn btn-primary btn-sm mx-2'>View</a></div>`;
    
    return buttonsHtml;
  }

  markAsGenerated(id) {
    this.confirmAndSendRequest(
      "Are you sure you want to mark this invoice as generated?",
      `${this.host}/api/InvoiceRequest/MarkAsGenerated/${id}`,
      "Invoice marked as generated successfully"
    );
  }

  markAsPaid(id) {
    this.confirmAndSendRequest(
      "Are you sure you want to mark this invoice as paid?",
      `${this.host}/api/InvoiceRequest/MarkAsPaid/${id}`,
      "Invoice marked as paid successfully"
    );
  }

  confirmAndSendRequest(message, url, successMessage) {
    bootbox.confirm(message, (result) => {
      if (result) {
        this.showSpinner();
        this.sendAjaxRequest(null, "POST", url, () => {
          this.hideSpinner();
          toastr.success(successMessage);
          this.dataTable.ajax.reload();
        });
      }
    });
  }

  sendAjaxRequest(formData, method, url, successCallback) {
    fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${this.tokenValue}`
      },
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.hideSpinner();
      console.log("data", data)
      successCallback(data);
    })
    .catch(error => {
      this.hideSpinner();
      toastr.error("An error occurred while processing your request");
      console.error('Error:', error);
    });
  }
}

// Initialize the handler when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.invoiceRequestHandler = new InvoiceRequestHandler(host, tokenValue);
});