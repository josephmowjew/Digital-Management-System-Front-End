using MLS_Digital_Management_System_Front_End.Core.DTOs.Attachment;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MLS_Digital_Management_System_Front_End.Core.DTOs.CPDTraining;
public class ReadCPDTrainingDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public double Duration { get; set; }
    public DateTime DateToBeConducted { get; set; }
    public DateTime? RegistrationDueDate { get; set; }
    public int ProposedUnits { get; set; }
    public double? SeniorLawyerPhysicalAttendanceFee { get; set; }
    public double? SeniorLawyerVirtualAttendanceFee { get; set; }
    public double? JuniorLawyerPhysicalAttendanceFee { get; set; }
    public double? JuniorLawyerVirtualAttendanceFee { get; set; }
    public double? MemberPhysicalAttendanceFee { get; set; }
    public double? MemberVirtualAttendanceFee { get; set; }
    public double? NonMemberPhysicalAttendanceFee { get; set; }
    public double? NonMemberVirtualAttandanceFee { get; set; }
    public string? PhysicalVenue { get; set; }
    public int CPDUnitsAwarded { get; set; }
    public string? AccreditingInstitution { get; set; }
    public List<ReadAttachmentDTO> Attachments { get; set; } = new List<ReadAttachmentDTO>();
}

