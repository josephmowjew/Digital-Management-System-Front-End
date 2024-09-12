using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApplication;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.License;


    public class ReadLicenseDTO
    {
        public int Id { get; set; }
        public string LicenseNumber { get; set; }
        public int MemberId { get; set; }
        public ReadMemberDTO Member { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
        public int LicenseApplicationId { get; set; }
        public ReadLicenseApplicationDTO LicenseApplication { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<ReadAttachmentDTO> Attachments { get; set; } = new List<ReadAttachmentDTO>();
    }

