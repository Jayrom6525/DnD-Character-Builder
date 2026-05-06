// place class in models folder so other API can import cleanly
namespace CharacterCreator.Api.Models;

// defines shape of character data in database and API responses
public class Character
{
    public int Id { get; set; }

    //ID fields
    public string Name { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public string Race { get; set; } = string.Empty;
    public int Level { get; set; } = 1;

    // Links the character to the logged-in user
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}