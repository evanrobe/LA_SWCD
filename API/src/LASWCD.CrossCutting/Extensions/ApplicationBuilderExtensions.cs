using LASWCD.CrossCutting.Middleware;
using Microsoft.AspNetCore.Builder;

namespace LASWCD.CrossCutting.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseCrossCutting(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
