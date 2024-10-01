using System;
using Newtonsoft.Json;

namespace Core.Models
{
    public class AuthData{
        
         [JsonProperty("tokenData")]
        public TokenData TokenData { get; set; }
    }
  // Models/TokenData.cs
    public class TokenData
    {
        [JsonProperty("user_id")]
        public string UserId { get; set; }
        [JsonProperty("token")]
        public string Token { get; set; }
        [JsonProperty("first_name")]
        public string FirstName { get; set; }
        [JsonProperty("last_name")]
        public string LastName { get; set; }
        [JsonProperty("role")]
        public string Role { get; set; }
        [JsonProperty("email")]
        public string Email { get; set; }
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
        [JsonProperty("token_expiry_minutes")]
        public DateTime TokenExpiryMinutes { get; set; }
        [JsonProperty("date_of_birth")]
        public DateTime? DateOfBirth { get; set; }
    }
}
