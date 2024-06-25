using MLS_Digital_Management_System_Front_End.Core.DTOs.Committe;
using MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class CommitteeMembershipService: ICommitteeMembershipService
    {
        private readonly HttpClient _httpClient;
        public CommitteeMembershipService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ReadUserDTO>> GetAllNonMembersAsync(int committeeId)
        {
            // Retrieve all users
            var usersResponse = await _httpClient.GetAsync("api/users/getAll");
            usersResponse.EnsureSuccessStatusCode();
            var usersList = await usersResponse.Content.ReadFromJsonAsync<List<ReadUserDTO>>();

            // Retrieve all committee memberships for the given committeeId
            var membershipsResponse = await _httpClient.GetAsync($"api/CommitteeMembers/paged?committeeId={committeeId}");
            membershipsResponse.EnsureSuccessStatusCode();
            var committeeMemberships = await membershipsResponse.Content.ReadFromJsonAsync<List<ReadCommitteeMemberDTO>>();

            // Filter out users who are members of the committee
            var nonMembersList = usersList
                .Where(user => !committeeMemberships
                    .Select(cm => cm.MemberShipId)
                    .Contains(user.Id))
                .ToList();

            return nonMembersList;
        }
    }
}
