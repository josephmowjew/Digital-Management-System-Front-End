using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.User;

public class ReadUserDTO{
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string OtherName { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string IdentityNumber { get; set; }
        public DateOnly IdentityExpiryDate { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public int DepartmentId { get; set; }
        public int IdentityTypeId { get; set; }
        public int TitleId { get; set; }
        public int CountryId { get; set; }
        public string RoleName { get; set; }
        public string Email { get; set; }
        public DateOnly LastLogin { get; set; }
        public DateOnly CreatedDate { get; set; }
        public string FullName { get; set; }
        public List<ReadAttachmentDTO> ProfilePictures { get; set; } = new List<ReadAttachmentDTO>();
}