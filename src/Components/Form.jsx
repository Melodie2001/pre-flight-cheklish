import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Form = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([{ title: "", description: "", status: 0 }]);

  // Fonction pour récupérer les données d'une checklist en cas de modification
  const fetchChecklist = async () => {
    if (id) {
      try {
        const response = await api.get(`/checklist?id=${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTasks(response.data.todo);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    }
  };

  // Enregistrer la checklist (création ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Mise à jour de la checklist existante
        await api.post("/checklist/update", {
          id,
          title,
          description,
          todo: tasks,
        });
      } else {
        // Création d'une nouvelle checklist
        await api.post("/checklist/add", {
          title,
          description,
          todo: tasks,
        });
      }
      navigate("/"); 
    } catch (error) {
      console.error("Error saving checklist:", error);
    }
  };

  // Ajouter une nouvelle tâche
  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", status: 0 }]);
  };

  // Supprimer une tâche
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    fetchChecklist(); 
  }, [id]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        {id ? "Edit Checklist" : "New Checklist"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter checklist title"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter checklist description"
            rows="4"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        <h2 style={{ marginBottom: "10px" }}>Tasks</h2>
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                Task Title
              </label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].title = e.target.value;
                  setTasks(updatedTasks);
                }}
                placeholder="Enter task title"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                Task Description
              </label>
              <input
                type="text"
                value={task.description}
                onChange={(e) => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].description = e.target.value;
                  setTasks(updatedTasks);
                }}
                placeholder="Enter task description (optional)"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => deleteTask(index)}
              style={{
                backgroundColor: "#EF476F",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete Task
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTask}
          style={{
            backgroundColor: "#26547c",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Add Task
        </button>

        <button
          type="submit"
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            backgroundColor: "#06D6A0",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          Save Checklist
        </button>
      </form>
      <button
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          backgroundColor: "#FFD166",
          color: "black",
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

export default Form;
