using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
using MLS_Digital_Management_System_Front_End.Core.DTOs.QBInvoices;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IInvoiceRequestService
{
    Task<ReadInvoiceRequestDTO> GetInvoiceRequestByIdAsync(int id);

    Task<ReadQBInvoiceDTO> GetProcessedInvoiceRequestByIdAsync(string id);

    Task<int> GetInvoiceRequestsCount();
}
