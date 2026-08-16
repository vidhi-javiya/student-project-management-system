using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Project_SPM_Status_SPM_StatusStatusID",
                table: "SPM_Project");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Project_SPM_User_SPM_UserUserId",
                table: "SPM_Project");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_Project_SPM_User_SPM_UserUserId1",
                table: "SPM_Project");

            migrationBuilder.DropForeignKey(
                name: "FK_SPM_UserRole_SPM_User_SPM_UserUserId",
                table: "SPM_UserRole");

            migrationBuilder.DropIndex(
                name: "IX_SPM_UserRole_SPM_UserUserId",
                table: "SPM_UserRole");

            migrationBuilder.DropIndex(
                name: "IX_SPM_Project_SPM_StatusStatusID",
                table: "SPM_Project");

            migrationBuilder.DropIndex(
                name: "IX_SPM_Project_SPM_UserUserId",
                table: "SPM_Project");

            migrationBuilder.DropIndex(
                name: "IX_SPM_Project_SPM_UserUserId1",
                table: "SPM_Project");

            migrationBuilder.DropColumn(
                name: "SPM_UserUserId",
                table: "SPM_UserRole");

            migrationBuilder.DropColumn(
                name: "SPM_StatusStatusID",
                table: "SPM_Project");

            migrationBuilder.DropColumn(
                name: "SPM_UserUserId",
                table: "SPM_Project");

            migrationBuilder.DropColumn(
                name: "SPM_UserUserId1",
                table: "SPM_Project");

            migrationBuilder.CreateTable(
                name: "SPM_Task",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    TaskTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TaskDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaskStatus = table.Column<int>(type: "int", nullable: false),
                    PriorityID = table.Column<int>(type: "int", nullable: false),
                    AssignedScore = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    EarnedScore = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    ProgressPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FacultyRemarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StudentRemarks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPM_Task", x => x.TaskId);
                    table.ForeignKey(
                        name: "FK_SPM_Task_SPM_Priority_PriorityID",
                        column: x => x.PriorityID,
                        principalTable: "SPM_Priority",
                        principalColumn: "PriorityID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_Task_SPM_Project_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "SPM_Project",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SPM_Task_SPM_Status_TaskStatus",
                        column: x => x.TaskStatus,
                        principalTable: "SPM_Status",
                        principalColumn: "StatusID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Task_PriorityID",
                table: "SPM_Task",
                column: "PriorityID");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Task_ProjectId",
                table: "SPM_Task",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SPM_Task_TaskStatus",
                table: "SPM_Task",
                column: "TaskStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SPM_Task");

            migrationBuilder.AddColumn<int>(
                name: "SPM_UserUserId",
                table: "SPM_UserRole",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SPM_StatusStatusID",
                table: "SPM_Project",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SPM_UserUserId",
                table: "SPM_Project",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SPM_UserUserId1",
                table: "SPM_Project",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SPM_UserRole_SPM_UserUserId",
                table: "SPM_UserRole",
                column: "SPM_UserUserId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Project_SPM_Status_SPM_StatusStatusID",
                table: "SPM_Project",
                column: "SPM_StatusStatusID",
                principalTable: "SPM_Status",
                principalColumn: "StatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Project_SPM_User_SPM_UserUserId",
                table: "SPM_Project",
                column: "SPM_UserUserId",
                principalTable: "SPM_User",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_Project_SPM_User_SPM_UserUserId1",
                table: "SPM_Project",
                column: "SPM_UserUserId1",
                principalTable: "SPM_User",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SPM_UserRole_SPM_User_SPM_UserUserId",
                table: "SPM_UserRole",
                column: "SPM_UserUserId",
                principalTable: "SPM_User",
                principalColumn: "UserId");
        }
    }
}
