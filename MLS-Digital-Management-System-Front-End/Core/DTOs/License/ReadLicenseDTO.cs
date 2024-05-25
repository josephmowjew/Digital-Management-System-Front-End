namespace MLS_Digital_Management_System_Front_End.Core.DTOs.License;


 public class ReadMemberDTO
    {
        public int Id { get; set; }

        public string UserId { get; set; }

       
        public string PostalAddress { get; set; }

  
        public string PermanentAddress { get; set; }

    
        public string ResidentialAddress { get; set; }

        public DateOnly DateOfAdmissionToPractice { get; set; }

        //public List<DataStore.Core.DTOs.QualificationType.ReadQualificationTypeDTO> QualificationTypes { get; set; }

        //public List<DataStore.Core.DTOs.ProBono.ReadProBonoDTO> ProBonos { get; set; }

        //public ReadUserDTO User { get; set; }

        //public int FirmId { get; set; }
        //public ReadFirmDTO Firm { get; set; }
        //public List<ReadLicenseDTO> Licenses { get; set; }

        //public ReadLicenseDTO CurrentLicense { get; set; }
    }

