using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee
{
    public class ReadSubcommitteeMembershipDTO
    {
        public int SubcommitteeID { get; set; }

        public string MembershipId { get; set; }

        public string Role { get; set; }
    }
}
