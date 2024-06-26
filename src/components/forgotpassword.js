import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as emailjs from 'emailjs-com';
import bcrypt from 'bcryptjs';

const emailServiceID = 'service_xfudh5t';
const emailTemplateID = 'template_ql1pc7d';

// Initialize EmailJS with your user ID
emailjs.init("5CED_P6z3JRHEcgVq");

function ForgotPasswordPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const navigate = useNavigate();

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/checkEmployeeAndEmail", { employeeId, email });
      if (response.data.exists) {
        const otp = generateOtp();
        setGeneratedOtp(otp);

        // Send OTP email
        const templateParams = {
          to_name: employeeId,
          from_name: 'Innodata - HRAdmin',
          to_email: email,
          subject: 'Your OTP for Password Reset',
          otp: otp,
        };
        await emailjs.send(emailServiceID, emailTemplateID, templateParams);
        setShowOtpField(true);
        alert("OTP sent to your email.");
      } else {
        alert("Employee ID and/or Email do not exist in the database.");
      }
    } catch (error) {
      console.error("Error checking Employee ID and Email:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp === generatedOtp) {
      setShowNewPasswordField(true);
      alert("OTP verified. Please enter your new password.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await axios.post("/api/resetPassword", { email, newPassword: hashedPassword });
      alert("Password reset successfully. You can now log in with your new password.");
      navigate("/"); // Redirect to login page after successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
                    alt="Forgot Password"
                    className="forgot-password-image"
                    style={{ width: "100px", height: "90px" }}
                  />
                </div>
                <form className="user" onSubmit={handleEmailSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="employeeId"
                      name="employeeId"
                      placeholder="Employee ID"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Request Password Reset
                  </button>
                </form>
                {showOtpField && (
                  <form className="user mt-3" onSubmit={handleOtpSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="otp"
                        name="otp"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-user btn-block"
                    >
                      Verify OTP
                    </button>
                  </form>
                )}
                {showNewPasswordField && (
                  <form className="user mt-3" onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-user btn-block"
                    >
                      Reset Password
                    </button>
                  </form>
                )}
                <hr />
                <div className="text-center">
                  <Link className="small" to="/">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
