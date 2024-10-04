using System;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.NotariesPublic
{
    public class ReadNotariesPublicDTO
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int YearOfOperationId { get; set; }
        public List<string> AttachmentPaths { get; set; }
    }
}
