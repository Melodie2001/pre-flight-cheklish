import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Checklist = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(null);

  // Fonction pour récupérer les détails d'une checklist depuis l'API
  const fetchChecklist = async () => {
    try {
      const response = await api.get(`/checklist?id=${id}`);
      setChecklist(response.data);
    } catch (error) {
      console.error("Error fetching checklist:", error);
    }
  };

  
  const toggleTaskStatus = async (taskIndex) => {
    if (!checklist) return;

    const updatedTasks = [...checklist.todo];
    updatedTasks[taskIndex].status = updatedTasks[taskIndex].status === 0 ? 1 : 0;

    // Vérifie si toutes les tâches sont marquées comme "faites"
    const allCompleted = updatedTasks.every((task) => task.status === 1);
    const newChecklistStatus = allCompleted ? 2 : 1;

    try {
    
      await api.post("/checklist/update", {
        id: checklist.id,
        title: checklist.title,
        description: checklist.description,
        todo: updatedTasks,
      });

      
      await api.get(`/checklist/statut?id=${checklist.id}&statut=${newChecklistStatus}`);

      
      setChecklist((prevChecklist) => ({
        ...prevChecklist,
        todo: updatedTasks,
        status: newChecklistStatus,
      }));
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id]);

  if (!checklist) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{checklist.title}</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>{checklist.description}</p>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Status:{" "}
        {checklist.status === 0
          ? "Not Started"
          : checklist.status === 1
          ? "In Progress"
          : "Completed"}
      </p>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {checklist.todo.map((task, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: "bold" }}>{task.title}</p>
              <p style={{ margin: "5px 0 0 0" }}>{task.description}</p>
            </div>
            <button
              style={{
                backgroundColor: task.status === 0 ? "#FFD166" : "#06D6A0",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => toggleTaskStatus(index)}
            >
              {task.status === 0 ? "Mark as Done" : "Mark as Undone"}
            </button>
          </li>
        ))}
      </ul>

      <button
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          backgroundColor: "#26547c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Checklist;
