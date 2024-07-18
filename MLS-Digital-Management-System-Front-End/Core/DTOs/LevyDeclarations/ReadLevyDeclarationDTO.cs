using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;
using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LevyDeclarations
{
    public class ReadLevyDeclarationDTO
    {
        public DateTime Month { get; set; }
        public decimal Revenue { get; set; }
        public decimal LevyAmount { get; set; }
        public decimal Percentage { get; set; }
        public int FirmId { get; set; }
        public ReadFirmDTO Firm { get; set; }
        public List<IFormFile>? Attachments { get; set; }
        public int? InvoiceRequestId { get; set; }
        public ReadInvoiceRequestDTO InvoiceRequest { get; set; }
    }
}
