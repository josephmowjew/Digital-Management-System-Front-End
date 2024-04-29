using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;

public class CreateProBonoApplicationDTO
{
        [Required, MaxLength(200)]
        [Display(Name = "Nature of Dispute")]
        public string NatureOfDispute { get; set; }

        [Required]
        [Display(Name = "Case Details")]
        public string CaseDetails { get; set; }
        [Required]
        [Display(Name = "Client")]
        public int ProbonoClientId { get; set; }
        [Display(Name = "Application Status")]
        public string ApplicationStatus { get; set; }

        public DateTime ApprovedDate { get; set; }

        [StringLength(200)]
        public string DenialReason { get; set; }
        [Display(Name = "Summary of Dispute")]
        public string SummaryOfDispute { get; set; }
        [Display(Name = "Year of Operation")]
        public int YearOfOperationId { get; set; }

        public ICollection<IFormFile> Attachments { get; set; }  
}