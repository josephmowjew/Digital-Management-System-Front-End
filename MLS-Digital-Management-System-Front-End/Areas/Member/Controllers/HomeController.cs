﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MLS_Digital_Management_System_Front_End.Core.DTOs.ProBonoApplications;
using MLS_Digital_Management_System_Front_End.Core.DTOs.YearOfOperation;
using MLS_Digital_Management_System_Front_End.Helpers;
using MLS_Digital_Management_System_Front_End.Services.Interfaces;


namespace MLS_Digital_Management_System_Front_End.Areas.Member.Controllers
{
    [Area("Member")]
    [Authorize (Roles = "member")]
    public class HomeController : Controller
    {
        private readonly IServiceRepository _service;
        public HomeController(IServiceRepository serviceRepository)
        {
            _service = serviceRepository;
        }
        public async Task<IActionResult> Index()
        {
            string token = this.GetToken();
            this._service.Token = token;
            ViewBag.summedUnits = await this.GetSummedCPDUnits();
            ViewBag.proBonoApplicationsTotal = await this.GetProBonoApplications();
            ViewBag.cpdTrainingsCount = await this.GetTotalCpdTrainings();
            ViewBag.proBonoHours = await this.GetTotalProBonoHours();
            ViewBag.licensedMembers = await this.GetLicensedMembersCount();
            ViewBag.currentYear = await CurrentYearOfOperation();
            ViewBag.userId = HttpContext.Request.Cookies["UserId"];
            return View();
        }

        public async Task<IActionResult> Profile()
        {


            await PopulateViewBags();

            return View();
        }

        public async Task<IActionResult> ViewMember()
        {
            await PopulateViewBagsMinimal();

            //get member record to pass to the view
            var member = await _service.MemberService.GetMemberByUserIdAsync(HttpContext.Request.Cookies["UserId"]);

            ViewBag.member = member;

            ViewBag.memberId = member?.Id;

            ViewBag.firms = await this.GetAllFirms();

            return View();
        }


        private async Task PopulateViewBags()
        {
            //get the token
            string token = AuthHelper.GetToken(HttpContext);
            ViewBag.token = token;
            this._service.Token = token;
            //get identity types
            ViewBag.identityTypesList = await GetIdentityTypes();
            ViewBag.personalTitlesList = await GetPersonalTitles();
            ViewBag.rolesList = await GetRoles();
            ViewBag.departmentsList = await GetDepartments();
            ViewBag.countriesList = await GetCountries();
            ViewBag.qualificationTypesList = await GetQualificationTypes();
            ViewBag.currentYear = await CurrentYearOfOperation();

            ViewBag.userId = HttpContext.Request.Cookies["UserId"];

            ViewBag.username = await _service.UserService.GetUserByIdAsync(HttpContext.Request.Cookies["UserId"]);

            ViewBag.roleName = HttpContext.Request.Cookies["RoleName"];
        }

        private async Task PopulateViewBagsMinimal()
        {
            //get the token
            string token = this.GetToken();
            ViewBag.token = token;
            this._service.Token = token;

            ViewBag.userId = HttpContext.Request.Cookies["UserId"];
            ViewBag.roleName = HttpContext.Request.Cookies["RoleName"];

            ViewBag.qualificationTypesList = await GetQualificationTypes();
        }


        private string GetToken()
        {
            return AuthHelper.GetToken(HttpContext);

        }
        private async Task<List<SelectListItem>> GetIdentityTypes()
        {
            List<SelectListItem> identityTypes = new() { new SelectListItem() { Text = "---Select Identity Type---", Value = "" } };

            //get identity types from remote
            var identityTypesFromRemote = await this._service.IdentityTypeService.GetAllIdentityTypesAsync();

            if (identityTypesFromRemote != null)
            {
                identityTypesFromRemote.ForEach(idType =>
                {
                    identityTypes.Add(new SelectListItem() { Text = idType.Name, Value = idType.Id.ToString() });
                });
            }

            return identityTypes;
        }
        private async Task<List<SelectListItem>> GetQualificationTypes()
        {
            List<SelectListItem> qualificationTypesList = new() { new SelectListItem() { Text = "---Select Qualification Type---", Value = "" } };

            //get identity types from remote
            var qualificationTypeFromRemote = (await this._service.QualificationTypeService.GetAllAsync()).ToList();

            if (qualificationTypeFromRemote != null)
            {
                qualificationTypeFromRemote.ForEach(q =>
                {
                    qualificationTypesList.Add(new SelectListItem() { Text = q.Name, Value = q.Id.ToString() });
                });
            }

            return qualificationTypesList;
        }

