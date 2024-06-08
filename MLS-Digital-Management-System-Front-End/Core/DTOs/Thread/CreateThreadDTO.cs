using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Thread
{
    public class CreateThreadDTO
    {   [Display(Name = "Committee Name")]
        public int CommitteeId { get; set; }

        [Required]
        [StringLength(maximumLength: 150)]
        public string Subject { get; set; }
       
        
        
    }
}
