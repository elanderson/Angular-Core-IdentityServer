using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClientApp.Controllers
{
    public class IdentityController : Controller
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var apiCallUsingUserAccessToken = await ApiCallUsingUserAccessToken();
            ViewData["apiCallUsingUserAccessToken"] = apiCallUsingUserAccessToken.IsSuccessStatusCode ? await apiCallUsingUserAccessToken.Content.ReadAsStringAsync() : apiCallUsingUserAccessToken.StatusCode.ToString();

            var clientCredentialsResponse = await ApiCallUsingClientCredentials();
            ViewData["clientCredentialsResponse"] = clientCredentialsResponse.IsSuccessStatusCode ? await clientCredentialsResponse.Content.ReadAsStringAsync() : clientCredentialsResponse.StatusCode.ToString();

            return View();
        }

        private async Task<HttpResponseMessage> ApiCallUsingUserAccessToken()
        {
            var accessToken = await HttpContext.Authentication.GetTokenAsync("access_token");

            var client = new HttpClient();
            client.SetBearerToken(accessToken);

            return await client.GetAsync("http://localhost:5001/api/identity");
        }

        private async Task<HttpResponseMessage> ApiCallUsingClientCredentials()
        {
            var tokenClient = new TokenClient("http://localhost:5000/connect/token", "mvc", "secret");
            var tokenResponse = await tokenClient.RequestClientCredentialsAsync("apiApp");

            var client = new HttpClient();
            client.SetBearerToken(tokenResponse.AccessToken);

            return await client.GetAsync("http://localhost:5001/api/identity");
        }

        public async Task Logout()
        {
            await HttpContext.Authentication.SignOutAsync("Cookies");
            await HttpContext.Authentication.SignOutAsync("oidc");
        }
    }
}
