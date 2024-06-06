using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface IMemberService
{
    Task<List<ReadMemberDTO>> GetAllMembersAsync();

    Task<ReadMemberDTO> GetMemberByUserIdAsync(string id);

    //Task<ReadMemberDTO> AddMember(CreateMemberDTO createMemberDTO);
}
