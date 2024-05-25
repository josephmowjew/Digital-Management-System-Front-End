using MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalHistory;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.LicenseApprovalComment;

public class ReadLicenseApprovalCommentDTO
{
    public int Id { get; set; }
    public int ApprovalHistoryId { get; set; }
    public ReadLicenseApprovalHistoryDTO ApprovalHistory { get; set; }
    public string Comment { get; set; }
    public string CommentedById { get; set; }
    public ReadUserDTO CommentedBy { get; set; }
    public DateTime CommentDate { get; set; }
}