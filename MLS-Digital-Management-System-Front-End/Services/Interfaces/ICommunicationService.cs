using Microsoft.CodeAnalysis.Elfie.Serialization;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Communication;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ICommunicationService
{
    Task<ReadMessageDTO> GetCommunicationByIdAsync(int id);

}
