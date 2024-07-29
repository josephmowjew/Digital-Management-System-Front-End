using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.SubcommitteeThread
{
    public class CreateSubcommitteeThreadDTO
    {
        [Display(Name = "Subcommittee Name")]
        public int SubcommitteeId { get; set; }

        [Required]
        [StringLength(maximumLength: 150)]
        public string Subject { get; set; }
    }
}
