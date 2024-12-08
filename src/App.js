import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Checklist from "./Components/Checklist";
import Form from "./Components/Form";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checklist/:id" element={<Checklist />} />
        <Route path="/form/:id?" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
