using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.Thread;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;

namespace MLS_Digital_Management_System_Front_End.Areas.CEO.Controllers
{
    [Area("CEO")]
    public class MessagesController : Controller
    {
        private readonly IServiceRepository _service;
        public MessagesController(IServiceRepository serviceRepository)
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
            ViewBag.ThreadSubject = (await this._service.ThreadService.GetThreadByIdAsync(threadId)).Subject;
        }


        
    }
}