        private async Task<List<SelectListItem>> GetAllFirms()
        {
            List<SelectListItem> firmsList = new() { new SelectListItem() { Text = "---Select Firm---", Value = "" } };

            var firmsFromRemote = await this._service.FirmService.GetAllFirmsAsync();
            if (firmsFromRemote != null)
            {
                firmsFromRemote.ForEach(f =>
                {
                    firmsList.Add(new SelectListItem() { Text = f.Name, Value = f.Id.ToString() });
                });
            }
            return firmsList;
        }


        private async Task<List<SelectListItem>> GetPersonalTitles()
        {
            List<SelectListItem> personalTitlesList = new() { new SelectListItem() { Text = "---Select Title---", Value = "" } };
            //get identity types from remote
            var titlesFromRemote = await this._service.TitleService.GetAllTitlesAsync();

            if (titlesFromRemote != null)
            {
                titlesFromRemote.ForEach(title =>
                {
                    personalTitlesList.Add(new SelectListItem() { Text = title.Name, Value = title.Id.ToString() });
                });
            }
            return personalTitlesList;
        }

        private async Task<List<SelectListItem>> GetRoles()
        {
            List<SelectListItem> rolesList = new() { new SelectListItem() { Text = "---Select Role---", Value = "" } };
            //get identity types from remote
            var rolesFromRemote = await this._service.RoleService.GetAllRolesAsync();

            if (rolesFromRemote != null)
            {
                rolesFromRemote.ForEach(role =>
                {
                    rolesList.Add(new SelectListItem() { Text = role.Name, Value = role.Name.ToString() });
                });
            }
            return rolesList;
        }

        private async Task<List<SelectListItem>> GetDepartments()
        {
            List<SelectListItem> departmentsList = new() { new SelectListItem() { Text = "---Select Departments---", Value = "" } };
            //get identity types from remote
            var departmentsFromRemote = await this._service.DepartmentService.GetAllDepartmentsAsync();

            if (departmentsFromRemote != null)
            {
                departmentsFromRemote.ForEach(department =>
                {
                    departmentsList.Add(new SelectListItem() { Text = department.Name, Value = department.Id.ToString() });
                });
            }
            return departmentsList;
        }
        private async Task<List<SelectListItem>> GetCountries()
        {
            List<SelectListItem> countriesList = new() { new SelectListItem() { Text = "---Select Country---", Value = "" } };
            //get countries  from remote
            var countriesFromRemote = await this._service.CountryService.GetCountries();

            if (countriesFromRemote != null)
            {
                countriesFromRemote.ForEach(country =>
                {
                    countriesList.Add(new SelectListItem() { Text = country.Name, Value = country.Id.ToString() });
                });
            }
            return countriesList;
        }

        private async Task<int> GetSummedCPDUnits()
        {
            var member = await _service.MemberService.GetMemberByUserIdAsync(HttpContext.Request.Cookies["UserId"]);

            if (member == null)
            {
                return 0;
            }

            //get member record to pass to the view
            var summedUnits = await _service.CpdUnitsEarnedService.GetCpdSummedUnitsEarnedById(member.Id);

            return summedUnits;
        }

        private async Task<int> GetProBonoApplications()
        {
            var proBonoApplication = await _service.ProBonoApplicationService.GetProBonoApplicationCountAsync();

            return proBonoApplication;
        }

        private async Task<int> GetTotalCpdTrainings()
        {
            var totalCpdTrainings = await _service.CpdTrainingRegistrationService.GetCpdTrainingsAttendedCountAsync();

            return totalCpdTrainings;
        }

        private async Task<double> GetTotalProBonoHours()
        {
            var totalProBonoHours = await _service.ProBonoReportService.GetProBonoHoursTotalAsync();

            return totalProBonoHours;
        }

        private async Task<ReadYearOfOperationDTO> CurrentYearOfOperation()
        {
            return await _service.YearOfOperationService.GetCurrentYearOfOperationAsync();
        }

        private async Task<int> GetLicensedMembersCount()
        {
            var memberCount = await _service.MemberService.GetLicensedMembersCount();
            return memberCount;
        }


    }
}
