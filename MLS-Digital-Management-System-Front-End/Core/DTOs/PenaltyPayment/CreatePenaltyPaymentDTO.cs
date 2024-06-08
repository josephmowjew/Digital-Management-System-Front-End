using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyPayment
{
    public class CreatePenaltyPaymentDTO
    {
        public int Id { get; set; }

        [Display(Name = "Penalty")]
        public int PenaltyId { get; set; }

        [Required]
        [Display(Name = "Payment Fee")]
        public double Fee { get; set; }

        [StringLength(250)]
        public string? Description { get; set; }

        public List<IFormFile>? Attachments { get; set; }
    }
}
