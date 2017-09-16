using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace IdentityApp.Data.Migrations.IdentityServer.Configuration
{
    public partial class ConfigCore2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoutSessionRequired",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "LogoutUri",
                table: "Clients");

            migrationBuilder.AddColumn<bool>(
                name: "BackChannelLogoutSessionRequired",
                table: "Clients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BackChannelLogoutUri",
                table: "Clients",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ConsentLifetime",
                table: "Clients",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Clients",
                type: "TEXT",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FrontChannelLogoutSessionRequired",
                table: "Clients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "FrontChannelLogoutUri",
                table: "Clients",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedClientId",
                table: "Clients",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClientProperties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClientId = table.Column<int>(type: "INTEGER", nullable: false),
                    Key = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    Value = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientProperties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientProperties_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientProperties_ClientId",
                table: "ClientProperties",
                column: "ClientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientProperties");

            migrationBuilder.DropColumn(
                name: "BackChannelLogoutSessionRequired",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "BackChannelLogoutUri",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "ConsentLifetime",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "FrontChannelLogoutSessionRequired",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "FrontChannelLogoutUri",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "NormalizedClientId",
                table: "Clients");

            migrationBuilder.AddColumn<bool>(
                name: "LogoutSessionRequired",
                table: "Clients",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LogoutUri",
                table: "Clients",
                nullable: true);
        }
    }
}
