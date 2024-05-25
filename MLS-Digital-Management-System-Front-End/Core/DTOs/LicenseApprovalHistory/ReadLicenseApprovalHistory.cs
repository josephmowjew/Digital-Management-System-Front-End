
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalComment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalLevel;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;

 public class ReadLicenseApprovalHistoryDTO
    {
        public ReadLicenseApprovalHistoryDTO()
        {
            Comments = new List<ReadLicenseApprovalCommentDTO>();
        }

        public int Id { get; set; }
        public int LicenseApplicationId { get; set; }
        public ReadLicenseApplicationDTO LicenseApplication { get; set; }
        public DateTime ChangeDate { get; set; }
        public int ApprovalLevelId { get; set; }
        public ReadLicenseApprovalLevelDTO ApprovalLevel { get; set; }
        public string Status { get; set; }
        public string ChangedById { get; set; }
        public ReadUserDTO ChangedBy { get; set; }
        public virtual List<ReadLicenseApprovalCommentDTO> Comments { get; set; }

        
    }
