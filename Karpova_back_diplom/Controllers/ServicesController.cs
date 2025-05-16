using Karpova_back_diplom.Data;
using Karpova_back_diplom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{contractId}")]
        public async Task<ActionResult<Services>> CreateService(
            int contractId,
            [FromBody] CreateServicesDto dto)
        {

            // Проверка существования договора из URL
            var contract = await _context.contracts
                .FirstOrDefaultAsync(c => c.id == contractId);
            if (contract == null) return NotFound("Договор не найден");

            // Проверка остальных связанных сущностей
            var operation = await _context.operations.FindAsync(dto.operation_id);
            if (operation == null) return NotFound("Операция не найдена");

            var resource = await _context.resources.FindAsync(dto.resource_id);
            if (resource == null) return NotFound("Ресурс не найден");

            var article = await _context.articles.FindAsync(dto.article_id);
            if (article == null) return NotFound("Статья не найдена");

            var user = await _context.users.FindAsync(dto.user_id);
            if (user == null) return NotFound("Пользователь не найден");

            // Создание услуги
            var service = new Services
            {
                operation_id = dto.operation_id,
                resource_id = dto.resource_id,
                article_id = dto.article_id,
                unit_of_measurement = dto.unit_of_measurement,
                name = dto.name,
                aim = dto.aim,
                contract_id = contractId, // Берём из URL
                date_of_change = DateTime.UtcNow,
                user_id = dto.user_id
            };

            _context.services.Add(service);
            await _context.SaveChangesAsync();

            // Возвращаем созданную услугу с полными данными
            var createdService = await _context.services
                .Include(s => s.operation)
                .Include(s => s.resource)
                .Include(s => s.article)
                .Include(s => s.contract)
                .Include(s => s.user)
                .FirstOrDefaultAsync(s => s.id == service.id);

            return Ok(createdService);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Services>>> GetAllServices()
        {
            var services = await _context.services
                .Include(s => s.operation)
                .Include(s => s.resource)
                .Include(s => s.article)
                .Include(s => s.contract)
                .Include(s => s.user)
                .ToListAsync();

            return Ok(services);
        }
    }

    public class CreateServicesDto
    {
        public int operation_id { get; set; }
        public int resource_id { get; set; }
        public int article_id { get; set; }
        public required string unit_of_measurement { get; set; }
        public required string name { get; set; }
        public required string aim { get; set; }
        public int user_id { get; set; }
    }
}