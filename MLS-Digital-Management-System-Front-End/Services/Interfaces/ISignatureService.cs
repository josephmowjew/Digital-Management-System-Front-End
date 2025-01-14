
using MLS_Digital_Management_System_Front_End.Core.DTOs.Signature;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ISignatureService
{
    Task<ReadSignatureDTO> GetSignatureByIdAsync(int signatureId);
    Task<ReadSignatureDTO> GetSignatureByNameAsync(string name);
}
