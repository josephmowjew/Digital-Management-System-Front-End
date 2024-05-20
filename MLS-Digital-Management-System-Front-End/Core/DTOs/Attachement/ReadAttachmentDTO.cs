
using MLS_Digital_Management_System_Front_End.Core.DTOs.AttachmentType;
namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
public class ReadAttachmentDTO
{
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public ReadAttachmentTypeDTO AttachmentType{ get; set; }
    public string AbsoluteFilePath { get; set; }
    public string PropertyName { get; set; }
}