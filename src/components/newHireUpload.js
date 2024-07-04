import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as emailjs from "emailjs-com";
import bcrypt from "bcryptjs";
// Import the generateUniquePassword function
const { generateUniquePassword } = require("./utils");

// Initialize EmailJS with your user ID
emailjs.init("5CED_P6z3JRHEcgVq");
// Define email service ID and template ID
const emailServiceID = "service_xfudh5t";
const emailTemplateID = "template_j6qm7ym";

const NewHireUpload = () => {
  // State for handling file to insert to the database
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [editModalShow, setEditModalShow] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [editedData, setEditedData] = useState({}); 
  // State for handling update file
  const [updateFile, setUpdateFile] = useState(null);
  const [updateExcelData, setUpdateExcelData] = useState([]);
  const [showUpdatePreview, setShowUpdatePreview] = useState(false);
  const [editUpdateModalShow, setEditUpdateModalShow] = useState(false);
  const [editUpdateRowData, setEditUpdateRowData] = useState(null);
  const [editedUpdateData, setEditedUpdateData] = useState({}); 

  const navigate = useNavigate();

// // Function to handle change in update file input
// const handleUpdateFileChange = (event) => {
//   const file = event.target.files[0];
//   setUpdateFile(file);
//       // Handle file upload for update
//       setShowUpdatePreview(true);
//       setActiveTab("updatePreview");
// };

  //function to handle the uploaded file input 
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setShowPreview(false);
    setActiveTab("upload");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("No File Selected");
      return;
    }

    const fileType = file.type;
    if (
      fileType !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please select an Excel file.");
      return;
    }

    try {
      const data = await readFile(file);
      const parsedData = parseExcelData(data);
      setExcelData(parsedData);
      setShowPreview(true);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error occurred while reading the file:", error);
      setExcelData([]);
      setShowPreview(false);
      setActiveTab("upload");
      alert("Error occurred while reading the file. Please try again.");
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(new Uint8Array(e.target.result));
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

//this handles to automatically fill in the empty fields
  // const parseCellValue = (value) => {
  //   return value !== undefined && value !== null ? value.toString() : "N/A";
  // };

  const parseCellValue = (value) => {
    return value !== undefined && value !== null ? value.toString() : "";
  };

  const parseExcelData = (data) => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const parsedData = rows.slice(1).map((row) => {
      const rowData = {};
      Object.keys(headers).forEach((headerKey) => {
        const header = headers[headerKey];
        const cellValue = row[headerKey];
        rowData[header] = parseCellValue(cellValue);
      });
      return rowData;
    });

    return parsedData;
  };

  const convertExcelDateToDate = (excelDateValue) => {
    if (!excelDateValue) return null;

    const excelDateNumber = parseFloat(excelDateValue);

    if (isNaN(excelDateNumber)) return null;

    const excelDateInMS = (excelDateNumber - 25569) * 86400 * 1000;
    const dateObj = new Date(excelDateInMS);

    return dateObj.toLocaleDateString(); // Return date in locale format
  };

  const handleEditClick = (rowData) => {
    setEditRowData(rowData);
    setEditedData(rowData); // Initialize edited data with current row data
    setEditModalShow(true);
    // setEditUpdateModalShow(true);
  };

  const handleCloseEditModal = () => {
    setEditModalShow(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveChanges = () => {
    // Update excelData with editedData
    const updatedData = excelData.map((row) => {
      if (row === editRowData) {
        return { ...row, ...editedData };
      }
      return row;
    });

    setExcelData(updatedData);
    setEditModalShow(false);
  };

  // Function to send email notification
  const sendEmailNotification = async (templateParams) => {
    try {
      // Send email using EmailJS API
      await emailjs.send(emailServiceID, emailTemplateID, templateParams);

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Function to check if a field is empty
  const isFieldEmpty = (value) => {
    return value === null || value === "";
  };

  // Function of insertion of data
  const handleSaveData = async () => {
    console.log("Saving data...");
    console.log("Excel Data:", excelData);

    try {
      // Check for empty fields in any row
      const hasEmptyFields = excelData.some((row) =>
        Object.values(row).some((value) => isFieldEmpty(value))
      );

      if (hasEmptyFields) {
        throw new Error(
          "One or more fields are empty. Please fill in all fields."
        );
      }

      // Validate bit fields
      const validateBitFields = () => {
        const invalidFields = [];

        excelData.forEach((row, index) => {
          const validateField = (fieldName, validValues) => {
            if (!validValues.includes(row[fieldName])) {
              invalidFields.push(`${fieldName} in row ${index + 1}`);
            }
          };

          validateField("IsManager", ["0", "1", 0, 1]);
          validateField("IsPMPIC", ["0", "1", 0, 1]);
          validateField("IsIndividualContributor", ["0", "1", 0, 1]);
          validateField("IsActive", ["0", "1", 0, 1]);
          validateField("Is_Active", ["0", "1", 0, 1]);
          validateField("is_Active", ["0", "1", 0, 1]);
          validateField("IsDUHead", ["0", "1", 0, 1]);
          validateField("IsPermanent", ["0", "1", 0, 1]);
          validateField("IsEmergency", ["0", "1", 0, 1]);
        });

        if (invalidFields.length > 0) {
          throw new Error(
            `Invalid values detected:\n${invalidFields.join("\n")}`
          );
        }
      };

      validateBitFields();

      // Validate Role field
      const invalidRoles = excelData.filter((row) => {
        const role = row.Role?.trim();
        return role !== "HRAdmin" && role !== "Employee";
      });

      if (invalidRoles.length > 0) {
        const invalidRoleRows = invalidRoles.map((row, index) => `Row ${index + 1}`);
        throw new Error(`Invalid Role values detected in the following rows: ${invalidRoleRows.join(", ")} (which is the Employee Role Type). Please ensure the Role is either 'HRAdmin' or 'Employee'.`);
      }

      // Check for duplicate Employee IDs against backend API
      const duplicateEmployeeIds = [];
      for (const row of excelData) {
        const { EmployeeId } = row;
        const response = await axios.get(
          `/api/checkExistingEmployeeId/${EmployeeId}`
        );
        if (response.data.exists) {
          duplicateEmployeeIds.push(EmployeeId);
        }
      }

      if (duplicateEmployeeIds.length > 0) {
        throw new Error(
          `Duplicate Employee IDs detected: ${duplicateEmployeeIds.join(
            ", "
          )}. Each Employee ID must be unique.`
        );
      }

      // Format date fields
      const formattedData = excelData.map((row) => {
        const formattedRow = { ...row };
        const dateFields = [
          "Birthdate",
          "DateHired",
          "DateTo",
          "DateFrom",
          "DateOfBirth",
        ];
        dateFields.forEach((field) => {
          formattedRow[field] = convertExcelDateToDate(row[field]);
        });
        return formattedRow;
      });

      // Generate a unique password for each employee and include it in the data sent to the server
      const dataWithPasswords = formattedData.map((row) => {
        const uniquePassword = generateUniquePassword();
        return { ...row, Password: uniquePassword };
      });

      // Send data to the backend API
      const response = await axios.post("/uploadNewHire", dataWithPasswords, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to save data");
      }

      // Send email notifications to the employees with their unique passwords
      for (const row of dataWithPasswords) {
        const templateParams = {
          from_name: 'Innodata - HRAdmin',
          firstName: row.FirstName,
          employeeId: row.EmployeeId,
          temporaryPassword: row.Password,
          to_email: row.EmailAddress,
        };

        await sendEmailNotification(templateParams);
      }

      alert("Data has been successfully uploaded and Email sent successfully to account user!");
      setShowPreview(false);
      setActiveTab("upload");
      setExcelData([]);
      console.log("Upload response:", response.data);
      navigate("/reports"); // Navigate to report.js after successful upload

    } catch (error) {
      console.error("Error saving data:", error);
      alert(error.message);
    }
  };

    // Function to handle change in update file input
    const handleUpdateFileChange = (event) => {
      const file = event.target.files[0];
      setUpdateFile(file);
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setUpdateExcelData(jsonData);
        setShowUpdatePreview(true);
        setActiveTab("updatePreview");
      };
      reader.readAsArrayBuffer(file);
    };

   // Function to handle submission of update file
   const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateFile) {
      alert('No File Selected');
      return;
    }

    const fileType = updateFile.type;
    if (
      fileType !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      alert('Please select an Excel file.');
      return;
    }

    try {
      const data = await readUpdateFile(updateFile);
      const parsedData = parseUpdateExcelData(data);
      setUpdateExcelData(parsedData); // Update state with parsed data
      setShowUpdatePreview(true); // Show update preview tab
      setActiveTab('updatePreview'); // Set active tab to update preview
    } catch (error) {
      console.error('Error occurred while reading the file:', error);
      setUpdateExcelData([]);
      setShowUpdatePreview(false);
      setActiveTab('update');
      alert('Error occurred while reading the file. Please try again.');
    }
  };

  // Function to read Excel file as array buffer
  const readUpdateFile = (updateFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(new Uint8Array(e.target.result));
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(updateFile);
    });
  };

  const parseUpdateCellValue = (value) => {
    return value !== undefined && value !== null ? value.toString() : "";
  };

  // Function to parse Excel data into JSON format
  const parseUpdateExcelData = (data) => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const parsedData = rows.slice(1).map((row) => {
      const rowData = {};
      Object.keys(headers).forEach((headerKey) => {
        const header = headers[headerKey];
        const cellValue = row[headerKey];
        rowData[header] = parseUpdateCellValue(cellValue);
      });
      return rowData;
    });

    return parsedData;
  };

  // Function to convert Excel date value to Date object
  const convertUpdateExcelDateToDate = (excelDateValue) => {
    if (!excelDateValue) return null;

    const excelDateNumber = parseFloat(excelDateValue);

    if (isNaN(excelDateNumber)) return null;

    const excelDateInMS = (excelDateNumber - 25569) * 86400 * 1000;
    const dateObj = new Date(excelDateInMS);

    return dateObj.toLocaleDateString(); // Return date in locale format
  };

  const handleEditUpdateClick = (rowData) => {
    setEditUpdateRowData(rowData);
    setEditedUpdateData(rowData); // Initialize edited data with current row data
    // setEditModalShow(true);
    setEditUpdateModalShow(true);
  };

  const handleCloseEditUpdateModal = () => {
    setEditUpdateModalShow(false);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setEditedUpdateData({ ...editedUpdateData, [name]: value });
  };

  const handleSaveUpdateChanges = () => {
    const updatedData = updateExcelData.map((row) => {
      if (row === editUpdateRowData) {
        return { ...row, ...editedUpdateData };
      }
      return row;
    });

    setUpdateExcelData(updatedData);
    setEditUpdateModalShow(false);
  };
  
 // Function of insertion of data
 const handleUpdateEmployeeInfo = async () => {
  console.log("Updating Employee Information...");
  console.log("Excel Data:", excelData);

  try {
    // Check for empty fields in any row
    const hasEmptyFields = excelData.some((row) =>
      Object.values(row).some((value) => isFieldEmpty(value))
    );

    if (hasEmptyFields) {
      throw new Error(
        "One or more fields are empty. Please fill in all fields."
      );
    }

    // Validate bit fields
    const validateBitFields = () => {
      const invalidFields = [];

      excelData.forEach((row, index) => {
        const validateField = (fieldName, validValues) => {
          if (!validValues.includes(row[fieldName])) {
            invalidFields.push(`${fieldName} in row ${index + 1}`);
          }
        };

        validateField("IsManager", ["0", "1", 0, 1]);
        validateField("IsPMPIC", ["0", "1", 0, 1]);
        validateField("IsIndividualContributor", ["0", "1", 0, 1]);
        validateField("IsActive", ["0", "1", 0, 1]);
        validateField("Is_Active", ["0", "1", 0, 1]);
        validateField("is_Active", ["0", "1", 0, 1]);
        validateField("IsDUHead", ["0", "1", 0, 1]);
        validateField("IsPermanent", ["0", "1", 0, 1]);
        validateField("IsEmergency", ["0", "1", 0, 1]);
      });

      if (invalidFields.length > 0) {
        throw new Error(
          `Invalid values detected:\n${invalidFields.join("\n")}`
        );
      }
    };

    validateBitFields();

    // Format date fields
    const formattedData = excelData.map((row) => {
      const formattedRow = { ...row };
      const dateFields = [
        "Birthdate",
        "DateHired",
        "DateTo",
        "DateFrom",
        "DateOfBirth",
      ];
      dateFields.forEach((field) => {
        formattedRow[field] = convertExcelDateToDate(row[field]);
      });
      return formattedRow;
    });

    // Update employee information based on EmployeeId
    const updateResponses = await Promise.all(
      formattedData.map(async (row) => {
        const { EmployeeId } = row;
        const response = await axios.put(
          `api/updateListofEmployee/${EmployeeId}`,
          row,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data; 
      })
    );

    // Check responses for success or failure
    const failedUpdates = updateResponses.filter(
      (response) => response.status !== "success"
    );

    if (failedUpdates.length > 0) {
      const failedIds = failedUpdates.map((response) => response.EmployeeId);
      throw new Error(
        `Failed to update information for Employee IDs: ${failedIds.join(", ")}`
      );
    }

    alert("Employee information has been successfully updated!");
    setShowUpdatePreview(false);
    setExcelData([]);
    console.log("Update responses:", updateResponses);
    navigate("/reports"); // Navigate to report.js after successful update

  } catch (error) {
    console.error("Error updating employee information:", error);
    alert(error.message);
  }
};


  return (
    <div>
      <div id="wrapper">
        {/* Sidebar */}
        <Navbar />
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {/* Topbar */}
            <TopNavbar />
            {/* Start of Page Content */}
            <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "upload" ? "active" : ""}`}
                    id="upload-tab"
                    data-toggle="tab"
                    href="#uploadForm"
                    role="tab"
                    aria-controls="uploadForm"
                    aria-selected={activeTab === "upload"}
                    onClick={() => setActiveTab("upload")}
                  >
                    Upload
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "preview" ? "active" : ""}`}
                    id="preview-tab"
                    data-toggle="tab"
                    href="#newHireReports"
                    role="tab"
                    aria-controls="newHireReports"
                    aria-selected={activeTab === "preview"}
                    onClick={() => setActiveTab("preview")}
                  >
                    Preview
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "update" ? "active" : ""}`}
                    id="update-tab"
                    data-toggle="tab"
                    href="#updateForm"
                    role="tab"
                    aria-controls="updateForm"
                    aria-selected={activeTab === "update"}
                    onClick={() => setActiveTab("update")}
                  >
                    Update
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "updatePreview" ? "active" : ""}`}
                    id="updatePreview-tab"
                    data-toggle="tab"
                    href="#updatePreview"
                    role="tab"
                    aria-controls="updatePreview"
                    aria-selected={activeTab === "updatePreview"}
                    onClick={() => setActiveTab("updatePreview")}
                  >
                    Update Preview
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                <div
                  className={`tab-pane fade ${activeTab === "upload" ? "show active" : ""}`}
                  id="uploadForm"
                  role="tabpanel"
                  aria-labelledby="upload-tab"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-center">
                      <form className="user" encType="multipart/form-data">
                        <div className="form-group">
                          <input
                            type="file"
                            className="form-control-file"
                            aria-describedby="fileHelp"
                            onChange={handleFileChange}
                          />
                          <small id="fileHelp" className="form-text text-muted">
                            Choose a file to upload.
                          </small>
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            className="btn btn-primary btn-user btn-block col-md-6"
                          >
                            Upload File
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "preview" ? "show active" : ""}`}
                  id="newHireReports"
                  role="tabpanel"
                  aria-labelledby="preview-tab"
                >
                  <div className="card-body">
                    <div className="table-responsive">
                      {showPreview && excelData.length > 0 ? (
                        <div>
                          <h5 className="mb-3 font-weight-bold">Preview of the Uploaded Data</h5>
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>ACTION</th>
                                {Object.keys(excelData[0]).map((header) => (
                                  <th key={header}>{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {excelData.map((row, index) => (
                                <tr key={index}>
                                  <td>
                                    <button
                                      className="update-button btn btn-xs"
                                      onClick={() => handleEditClick(row)}
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                  </td>
                                  {Object.keys(row).map((key) => (
                                    <td key={key}>
                                      {key.toLowerCase().includes("birthdate") ? convertExcelDateToDate(row[key]) : key.toLowerCase() === "datehired" ? convertExcelDateToDate(row[key]) : row[key]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="text-center mt-3">
                            <button className="btn btn-primary mr-2" onClick={handleSaveData}>
                              Submit Data
                            </button>
                          </div>
                          <br />
                        </div>
                      ) : (
                        <div className="text-center">Upload new file to preview data</div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "update" ? "show active" : ""}`}
                  id="updateForm"
                  role="tabpanel"
                  aria-labelledby="update-tab"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-center">
                      <form className="user" encType="multipart/form-data">
                        <div className="form-group">
                          <input
                            type="file"
                            className="form-control-file"
                            aria-describedby="updateFileHelp"
                            onChange={handleUpdateFileChange}
                          />
                          <small id="updateFileHelp" className="form-text text-muted">
                            Upload an Excel file containing employee information to update.
                          </small>
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            onClick={handleUpdateSubmit}
                            className="btn btn-primary btn-user btn-block col-md-6"
                          >
                            Upload File to Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "updatePreview" ? "show active" : ""}`}
                  id="updatePreview"
                  role="tabpanel"
                  aria-labelledby="updatePreview-tab"
                >
                  <div className="card-body">
                    <div className="table-responsive">
                      {showUpdatePreview && updateExcelData.length > 0 ? (
                        <div>
                          <h5 className="mb-3 font-weight-bold">Preview of the Updated Data</h5>
                          <table className="table table-bordered table-hover">
                            <thead>
                              <tr>
                                <th>ACTION</th>
                                {Object.keys(updateExcelData[0]).map((header) => (
                                  <th key={header}>{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {updateExcelData.map((row, index) => (
                                <tr key={index}>
                                  <td>
                                    <button
                                      className="update-button btn btn-xs"
                                      onClick={() => handleEditUpdateClick(row)}
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                  </td>
                                  {Object.keys(row).map((key) => (
                                    <td key={key}>
                                      {key.toLowerCase().includes("birthdate") ? convertUpdateExcelDateToDate(row[key]) : key.toLowerCase() === "datehired" ? convertUpdateExcelDateToDate(row[key]) : row[key]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="text-center mt-3">
                            <button className="btn btn-primary mr-2" onClick={handleUpdateEmployeeInfo}>
                              Update Data
                            </button>
                          </div>
                          <br />
                        </div>
                      ) : (
                        <div className="text-center">Upload file to update to preview data</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
            {/* /.container-fluid */}
          </div>
          {/* Footer */}
          <Footer />
          {/* End of Page Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
      {/* End of Page Wrapper */}
      {/* Edit Modal */}
      {/* This edit modal is intended for employee information to insert in the database */}
      <Modal
        show={editModalShow}
        onHide={handleCloseEditModal}
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>Update employee information</Modal.Title>
          <Button variant="default" onClick={handleCloseEditModal}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
        {editRowData && (
          <div>
            <Row>
              {Object.keys(editRowData).map((key) => (
                <Col key={key} md={4}>
                  <div className="form-group">
                    <label htmlFor={key}>
                      {key}{" "}
                      {isFieldEmpty(editedData[key]) && (
                        <span style={{ color: "red" }}> *required field </span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`form-control auto-width-input`}
                      name={key}
                      value={editedData[key] || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Update Modal */}
      <Modal
        show={editUpdateModalShow}
        onHide={handleCloseEditUpdateModal}
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>Update employee information</Modal.Title>
          <Button variant="default" onClick={handleCloseEditUpdateModal}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          {editUpdateRowData && (
            <div>
              <Row>
                {Object.keys(editUpdateRowData).map((key) => (
                  <Col key={key} md={4}>
                    <div className="form-group">
                      <label htmlFor={key}>
                        {key}{" "}
                        {isFieldEmpty(editedUpdateData[key]) && (
                          <span style={{ color: "red" }}> *required field </span>
                        )}
                      </label>
                      <input
                        type="text"
                        className={`form-control auto-width-input`}
                        name={key}
                        value={editedUpdateData[key] || ""}
                        onChange={handleUpdateChange}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUpdateChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default NewHireUpload;