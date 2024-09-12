using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Stamp;

public class ReadStampDTO
{
    public string Id { get; set; }
    public string Name { get; set; }
    public int YearOfOperationId { get; set; }
    public List<ReadAttachmentDTO> Attachments { get; set; } = new List<ReadAttachmentDTO>();
}