using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoClient;


 public class CreateProBonoClientDTO
{
        [Required, MaxLength(50)]
        public string Name { get; set; }

        [Required, MaxLength(250)]
        [Display(Name = "Postal Address")]
        public string PostalAddress { get; set; }

        [Required, MaxLength(250)]
        [Display(Name = "Permanent Address")]
        public string PermanentAddress { get; set; }

        [Required, MaxLength(250)]
        [Display(Name = "Residential Address")]
        public string ResidentialAddress { get; set; }

        [Required, MaxLength(20)]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; }

        [MaxLength(150)]
        [Display(Name = "Other Contacts")]
        public string OtherContacts { get; set; }

        [Required, MaxLength(150)]
        public string Occupation { get; set; }

        [Required, Range(0, double.MaxValue)]
        [Display(Name = "Annual Income")]
        public decimal AnnualIncome { get; set; }
        [Required]
        [StringLength(maximumLength:30)]
        [Display(Name = "National Id")]
        public string  NationalId { get; set; }
}
