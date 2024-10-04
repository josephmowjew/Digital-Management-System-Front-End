
using System;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.NotariesPublic
{
    public class CreateNotariesPublicDTO
    {
        [Display(Name = "Member")]
        public int MemberId { get; set; }
        [Required]
        [Display(Name = "Practicing Year")]
        public int YearOfOperationId { get; set; }
        [Display(Name = "Attachment")]
        public List<IFormFile>? Attachments { get; set; }
    }
}
