using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyPayment
{
    public class ReadPenaltyPaymentDTO
    {
        public int Id { get; set; }
        public double Fee { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        public int PenaltyId { get; set; }
        public ReadPenaltyDTO Penalty { get; set; }
        public string PaymentStatus { get; set; }
        public List<ReadAttachmentDTO> Attachments { get; set; }
    }
}
