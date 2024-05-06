
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace MLS_Digital_Management_System_Front_End.Core.Middleware;
public class ExternalAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public ExternalAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check if the request is for a callback from the external authentication provider
        if (Context.Request.Path.HasValue && Context.Request.Path.Value.EndsWith("/ExternalLoginCallback", StringComparison.OrdinalIgnoreCase))
        {
            // Get the external authentication information
            var result = await Context.AuthenticateAsync("Identity.External");
            if (result?.Principal != null && result.Succeeded)
            {
                // Extract user claims from the external authentication principal
                var claims = result.Principal.Claims.ToList();

                // Add any custom claims or logic here if needed

                // Create an identity for the user
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return AuthenticateResult.Success(ticket);
            }
            else
            {
                return AuthenticateResult.Fail("External authentication failed.");
            }
        }

        // Return NoResult for requests that are not for the callback URL
        return AuthenticateResult.NoResult();
    }
}
