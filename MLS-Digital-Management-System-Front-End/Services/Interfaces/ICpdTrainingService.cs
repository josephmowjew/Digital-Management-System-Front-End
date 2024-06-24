using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ICpdTrainingService
{
    //Task<List<ReadMemberDTO>> GetAllCpdTrainingsAsync();



    Task<ReadCPDTrainingDTO> GetCpdTrainingByIdAsync(int id);

    //Task<ReadMemberDTO> AddMember(CreateMemberDTO createMemberDTO);
}
