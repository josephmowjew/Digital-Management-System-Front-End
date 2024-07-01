namespace MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest
{
    public class CreateInvoiceRequestDTO
    {
        public double? Amount { get; set; }
        public string ReferencedEntityType { get; set; }

        public string Description { get; set; }
        public string ReferencedEntityId { get; set; }
    }
}
