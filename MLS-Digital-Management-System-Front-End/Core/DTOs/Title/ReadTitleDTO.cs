using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Title;

public class ReadTitleDTO
{
    public int Id { get; set; }
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    public string Name { get; set; }
}