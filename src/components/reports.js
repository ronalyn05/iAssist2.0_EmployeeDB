import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import "../App.css";
import * as XLSX from "xlsx";
import axios from "axios";

const Reports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("All");
  const [selectedEmpStatus, setSelectedEmpStatus] = useState("All");

  const handleUpdate = (EmployeeId) => {
    navigate(`/update/${EmployeeId}`);
  };

  const handleFacilityFilterChange = (event) => {
    const { value } = event.target;
    setSelectedFacility(value);
    if (value === "All") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.Facility === value
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleEmpStatusFilterChange = (event) => {
    const { value } = event.target;
    setSelectedEmpStatus(value);
    if (value === "All") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.EmployeeStatus === value
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    filterEmployees(value);
  };

  const filterEmployees = (query) => {
    const filtered = employees.filter(
      (employee) =>
        String(employee.EmployeeId)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        employee.EmployeeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/retrieveReports");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        function convertToTitleCase(str) {
          if (typeof str === "string" && str !== null && str.trim() !== "") {
            return str.toLowerCase().replace(/\b\w/g, function (char) {
              return char.toUpperCase();
            });
          } else {
            return "";
          }
        }

        const formattedData = data.map((employee) => ({
          ...employee,
          EmployeeName: convertToTitleCase(employee.EmployeeName),
          EmployeeStatus: convertToTitleCase(employee.EmployeeStatus),
          EmploymentStatus: convertToTitleCase(employee.EmploymentStatus),
        }));

        setEmployees(formattedData);
        setFilteredEmployees(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-success";
      case "Separated":
        return "text-danger";
      case "Inactive - Maternity":
      case "Inactive - Sickness":
        return "text-primary";
      case "Inactive - Absent Without Leave":
        return "text-danger";
      case "Inactive - Absent With Leave":
        return "text-info";
      case "Inactive - Suspension":
        return "text-warning";
      default:
        return "";
    }
  };
  //this only download data that are visible in the user interface table
  // const handleDownloadExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(filteredEmployees);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Employees Data Report");

  //   XLSX.writeFile(wb, "Employees_Report.xlsx");
  // };

  // Helper function to convert text to title case
  const toTitleCase = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  //this downloads all the employee data in multiple tables
  // Function to handle Excel download
  const handleDownloadExcel = async () => {
    try {
      // Fetch data from the backend
      const response = await axios.get("/api/getAllEmployees");

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const data = response.data;

      // Log the response data to inspect
      console.log("Data from backend:", data);

      // Specify fields to exclude
      const excludedFields = [
        "EmpInfoID",
        "ProjectId",
        "DepartmentId",
        "ProdId",
        "ShiftId",
        "EducationID",
        "AddressID",
        "ContactId",
        "ShiftID",
        "DependentID",
        "CreatedAt",
      ];

      // Extract headers (field names) dynamically from the first row of data
      const headers = Object.keys(data[0]).filter(
        (field) => !excludedFields.includes(field)
      );

      // Format date fields and other specific fields
      const formattedData = data.map((row) => {
        const formattedRow = {};
        headers.forEach((field) => {
          if (
            [
              "FirstName",
              "LastName",
              "MiddleName",
              "MaidenName",
              "EmployeeName",
              "DUName",
              "DepartmentName",
              "ManagerName",
              "PMPICIDName",
              "EmploymentStatus",
            ].includes(field)
          ) {
            formattedRow[field] = row[field] ? toTitleCase(row[field]) : "";
          } else if (
            field === "Birthdate" ||
            field === "DateHired" ||
            field === "DateTo" ||
            field === "DateFrom" ||
            field === "DateOfBirth"
          ) {
            formattedRow[field] = row[field]
              ? new Date(row[field]).toLocaleDateString()
              : "";
          } else if (field === "EmployeeId") {
            // Ensure array fields are joined properly
            formattedRow[field] = Array.isArray(row[field])
              ? row[field][0]
              : row[field];
          } else {
            formattedRow[field] = row[field];
          }
        });
        return formattedRow;
      });

      // Create a worksheet from the formatted data
      const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });

      // Auto-adjust column widths based on the longest cell value in each column
      const maxLengths = headers.map((header) =>
        Math.max(
          ...formattedData.map((row) =>
            row[header] ? row[header].toString().length : 0
          ),
          header.length
        )
      );
      ws["!cols"] = maxLengths.map((length) => ({ width: length + 2 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employees Data Report");

      // Write the workbook to a file
      XLSX.writeFile(wb, "Employees_Report.xlsx");
      alert("File has been successfully downloaded!");
    } catch (error) {
      console.error("Error occurred while downloading data:", error);
      alert("Failed to download data. Please try again.");
    }
  };

  return (
    <div>
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Reports
                      </h5>
                      <form className="form-inline ml-auto">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <button className="btn btn-primary" type="button">
                              <i className="fas fa-search fa-sm"></i>
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control bg-light border-0 small"
                            placeholder="Search by ID or Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </form>
                      <button
                        className="btn btn-primary ml-2"
                        onClick={handleDownloadExcel}
                      >
                        <i className="fas fa-arrow-down"></i> Employee Reports
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="d-flex">
                        <label className="mr-2" style={{ alignSelf: "center" }}>
                          Filter by:
                        </label>
                        <div className="form-group mr-2">
                          <select
                            className="form-control"
                            value={selectedFacility}
                            onChange={handleFacilityFilterChange}
                          >
                            <option value="All">All Facility</option>
                            {employees.length > 0 &&
                              [
                                ...new Set(
                                  employees.map((employee) => employee.Facility)
                                ),
                              ].map((facility, index) => (
                                <option key={index} value={facility}>
                                  {facility} Facility
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <select
                            className="form-control"
                            value={selectedEmpStatus}
                            onChange={handleEmpStatusFilterChange}
                          >
                            <option value="All">All Statuses</option>
                            {employees.length > 0 &&
                              [
                                ...new Set(
                                  employees.map(
                                    (employee) => employee.EmployeeStatus
                                  )
                                ),
                              ].map((empstatus, index) => (
                                <option key={index} value={empstatus}>
                                  {empstatus} Status
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Action</th>
                              <th scope="col">Employee Id</th>
                              <th scope="col">Name</th>
                              <th scope="col">Facility</th>
                              <th scope="col">Employee Status</th>
                              <th scope="col">Employment Status</th>
                              <th scope="col">Date Hired</th>
                              <th scope="col">Employee Role</th>
                              <th scope="col">Position</th>
                              <th scope="col">Level</th>
                              <th scope="col">Project Code</th>
                              <th scope="col">Delivery Unit</th>
                              <th scope="col">Department</th>
                              <th scope="col">Work Week Type</th>
                              <th scope="col">Work Arrangement</th>
                              <th scope="col">Shift</th>
                              <th scope="col">Shift Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEmployees.length > 0 ? (
                              filteredEmployees.map((employee) => (
                                <tr key={employee.EmployeeId}>
                                  <td>
                                    <button
                                      className="update-button btn btn-xs mr-2"
                                      onClick={() =>
                                        handleUpdate(employee.EmployeeId)
                                      }
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                  </td>
                                  <td>{employee.EmployeeId}</td>
                                  <td>{employee.EmployeeName}</td>
                                  <td>{employee.Facility}</td>
                                  <td>
                                    <span
                                      className={getStatusColor(
                                        employee.EmployeeStatus
                                      )}
                                    >
                                      {employee.EmployeeStatus}
                                    </span>
                                  </td>
                                  <td>{employee.EmploymentStatus}</td>
                                  <td>
                                    {employee.DateHired
                                      ? new Date(
                                          employee.DateHired
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td>{employee.EmployeeRole}</td>
                                  <td>{employee.Position}</td>
                                  <td>{employee.Level}</td>
                                  <td>{employee.ProjectCode}</td>
                                  <td>{employee.DepartmentName}</td>
                                  <td>{employee.DUName}</td>
                                  <td>{employee.WorkWeekType}</td>
                                  <td>{employee.WorkArrangement}</td>
                                  <td>
                                    {employee.ShiftCode +
                                      " " +
                                      employee.ShiftName}
                                  </td>
                                  <td>{employee.ShiftType}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="20">No data available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Reports;