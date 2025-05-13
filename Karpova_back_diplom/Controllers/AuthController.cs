using Karpova_back_diplom.Data;
using Karpova_back_diplom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login([FromBody] LoginDto dto)
        {
            var user = await _context.users.FirstOrDefaultAsync(u => u.login == dto.Login);

            if (user == null || user.password != dto.Password) // упрощённая проверка
                return Unauthorized("Неверный логин или пароль");

            return Ok(user);
        }
    }

    public class LoginDto
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}
