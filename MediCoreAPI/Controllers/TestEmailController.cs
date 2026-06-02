using MediCoreAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MediCoreAPI.Controllers
{
  [ApiController]
  [Route("api/test-email")]
  public class TestEmailController : ControllerBase
  {
    private readonly EmailService _email;

    public TestEmailController(EmailService email)
    {
      _email = email;
    }

    [HttpGet]
    public async Task<IActionResult> Send()
    {
      await _email.SendAsync(
          "jabniumakej@gamil.com",
          "Test MediCore",
          "<h1>Email works 🚀</h1>"
      );

      return Ok("Email sent");
    }
  }
}
