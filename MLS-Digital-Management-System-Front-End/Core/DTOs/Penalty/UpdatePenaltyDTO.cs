using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty
{
    public class UpdatePenaltyDTO
    {
        public int Id { get; set; }
        [Required]
        public int MemberId { get; set; }
        [Required]
        public int PenaltyTypeId { get; set; }
        public double Fee { get; set; }
        [Required]
        [StringLength(250)]
        public string Reason { get; set; }
        [Required]
        public int YearOfOperationId { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
