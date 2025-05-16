using Karpova_back_diplom.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OperationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Operation>>> GetLicenseAuthorities()
        {
            return await _context.operations.ToListAsync();
        }
    }
}