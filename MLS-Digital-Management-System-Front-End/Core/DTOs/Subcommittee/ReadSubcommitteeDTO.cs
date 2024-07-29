using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using System;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Subcommittee
{
    public class ReadSubcommitteeDTO
    {
        public int Id { get; set; }
        public string SubcommitteeName { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public int? ChairpersonID { get; set; }
        public int CommitteeId { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
    }
}
