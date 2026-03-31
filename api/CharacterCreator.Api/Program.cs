//This is the start up scipt for the backend API 

//imports bringing classes iinto scope 
//Data gives access to database context
using CharacterCreator.Api.Data;
//model gives access to Application User class
using CharacterCreator.Api.Models;
//Identity and FramworkCore bring authencation and SQL features
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

//Create builder for web app, swagger gives testing UI and API docs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//database context configuration, tells app to use SQL server and connection string from config file
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//sets identity system, store and create tables in database 
builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireDigit = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

//authentication and authorization
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
builder.Services.AddAuthorization();

//Cores policy for react frontend
//browser security blocks cross origin requests by default, this allows requests from frontend to backend
builder.Services.AddCors(options =>
{
    //Policy allows React app origin, any header, any method, and credentials like cookies or auth tokens, browser to API 
    options.AddPolicy("Frontend", policy =>
    {
        policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

//app and middlerware pipline
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new { message = "Character Creator API is running." }));

app.Run();