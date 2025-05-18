using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Karpova_back_diplom.Data;
using Karpova_back_diplom.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.IO;

namespace Karpova_back_diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract([FromBody] CreateContractDto dto)
        {
            var user = await _context.users.FindAsync(dto.user_id);
            if (user == null)
                return NotFound("Пользователь не найден");

            var contractor = await _context.contractors.FindAsync(dto.contractor_id);
            if (contractor == null)
                return NotFound("Контрагент не найден");

            var license = await _context.licensing_authority.FindAsync(dto.authority);
            if (license == null)
                return NotFound("Орган лицензирования не найден");

            var contract = new Contract
            {
                name = dto.name,
                number_c = dto.number_c,
                valid_from = dto.valid_from.ToUniversalTime(),
                valid_to = dto.valid_to.ToUniversalTime(),
                contractor_id = dto.contractor_id,
                object_id = dto.object_id,
                license_number = dto.license_number,
                license_date = dto.license_date.ToUniversalTime(),
                authority = dto.authority,
                user_id = dto.user_id,
                date_of_change = DateTime.UtcNow,
                finished_action = false
            };

            _context.contracts.Add(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContractById), new { id = contract.id }, contract);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContractById(int id)
        {
            var contract = await _context.contracts
                .Include(c => c.contractor)
                .Include(c => c.license)
                .Include(c=>c.objects)
                .Include(c => c.user)
                .FirstOrDefaultAsync(c => c.id == id);

            if (contract == null)
                return NotFound();

            return contract;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetAllContracts()
        {
            var contracts = await _context.contracts
                .Include(c => c.contractor)
                .Include(c => c.license)
                .Include(c => c.user)
                .ToListAsync();

            return Ok(contracts);
        }

        [HttpGet("filtered")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetFilteredContracts([FromQuery] ContractFilterDto filters)
        {
            var query = _context.contracts
                .Include(c => c.services)
                    .ThenInclude(s => s.operation)
                .Include(c => c.services)
                    .ThenInclude(s => s.resource)
                .Include(c => c.services)
                    .ThenInclude(s => s.article)
                .Include(c => c.objects)
                .AsQueryable();

            if (filters.object_id.HasValue)
                query = query.Where(c => c.object_id == filters.object_id.Value);

            if (filters.operation_id.HasValue)
                query = query.Where(c => c.services.Any(s => s.operation_id == filters.operation_id.Value));

            if (filters.resource_id.HasValue)
                query = query.Where(c => c.services.Any(s => s.resource_id == filters.resource_id.Value));

            if (filters.article_id.HasValue)
                query = query.Where(c => c.services.Any(s => s.article_id == filters.article_id.Value));

            var result = await query.ToListAsync();

            return Ok(result);
        }

        [HttpGet("{id}/report")]
        public async Task<IActionResult> GetContractReport(int id)
        {
            var contract = await _context.contracts
                .Include(c => c.contractor)
                .Include(c => c.license)
                .Include(c => c.user)
                .Include(c => c.objects)
                .Include(c => c.services).ThenInclude(s => s.operation)
                .Include(c => c.services).ThenInclude(s => s.resource)
                .Include(c => c.services).ThenInclude(s => s.article)
                .FirstOrDefaultAsync(c => c.id == id);

            if (contract == null) return NotFound();

            var prices = await _context.prices
                .Where(p => p.contract_id == id)
                .ToListAsync();

            using var memStream = new MemoryStream();
            using (var doc = WordprocessingDocument.Create(memStream, WordprocessingDocumentType.Document, true))
            {
                var mainPart = doc.AddMainDocumentPart();
                mainPart.Document = new Document();
                var body = new Body();

                // Заголовок
                body.Append(new Paragraph(new ParagraphProperties(
                        new Justification { Val = JustificationValues.Center },
                        new SpacingBetweenLines { After = "200" }),
                    new Run(new RunProperties(new Bold(), new FontSize { Val = "28" }),
                        new Text($"ДОГОВОР №{contract.number_c}"))));

                // Основная информация
                string[] info = {
            $"Наименование: {contract.name}",
            $"Контрагент: {contract.contractor?.fullname}",
            $"Объект: {contract.objects?.name}",
            $"Период действия: {contract.valid_from:dd.MM.yyyy} — {contract.valid_to:dd.MM.yyyy}",
            $"Лицензия: №{contract.license_number} от {contract.license_date:dd.MM.yyyy}, выдана: {contract.license?.name}"
        };

                foreach (var line in info)
                    body.Append(new Paragraph(new Run(new Text(line))));

                body.Append(new Paragraph(new Run(new Text("")))); // отступ

                // Таблица: Услуги
                if (contract.services.Any())
                {
                    body.Append(new Paragraph(new Run(new Bold(), new Text("Услуги по договору:"))));
                    var serviceTable = CreateStyledTable(
                        new[] { "Операция", "Ресурс", "Статья", "Ед. изм.", "Наименование", "Цель" },
                        contract.services.Select(s => new[]
                        {
                    s.operation?.operation_name,
                    s.resource?.resource_name,
                    s.article?.article_name,
                    s.unit_of_measurement,
                    s.name,
                    s.aim
                        }));
                    body.Append(serviceTable);
                }

                // Таблица: Цены
                if (prices.Any())
                {
                    body.Append(new Paragraph(new Run(new Text(""))));
                    body.Append(new Paragraph(new Run(new Bold(), new Text("Цены по договору:"))));
                    var priceTable = CreateStyledTable(
                        new[] { "С", "По", "Цена (руб.)" },
                        prices.Select(p => new[]
                        {
                    p.valid_from.ToString("dd.MM.yyyy"),
                    p.valid_to.ToString("dd.MM.yyyy"),
                    p.price.ToString()
                        }));
                    body.Append(priceTable);
                }

                // Пустая строка
                body.Append(new Paragraph(new Run(new Text(""))));

                // Внизу: кто изменил
                body.Append(new Paragraph(new Run(new Text($"Изменено пользователем: {contract.user?.fullName ?? "-"}"))));
                body.Append(new Paragraph(new Run(new Text($"Дата изменения: {contract.date_of_change:dd.MM.yyyy}"))));

                mainPart.Document.Append(body);
                mainPart.Document.Save();
            }

            return File(memStream.ToArray(),
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                $"Отчёт_договор_{contract.number_c}.docx");
        }



        private Table CreateStyledTable(IEnumerable<string> headers, IEnumerable<string[]> rows)
        {
            var table = new Table();

            // Добавим границы таблицы
            var tableProps = new TableProperties(
                new TableBorders(
                    new TopBorder { Val = BorderValues.Single, Size = 7 },
                    new BottomBorder { Val = BorderValues.Single, Size = 7 },
                    new LeftBorder { Val = BorderValues.Single, Size = 7 },
                    new RightBorder { Val = BorderValues.Single, Size = 7 },
                    new InsideHorizontalBorder { Val = BorderValues.Single, Size = 7 },
                    new InsideVerticalBorder { Val = BorderValues.Single, Size = 7 }
                )
            );
            table.AppendChild(tableProps);

            // Заголовки
            var headerRow = new TableRow();
            foreach (var header in headers)
            {
                var cell = new TableCell(new Paragraph(
                    new Run(new RunProperties(new Bold()), new Text(header ?? "-"))));
                headerRow.Append(cell);
            }
            table.Append(headerRow);

            // Строки данных
            foreach (var rowValues in rows)
            {
                var row = new TableRow();
                foreach (var val in rowValues)
                {
                    var cell = new TableCell(new Paragraph(new Run(new Text(val ?? "-"))));
                    row.Append(cell);
                }
                table.Append(row);
            }

            return table;
        }


    }

    public class CreateContractDto
    {
        public string name { get; set; }
        public int number_c { get; set; }
        public DateTime valid_from { get; set; }
        public DateTime valid_to { get; set; }
        public int contractor_id { get; set; }

        public int object_id { get; set; }
        public string license_number { get; set; }
        public DateTime license_date { get; set; }
        public int authority { get; set; }
        public int user_id { get; set; }
    }

    public class ContractFilterDto
    {
        public int? object_id { get; set; }
        public int? operation_id { get; set; }
        public int? resource_id { get; set; }
        public int? article_id { get; set; }
    }



}
