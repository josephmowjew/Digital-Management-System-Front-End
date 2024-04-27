using System.Threading.Tasks;
using Core.Models;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces
{
  public interface IAuthenticationService
  {
    Task<AuthData> LoginAsync(string email, string password);
  }
}
