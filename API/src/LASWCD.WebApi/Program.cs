using LASWCD.CrossCutting.Extensions;
using LASWCD.Infrastructure.Extensions;
using LASWCD.Managers.Extensions;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LA SWCD API",
        Version = "v1"
    });
});

// Clean architecture layer registrations.
builder.Services.AddCrossCuttingServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddManagers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCrossCutting();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "LA SWCD API v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program;
