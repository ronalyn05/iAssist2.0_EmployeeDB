import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import "../App.css";
// import axios from "axios";

const Reports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("All"); // State for selected facility filter
 

  const handleUpdate = (EmployeeId) => {
    // Redirect to the update page with employee ID as a parameter
    navigate(`/update/${EmployeeId}`);
    // navigate(`/update/${employee.EmpID}`, { state: { employee } });
  };
    // Function to handle changes in the facility filter selection
    const handleFacilityFilterChange = (event) => {
      const { value } = event.target;
      setSelectedFacility(value);
      if (value === "All") {
        setFilteredEmployees(employees);
      } else {
        const filtered = employees.filter((employee) => employee.Facility === value);
        setFilteredEmployees(filtered);
      }
    };
    
  // //function to handle on deleting all data in different tables
  // const handleDeleteAllData = async () => {
  //   try {
  //     const response = await axios.delete('/api/deleteAllEmployeeData');
  //     alert(response.data.message);
  //   } catch (error) {
  //     console.error('Error deleting all employee data:', error);
  //     alert('Failed to delete all employee data. Please try again.');
  //   }
  // };

  // Effect to filter employee data based on search query
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
//handles in fetching the personal details
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("/newHireEmp");
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
                      <h5 className="m-0 font-weight-bold text-primary">
                        Reports
                      </h5>
                        {/* Facility filter dropdown */}
                        {/* <select
                        className="form-select"
                        value={selectedFacility}
                        onChange={handleFacilityFilterChange}
                      >
                        <option value="All">All</option>
                        {employees.length > 0 &&
                          [...new Set(employees.map((employee) => employee.Facility))].map((facility, index) => (
                            <option key={index} value={facility}>
                              {facility}
                            </option>
                          ))}
                      </select> */}
                      {/* Topbar Search */}
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
                      {/* <button
                                      className="update-button btn btn-xs"
                                      onClick={handleDeleteAllData} // handle to delete all data in different table
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                    <span>Delete all data</span> */}
                    </div>
                    <div className="card-body">
                       {/* Facility filter dropdown */}
                       <div className="col-md-2">
                        <div className="form-group d-flex align-items-center">
                        {/* <label className="form-label me-2" style={{ fontSize: '1rem' }}>Facility by:</label> */}
                          <select
                            className="form-control"
                            value={selectedFacility}
                            onChange={handleFacilityFilterChange}
                          >
                             <option value="All">All Facility</option>
                              {employees.length > 0 &&
                                [...new Set(employees.map((employee) => employee.Facility))].map((facility, index) => (
                                  <option key={index} value={facility}>
                                     {facility} Facility
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
                                      } // Call handleUpdate with employee ID
                                    >
                                      <i className="fas fa-pencil-alt"></i>
                                    </button>
                                    {/* <button
                                      className="btn btn-xs btn-success "
                                      onClick={() =>
                                        handleDownload(employee)
                                      }
                                    >
                                      <i className="far fa-eye"></i>
                                    </button> */}
                                  </td>
                                  <td>{employee.EmployeeId}</td>
                                  <td>{employee.EmployeeName}</td>
                                  <td>{employee.Facility}</td>
                                  <td>{employee.EmployeeStatus}</td>
                                  <td>{employee.EmploymentStatus}</td>
                                  <td>{employee.DateHired}</td>
                                  <td>{employee.EmployeeRole}</td>
                                  <td>{employee.Position}</td>
                                  <td>{employee.Level}</td>
                                  <td>{employee.ProjectCode}</td>
                                  <td>{employee.DepartmentName}</td>
                                  <td>{employee.DUName}</td>
                                  <td>{employee.WorkWeekType}</td>
                                  <td>{employee.WorkArrangement}</td>
                                  {/* <td>{employee.ShiftName}</td> */}
                                  <td>{employee.ShiftCode + ' ' + employee.ShiftName}</td>
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
            {/* /.container-fluid */}
          </div>
          {/* Footer */}
          <Footer />
          {/* End of Page Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
      {/* End of Page Wrapper */}
      {/* Add Dependent Modal */}
    </div>
  );
};

export default Reports;
