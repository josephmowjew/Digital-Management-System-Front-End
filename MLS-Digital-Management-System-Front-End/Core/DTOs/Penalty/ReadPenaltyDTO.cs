using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Core.Models;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty
{
    public class ReadPenaltyDTO
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int PenaltyTypeId { get; set; }
        public double Fee { get; set; }
        [Required]
        [StringLength(maximumLength: 250)]
        public string Reason { get; set; }
        [Required]
        public int YearOfOperationId { get; set; }
        public double AmountRemaining { get; set; }
        public List<IFormFile>? Attachments { get; set; }
        public int? InvoiceRequestId { get; set; }
        public ReadInvoiceRequestDTO InvoiceRequest { get; set; }
    }
}
