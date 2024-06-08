using MLS_Digital_Management_System_Front_End.Core.DTOs.Penalty;
using MLS_Digital_Management_System_Front_End.Core.DTOs.PenaltyPayment;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IPenaltyPaymentService
    {
        Task<List<ReadPenaltyPaymentDTO>> GetAllPenaltyPaymentsAsync();
    }
}
