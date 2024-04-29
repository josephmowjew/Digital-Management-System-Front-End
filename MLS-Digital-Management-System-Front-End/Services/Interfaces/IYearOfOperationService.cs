using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IYearOfOperationService
{
    Task<List<ReadYearOfOperationDTO>> GetAllYearOfOperationsAsync();
}