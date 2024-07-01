using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IInvoiceRequestService
{
    Task<ReadInvoiceRequestDTO> GetInvoiceRequestByIdAsync(int id);
}
