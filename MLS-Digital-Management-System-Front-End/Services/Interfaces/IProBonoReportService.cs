namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
    public interface IProBonoReportService
    {
        Task<double> GetProBonoHoursTotalAsync();
    }
}
