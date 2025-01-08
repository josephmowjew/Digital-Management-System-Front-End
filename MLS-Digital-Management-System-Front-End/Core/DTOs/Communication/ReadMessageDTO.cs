using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Communication
{
    public class ReadMessageDTO
    {
        public string Subject { get; set; }
        public string Body { get; set; }

        public List<string> TargetedRoles { get; set; }
        public List<string> TargetedDepartments { get; set; }
        public List<ReadAttachmentDTO> Attachments { get; set; } = new List<ReadAttachmentDTO>();
    }
}