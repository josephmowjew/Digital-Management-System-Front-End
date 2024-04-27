using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.Role;

public class CreateRoleDTO
{
    [StringLength(maximumLength: 100, MinimumLength = 2)]
    public string Name { get; set; }

    public string DataInvalid { get; set; } = "true";
}