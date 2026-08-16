using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SPM_RoleRoleId",
                table: "SPM_UserRole",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SPM_UserUserId",
                table: "SPM_UserRole",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRole_SPM_RoleRoleId",
                table: "SPM_UserRole",
                column: "SPM_RoleRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRole_SPM_UserUserId",
                table: "SPM_UserRole",
                column: "SPM_UserUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_UserRole_SPM_Roles_SPM_RoleRoleId",
                table: "SPM_UserRole",
                column: "SPM_RoleRoleId",
                principalTable: "SPM_Roles",
                principalColumn: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_UserRole_SPM_User_SPM_UserUserId",
                table: "SPM_UserRole",
                column: "SPM_UserUserId",
                principalTable: "SPM_User",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_UserRole_SPM_Roles_SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_UserRole_SPM_User_SPM_UserUserId",
                table: "SPM_UserRole");

            migrationBuilder.DropIndex(
                name: "IX_SPM_UserRole_SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.DropIndex(
                name: "IX_SPM_UserRole_SPM_UserUserId",
                table: "SPM_UserRole");

            migrationBuilder.DropColumn(
                name: "SPM_RoleRoleId",
                table: "SPM_UserRole");

            migrationBuilder.DropColumn(
                name: "SPM_UserUserId",
                table: "SPM_UserRole");
        }
    }
}
