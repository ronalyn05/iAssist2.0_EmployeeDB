import React, { useState, useEffect, useRef, useCallback} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import axios from 'axios';

function Employee() {
  // const { employeeId } = useParams();
  // const { state } = useLocation();
  // const [employeeData, setEmployeeData] = useState({
  //   ProfilePhoto: "/img/user.png",
  // });
  const [employeeData, setEmployeeData] = useState({
    ProfilePhoto: "/img/user.png",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    EmailAddress: "", 
    EmployeeId: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const employeeProfileRef = useRef(null);

  useEffect(() => {
    // Fetch personal details on component mount
    fetchPersonalDetails();
  }, []);

  const fetchPersonalDetails = useCallback(async () => {
    try {
        // Retrieve userId from sessionStorage
        const employeeId = sessionStorage.getItem("employeeId");
        console.log(employeeId);

        if (!employeeId) {
          throw new Error('UserId not found in sessionStorage');
        }

        // Fetch user data from the backend using the userId
        const response = await axios.get(`http://localhost:5000/retrieve/${employeeId}`);
        setEmployeeData(response.data);

      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching user data');
      }
  }, []);

  // Define a function to determine the color based on EmployeeStatus value
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": 
        return "green";
      case "Separated": 
        return "red";
      case "Inactive - Maternity": 
      case "Inactive - Sickness": 
      case "Inactive - Absent with leave": 
      case "Inactive - Absent Without Leave": 
      case "Inactive - Suspension": 
        return "gray";
      default:
        return "black"; 
    }
  };

  const statusColor = getStatusColor(employeeData.EmployeeStatus);

  // Go back to the previous page in history
  // const handleNavigateBack = () => {
  //   // Navigate back one step in history (equivalent to pressing the browser's back button)
  //   navigate(-1);
  // };

  if (!employeeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div id="wrapper">
        <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              {/* <div>
                <button
                  className="update-button btn btn-xs mr-2"
                  onClick={handleNavigateBack}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
              </div>
              <br /> */}
              <div className="row justify-content-center">
                <div className="col-xl-12 col-xl-12">
                  <div className="card shadow mb-12">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Employee Profile
                      </h5>
                      {/* <div className="d-flex align-items-center">
                         <button
                          className="update-button btn btn-xs mr-2"
                          onClick={handleNavigateBack}
                        >
                          <i className="fas fa-arrow-left"></i> Back
                        </button>
                      </div> */}
                      {/* <div className="d-flex align-items-center">
                        <button
                        className="update-button btn btn-xs mr-2"
                        onClick={handleDownloadPDF}
                        >
                        <i className="fas fa-arrow-down"></i> Download Profile
                        </button>
                    </div> */}
                    </div>
                    <div className="card-body" ref={employeeProfileRef}>
                      <div className="row">
                        {/* Profile Container */}
                        <div className="col-md-4">
                          <div className="profile-container">
                            {employeeData.ProfilePhoto ? (
                              <img
                                src={employeeData.ProfilePhoto}
                                alt="Profile"
                                className="img-fluid rounded-circle profile-photo"
                              />
                            ) : (
                              <img
                                src="/img/user.png" // Default profile photo
                                alt="Default Profile"
                                className="img-fluid rounded-circle profile-photo"
                              />
                            )}
                          </div>
                          <div className="row align-items-center text-center justify-content-center">
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Employee ID:
                                </label>
                                <span className="textDecorationUnderline">
                                  {Array.isArray(employeeData.EmployeeId)
                                    ? employeeData.EmployeeId[0]
                                    : employeeData.EmployeeId}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9 ">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Employee Status:
                                </label>
                                <span
                                  style={{
                                    color: statusColor,
                                    textDecoration: "underline",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {employeeData.EmployeeStatus}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Name:
                                </label>
                                <span className="valueCenter">
                                  {employeeData.EmployeeName}
                                </span>
                                <br />
                              </div>
                            </div>
                            <div className="col-md-9">
                              <div className="form-group">
                                <label className="blueLabel labelWithSpacing">
                                  Email Address:
                                </label>
                                <span className="valueCenter">
                                  {employeeData.EmailAddress}
                                </span>
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                        <br />
                        <form className="user">
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Birth Date</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Birthdate}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Age</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Age}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Gender</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Gender}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Marital Status</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.MaritalStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Date Hired</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.DateHired}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Level</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Level}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="EmploymentStatus">
                                  Employment Status
                                </label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.EmploymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Work Arrangement</label>
                                <span className="form-control autoAdjustSpanz">
                                  {employeeData.WorkArrangement}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Position</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.Position}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="Shift">Shift</label>
                                <span className="form-control autoAdjustSpan">
                                  {employeeData.ShiftName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Department</label>
                                <span className="form-control autoAdjustSpan ">
                                  {employeeData.DepartmentName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <br />
                        </form>
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
}

export default Employee;