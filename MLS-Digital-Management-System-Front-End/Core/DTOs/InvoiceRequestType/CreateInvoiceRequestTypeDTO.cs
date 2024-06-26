using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequestType
{
    public class CreateInvoiceRequestTypeDTO
    {
        [Required]
        [StringLength(maximumLength: 100)]
        public string Name { get; set; }
    }
}
