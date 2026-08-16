using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddSPMProjectTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SPM_Project",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    FacultyId = table.Column<int>(type: "int", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    ProjectStatus = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalTasks = table.Column<int>(type: "int", nullable: false),
                    CompletedTasks = table.Column<int>(type: "int", nullable: false),
                    ProgressPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    SPM_StatusStatusID = table.Column<int>(type: "int", nullable: true),
                    SPM_UserUserId = table.Column<int>(type: "int", nullable: true),
                    SPM_UserUserId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_Project", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_Status_ProjectStatus",
                        column: x => x.ProjectStatus,
                        principalTable: "SPM_Status",
                        principalColumn: "StatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_Status_SPM_StatusStatusID",
                        column: x => x.SPM_StatusStatusID,
                        principalTable: "SPM_Status",
                        principalColumn: "StatusID");
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_User_FacultyId",
                        column: x => x.FacultyId,
                        principalTable: "SPM_User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_User_SPM_UserUserId",
                        column: x => x.SPM_UserUserId,
                        principalTable: "SPM_User",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_User_SPM_UserUserId1",
                        column: x => x.SPM_UserUserId1,
                        principalTable: "SPM_User",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_SPM_Project_SPM_User_StudentId",
                        column: x => x.StudentId,
                        principalTable: "SPM_User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_FacultyId",
                table: "SPM_Project",
                column: "FacultyId");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_ProjectStatus",
                table: "SPM_Project",
                column: "ProjectStatus");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_SPM_StatusStatusID",
                table: "SPM_Project",
                column: "SPM_StatusStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_SPM_UserUserId",
                table: "SPM_Project",
                column: "SPM_UserUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_SPM_UserUserId1",
                table: "SPM_Project",
                column: "SPM_UserUserId1");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Project_StudentId",
                table: "SPM_Project",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SPM_Project");
        }
    }
}
