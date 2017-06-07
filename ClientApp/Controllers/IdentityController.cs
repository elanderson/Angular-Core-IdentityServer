using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.AspNetCore.Mvc;

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

            var client = new HttpClient();
            client.SetBearerToken(tokenResponse.AccessToken);

            var apiResponse = await client.GetAsync("http://localhost:5001/api/identity");
            ViewData["apiResult"] = apiResponse.IsSuccessStatusCode ? await apiResponse.Content.ReadAsStringAsync() : apiResponse.StatusCode.ToString();

            return View();
        }
    }
}
