using System.ComponentModel.DataAnnotations;
using MLS_Digital_Management_System_Front_End.Core.DTOs.User;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Department;

public class ReadDepartmentDTO
{
    public int Id { get; set; }
    [Required]
    [StringLength(maximumLength:150)]
    public string Name { get; set; } = string.Empty;
    //add association to ApplicationUser
    public ICollection<ReadUserDTO> Users { get; set; }
}