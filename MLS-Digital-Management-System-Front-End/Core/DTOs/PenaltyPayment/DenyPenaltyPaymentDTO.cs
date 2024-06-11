using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyPayment;

public class DenyPenaltyPaymentDTO
{   [Required]
    public int PenaltyPaymentId { get; set; }
    [Required, MaxLength(255)]
    public string Reason { get; set; }
}