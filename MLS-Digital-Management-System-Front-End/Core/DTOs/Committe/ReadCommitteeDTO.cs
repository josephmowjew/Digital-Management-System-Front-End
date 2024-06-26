using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Committe
{
    public class ReadCommitteeDTO
    {
        public int Id { get; set; }
        public string CommitteeName { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public int? ChairpersonID { get; set; }
        public int YearOfOperationId { get; set; }
        public ReadYearOfOperationDTO YearOfOperation { get; set; }
    }
}
