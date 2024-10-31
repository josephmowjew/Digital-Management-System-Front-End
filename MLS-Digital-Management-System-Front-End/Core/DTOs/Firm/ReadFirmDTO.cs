using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Firm;

public class ReadFirmDTO
{
    public ReadFirmDTO()
    {
        Users = new List<ReadUserDTO>();
    }

    public int Id { get; set; }

    public string Name { get; set; }

    public string PostalAddress { get; set; }

    public string PhysicalAddress { get; set; }

    public string PrimaryContactPerson { get; set; }

    public string PrimaryPhoneNumber { get; set; }

    public string SecondaryContactPerson { get; set; }

    public string SecondaryPhoneNumber { get; set; }
    public string? CreatedById { get; set; }
    public string? CustomerId { get; set; }

    public ICollection<ReadUserDTO> Users { get; set; }
}