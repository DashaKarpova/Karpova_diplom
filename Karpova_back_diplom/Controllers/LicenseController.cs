using Karpova_back_diplom.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseAuthoritiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LicenseAuthoritiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<License>>> GetLicenseAuthorities()
        {
            return await _context.licensing_authority.ToListAsync();
        }
    }
}
