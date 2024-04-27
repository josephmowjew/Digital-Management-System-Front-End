using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Department;

public class UpdateDepartmentDTO
{
     public int Id { get; set; }
    [Required]
    [StringLength(maximumLength:150)]
    public string Name { get; set; } = string.Empty;
}