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

        const submitGeneratedInvoiceBtn = document.querySelector(
            "#invoice_request_modal button[name='submitGeneratedInvoiceBtn']"
        );
        if (submitGeneratedInvoiceBtn) {
            submitGeneratedInvoiceBtn.addEventListener("click", this.onSubmitGeneratedInvoice.bind(this));
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
                'invoices_requested_processed_table': {
                    url: `${this.host}/api/InvoiceRequest/byMember`,
                    columns: [
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
                            data: "qbInvoiceId",
                            name: "qbInvoiceId",
                            className: "text-left",
                            "orderable": false,
                            render: function(data, type, row){
                                if(row.qbInvoice){
                                    return row.qbInvoice?.InvoiceNumber
                                }else{
                                    return row.invoiceNumber;
                                }
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
                            data: "attachment",
                            name: "attachment",
                            className: "text-left",
                            "orderable": false,
                            render: function(data, type, row){
                                if(row.attachment){
                                    return `<a href="${host}${apiPrefix}/${row.attachment.filePath}" target="_blank" download="${row.attachment.fileName}"> Attachment <i class="bi bi-paperclip"></i></a>`;
                                }else{
                                    return '';
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
                'invoice_requests_table': {
                    url: `${this.host}/api/InvoiceRequest/cpdtrainings?cpdTrainingId=${cpdTrainingId}`,
                    columns: [
                        {
                            data: "customer.customerName",
                            name: "CustomerId",
                            className: "text-left",
                            "orderable": false,
                            render: function (data, type, row) {
                                return row.customer?.customerName ?? row.createdBy.fullName
                            }
                        },
                        {
                            data: "firm.name",
                            name: "Firm",
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
                            data: "referencedEntityType",
                            name: "referencedEntityType",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "firm.name",
                            name: "Firm",
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
                            data: "qbInvoiceId",
                            name: "qbInvoiceId",
                            className: "text-left",
                            "orderable": false,
                            render: function(data, type, row){
                                if(row.qbInvoice){
                                    return row.qbInvoice?.InvoiceNumber
                                }else{
                                    return row.invoiceNumber;
                                }
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
                            data: "attachment",
                            name: "attachment",
                            className: "text-left",
                            "orderable": false,
                            render: function(data, type, row){
                                if(row.attachment){
                                    return `<a href="${host}${apiPrefix}/${row.attachment.filePath}" target="_blank" download="${row.attachment.fileName}"> Attachment <i class="bi bi-paperclip"></i></a>`;
                                }else{
                                    return '';
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
                            render: function (data, type, row) {
                                return row.customer?.customerName ?? row.createdBy.fullName
                            }
                        },
                        {
                            data: "createdBy.email",
                            name: "createdBy.email",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "firm.name",
                            name: "Firm",
                            className: "text-left",
                            "orderable": false,
                        },
                        {
                            data: "requestType",
                            name: "requestType",
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
                                        <button class='btn btn-warning btn-sm mx-2' onclick='invoiceRequestHandler.markAsGenerated(\`${data}\`, "${this.tokenValue}")'>Mark as Generated</button>
                                    `;
                                }/* else if (row.status === "Generated") {
                                    buttonsHtml += `
                                        <button class='btn btn-success btn-sm mx-2' onclick='invoiceRequestHandler.markAsPaid(${data})'>Mark as Paid</button>
                                    `;
                                }*/
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
                    url: `${this.host}/api/InvoiceRequest/processedNotQuickBooks`,
                    columns: [

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
                            data: "unpaidAmount",
                            name: "unpaidAmount",
                            className: "text-left",
                            orderable: true,
                            render: function (data) {
                                return data.toLocaleString('en-MW', { style: 'currency', currency: 'MWK' })
                            }
                        },
                        {
                            data: "invoiceDate",
                            name: "invoiceDate",
                            className: "text-left",
                            "orderable": false,
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
                            data: "invoiceType",
                            name: "invoiceType",
                            className: "text-left",
                            orderable: true,
                        },
                        {
                            data: "id",
                            name: "id",
                            "orderable": false,
                            render: (data, type, row) => {
                                let buttonsHtml = `<div class="d-flex justify-content-center">`;
                                // Always add the View button with spacing
                                buttonsHtml += `
                                    <a href='/Member/InvoiceRequests/ViewProcessedInvoiceRequest?invoiceRequestId=${data}' class='btn btn-primary btn-sm mx-2'> <i class="bi bi-info-circle"></i> view</a>
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

    markAsGenerated(id, token) {
        this.showSpinner();

        if (id > 0) {
            $.ajax({
                url: `${this.host}/api/InvoiceRequest/MarkAsGenerated/${id}`,
                type: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                success: (response) => {
                    this.handleEditFormSuccess(response, id);
                },
                error: (xhr) => {
                    this.hideSpinner();
                    toastr.error('Failed to load invoice request details');
                }
            });
        }
    }

    handleEditFormSuccess(response, id) {
        this.hideSpinner();

        try {
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            const editform = document.querySelector("#invoice_request_modal form");

            if (!editform) {
                toastr.error('Form not found');
                return;
            }

            const fieldMap = this.createFieldMap(data);
            const editformElements = editform.querySelectorAll('input, select, textarea');

            editformElements.forEach(element => {
                const fieldName = element.getAttribute('name');
                if (!fieldName) return;

                const dataKey = fieldMap[fieldName];

                if (fieldName === 'invoiceRequestId') {
                    element.value = id;
                }
            });

            // Show modal
            $("#invoice_request_modal").modal("show");
        } catch (error) {
            console.error('Error processing form data:', error);
            toastr.error('Error processing invoice request data');
        }
    }

    createFieldMap(data) {
        return Object.entries(data).reduce((map, [key, value]) => {
            const formFieldName = key.charAt(0).toUpperCase() + key.slice(1);
            map[formFieldName] = key;
            return map;
        }, {});
    }

    onSubmitGeneratedInvoice() {
        const form = document.getElementById('markAsGeneratedForm');
        const id = document.querySelector("#invoice_request_modal form input[name='invoiceRequestId']").value;
        const fileInput = document.querySelector("#invoice_request_modal form input[name='invoiceFile']");
        const file = fileInput.files[0];

        const formData = new FormData(form);
        formData.append('fileUpload', file);

        this.showSpinner();

        $.ajax({
            url: `${this.host}/api/InvoiceRequest/markAsGenerated/${id}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': "Bearer " + this.tokenValue
            },
            success: (response) => {
                this.hideSpinner();
                toastr.success("Invoice marked as generated successfully");
                $('#invoice_request_modal').modal('hide');
                form.reset();

                // Reload the table
                $('#invoices_requests').DataTable().ajax.reload();
            },
            error: (xhr) => {
                this.hideSpinner();
                if (xhr.responseText) {
                    const errorResponse = JSON.parse(xhr.responseText);
                    $.each(errorResponse, function (key, value) {
                        $.each(value, function (index, message) {
                            $(`#${key}`).siblings(".text-danger").text(message);
                        });
                    });
                } else {
                    toastr.error("An error occurred while marking the invoice as generated");
                }
            }
        });
    }

    markAsPaid(id) {
        this.confirmAndSendRequest(
            "Are you sure you want to mark this invoice as paid?",
            `${this.host}/api/InvoiceRequest/MarkAsPaid/${id}`,
            "Invoice marked as paid successfully",
        );
    }

    confirmAndSendRequest(message, url, successMessage) {
        bootbox.confirm(message, (result) => {
            if (result) {
                this.showSpinner();
                this.sendAjaxRequest(null, "POST", url, () => {
                    this.hideSpinner();
                    toastr.success(successMessage);
                    window.location.reload();
                });
            }
        });
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