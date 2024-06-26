import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as emailjs from 'emailjs-com';
import bcrypt from 'bcryptjs';
// Import the generateUniquePassword function
const { generateUniquePassword } = require('./utils');

  // Initialize EmailJS with your user ID
  emailjs.init("5CED_P6z3JRHEcgVq");
  // Define email service ID and template ID
const emailServiceID = 'service_xfudh5t';
const emailTemplateID = 'template_j6qm7ym';

const NewHireUpload = () => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [editModalShow, setEditModalShow] = useState(false);
  const [editRowData, setEditRowData] = useState(null);
  const [editedData, setEditedData] = useState({}); // State to hold edited data

  const navigate = useNavigate();

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

  const parseCellValue = (value) => {
    return value !== undefined && value !== null ? value.toString() : "N/A";
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

// Function to generate a unique password
// const generateUniquePassword = () => {
//   return 'Test@' + Math.random().toString(36).slice(-8);
// };

// Function to send email notification
const sendEmailNotification = async ( templateParams) => {
  try {
    // Send email using EmailJS API
    await emailjs.send(emailServiceID, emailTemplateID, templateParams);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// const sendEmailNotification = async (to, subject, message) => {
//   try {
//     const templateParams = {
//       to_email: to,
//       subject: subject,
//       message: message
//     };

//     // Send email using EmailJS API
//     await emailjs.send(emailServiceID, emailTemplateID, templateParams);

//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };
//function of insertion of data
      const handleSaveData = async () => {
        console.log("Saving data...");
        console.log("Excel Data:", excelData);

        try {
          // Check for null values in any row
          const hasNullValues = excelData.some((row) =>
            Object.values(row).some((value) => value === null || value === "")
          );

          if (hasNullValues) {
            throw new Error(
              "One or more fields contain null values. Please fill in all fields and use 'N/A' if a field is empty."
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

        //   for (const row of excelData) {
        //     // Generate a unique password for each employee
        //     const uniquePassword = generateUniquePassword();
        //     row.Password = uniquePassword;

        //     // Create the template parameters
        //     const templateParams = {
        //         firstName: row.FirstName,
        //         employeeId: row.EmployeeId,
        //         temporaryPassword: row.Password,
        //         to_email: row.EmailAddress,
        //         subject: 'Your Account Details'
        //     };

        //     // Send email notification with account details
        //     await sendEmailNotification(templateParams);
        // }
         // Generate a unique password for each employee and include it in the data sent to the server
    const dataWithPasswords = formattedData.map((row) => {
      const uniquePassword = generateUniquePassword();
      return { ...row, Password: uniquePassword };
    });

        // Make a POST request to upload data
        const response = await axios.post("/upload", dataWithPasswords, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status !== 200) {
          throw new Error("Failed to save data");
        }
    
        // Send email notifications after successful upload
        for (const row of dataWithPasswords) {
          const templateParams = {
            from_name: 'Innodata - HRAdmin',
            firstName: row.FirstName,
            employeeId: row.EmployeeId,
            temporaryPassword: row.Password,
            to_email: row.EmailAddress,
            // subject: 'Your Account Details',
          };
    
          // Send email notification with account details
          await sendEmailNotification(templateParams);
        }

          // // Make a POST request to upload data
          // const response = await axios.post("/upload", formattedData, {
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          // });

          // if (response.status !== 200) {
          //   throw new Error("Failed to save data");
          // }

        alert("Data has been successfully uploaded and Email sent successfully to each account user!");
          console.log("Upload response:", response.data);
          // alert("Data has been successfully uploaded!");
          navigate("/reports"); // Navigate to report.js after successful upload
        } catch (error) { 
          console.error("Error occurred while saving data:", error);

          if (error.message.includes("Duplicate Employee IDs detected")) {
            // Extract the list of duplicate Employee IDs from the error message
            const duplicateIds = error.message.match(
              /Duplicate Employee IDs detected: (.*). Each Employee ID must be unique\./
            );
            const duplicateEmployeeIds = duplicateIds
              ? duplicateIds[1].split(", ")
              : [];

            if (duplicateEmployeeIds.length > 0) {
              alert(
                `Duplicate Employee IDs detected in the uploaded data: ${duplicateEmployeeIds.join(
                  ", "
                )}. Each Employee ID must be unique.`
              );
              return; // Stop further execution to prevent displaying the generic error message
            }
          }

          // Handle other types of errors
          if (error.message.includes("One or more fields contain null values")) {
            alert(
              "One or more fields contain null values. Please fill in all fields and use 'N/A' if a field is empty."
            );
          } else if (error.message.includes("Failed to save data")) {
            alert("Failed to save data. Please try again.");
          } else {
            alert(
              `Failed to upload data to the database. An unexpected error occurred. Please try again.`
            );
          }
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
                            className={`nav-link ${
                              activeTab === "upload" ? "active" : ""
                            }`}
                            id="upload-tab"
                            data-toggle="tab"
                            href="#uploadForm"
                            role="tab"
                            aria-controls="uploadForm"
                            aria-selected={activeTab === "upload"}
                          >
                            Upload
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "preview" ? "active" : ""
                            }`}
                            id="reports-tab"
                            data-toggle="tab"
                            href="#newHireReports"
                            role="tab"
                            aria-controls="newHireReports"
                            aria-selected={activeTab === "preview"}
                          >
                            Preview
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <div className="tab-content">
                        <div
                          className={`tab-pane fade ${
                            activeTab === "upload" ? "show active" : ""
                          }`}
                          id="uploadForm"
                          role="tabpanel"
                          aria-labelledby="upload-tab"
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-center">
                              <form
                                className="user"
                                encType="multipart/form-data"
                              >
                                <div className="form-group">
                                  <input
                                    type="file"
                                    className="form-control-file"
                                    aria-describedby="fileHelp"
                                    onChange={handleFileChange}
                                  />
                                  <small
                                    id="fileHelp"
                                    className="form-text text-muted"
                                  >
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
                          className={`tab-pane fade ${
                            activeTab === "preview" ? "show active" : ""
                          }`}
                          id="newHireReports"
                          role="tabpanel"
                          aria-labelledby="reports-tab"
                        >
                          <div className="card-body">
                            <div className="table-responsive">
                              {showPreview && excelData.length > 0 ? (
                                <div>
                                  <h5 className="mb-3 font-weight-bold">
                                    Preview of the Uploaded Data
                                  </h5>
                                  <table className="table table-bordered table-hover">
                                    {/* Table Headers */}
                                    <thead>
                                      <tr>
                                        <th>ACTION</th>
                                        {Object.keys(excelData[0]).map(
                                          (header) => (
                                            <th key={header}>{header}</th>
                                          )
                                        )}
                                      </tr>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody>
                                      {excelData.map((row, index) => (
                                        <tr key={index}>
                                          <td>
                                            <button
                                              className="update-button btn btn-xs"
                                              onClick={() =>
                                                handleEditClick(row)
                                              }
                                            >
                                              <i className="fas fa-pencil-alt"></i>
                                            </button>
                                          </td>
                                          {/* Table Data */}
                                          {Object.keys(row).map((key) => (
                                            <td key={key}>
                                              {/* Convert birthdate if necessary */}
                                              {key
                                                .toLowerCase()
                                                .replace(/\s/g, "")
                                                .includes("birthdate")
                                                ? convertExcelDateToDate(
                                                    row[key]
                                                  )
                                                : key
                                                    .toLowerCase()
                                                    .replace(/\s/g, "") ===
                                                  "datehired"
                                                ? convertExcelDateToDate(
                                                    row[key]
                                                  ) // Convert Date Hired to date format
                                                : row[key]}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {/* Submit Data Button */}
                                  <div className="text-center mt-3">
                                    <button
                                      className="btn btn-primary mr-2"
                                      onClick={handleSaveData}
                                    >
                                      Submit Data
                                    </button>
                                  </div>
                                  <br />
                                </div>
                              ) : (
                                // Render message when no uploaded data
                                <div className="text-center">
                                  Upload new file to preview data
                                </div>
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
                      <label>{key}</label>
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
    </div>
  );
};

export default NewHireUpload;