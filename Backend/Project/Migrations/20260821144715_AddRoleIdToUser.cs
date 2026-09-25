using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_UserRole_SPM_Roles_SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.DropIndex(
                name: "IX_SPM_UserRole_SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.DropColumn(
                name: "SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "SPM_User",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_User_RoleId",
                table: "SPM_User",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_User_SPM_Roles_RoleId",
                table: "SPM_User",
                column: "RoleId",
                principalTable: "SPM_Roles",
                principalColumn: "RoleId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_User_SPM_Roles_RoleId",
                table: "SPM_User");

            migrationBuilder.DropIndex(
                name: "IX_SPM_User_RoleId",
                table: "SPM_User");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "SPM_User");

            migrationBuilder.AddColumn<int>(
                name: "SPM_RoleRoleId",
                table: "SPM_UserRole",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRole_SPM_RoleRoleId",
                table: "SPM_UserRole",
                column: "SPM_RoleRoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_UserRole_SPM_Roles_SPM_RoleRoleId",
                table: "SPM_UserRole",
                column: "SPM_RoleRoleId",
                principalTable: "SPM_Roles",
                principalColumn: "RoleId");
        }
    }
}
