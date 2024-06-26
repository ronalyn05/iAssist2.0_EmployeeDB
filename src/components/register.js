import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';


function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        EmployeeId: '',
        LastName: '',
        FirstName: '',
        MiddleName: '',
        EmailAddress: '',
        Password: '',
        ConfirmPassword: '',
        Role: ''
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleAutofill = async () => {
        try {
            const response = await fetch(`/employee/${formData.EmployeeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Employee not found');
            }

            const employeeData = await response.json();
            setFormData({
                ...formData,
                EmployeeId: employeeData.EmployeeId || '',
                LastName: employeeData.LastName || '',
                FirstName: employeeData.FirstName || '',
                MiddleName: employeeData.MiddleName || '',
                EmailAddress: employeeData.EmailAddress || '',
                Role: employeeData.Role || ''
            });
        } catch (error) {
            console.error('Error autofilling employee data:', error);
            setErrorMessage('Employee not found. Please check the Employee ID entered or contact the HR Admin regarding your employee Id!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation checks for form data...
        const errors = [];
        if (!formData.FirstName.trim()) {
            errors.push('First Name is required');
        }
        if (!formData.LastName.trim()) {
            errors.push('Last Name is required');
        }
        if (!formData.EmailAddress.trim()) {
            errors.push('Email is required');
        }
        // Password validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!formData.Password.match(passwordRegex)) {
            errors.push('Password must be at least 6 characters long and contain at least one special character and one number');
        }
        if (formData.Password !== formData.ConfirmPassword) {
            errors.push('Passwords do not match');
        }
        if (!formData.Role) {
            errors.push('Role selection is required');
        }
    
        if (errors.length > 0) {
            setErrorMessage(errors.join(', '));
            return;
        }

                // Check if the EmployeeId exists
        try {
            const response = await fetch(`/api/checkEmployeeId/${formData.EmployeeId}`);
            if (!response.ok) {
            throw new Error('Failed to check EmployeeId');
            }
            const { exists } = await response.json();
            if (exists) {
            setErrorMessage('Employee ID already registered. Please use a different Employee ID.');
            return;
            }
        } catch (error) {
            console.error('Error checking EmployeeId:', error);
            setErrorMessage('Failed to check Employee ID. Please try again later.');
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(formData.Password, 10);
    
            const registerResponse = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    EmployeeId: formData.EmployeeId,
                    LastName: formData.LastName,
                    FirstName: formData.FirstName,
                    MiddleName: formData.MiddleName,
                    EmailAddress: formData.EmailAddress,
                    Password: hashedPassword,
                    Role: formData.Role
                }),
            });
    
            if (!registerResponse.ok) {
                throw new Error('Failed to register user');
            }
    
            const responseData = await registerResponse.json();
            console.log(responseData); // Log the response from the server
            alert("Account successfully registered!");
            navigate("/");
        } catch (error) {
            console.error('Error registering user:', error);
            setErrorMessage('Failed to register user. Please try again later.');
        }
    };

    return (
        <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card o-hidden border-0 shadow-lg">
                            <div className="card-body p-5">
                                <div className="text-center">
                                    <img src="./img/hris-2.png" alt="Logo" className="logo" style={{ width: '200px', height: '90px' }} />
                                </div>
                                <hr />
                                <div className="text-center" style={{ margin: "20px" }}>
                                    <img src="./img/add.png" alt="Add" className="add-image" style={{ width: "100px", height: "90px" }} />
                                </div>
                                <form className="user" onSubmit={handleSubmit}>
                                    {/* Employee ID input for autofill */}
                                    <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="EmployeeId"
                                                placeholder="Employee ID"
                                                onChange={handleChange}
                                                value={formData.EmployeeId}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm mt-2"
                                                onClick={handleAutofill}
                                            >
                                                Autofill
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                    {/* Form inputs for user details */}
                                    <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label >Last Name</label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            id="LastName"
                                            placeholder="Last Name"
                                            onChange={handleChange}
                                            value={formData.LastName}
                                        />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label >First Name</label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            id="FirstName"
                                            placeholder="First Name"
                                            onChange={handleChange}
                                            value={formData.FirstName}
                                        />
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-6">
                                        <div className="form-group">
                                            <label >Middle Name</label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            id="MiddleName"
                                            placeholder="Middle Name"
                                            onChange={handleChange}
                                            value={formData.MiddleName}
                                        />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="form-group">
                                            <label >Email Address</label>
                                            <input
                                            type="email"
                                            className="form-control"
                                            id="EmailAddress"
                                            placeholder="Email Address"
                                            onChange={handleChange}
                                            value={formData.EmailAddress}
                                        />
                                        </div> 
                                        </div>   
                                </div>
                                    <div className="row justify-content-center">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label >Password</label>
                                            <input
                                            type="password"
                                            className="form-control"
                                            id="Password"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            value={formData.Password}
                                        />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label >Confirm Password</label>
                                            <input
                                            type="password"
                                            className="form-control"
                                            id="ConfirmPassword"
                                            placeholder="Confirm Password"
                                            onChange={handleChange}
                                            value={formData.ConfirmPassword}
                                        />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Role">Role:</label>
                                        <select
                                            className="form-control"
                                            id="Role"
                                            value={formData.Role}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="employee">Employee</option>
                                            <option value="hrAdmin">HR-Admin</option>
                                        </select>
                                    </div>
                                    {/* Submit button */}
                                    <div className="d-flex justify-content-center">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <button type="submit" className="btn btn-primary btn-user btn-block">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                {/* Error message */}
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                {/* Links for login or other actions */}
                                <hr />
                                <div className="text-center">
                                    <Link className="small" to="/forgotpassword">Forgot Password?</Link>
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="/">Already have an Account? Login!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
