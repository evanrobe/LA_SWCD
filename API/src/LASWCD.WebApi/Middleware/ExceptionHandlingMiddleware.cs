using Microsoft.AspNetCore.Mvc;

// Global catch-all for unhandled exceptions anywhere later in the request pipeline.
namespace LASWCD.WebApi.Middleware;

/// <summary>Logs unhandled exceptions and converts them into a generic 500 ProblemDetails response.</summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    /// <summary>Runs the rest of the pipeline, catching and translating any unhandled exception into a JSON error response.</summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);

            if (context.Response.HasStarted)
            {
                throw;
            }

            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "An unexpected error occurred.",
                Detail = "Please contact support if the problem persists.",
                Instance = context.Request.Path
            };

            context.Response.StatusCode = problemDetails.Status.Value;
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
