import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

function LoginPage() {
  const [formData, setFormData] = useState({
    EmployeeId: "",
    Password: "",
  });
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //function that handles the login 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim whitespace from form data
    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedFormData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const responseData = await response.json();
          alert(responseData.error);
        } else {
          throw new Error("Login Failed");
        }
        return;
      }

      const data = await response.json();
      console.log("Login Successful:", data);

      sessionStorage.setItem("userId", data.UserId);
      sessionStorage.setItem("employeeId", data.EmployeeId);
      sessionStorage.setItem("firstName", data.FirstName);
      sessionStorage.setItem("lastName", data.LastName);
      sessionStorage.setItem("email", data.EmailAddress);
      sessionStorage.setItem("middleName", data.MiddleName);
      sessionStorage.setItem("profilePhoto", data.ProfilePhoto);
      sessionStorage.setItem("role", data.Role);
      sessionStorage.setItem("facility", data.Facility);

      if (data.Role === "HRAdmin") {
        if (data.ChangePasswordRequired) {
          navigate("/changePassword", { state: data });
        } else {
          navigate("/dashboard", { state: data });
        }
      } else if (data.Role === "Employee") {
        if (data.ChangePasswordRequired) {
          navigate("/changePassword", { state: data });
        } else {
          navigate("/employee", { state: data });
        }
      } else {
        throw new Error("Invalid user role");
      }
    } catch (error) {
      console.error("Login Failed", error);
      setErrorMessage(error.message || "Login Failed.");
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
                    src="./img/login.png"
                    alt="Login"
                    className="login-image"
                    style={{ width: "100px", height: "90px" }}
                  />
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="EmployeeId"
                      name="EmployeeId"
                      placeholder="Employee ID"
                      value={formData.EmployeeId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      id="Password"
                      name="Password"
                      placeholder="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Login
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/forgotpassword">
                    Forgot Password?
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

export default LoginPage;