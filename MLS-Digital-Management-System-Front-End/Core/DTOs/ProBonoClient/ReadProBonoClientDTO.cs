using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;

public class ReadProBonoClientDTO
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string PostalAddress { get; set; }

    public string PermanentAddress { get; set; }

    public string ResidentialAddress { get; set; }

    public string PhoneNumber { get; set; }

    public string OtherContacts { get; set; }

    public string Occupation { get; set; }

    public decimal AnnualIncome { get; set; }

    public string NationalId { get; set; }
}
