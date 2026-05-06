// gives access to IdentityDbContext and ApplicationUser class
using CharacterCreator.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;



namespace CharacterCreator.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
    //tells EF core to create/manage characters table
    public DbSet<Character> Characters => Set<Character>();
}