
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Thread
{
    public class ReadThreadDTO
    {
        public int CommitteeId { get; set; }
        public string Subject { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedById { get; set; }
        public ReadUserDTO CreatedBy { get; set; }
    }
}
