using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Department;

public class CreateDepartmentDTO
{
    [Required]
    [StringLength(maximumLength:150)]
    public string Name { get; set; }
}