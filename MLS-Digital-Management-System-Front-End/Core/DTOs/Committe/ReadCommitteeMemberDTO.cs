using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Committe
{
    public class ReadCommitteeMemberDTO
    {
        public int CommitteeID { get; set; }

        public string MemberShipId { get; set; }

        public string Role { get; set; }
    }
}
