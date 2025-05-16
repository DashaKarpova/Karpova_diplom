using Karpova_back_diplom.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Models;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArticleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetLicenseAuthorities()
        {
            return await _context.articles.ToListAsync();
        }
    }
}
