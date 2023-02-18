using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DiscussipediA.Models;
using Microsoft.AspNetCore.Http;
using DiscussipediA.Services;
using DiscussipediA.VMs;

namespace DiscussipediA.Controllers
{

    public class HomeController : Controller
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HomeController(IHttpContextAccessor httpContextAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
        }

        // User sets their alias name with a cookie
        [HttpPost]
        public IActionResult Index(SiteUserVM siteUser)
        {
            CookieHelper cookieHelper = new CookieHelper(_httpContextAccessor, Request, Response);

            // some extra code to include session data
            if (siteUser.note != null)
            {
                HttpContext.Session.SetString("noteToSelf", siteUser.note);
            }
            // set the alias name if they didn't decide to make a note
            else if (siteUser.aliasName != null)
            {
                cookieHelper.Set("aliasName", siteUser.aliasName, 1000);
            }
            else
            {
                cookieHelper.Remove("aliasName");
            }

            



            // Redirect to GET method so cookie is read.
            return RedirectToAction("Index", "Home");
        }

        // reads cookie to display alias name if it exists 
        [HttpGet]
        public IActionResult Index()
        {
            CookieHelper cookieHelper = new CookieHelper(_httpContextAccessor, Request, Response);

            string aliasName = cookieHelper.Get("aliasName");
            ViewData["aliasName"] = aliasName;

            ViewData["noteToSelf"] = HttpContext.Session.GetString("noteToSelf");


            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
