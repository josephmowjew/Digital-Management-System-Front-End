using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Thread
{
    public class UpdateThreadDTO
    {
        public int Id { get; set; }
        [Display(Name = "Committee Name")]
        public int CommitteeId { get; set; }

        [Required]
        [StringLength(150)]
        public string Subject { get; set; }
       
   
       
    }
}
