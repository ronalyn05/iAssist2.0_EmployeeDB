import React, { useState, useEffect, useCallback } from "react";
// import Navbar from "./navbar";
import Navbar from './navbar';
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState({
    ProfilePhoto: "/img/user.png",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    EmailAddress: "", 
    EmployeeId: ""
  });
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);

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
        const response = await axios.get(`/api/getUserData/${employeeId}`);
        setUserData(response.data);

      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching user data');
      }
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  //handles in saving the profile photo
const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    // Retrieve employeeId from the textbox
    // const employeeId = document.getElementById('employeeId').value;
    const employeeId = userData.EmployeeId;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    console.log(file);

    // Send POST request to update photo
    await axios.post(`/api/updatePhoto/${employeeId}`, formData);

    // Show success message to the user
    alert('Profile photo updated successfully!');

    // Reload the page after showing the alert
    window.location.reload();
  } catch (err) {
    console.error(err);
    setErrorMessage('Error updating profile photo');
  }
};

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    
    try {
      // Retrieve userId from the textbox
      // const employeeId = document.getElementById('employeeId').value;
      const employeeId = userData.EmployeeId; // Use userData directly
  
      const updatedDetails = {
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        MiddleName: userData.MiddleName,
        EmailAddress: userData.EmailAddress,
        EmployeeId: employeeId // Use the userId from the textbox
      };
  
      await axios.post(`/api/updatePersonalDetails/${employeeId}`, updatedDetails);
    
      // Show success message to the user
      alert('User data updated successfully!');

      // Reload the page after showing the alert
    window.location.reload();

    } catch (err) {
      console.error(err);
      setErrorMessage('Error saving changes');
    }
  };
  const handleNavigateToAssistPage = () => {
    navigate(`/iAssist`);
    // Navigate the user to the iAssist page
    // Implement your navigation logic here
    // For example, you can use react-router-dom's useHistory hook or Link component
  };

  return (
    <div>
      <div id="wrapper">
        {/* <Navbar /> */}
         <Navbar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <TopNavbar />
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-xl-12 col-lg-12">
                  <div className="card shadow mb-12">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h5 className="m-0 font-weight-bold text-primary">
                        Profile
                      </h5>
                      <button
                        className="btn btn-primary btn-user"
                        onClick={handleNavigateToAssistPage}
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Go to
                        iAssist
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="profile-container">
                            <img
                              src={userData.ProfilePhoto}
                              alt="Profile"
                              className="img-fluid rounded-circle profile-photo"
                            />
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className="form-control-file mt-3"
                                />
                              </div>
                              <button type="submit" className="btn btn-primary">
                                Update Photo
                              </button>
                            </form>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="profile-info">
                            {errorMessage && (
                              <div className="row justify-content-center">
                                <div className="col-md-6">
                                  <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                  </div>
                                </div>
                              </div>
                            )}
                            <h5 className="m-0 font-weight-bold text-primary">
                              Personal Details
                            </h5>
                            <br />
                            <form className="user" onSubmit={handleSaveChanges}>
                              <div className="form-group row justify-content-center">
                              <div className="col-sm-6 mb-3 mb-sm-0">
                                <label htmlFor="employeeId">Employee Id:</label>
                                <span className="form-control form-control-user text-center"> {userData.EmployeeId}</span>
                                </div>
                              </div>
                              <div className="form-group row ">
                              <div className="col-sm-6 mb-3 mb-sm-0 ">
                                <label htmlFor="FirstName">First Name:</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-user text-center"
                                    id="FirstName"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    value={userData.FirstName}
                                  />
                                </div>
                                <div className="col-sm-6">
                                <label htmlFor="lastname">Last Name:</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-user text-center"
                                    id="LastName"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                    value={userData.LastName}
                                  />
                                </div>
                                {/* <div className="col-sm-6">
                                <label htmlFor="username">User Name:</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-user"
                                    id="UserName"
                                    placeholder="User Name"
                                    onChange={handleChange}
                                    value={userData.UserName}
                                  />
                                </div> */}
                              </div>
                              <div className="form-group row">
                              <div className="col-sm-6 mb-3 mb-sm-0">
                                <label htmlFor="middlename">Middle Name:</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-user text-center"
                                    id="MiddleName"
                                    placeholder="Middle Name"
                                    onChange={handleChange}
                                    value={userData.MiddleName}
                                  />
                                </div>
                                <div className="col-sm-6 mb-3 mb-sm-0">
                                <label htmlFor="email">Email Address:</label>
                                <input
                                  type="email"
                                  className="form-control form-control-user text-center"
                                  id="EmailAddress"
                                  placeholder="Email Address"
                                  onChange={handleChange}
                                  value={userData.EmailAddress}
                                />
                                </div>
                                
                              </div>
                              <div className="d-flex justify-content-center">
                                <div className="col-md-6 d-flex justify-content-center">
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-user btn-block"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
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

export default Profile;
