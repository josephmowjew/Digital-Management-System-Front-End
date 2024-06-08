using Microsoft.AspNetCore.Mvc;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Secretariat.Controllers
{
    [Area("Secretariat")]
    public class PenaltyTypesController : Controller
    {
        private readonly IServiceRepository _service;

        public PenaltyTypesController(IServiceRepository serviceRepository)
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
            ViewBag.YearOfOperation = await GetCurrentYearOfOperationAsync();
            //ViewBag.membersList = await GetAllMembersAsync();
            //ViewBag.penaltyTypeList = await GetAllPenaltiesAsync();
            //ViewBag.yearOperationsList = await GetYearOfOperations();
        }

        private async Task<ReadYearOfOperationDTO> GetCurrentYearOfOperationAsync()
        {
            return await this._service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }
    }
}
