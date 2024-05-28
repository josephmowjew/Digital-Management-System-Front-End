

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ICpdUnitsEarnedService
{
   
    Task<int> GetCpdSummedUnitsEarnedById(int id);
    
}
