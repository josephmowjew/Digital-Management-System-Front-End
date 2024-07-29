using MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Services
{
    public class SubcommitteeMembershipService : ISubcommitteeMembershipService
    {
        private readonly HttpClient _httpClient;

        public SubcommitteeMembershipService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ReadUserDTO>> GetAllNonMembersAsync(int subcommitteeId)
        {
            // Retrieve all users
            var usersResponse = await _httpClient.GetAsync("api/users/getAll");
            usersResponse.EnsureSuccessStatusCode();
            var usersList = await usersResponse.Content.ReadFromJsonAsync<List<ReadUserDTO>>();

            // Retrieve all subcommittee memberships for the given subcommitteeId
            var membershipsResponse = await _httpClient.GetAsync($"api/SubcommitteeMembership/paged?subcommitteeId={subcommitteeId}");
            membershipsResponse.EnsureSuccessStatusCode();
            var subcommitteeMemberships = await membershipsResponse.Content.ReadFromJsonAsync<List<ReadSubcommitteeMembershipDTO>>();

            // Filter out users who are members of the subcommittee
            var nonMembersList = usersList
                .Where(user => !subcommitteeMemberships
                    .Select(sm => sm.MembershipId)
                    .Contains(user.Id))
                .ToList();

            return nonMembersList;
        }
    }
}
