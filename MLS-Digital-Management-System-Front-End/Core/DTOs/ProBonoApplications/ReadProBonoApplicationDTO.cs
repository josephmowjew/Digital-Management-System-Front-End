using System.ComponentModel.DataAnnotations;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;

public class ReadProBonoApplicationDTO
{
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string NatureOfDispute { get; set; }

        [Required]
        public string CaseDetails { get; set; }

        public string CreatedById { get; set; }

        public ReadUserDTO CreatedBy { get; set; }

        public int ProbonoClientId { get; set; }

        public ReadProBonoClientDTO ProbonoClient { get; set; }

        public string ApplicationStatus { get; set; }

        public DateTime ApprovedDate { get; set; }

        public string DenialReason { get; set; }

        public string SummaryOfDispute { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
        public List<IFormFile>? Attachments { get; set; }

}