namespace MLS_Digital_Management_System_Front_End.Core.Models;

    public class QBInvoice
    {
       
      
        public string Id { get; set; }
        public string InvoiceNumber { get; set; }
        public string CustomerId { get; set; }
        public QBCustomer Customer { get; set; }
        public string CustomerName { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
        public string InvoiceType { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string InvoiceDescription { get; set; }
          
    }
