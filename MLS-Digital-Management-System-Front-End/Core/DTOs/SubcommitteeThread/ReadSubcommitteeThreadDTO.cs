using MLS_Digital_Management_System_Front_End.Core.DTOs.User;
using System;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.SubcommitteeThread
{
    public class ReadSubcommitteeThreadDTO
    {
        public int SubcommitteeId { get; set; }
        public string Subject { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedById { get; set; }
        public ReadUserDTO CreatedBy { get; set; }
    }
}
