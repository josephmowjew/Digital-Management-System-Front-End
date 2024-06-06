using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty
{
    public class ReadPenaltyDTO
    {
        public int MemberId { get; set; }
        public int PenaltyTypeId { get; set; }
        public double Fee { get; set; }
        [Required]
        [StringLength(maximumLength: 250)]
        public string Reason { get; set; }
        [Required]
        public int YearOfOperationId { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
