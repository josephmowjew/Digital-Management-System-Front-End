using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Thread;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    public class SubcommitteeMessagesController : Controller
    {
        private readonly IServiceRepository _service;
        public SubcommitteeMessagesController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }

        public async Task<IActionResult> Index(int threadId)
        {
            await PopulateViewBags(threadId);
            return View();
        }

        private async Task PopulateViewBags(int threadId)
        {
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            ViewBag.ThreadId = threadId;
            ViewBag.UserId = AuthHelper.GetUserId(HttpContext);
            ViewBag.ThreadSubject = (await this._service.SubcommitteeThreadService.GetSubcommitteeThreadByIdAsync(threadId)).Subject;
            ViewBag.SubcommitteeId = (await this._service.SubcommitteeThreadService.GetSubcommitteeThreadByIdAsync(threadId)).SubcommitteeId;
        }
    }
}
