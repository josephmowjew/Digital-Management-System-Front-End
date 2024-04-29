using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;

public class UpdateProBonoApplicationDTO
{
    public int Id { get; set; }

        [Required, MaxLength(200)]
        public string NatureOfDispute { get; set; }

        [Required]
        public string CaseDetails { get; set; }

        public int ProbonoClientId { get; set; }

        public string ApplicationStatus { get; set; }

        [StringLength(200)]
        public string DenialReason { get; set; }

        public string SummaryOfDispute { get; set; }
        public int YearOfOperationId { get; set; }

        public ICollection<IFormFile> Attachments { get; set; } = new List<IFormFile>(); 

}