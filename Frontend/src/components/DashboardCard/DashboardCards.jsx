import React, { useState, useEffect } from "react";
import "./DashboardCards.css";

import {
  Assignment,
  Task,
  CheckCircle,
  PendingActions,
  Event,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardCards = () => {
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,
    pendingTasks: 0,
    totalTasks: 0,
    upcomingDeadlines: 0,
    lowPriorityTasks: 0,
    mediumPriorityTasks: 0,
    highPriorityTasks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [taskRes, projectRes, statusRes, priorityRes] = await Promise.all([
          fetch("https://localhost:7187/api/Task"),
          fetch("https://localhost:7187/api/Project"),
          fetch("https://localhost:7187/api/Status"),
          fetch("https://localhost:7187/api/Priority"),
        ]);

        const tasksData = await taskRes.json();
        const projectsData = await projectRes.json();
        const statusesData = await statusRes.json();
        const prioritiesData = await priorityRes.json();

        const taskList = Array.isArray(tasksData) ? tasksData : tasksData?.data || [];
        const projectList = Array.isArray(projectsData) ? projectsData : projectsData?.data || [];
        const statusList = Array.isArray(statusesData) ? statusesData : statusesData?.data || [];
        const priorityList = Array.isArray(prioritiesData) ? prioritiesData : prioritiesData?.data || [];

        // Debugging માટે console માં ચેક કરો કે Task API શું ડેટા આપે છે
        console.log("Tasks Raw Data:", taskList);
        console.log("Status Raw Data:", statusList);

        // Dynamic Status ID and Name Map
        const statusMap = {};
        statusList.forEach((s) => {
          const sId = s.statusID ?? s.statusId ?? s.StatusID ?? s.id;
          const sName = (s.statusName ?? s.StatusName ?? s.name ?? "").toLowerCase().trim();
          if (sId !== undefined) {
            statusMap[sId] = sName;
          }
        });

        // Dynamic Priority Map
        const priorityMap = {};
        priorityList.forEach((p) => {
          const pId = p.priorityID ?? p.priorityId ?? p.PriorityID ?? p.id;
          const pName = (p.priorityName ?? p.PriorityName ?? p.name ?? "").toLowerCase().trim();
          if (pId !== undefined) {
            priorityMap[pId] = pName;
          }
        });

        // --- 1. PROJECTS STATUS COUNT ---
        let activeProjects = 0;
        let completedProjects = 0;
        let pendingProjects = 0;

        projectList.forEach((p) => {
          if (p.isDeleted === true || p.IsDeleted === true) return;

          let statusName = (p.statusName || p.StatusName || "").toLowerCase().trim();
          const pStatusId = p.projectStatus ?? p.ProjectStatus;

          if (!statusName && pStatusId && statusMap[pStatusId]) {
            statusName = statusMap[pStatusId];
          }

          if (
            statusName.includes("progress") ||
            statusName.includes("active")
          ) {
            activeProjects++;
          } else if (
            statusName.includes("complete") ||
            statusName.includes("done")
          ) {
            completedProjects++;
          } else if (
            statusName.includes("pending") ||
            statusName.includes("hold")
          ) {
            pendingProjects++;
          }
        });

        // --- 2. TASKS & STATUS CALCULATION ---
        const totalTasks = taskList.length;

        const getTaskStatusName = (t) => {
          // Task DTO માંથી statusName અથવા StatusName લેવું
          let sName = (t.statusName || t.StatusName || t.status || t.Status || "").toString().toLowerCase().trim();
          
          // જો statusName ન હોય, તો TaskStatus (ID) પરથી Master Status Table માંથી શોધો
          const sId = t.taskStatus ?? t.TaskStatus ?? t.statusId ?? t.StatusId;
          if (!sName && sId !== undefined && statusMap[sId]) {
            sName = statusMap[sId];
          }
          return sName;
        };

        const getTaskPriorityName = (t) => {
          let pName = (t.priorityName || t.PriorityName || t.priority || t.Priority || "").toString().toLowerCase().trim();
          const pId = t.priorityID ?? t.PriorityID ?? t.priorityId ?? t.PriorityId;
          if (!pName && pId !== undefined && priorityMap[pId]) {
            pName = priorityMap[pId];
          }
          return pName;
        };

        // --- PENDING TASKS COUNT ---
        // જે ટાસ્ક Complete અથવા Done નથી, અથવા જેનું સ્ટેટસ "pending", "to do", "not started", કે "hold" હોય અથવા StatusID 1 (સામાન્ય રીતે Pending/To Do માટે 1 હોય છે)
        const pendingTasks = taskList.filter((t) => {
          const stName = getTaskStatusName(t);
          const sId = t.taskStatus ?? t.TaskStatus ?? t.statusId ?? t.StatusId;

          const isCompleted = stName.includes("complete") || stName.includes("done");

          // જો Completed નથી અને સ્ટેટસમાં Pending / To do લખેલું છે અથવા તે StatusID 1 છે
          const isPendingByName = 
            stName.includes("pending") || 
            stName.includes("todo") || 
            stName.includes("to do") || 
            stName.includes("hold") || 
            stName.includes("not started") ||
            stName.includes("open") ||
            stName === ""; // જો સ્ટેટસ નામ ન મળતું હોય પરંતુ complete ન હોય

          return !isCompleted && (isPendingByName || sId === 1);
        }).length;

        // --- UPCOMING DEADLINES (NEXT 5 DAYS ONLY) ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next5Days = new Date(today);
        next5Days.setDate(today.getDate() + 5);
        next5Days.setHours(23, 59, 59, 999);

        const upcomingDeadlines = taskList.filter((t) => {
          const dueDateStr = t.dueDate || t.DueDate || t.deadline || t.Deadline;
          const stName = getTaskStatusName(t);
          const isCompleted = stName.includes("complete") || stName.includes("done");

          if (dueDateStr && !isCompleted) {
            const taskDate = new Date(dueDateStr);
            return taskDate >= today && taskDate <= next5Days;
          }
          return false;
        }).length;

        const lowPriorityTasks = taskList.filter((t) => getTaskPriorityName(t).includes("low")).length;
        const mediumPriorityTasks = taskList.filter((t) => getTaskPriorityName(t).includes("med")).length;
        const highPriorityTasks = taskList.filter((t) => getTaskPriorityName(t).includes("high")).length;

        setStats({
          activeProjects,
          completedProjects,
          pendingProjects,
          pendingTasks,
          totalTasks,
          upcomingDeadlines,
          lowPriorityTasks,
          mediumPriorityTasks,
          highPriorityTasks,
        });
      } catch (error) {
        console.error("Dashboard Data Fetching Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Active Projects", count: loading ? "..." : stats.activeProjects, icon: <Assignment />, color: "blue" },
    { title: "Completed Projects", count: loading ? "..." : stats.completedProjects, icon: <CheckCircle />, color: "green" },
    { title: "Pending Tasks", count: loading ? "..." : stats.pendingTasks, icon: <PendingActions />, color: "orange" },
    { title: "Upcoming Deadlines (5 Days)", count: loading ? "..." : stats.upcomingDeadlines, icon: <Event />, color: "purple" },
    { title: "Total Tasks", count: loading ? "..." : stats.totalTasks, icon: <Task />, color: "success" },
  ];

  const projectData = {
    labels: ["Active Projects", "Completed Projects", "Pending Projects"],
    datasets: [
      {
        data: [stats.activeProjects, stats.completedProjects, stats.pendingProjects],
        backgroundColor: ["#2563eb", "#22c55e", "#f97316"],
        borderWidth: 3,
        borderColor: "#ffffff",
      },
    ],
  };

  const taskData = {
    labels: ["Low Priority", "Medium Priority", "High Priority"],
    datasets: [
      {
        label: "Tasks",
        data: [stats.lowPriorityTasks, stats.mediumPriorityTasks, stats.highPriorityTasks],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <>
      <div className="cards">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <div className={`icon ${card.color}`}>{card.icon}</div>
            <h2>{card.count}</h2>
            <p>{card.title}</p>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-card">
          <h3>Project Statistics</h3>
          <div className="chart">
            <Doughnut
              data={projectData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>Task Priority Statistics</h3>
          <div className="chart">
            <Bar
              data={taskData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;