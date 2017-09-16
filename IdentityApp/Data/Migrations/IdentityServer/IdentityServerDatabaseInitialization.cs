﻿using System;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace IdentityApp.Data.Migrations.IdentityServer
{
    public static class IdentityServerDatabaseInitialization
    {
        public static void InitializeDatabase(IServiceProvider services)
        {
            PerformMigrations(services);
            SeedData(services);

        }

        private static void PerformMigrations(IServiceProvider services)
        {
            services.GetRequiredService<ConfigurationDbContext>().Database.Migrate();
            services.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
        }

        private static void SeedData(IServiceProvider services)
        {
            var context = services.GetRequiredService<ConfigurationDbContext>();

            if (!context.Clients.Any())
            {
                foreach (var client in Config.GetClients())
                {
                    context.Clients.Add(client.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.IdentityResources.Any())
            {
                foreach (var resource in Config.GetIdentityResources())
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }

            if (!context.ApiResources.Any())
            {
                foreach (var resource in Config.GetApiResources())
                {
                    context.ApiResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
        }
    }
}