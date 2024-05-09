using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Authorize]
    [Area("Secretariat")]
    public class ProBonoApplicationsController : Controller
    {
        private readonly IServiceRepository _service;
        public ProBonoApplicationsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {

            await PopulateViewBags();

            return View();
        }


        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;

            ViewBag.probonoClientsList = await GetProbonoClients();
            ViewBag.yearOperationsList = await GetYearOfOperations();
            
        }

        private async Task<List<SelectListItem>> GetIdentityTypes()
        {
            List<SelectListItem> identityTypes = new() { new SelectListItem() { Text = "---Select Identity Type---", Value = "" } };

            //get identity types from remote
            var identityTypesFromRemote =  await this._service.IdentityTypeService.GetAllIdentityTypesAsync();

            if (identityTypesFromRemote != null)
            {
                identityTypesFromRemote.ForEach(idType =>
                {
                    identityTypes.Add(new SelectListItem() { Text = idType.Name, Value = idType.Id.ToString() });
                });
            }

            return identityTypes;
        }
        private async Task<List<SelectListItem>> GetProbonoClients()
        {
            List<SelectListItem> probonoClientList = new() { new SelectListItem() { Text = "---Select Client---", Value = "" } };

            //get identity types from remote
            var probonoClientsFromRemote =  await this._service.ProbonoClientService.GetAllProBonoClientsAsync();

            if (probonoClientsFromRemote != null)
            {
                probonoClientsFromRemote.ForEach(client =>
                {
                    probonoClientList.Add(new SelectListItem() { Text = client.Name + " - "+client.NationalId, Value = client.Id.ToString() });
                });
            }

            return probonoClientList;
        }

         private async Task<List<SelectListItem>> GetYearOfOperations()
        {
            List<SelectListItem> yearOperationsList = new() { new SelectListItem() { Text = "---Select Year Of Operation---", Value = "" } };

            //get identity types from remote
            var yearsOfOperationFromRemote =  await this._service.YearOfOperationService.GetAllYearOfOperationsAsync();

            if (yearsOfOperationFromRemote != null)
            {
                yearsOfOperationFromRemote.ForEach(year =>
                {
                    yearOperationsList.Add(new SelectListItem() { Text = year.StartDate.ToString("yyyy") + " - "+ year.EndDate.ToString("yyyy"), Value = year.Id.ToString() });
                });
            }

            return yearOperationsList;
        }



    }
}
