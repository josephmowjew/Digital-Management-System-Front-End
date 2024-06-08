
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Message
{
    public class UpdateMessageDTO
    {
        public int Id { get; set; }

        public int CommitteeId { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }

        [Required]
        [StringLength(300)]
        public string Content { get; set; }

        public List<IFormFile>? Attachments { get; set; }

        public int? ThreadID { get; set; }
    }
}
