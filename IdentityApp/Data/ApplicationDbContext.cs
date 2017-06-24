using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using IdentityApp.Models;

namespace IdentityApp.Data
{
    public sealed class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private static bool _migrated;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            if (_migrated) return;
            Database.Migrate();
            _migrated = true;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
