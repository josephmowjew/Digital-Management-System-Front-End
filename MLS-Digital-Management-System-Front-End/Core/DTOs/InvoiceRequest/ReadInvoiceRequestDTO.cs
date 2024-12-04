using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Core.Models;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.InvoiceRequest;
public class ReadInvoiceRequestDTO
    {
        public int Id { get; set; }
       
        public string CreatedById { get; set; }
        public ReadUserDTO CreatedBy { get; set; }
        public double Amount { get; set; }
        public string CustomerId { get; set; }
        public QBCustomer Customer { get; set; }
        public string Status { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
        // Polymorphic association properties
        public string ReferencedEntityType { get; set; }
        public string ReferencedEntityId { get; set; }

        public object ReferencedEntity { get; set; }

         public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
         public string? QBInvoiceId { get; set; }
        public QBInvoice QBInvoice { get; set; }
        public string RequestType { get; set; }
        public string? FirmMembers { get; set; }

    }