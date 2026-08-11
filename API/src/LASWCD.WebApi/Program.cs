using LASWCD.Infrastructure.Extensions;
using LASWCD.Managers.Extensions;
using LASWCD.WebApi.Middleware;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LA SWCD API",
        Version = "v1"
    });
});

// Clean architecture layer registrations.
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddManagers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Enabled in all environments (including the production container) so the API stays self-documenting
// wherever it's deployed, not just in local development.
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "LA SWCD API v1");
});

app.UseHttpsRedirection();

// Serves the React production build published into wwwroot alongside the API.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

// Requests that don't match a controller, Swagger, or a static file fall back to the SPA's index.html
// so client-side routing (React Router) can handle them.
app.MapFallbackToFile("index.html");

app.Run();

public partial class Program;
