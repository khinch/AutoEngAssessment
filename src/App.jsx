import React, { useState } from "react";
import "./index.css";

function App() {
  const [name, setName] = useState("");
  const [automationUsed, setAutomationUsed] = useState(""); // 'yes', 'no', or ''
  const [yearsExperience, setYearsExperience] = useState(0);
  const [cvFile, setCvFile] = useState(null);
  const [personalStatement, setPersonalStatement] = useState("");
  const [completedTask, setCompletedTask] = useState(false);

  // State for validation errors
  const [nameError, setNameError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Character count limit for personal statement
  const personalStatementLimit = 100;

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default browser form submission

    // Reset previous errors
    setNameError("");
    setShowModal(false);
    setModalMessage("");

    let isValid = true;

    if (!name.trim()) {
      // Updated check to only look at name
      setModalMessage("Name field is required.");
      setShowModal(true);
      isValid = false;
      return;
    }

    if (isValid) {
      // If validation passes, simulate sending data
      console.log("Form Data Valid. Simulating data submission:");
      console.log("Name:", name);
      console.log("Automation Used:", automationUsed);
      console.log("Years Experience:", yearsExperience);
      console.log("CV File:", cvFile ? cvFile.name : "No file uploaded");
      console.log("Personal Statement:", personalStatement);
      console.log("Completed Task:", completedTask);

      alert("Simulated form submission successful!"); // Simulate success
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="app-container">
      <h1>Automation Experience Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />

          {nameError && (
            <p className="error-message" data-qa-id="name-error">
              {nameError}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Have you used automation tools in a real setting?</label>

          <div className="radio-group">
            <label>
              <input type="radio" name="automationUsed" value="yes" checked={automationUsed === "yes"} onChange={(e) => setAutomationUsed(e.target.value)} /> Yes
            </label>
            <label>
              <input type="radio" name="automationUsed" value="no" checked={automationUsed === "no"} onChange={(e) => setAutomationUsed(e.target.value)} /> No
            </label>
          </div>
        </div>

        <div className="form-group slider-group">
          <label htmlFor="yearsExperience">
            How many years of automation experience do you have? ({yearsExperience}
            {yearsExperience === 10 ? "+" : ""}) {/* Display 10+ specifically */}
          </label>
          <input type="range" id="yearsExperience" data-qa-id="years" min="0" max="10" step="1" value={yearsExperience} onChange={(e) => setYearsExperience(parseInt(e.target.value))} />
        </div>

        <div className="form-group">
          <label htmlFor="cvUpload">Please attach your CV:</label>
          <input type="file" id="cvUpload" onChange={(e) => setCvFile(e.target.files[0] || null)} />
          {cvFile && <p>Selected file: {cvFile.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="personalStatement">Personal Statement (max {personalStatementLimit} chars):</label>
          <textarea
            id="personalStatement"
            maxLength={personalStatementLimit} // Limit character input
            value={personalStatement}
            onChange={(e) => setPersonalStatement(e.target.value)}
          />
          <p className="char-count">
            {personalStatement.length} / {personalStatementLimit}
          </p>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" checked={completedTask} onChange={(e) => setCompletedTask(e.target.checked)} /> Completed the task
          </label>
        </div>

        <button type="submit">Submit Application</button>
      </form>

      {/* CSS Modal for Validation */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Validation Error</h2>
            <p>{modalMessage}</p>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
