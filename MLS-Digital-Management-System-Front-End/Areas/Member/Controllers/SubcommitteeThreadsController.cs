using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class SubcommitteeThreadsController : Controller
    {
        private readonly IServiceRepository _service;
        public SubcommitteeThreadsController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public async Task<IActionResult> Index(int subcommitteeId)
        {
            await PopulateViewBags(subcommitteeId);
            return View();
        }

        private async Task PopulateViewBags(int subcommitteeId)
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.SubcommitteeId = subcommitteeId;
        }
    }
}
