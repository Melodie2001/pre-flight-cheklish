import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [checklists, setChecklists] = useState([]);
  const navigate = useNavigate();

  // Récupérer les checklists
  const fetchChecklists = async () => {
    try {
      const response = await api.get("/checklists");
      setChecklists(response.data.response);
    } catch (error) {
      console.error("Error fetching checklists:", error);
    }
  };

  // Supprimer une checklist
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this checklist?");
    if (confirmDelete) {
      try {
        await api.get(`/checklist/delete?id=${id}`);
        fetchChecklists(); 
      } catch (error) {
        console.error("Error deleting checklist:", error);
      }
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</h1>
      <button
        style={{
          backgroundColor: "#26547c",
          color: "white",
          padding: "15px 25px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "18px",
          display: "block",
          margin: "20px auto",
        }}
        onClick={() => navigate("/form")}     
      >
        New Checklist
      </button>

      {checklists.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          No checklists found. Create a new one to get started!
        </p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {checklists.map((checklist) => (
            <li
              key={checklist.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer", 
              }}
              onClick={() => navigate(`/checklist/${checklist.id}`)} 
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#26547c" }}>{checklist.title}</h3>
              <p style={{ margin: "0 0 10px 0" }}>{checklist.description}</p>
              <p style={{ margin: "0 0 10px 0" }}>
                Status:{" "}        
                {checklist.status === 0
                  ? "Not Started"
                  : checklist.status === 1
                  ? "In Progress"
                  : "Completed"}
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                Tasks Completed:{" "}
                {checklist.todo.filter((task) => task.status === 1).length} / {checklist.todo.length}
              </p>
              <div>
                <button
                  style={{
                    backgroundColor: "#FFD166",
                    border: "none",
                    padding: "10px 15px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    navigate(`/form/${checklist.id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    backgroundColor: "#EF476F",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDelete(checklist.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
