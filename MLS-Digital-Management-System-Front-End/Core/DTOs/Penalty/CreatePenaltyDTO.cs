using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty
{
    public class CreatePenaltyDTO
    {
        [Display(Name = "Member")]
        public int MemberId { get; set; }
        [Display(Name = "Penalty Type")]
        public int PenaltyTypeId { get; set; }
        [Display(Name = "Fee")]
        public double Fee { get; set; }
        [Required]
        [StringLength(maximumLength: 250)]
        [Display(Name = "Reason")]
        public string Reason { get; set; }
        [Required]
        [Display(Name = "Practicing Year")]
        public int YearOfOperationId { get; set; }
        [Display(Name = "Attachment")]
        public List<IFormFile>? Attachments { get; set; }
    }
}
