using MLS_Digital_Management_System_Front_End.Core.DTOs.Member;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services;

public class MemberService : IMemberService
{

    private readonly HttpClient _httpClient;

    public MemberService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async  Task<List<ReadMemberDTO>> GetAllMembersAsync()
    {
        var response = await _httpClient.GetAsync($"api/Members/getAll");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<List<ReadMemberDTO>>();
            return responseData;
        }
        else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
   

            return null;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get members");
        }
    }

    public async Task<ReadMemberDTO> GetMemberByUserIdAsync(string id)
    {
        var response = await _httpClient.GetAsync($"api/Members/getByUserId/{id}");
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadFromJsonAsync<ReadMemberDTO>();
            return responseData;
        }
        else if(response.StatusCode == System.Net.HttpStatusCode.NotFound) {

            return null;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get member with ID {id}.");
        }
    }

    public async Task<int> GetMembersCount(){
        var response = await _httpClient.GetAsync($"api/Members/count");
        if (response.IsSuccessStatusCode)
        {
            var count = await response.Content.ReadFromJsonAsync<int>();
            return count;
        }
        else
        {
            throw new InvalidOperationException($"Failed to get Member count");
        }
    }

}
