using System.Threading.Tasks;

namespace IdentityApp.Services
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
