using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ClientApp.Controllers
{
    public class IdentityController : Controller
    {
        public async Task<IActionResult> Index()
        {
            var discovery = await DiscoveryClient.GetAsync("http://localhost:5000");

            var tokenClient = new TokenClient(discovery.TokenEndpoint, "clientApp", "secret");
            var tokenResponse = await tokenClient.RequestClientCredentialsAsync("apiApp");

            ViewData["tokenResult"] = tokenResponse.IsError ? tokenResponse.Error : tokenResponse.Json.ToString();

            return View();
        }
    }
}
