import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ChangePassword() {
  const [formData, setFormData] = useState({
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: ""
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.currentPassword || !formData.newPassword) {
      setErrorMessage("Please provide both current and new passwords.");
      return;
    }
  
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New password and confirm password must match.");
      return;
    }
  
    try {
      const response = await fetch('/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmployeeId: sessionStorage.getItem('employeeId'),
          CurrentPassword: formData.currentPassword,
          NewPassword: formData.newPassword,
        }),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        setErrorMessage(responseData.error || 'Password Change Failed');
        return;
      }

      alert('Password has successfully changed!');
      
      navigate('/');
    } catch (error) {
      console.error("Password Change Failed", error);
      setErrorMessage(error.message || "Password Change Failed.");
    }
  };

  useEffect(() => {
    // Manipulate browser history on component mount
    const disableBackButton = () => {
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", disableBackButton);
    };

    disableBackButton();

    // Cleanup function
    return () => {
      window.removeEventListener("popstate", disableBackButton);
    };
  }, []);

  return (
    <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center">
                  <img
                    src="./img/hris-2.png"
                    alt="Logo"
                    className="logo"
                    style={{ width: "200px", height: "auto" }}
                  />
                </div>
                <hr />
                <div className="text-center" style={{ margin: "20px" }}>
                  <img
                    src="./img/forgotpass.png"
                    alt="changePass"
                    className="login-image"
                    style={{ width: "140px", height: "120px" }}
                  />
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="form-control form-control-user"
                      id="currentPassword"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control form-control-user"
                      id="newPassword"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-user"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Change Password
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/">
                    Back to Login!
                  </Link>
                </div>
                {errorMessage && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
