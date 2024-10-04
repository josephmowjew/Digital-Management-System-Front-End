
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.NotariesPublic
{
    public class UpdateNotariesPublicDTO
    {
        public int Id { get; set; }

        [Display(Name = "Member")]
        public int MemberId { get; set; }

        [Required]
        [Display(Name = "Practicing Year")]
        public int YearOfOperationId { get; set; }

        [Display(Name = "Attachment")]
        public List<IFormFile>? Attachments { get; set; }
    }
}
