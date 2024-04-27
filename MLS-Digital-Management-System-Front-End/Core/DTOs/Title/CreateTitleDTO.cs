using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Title;

public class CreateTitleDTO
{
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    public string Name { get; set; }
}