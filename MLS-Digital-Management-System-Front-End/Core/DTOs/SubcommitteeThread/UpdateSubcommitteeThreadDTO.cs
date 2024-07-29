using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.SubcommitteeThread
{
    public class UpdateSubcommitteeThreadDTO
    {
        public int Id { get; set; }

        [Display(Name = "Subcommittee Name")]
        public int SubcommitteeId { get; set; }

        [Required]
        [StringLength(150)]
        public string Subject { get; set; }
    }
}
