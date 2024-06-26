// backend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
// const upload = multer();
const upload = multer({ dest: 'uploads/' }); // Specify upload directory
exports.upload = upload;
// Multer storage configuration

const util = require('util');
const crypto = require('crypto');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const dbOperationHR = require('./dbFiles/dbOperationHR.js');
const dbOperation = require('./dbFiles/dbOperation.js');
const dbOperationEmp = require('./dbFiles/dbOperationEmp.js');
const Employee = require('./dbFiles/employee');

const thisDefaultContructor = require('./dbFiles/dbContructor/thisDefaultContructor.js');
const DefaultOneFile = require('./dbFiles/dbContructor/DefaultOneFile.js');
const DefaultTwoFile = require('./dbFiles/dbContructor/DefaultTwoFile.js');
const DefaultThreeFile = require('./dbFiles/dbContructor/DefaultThreeFile.js');
const DefaultSetterFile = require('./dbFiles/dbContructor/DefaultSetterFile.js');

const submissionResubmit = require('./dbFiles/dbContructor/submissionResubmit.js');
const ResubmitPDFContructor = require('./dbFiles/dbContructor/ResubmitPDFContructor.js');


const app = express();
const PORT = 5000;
// const PORT = 3000;

const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Static credentials
const STATIC_EMPLOYEE_ID = '7654321';
const ADMIN_PASSWORD = 'admin123';
const EMPLOYEE_PASSWORD = 'employee123';



// app.post('/upload', upload.single('sssloanPDF'), async (req, res) => {
//   // console.log(req);
//   // console.log("this");
//   // try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//   //   // Here you can save the file to the database
//     await dbOperation.insertPDF(req.file.filename); // Pass filename to the insertPDF function

//   //   res.status(200).json({ message: 'PDF uploaded successfully' });
//   // } catch (error) {
//   //   console.error('Error uploading PDF:', error);
//   //   res.status(500).json({ error: 'Internal server error' });
//   // }
// });

// HR - get all employee submission

app.post('/hrsubmission',  upload.single(''), async (req, res) => {
 
  try { 
    const { pageNumber, pageSize, facility } = req.body; 
    const result = await dbOperationHR.getSubmissions(pageNumber, pageSize, facility);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error('Error:', error);
    // res.status(500).json({ error: 'Internal server error' });
  }
}); 
// HR - get all employee submission with filter
app.post('/hrfiltersubmission', upload.single(''),  async (req, res) => {
 
  try {
    const { pageNumber, pageSize, facility, name, transactionType, status, month, year } = req.body;   
    const result = await dbOperationHR.getFilteredSubmissions(pageNumber, pageSize, facility, name, transactionType, status, month, year);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 
// HR - download submissions
app.post('/hrdownloadsubmissions', upload.single(''),  async (req, res) => {
 
  try {
    const { name, transactionType, status, month, year, facility } = req.body;   
    const result = await dbOperationHR.downloadSubmissions(name, transactionType, status, month, year, facility);
    res.status(200).json({ result: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 
// HR - get submission pdfs
app.post('/submissionpdf',  upload.single('SubmissionID'), async (req, res) => {

  try {
  
    const result = await dbOperationHR.getPDF(req.body.SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// HR - update pdf status
app.post('/updatepdf', upload.single(''), async (req, res) => {

  try {

    const id = req.body.id;
    const reason = req.body.reason;  
    const SubmissionID = req.body.SubmissionID;  
  
    const result = await dbOperationHR.updatePDF(id,reason,SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// HR - update submission status
app.post('/updatesubmission', upload.single(''), async (req, res) => {

  try {

    const id = req.body.id;
    const reason = req.body.reason;  
  
    const result = await dbOperationHR.updateSubmission(id,reason);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Employee - get employee submission
app.post('/usersubmission',  upload.single('EmpId'), async (req, res) => {

  try { 
  
    const { pageNumber, pageSize } = req.body; 
    const result = await dbOperationHR.getUserSubmissions(req.body.EmpId,pageNumber, pageSize);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Employee - get hr emails
app.post('/gethremails',  upload.single('EmpId'), async (req, res) => {

  try { 
  
    const { facility } = req.body; 
    const result = await dbOperationHR.getHREmails(facility);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// All - get notifications
app.post('/getnotification',  upload.single(''), async (req, res) => {

  try {   
    // const result = await dbOperationHR.getPDF(req.body.SubmissionID);
    // console.log(req.body.EmpId)
    const result = await dbOperationHR.getNotifications(req.body.EmpId);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// All - mark all notifications as read
app.post('/notificationmarkallread',  upload.single(''), async (req, res) => {

  try {    
    const result = await dbOperationHR.markAllNotificationsRead(req.body.EmpId);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// All - mark one notification as read
app.post('/setnotificationasread',  upload.single(''), async (req, res) => {

  try {    
    const result = await dbOperationHR.setNotificationAsRead(req.body.NotificationID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// All - get submission details for notification
app.post('/getsubmissionfornotification',  upload.single(''), async (req, res) => {

  try {    
    const result = await dbOperationHR.getSubmissionForNotification(req.body.SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// All - insert notification
app.post('/insertnotification',  upload.single(''), async (req, res) => {

  try {

    const { EmployeeName, TransactionType, SenderID, ReceiverID, NotificationType, SubmissionID } = req.body;  
    
    const result = await dbOperationHR.insertNotification(EmployeeName, TransactionType, SenderID, ReceiverID, NotificationType, SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/getnotificationsforviewall',  upload.single('EmpId'), async (req, res) => {

  try {  
    const { EmpId, pageNumber, pageSize } = req.body; 
    const result = await dbOperationHR.getNotificationsForViewAll(req.body.EmpId,pageNumber, pageSize);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});














//RONALYN - EMPLOYEE DB STARTS HERE
// Generate a random string
const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Return required number of characters
};

// Generate a random secret key
const secretKey = generateRandomString(32); // You can adjust the length as needed

console.log('Secret key:', secretKey);

// Using the secret key in the session middleware
app.use(
  session({
    secret: secretKey, // Use the generated secret key
    resave: false,
    saveUninitialized: true
  })
);
// employee data retrieval endpoint
app.get('/employee/:employeeId', async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const existingUser = await dbOperation.getUserEmpId(employeeId);
      res.status(200).json(existingUser);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Backend API endpoint to check if an employee ID exists
app.get('/api/checkExistingEmployeeId/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // Perform a query to check if the employeeId exists in the database
    const existingEmployee = await dbOperation.getUserEmpId(employeeId);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Backend API endpoint to check if an employee ID exists
app.post('/api/checkEmployeeAndEmail', async (req, res) => {
  try {
    const { employeeId, email } = req.body;
    // Perform a query to check if the employeeId and email exist in the database
    const existingEmployee = await dbOperation.checkEmployeeAndEmail(employeeId, email);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID and email:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Backend API endpoint to reset the password
app.post('/api/resetPassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Update the user's password in the database
    const result = await dbOperation.resetPassword(email, newPassword);

    // Check if the password was successfully updated
    if (result) {
      res.status(200).json({ message: "Password reset successfully." });
    } else {
      res.status(400).json({ error: "Unable to reset password. Please try again." });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Backend API endpoint to check if an employee ID exists
app.get('/api/checkEmployeeId/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // Perform a query to check if the employeeId exists in the database
    const existingEmployee = await dbOperation.getUserById(employeeId);
    if (existingEmployee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking employee ID:', error);
    res.status(500).send('Internal Server Error');
  }
});
 // Define a POST endpoint for user registration
app.post('/register', async (req, res) => {
  // Extract user data from the request body
  const { EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role} = req.body;

  // Insert to Database
  let newEmp = new Employee( EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role);

  try {
      await dbOperation.insertEmployee(newEmp);
      console.log('Employee inserted:', newEmp);
      res.status(200).json({ message: 'Employee inserted successfully' });
  } catch (error) {
      console.error("Error inserting employee:", error);
      res.status(500).json({ error: 'Failed to insert employee' });
  }
});

//post endpoint for user login
app.post('/login', async (req, res) => {
  const { EmployeeId, Password } = req.body;
  console.log('Login attempt:', { EmployeeId, Password });

  try {
    // Check for static credentials
    if (EmployeeId === STATIC_EMPLOYEE_ID) {
      if (Password === ADMIN_PASSWORD) {
        res.status(200).json({
          EmployeeId: STATIC_EMPLOYEE_ID,
          Role: 'HRAdmin'
        });
        return;
      } else if (Password === EMPLOYEE_PASSWORD) {
        res.status(200).json({
          EmployeeId: STATIC_EMPLOYEE_ID,
          Role: 'Employee'
        });
        return;
      } else {
        res.status(401).json({ error: 'Incorrect employee id or password' });
        return;
      }
    }

    // Retrieve user from the database based on EmployeeId
    const users = await dbOperation.getEmployees(EmployeeId);
    if (users.length > 0) {
      const user = users[0];
      console.log('User found:', user);

      // Check if the employee status is Active
      // if (user.EmployeeStatus !== 'Active') {
      //   res.status(401).json({ error: `Your account status is currently ${user.EmployeeStatus}. Please contact HRAdmin for assistance.` });
      //   return;
      // }
      if (user.EmployeeStatus == 'Separated' || user.EmployeeStatus == 'Inactive - Absent Without Leave') {
        res.status(401).json({ error: `Your account status is currently ${user.EmployeeStatus}. Please contact HRAdmin for assistance.` });
        return;
      }

      // Compare provided password with the hashed password stored in the database
      const isValidPassword = await bcrypt.compare(Password, user.Password);
      console.log('Password valid:', isValidPassword);

      if (isValidPassword) {
        res.status(200).json(user);
      } else {
        console.log('Password mismatch:', { provided: Password, stored: user.Password });
        res.status(401).json({ error: 'Incorrect employee id or password' });
      }
    } else {
      res.status(401).json({ error: 'User not found or invalid credentials. Register your account!' });
    }
  } catch (error) {
    console.error('Login Failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Change password endpoint
  app.post('/changePassword', async (req, res) => {
    const { EmployeeId, NewPassword } = req.body;
  
    try {
      // Retrieve user from the database based on EmployeeId
      const user = await dbOperation.getUserByEmployeeId(EmployeeId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      // Compare provided current password with the hashed password stored in the database
      // const isValidPassword = await bcrypt.compare(CurrentPassword, user.Password);
      // if (!isValidPassword) {
      //   res.status(401).json({ error: 'Invalid current password' });
      //   return;
      // }
  
      // Hash the new password before storing it in the database
      const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
  
      // Update the user's password in the database
      await dbOperation.updateUserPassword(EmployeeId, hashedNewPassword);
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Password Change Failed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Multer storage configuration
const uploadMult = multer();
// API endpoint to update profile photo
app.post('/api/updatePhoto/:employeeId', uploadMult.single('profilePhoto'), async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    let profilePhoto = '/img/user.png'; // Set default profile photo path

    if (req.file) {
      // Convert file to base64 string
      profilePhoto = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await dbOperation.updateProfilePhoto(employeeId, profilePhoto);
    res.status(200).send("Profile photo updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile photo");
  }
});
// API endpoint to update users details
app.post('/api/updatePersonalDetails/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const updatedDetails = req.body; // This should contain updated user data
    await dbOperation.updatePersonalDetails(employeeId, updatedDetails);
    res.status(200).send("Personal details updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating personal details");
  }
});
//api endpoint to retrieve the users data
app.get('/api/getUserData/:employeeId', async (req, res) => {
  try {
    // Retrieve userId from the request parameters
    const employeeId = req.params.employeeId;

    // Fetch user data from the database based on the userId
    const userData = await dbOperation.getUserData(employeeId);

    // If no user data found for the provided userId, return an error
    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Respond with the user data
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  // POST endpoint to handle Excel data upload
  app.post('/uploadNewHire', async (req, res) => {
    const excelData = req.body; // Assuming excelData is sent as JSON

    try {
      for (const row of excelData) {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(row.Password, 10);

        // Insert row data along with the hashed password into the database
        await dbOperation.insertNewHire(row, hashedPassword);
        console.log('Employee inserted:', row);
      }

      // Respond with success message
      res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
      console.error("Error occurred while inserting data:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Endpoint to retrieve employee data
app.get('/newHireEmp', async (req, res) => {
  try {
      const employees = await dbOperation.getAllCountNewHireEmployees();
      res.status(200).json(employees);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send('Error retrieving employee data.');
  }
});
// Endpoint to retrieve monthly new hire count
app.get('/monthlyNewHireCount', async (req, res) => {
  try {
    const monthlyNewHireCount = await dbOperation.getMonthlyNewHireCount();
    res.status(200).json(monthlyNewHireCount);
  } catch (error) {
    console.error('Error retrieving monthly new hire count:', error);
    res.status(500).send('Error retrieving monthly new hire count.');
  }
});

// Endpoint to retrieve yearly new hire count
app.get('/yearlyNewHireCount', async (req, res) => {
  try {
    const yearlyNewHireCount = await dbOperation.getYearlyNewHireCount();
    res.status(200).json(yearlyNewHireCount);
  } catch (error) {
    console.error('Error retrieving yearly new hire count:', error);
    res.status(500).send('Error retrieving yearly new hire count.');
  }
});

//endpoints to fetch employee reports
app.get('/retrieveReports', async (req, res) => {
  try {
      const employees = await dbOperation.getAllNewHireEmployees();
      res.status(200).json(employees);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send('Error retrieving employee data.');
  }
});
// Endpoint for adding a new contact number
app.post('/addContactNumber/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const newContactData = req.body;
  try {
    // const result = await dbOperation.insertDependent(employeeId, newDependentData);
    await dbOperation.getAddNewContactId(employeeId, newContactData); // No need to assign to result if not used
    res.json({ message: 'Secondary contact number added successfully' });
  } catch (error) {
    console.error('Error adding Contact number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve users account data
app.get('/usersAccount', async (req, res) => {
  try {
      const users = await dbOperation.getAllUserAccount();
      res.status(200).json(users);
  } catch (error) {
      console.error('Error retrieving employee data:', error);
      res.status(500).send('Error retrieving employee data.');
  }
});
// Endpoint to retrieve employee by ID
app.get('/retrieve/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await dbOperation.getEmployeeById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to fetch all employee data
app.get('/api/getAllEmployees', async (req, res) => {
  try {
      const employees = await dbOperation.getAllEmployees();
      console.log("Fetched employees:", employees);
      res.status(200).json(employees);
  } catch (error) {
      console.error('Error fetching employee data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to update employee by ID
app.put('/updateEmployee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint for updating employee information by id
app.put('/updateEmployeeInfo/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;

  // Validate HRANType is chosen
  if (!updatedEmployeeData.HRANType) {
      return res.status(400).json({ message: 'HRANType is required when updating the employee information.' });
  }

  try {
      const result = await dbOperation.updateEmployeeInfoById(employeeId, updatedEmployeeData);
      if (!result) {
          return res.status(404).json({ message: 'Employee information not found' });
      }
      res.json({ message: 'Employee information updated successfully' });
  } catch (error) {
      console.error('Error updating employee information:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint for adding records to the History table
app.post('/addToHistory', async (req, res) => {
  const historyData = req.body;

  console.log('Received historyData:', historyData); // Debugging statement

  try {
      // Insert the record into the History table
      const result = await dbOperation.addToHistory(historyData);

      // Respond with success message
      res.status(201).json({ message: 'Record added to History successfully' });
  } catch (error) {
      console.error('Error adding record to History:', error);
      res.status(500).json({ message: 'Failed to add record to History' });
  }
});
// API endpoint for getting current employee information by ID
app.get('/getEmployeeInfo/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employeeData = await dbOperation.getEmployeeInfoById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employeeData);
  } catch (error) {
    console.error('Error fetching employee information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//api endpoint for updating employee address by id
app.put('/updateEmployeeAddress/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeAddressById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee address not found' });
    }
    res.json({ message: 'Employee address updated successfully' });
  } catch (error) {
    console.error('Error updating address information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating employee address by id
app.put('/updateEmployeeEducation/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeEducationById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee education details not found' });
    }
    res.json({ message: 'Employee education details updated successfully' });
  } catch (error) {
    console.error('Error updating education details information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating project details
app.put('/updateProject/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeProjectById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee project details not found' });
    }
    res.json({ message: 'Employee project details updated successfully' });
  } catch (error) {
    console.error('Error updating project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating  shift details
app.put('/updateShift/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeShiftById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee shift details not found' });
    }
    res.json({ message: 'Employee shift details updated successfully' });
  } catch (error) {
    console.error('Error updating shift details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating delivery unit details
app.put('/updateDU/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeDUById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee delivery unit details not found' });
    }
    res.json({ message: 'Employee delivery unit details updated successfully' });
  } catch (error) {
    console.error('Error updating delivery unit details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//api endpoint for updating deaprtment details
app.put('/updateDepartment/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmployeeDepartmentById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee department details not found' });
    }
    res.json({ message: 'Employee department details updated successfully' });
  } catch (error) {
    console.error('Error updating department details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  // API endpoint for inserting a new dependent record
  app.post('/addDependent/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const newDependentData = req.body;
    try {
      // const result = await dbOperation.insertDependent(employeeId, newDependentData);
      await dbOperation.insertDependent(employeeId, newDependentData); 
      res.json({ message: 'Dependent record added successfully' });
    } catch (error) {
      console.error('Error adding dependent record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// Endpoint to retrieve dependents by Employee ID
app.get('/retrieve/dependents/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const dependents = await dbOperation.getDependentsByEmployeeId(employeeId);
    res.json(dependents);
  } catch (error) {
    console.error('Error fetching dependents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to update dependent details by DependentId
app.put('/updateDependent/:dependentId', async (req, res) => {
  const { dependentId } = req.params;
  const updatedDependentData = req.body;

  try {
    const result = await dbOperation.updateDependentById(dependentId, updatedDependentData);

    if (!result) {
      return res.status(404).json({ message: 'Dependent not found' });
    }

    res.json({ message: 'Dependent details updated successfully' });
  } catch (error) {
    console.error('Error updating dependent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint for updating emergency contact details
app.put('/updateEmerContact/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;
  try {
    const result = await dbOperation.updateEmergencyContactById(employeeId, updatedEmployeeData);
    if (!result) {
      return res.status(404).json({ message: 'Employee emergency contact not found' });
    }
    res.json({ message: 'Employee emergency contact details updated successfully' });
  } catch (error) {
    console.error('Error updating emergency contact details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmployee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
      const result = await dbOperation.deleteEmployeeById(employeeId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete all employee data
app.delete('/api/deleteAllEmployeeData', async (req, res) => {
  try {
    const result = await dbOperation.deleteAllEmployeeData(); // Call the function

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error deleting all employee data:', error);
    res.status(500).json({ message: 'Failed to delete all employee data. Please try again.' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteUserAccount/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await dbOperation.deleteUsersById(userId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
      console.error('Error deleting User account:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmpInfo/:empInfoId', async (req, res) => {
  const { empInfoId } = req.params;
  try {
      const result = await dbOperation.deleteEmpInfoById(empInfoId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'employee Info deleted successfully' });
  } catch (error) {
      console.error('Error deleting employee Info:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// DELETE endpoint to delete an employee by ID
app.delete('/deleteEmContact/:emergencyNumId', async (req, res) => {
  const { emergencyNumId } = req.params;
  try {
      const result = await dbOperation.deleteEmContactById(emergencyNumId);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Emergency Contact deleted successfully' });
  } catch (error) {
      console.error('Error deleting emergency Contac:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint for inserting a new compensation benefits record
app.post('/addCompBen/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const newCompBenData = req.body;
  try {
    await dbOperation.insertCompBen(employeeId, newCompBenData); 
    res.json({ message: 'Compensation benefit added successfully' });
  } catch (error) {
    console.error('Error adding compensation benefit record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve compensation benefits by Employee ID
app.get('/retrieve/compBen/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    const compBen = await dbOperation.getCompBenByEmployeeId(employeeId);
    if (compBen.length === 0) {
      return res.status(404).json({ message: 'No compensation benefits found for the given Employee ID' });
    }
    res.json(compBen);
  } catch (error) {
    console.error('Error fetching compensation benefits:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// Endpoint to update compensation benefits details by CompBenId
app.put('/updateCompBen/:compBenId', async (req, res) => {
  const { compBenId } = req.params;
  const updatedcompBenData = req.body;

  try {
    const result = await dbOperation.updateCompBenById(compBenId, updatedcompBenData);

    if (!result) {
      return res.status(404).json({ message: 'Compensation benefit details not found' });
    }

    res.json({ message: 'Compensation benefit details updated successfully' });
  } catch (error) {
    console.error('Error updating compensation benefit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to retrieve history by Employee ID
app.get('/retrieve/history/:employeeId', async (req, res) => {
  // Retrieve employeeId from request parameters
  const { employeeId } = req.params;

  // Check if employeeId is provided
  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    // Fetch history data from the database based on the employee ID
    const history = await dbOperation.getHistoryByEmployeeId(employeeId);
    if (history.length === 0) {
      return res.status(404).json({ message: 'No history found for the given Employee ID' });
    }
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//EMPLOYEE DB ENDPOINTS ENDS HERE




app.post('/upload', upload.single('sssloanPDF'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Here you can save the file to the database
    await dbOperationEmp.insertPDF(req.file.filename); // Pass filename to the insertPDF function

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/hrsubmission', async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // }
  
    const result = await dbOperationEmp.getSubmissions();
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/submissionpdf',  upload.single('SubmissionID'), async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // } 
  
    const result = await dbOperationEmp.getPDF(req.body.SubmissionID);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/usersubmission',  upload.single('EmpId'), async (req, res) => {

  try {

    // if (!req.body) {
    //   return res.status(400).json({ error: 'No Employee ID' });
    // } 
  
    const result = await dbOperationEmp.getUserSubmissions(req.body.EmpId);
    console.log(req.body.EmpId);
    res.status(200).json({ result: result });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/resubmitPDF', upload.fields([{ name: 'newPDF' }, { name: 'requirementName' }, {name: 'PdfFileID'}, {name: 'SubmissionID'}]), async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const { requirementName, PdfFileID, SubmissionID} = req.body;

    uploadedFiles.newPDF.forEach((file, index) => {
      let setrequirementName;
      if (uploadedFiles.newPDF.length === 1) {
        setrequirementName = requirementName;
      } else {
        setrequirementName = requirementName[index];
      }

      const FileName = file.originalname;
      const ContentType = "pdf";
      const setFileSize = file.size;

      const now = new Date();
      const UploadDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

      const PdfData = file;
      const Resubmit = "0";
      const ResubmitReason = "";
      const setSubmissionID = SubmissionID;
      const setPdfFileID = PdfFileID[index]; 

      
      const dbData = new submissionResubmit(setrequirementName, FileName, ContentType, setFileSize, UploadDate, Resubmit, ResubmitReason, setSubmissionID, setPdfFileID);
      const dbDataPDF = new ResubmitPDFContructor(PdfData);
      
      dbOperationEmp.updateResubmit(dbData, dbDataPDF);
    });

    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//SSS Loan
app.post('/SSSloan', upload.fields([{ name: 'currentEmployeeId' }, { name: 'Pay_Slip' }, { name: 'Disclosure_Statement' }, { name: 'Application_Date' }, { name: 'Transaction_Number' }]), async (req, res) => {
  try {
      const TransactionType = "SSS Loan";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3"

      const { Application_Date, Transaction_Number,currentEmployeeId } = req.body;
      const TypeOfDelivery = "";
      const paySlipFiles = req.files['Pay_Slip']; // Assuming Pay_Slip can have multiple files
      const disclosureStatementFiles = req.files['Disclosure_Statement']; // Assuming Disclosure_Statement can have multiple files
      const RequestType = "";
      const OtherReq = "";
      
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const PlaceOfConfinement ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultTwoFile(paySlipFiles,disclosureStatementFiles);

      // Pass the required parameters to insertPDF function
      await dbOperationEmp.sssLoan(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


//Pag-ibig Landbank Card
app.post('/PagIbigLandbankCard', upload.fields([{ name: 'currentEmployeeId' }, { name: 'Application_Form' }, { name: 'paySlipFiles' }, { name: 'Valid_ID' } ]), async (req, res) => {
  try {
      const {currentEmployeeId} = req.body;

      const TransactionType = "Pag-Ibig Landbank Card";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";
      
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const ApplicationFormFile = req.files['Application_Form'];
      const paySlipFiles = req.files['paySlipFiles'];
      const Valid_ID= req.files['Valid_ID'];

      const PlaceOfConfinement ="";
      const BankAccount ="";
      
      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultThreeFile(ApplicationFormFile,paySlipFiles,Valid_ID);

      // Pass the required parameters to insertPDF function
      await dbOperationEmp.PagIbigLandbankCard(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//Pag-ibig Virtual Account
app.post('/PagIbigVirtualAccount', upload.fields([{ name: 'currentEmployeeId' }, { name: 'paySlip' }, { name: 'Screenshot_Virtual' }, { name: 'GrossIncome' } ]), async (req, res) => {
  try {
      const {currentEmployeeId} = req.body;

      const TransactionType = "Pag-Ibig Virtual Account";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";

      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const paySlip = req.files['paySlip'];
      const Screenshot_Virtual = req.files['Screenshot_Virtual'];
      const GrossIncome= req.files['GrossIncome'];

      const PlaceOfConfinement ="";
      const BankAccount ="";
      
      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
       const dbDataPDF = new DefaultThreeFile(Screenshot_Virtual,paySlip,GrossIncome);

      // Pass the required parameters to insertPDF function
      await dbOperationEmp.PagIbigVirtualAccount(dbData,dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/MaternityNotification', upload.fields([{ name: 'currentEmployeeId' }, { name: 'Notication_Form' }, { name: 'Maternity_Eligibility' }, { name: 'Credit_Form' }, { name: 'Medical_Reports' } ]), async (req, res) => {
  try {
    const {currentEmployeeId} = req.body;
    const TransactionType = "Maternity Notication";
    const Status = "Pending";
    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const TurnAround = "3"
    const Application_Date = "";
    const Transaction_Number = "";
    const TypeOfDelivery = "";
    const RequestType = "";
    const OtherReq = "";

    const EmpId = currentEmployeeId;
    const ErroneousName = "";
    const CorrectName = "";
    const RequestTitle = "";
    const Description = "";
    const CompletionDate= "";
    const ReasonType="";
    const DeductionFor="";
    
    const Notication_Form = req.files['Notication_Form'];
    const Maternity_Eligibility = req.files['Maternity_Eligibility'];
    const Credit_Form= req.files['Credit_Form'];
    const Medical_Reports= req.files['Medical_Reports'];

    const PlaceOfConfinement ="";
    const BankAccount ="";
    
    const ReasonForInfoUpdate ="";
    const CurrentFullname ="";
    const NewFullname ="";
    const CurrentCivilStatus ="";
    const NewCivilStatus ="";

    const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
    const dbDataPDF = new DefaultSetterFile(Notication_Form,Maternity_Eligibility,Credit_Form,Medical_Reports);
      
      // console.log(dbData);
      // Pass the required parameters to insertPDF function
      await dbOperationEmp.MaternityNotification(dbData, dbDataPDF);
      
      res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {``
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/MaternityBenefit', upload.fields([
  { name: 'selected' }, 
  { name: 'currentEmployeeId' }, 
  { name: 'Application_Form' }, 
  { name: 'LiveBirthCert' }, 
  { name: 'SoloParent' }, 
  { name: 'ProofPregnancy' }, 
  { name: 'HospitalRec' }, 
  { name: 'DeathCert' }
]), async (req, res) => {
  try {
      const {selected} = req.body;
      const {currentEmployeeId} = req.body;
      const Application_Form = req.files['Application_Form'];
      const LiveBirthCert = req.files['LiveBirthCert'];
      const SoloParent = req.files['SoloParent'];
      const ProofPregnancy = req.files['ProofPregnancy'];
      const HospitalRec = req.files['HospitalRec'];
      const DeathCert = req.files['DeathCert'];

      const TransactionType = "Maternity Benefit";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3"
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const OtherReq = "";
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";
    
      const EmpId = currentEmployeeId;

      if(selected === "1"){
        const TypeOfDelivery = "Live Child Birth";
        
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultThreeFile(Application_Form,LiveBirthCert,SoloParent);
        
        // Pass the required parameters to insertPDF function
        await dbOperationEmp.MaternityBenefit(dbData,dbDataPDF);
      }
      else if(selected === "2"){
        const TypeOfDelivery = "Miscarriage / Emergency Termination of Pregnancy / Ectopic Pregnancy";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultThreeFile(Application_Form,ProofPregnancy,HospitalRec);
        
        // Pass the required parameters to insertPDF function
        await dbOperationEmp.MaternityBenefit(dbData,dbDataPDF);
      }else if(selected === "3"){
        const TypeOfDelivery = "Still Birth / Fetal Death";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultTwoFile(Application_Form,DeathCert);
        
        // Pass the required parameters to insertPDF function
        await dbOperationEmp.MaternityBenefit(dbData,dbDataPDF);
      }
      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/CertificationRequestSSS', upload.fields([
  { name: 'selected' }, 
  { name: 'currentEmployeeId' }, 
  { name: 'StatementOfAccount' }, 
  { name: 'VerificationRequestForm' },
  { name: 'MonthlyContributions' },
  { name: 'SpecifyOtherRequest' }
]), async (req, res) => {
  try {
      const selectedNum = req.body.selected;
      const {currentEmployeeId} = req.body;
      const StatementOfAccount = req.files['StatementOfAccount'];
      const VerificationRequestForm = req.files['VerificationRequestForm'];
      const MonthlyContributions = req.files['MonthlyContributions'];
      const SpecifyOtherRequest = req.body.SpecifyOtherRequest;

      const TransactionType = "Certification Request SSS";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      

      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      if(selectedNum === "1"){
        const OtherReq = "";
        const RequestType = "SSS Unposted Loan Payment";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultTwoFile(StatementOfAccount,VerificationRequestForm);
        
        await dbOperationEmp.CertificationRequestSSS(dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const OtherReq = "";
        const RequestType = "SSS Unposted Contribution";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultTwoFile(MonthlyContributions,VerificationRequestForm);

        await dbOperationEmp.CertificationRequestSSS(dbData,dbDataPDF);
      
      }else if(selectedNum === "3"){
        const OtherReq = SpecifyOtherRequest;
        const RequestType = "SSS Other Information Update Request";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultOneFile(VerificationRequestForm);

        // Pass the required parameters to insertPDF function
        await dbOperationEmp.CertificationRequestSSS(dbData,dbDataPDF);
      }

      
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/PagIbigRequest', upload.fields([
  { name: 'selected' },
  { name: 'currentEmployeeId' },
  { name: 'StatementOfAccount' },
  { name: 'FormFromPagIbig' },
  { name: 'ErroneousName' },
  { name: 'CorrectName' },
]), async (req, res) => {
  try {
      const selectedNum = req.body.selected;
      const {currentEmployeeId} = req.body;
      const StatementOfAccount = req.files['StatementOfAccount'];
      const FormFromPagIbig = req.files['FormFromPagIbig'];
      
      const TransactionType = "Certification Request: PAG-IBIG";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";

      const EmpId = currentEmployeeId;

      const PlaceOfConfinement ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      if(selectedNum === "1"){
        const ErroneousName = "";
        const CorrectName = "";
        const RequestType = "PAG-IBIG Certificate of Remittance";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultOneFile(StatementOfAccount);
        
        // Pass the required parameters to insertPDF function
        await dbOperationEmp.CertificateOfRemittance(dbData,dbDataPDF);
      }
      else if(selectedNum === "2"){
        const ErroneousName = req.body.ErroneousName;
        const CorrectName = req.body.CorrectName;
        const RequestType = "PAG-IBIG Certificate of Oneness";
        const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
        const dbDataPDF = new DefaultOneFile(FormFromPagIbig);

        await dbOperationEmp.CertificateOfOneness(dbData,dbDataPDF);
      
      }
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/PHILHEALTHrequest', upload.fields([
  { name: 'selected' },
  { name: 'currentEmployeeId' }, 
  { name: 'selectedReason' },
  { name: 'EmailNotification' },
  { name: 'ProvidentApplicationForm' }
]), async (req, res) => {
  try {
      const selected = req.body.selected;
      const {currentEmployeeId} = req.body;
      const selectedReason = req.body.selectedReason;

      const EmailNotification = req.files['EmailNotification'];
      const ProvidentApplicationForm = req.files['ProvidentApplicationForm'];
      
      const TransactionType = "Certification Request: PHILHEALTH";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "5"
      const Application_Date = "";
      const Transaction_Number = "";
      const TypeOfDelivery = "";
      const RequestType = "";
      const OtherReq = "";
      const RequestTitle = "";
      const Description = "";
      const CompletionDate = "";
        
      const EmpId = currentEmployeeId;

      const ErroneousName = "";
      const CorrectName = "";
      const PlaceOfConfinement ="";
      const BankAccount ="";
      
      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      if(selected === "1"){
        if(selectedReason === "1"){
          const ReasonType = "Load is Fully-Paid";
          const DeductionFor = "SSS Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Due to Re-Loan";
          const DeductionFor = "SSS Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      }
      else if(selected === "2"){
        if(selectedReason === "1"){
          const ReasonType = "Load is Fully-Paid";
          const DeductionFor = "SSS Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Due to Re-Loan";
          const DeductionFor = "SSS Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(EmailNotification);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      else if(selected === "3"){
        if(selectedReason === "1"){
          const ReasonType = "Provident Fund";
          const DeductionFor = "PAG-IBIG Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Re-Loan";
          const DeductionFor = "PAG-IBIG Salary Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      else if(selected === "4"){
        if(selectedReason === "1"){
          const ReasonType = "Provident Fund";
          const DeductionFor = "PAG-IBIG Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }else if(selectedReason === "2"){
          const ReasonType = "Re-Loan";
          const DeductionFor = "PAG-IBIG Calamity Loan";
          const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
          const dbDataPDF = new DefaultOneFile(ProvidentApplicationForm);

          await dbOperationEmp.PHILHEALTHrequest(dbData,dbDataPDF);
        }
      
      }
      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/SicknessNotification', upload.fields([
  { name: 'SicknessNotificationForm' },
  { name: 'currentEmployeeId' },
  { name: 'PlaceOfConfinement' },
  { name: 'MedicalCertificate' },
  { name: 'SupportingDocuments' },
  { name: 'ECSupportingDocuments' }
]), async (req, res) => {
  try {
      const PlaceOfConfinement = req.body.PlaceOfConfinement;
      const {currentEmployeeId} = req.body;
      const SicknessNotificationForm = req.files['SicknessNotificationForm'];
      const MedicalCertificate = req.files['MedicalCertificate'];
      const SupportingDocuments = req.files['SupportingDocuments'];
      const ECSupportingDocuments = req.files['ECSupportingDocuments'];
      
      const TransactionType = "SSS Sickness Notification";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = ""
      const CompletionDate = "";
      const ReasonType ="";
      const DeductionFor ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultSetterFile(SicknessNotificationForm,MedicalCertificate,SupportingDocuments,ECSupportingDocuments);
      await dbOperationEmp.SicknessNotification(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/SicknessApproval', upload.fields([
  { name: 'SicknessEligibility' },
  { name: 'currentEmployeeId' },
  { name: 'BankAccount' }
]), async (req, res) => {
  try {
      const BankAccount = req.body.BankAccount;
      const SicknessEligibility = req.files['SicknessEligibility'];
      const {currentEmployeeId} = req.body;
      
      const TransactionType = "SSS Sickness Approval";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const RequestTitle = "";
      const Description = ""
      const CompletionDate = "";
      const ReasonType ="";
      const DeductionFor ="";
      const PlaceOfConfinement ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultOneFile(SicknessEligibility);
      await dbOperationEmp.SicknessApproval(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/UpdateEmployeeInformation', upload.fields([
  { name: 'currentEmployeeId' },
  { name: 'ReasonForInfoUpdate' },
  { name: 'SignedLetter' },
  { name: 'CurrentFullname' },
  { name: 'NewFullname' },
  { name: 'CurrentCivilStatus' },
  { name: 'NewCivilStatus' },
  { name: 'OtherContract' },
]), async (req, res) => {
  try {

      const { ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus,currentEmployeeId} = req.body;
      const SignedLetter = req.files['SignedLetter'];
      const OtherContract = req.files['OtherContract'];

      const TransactionType = "Update Employee Information";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";
      const RequestTitle = "";
      const Description = "";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultTwoFile(SignedLetter, OtherContract);
      await dbOperationEmp.UpdateEmployeeInformation(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/OtherRequest', upload.fields([
  { name: 'currentEmployeeId' },
  { name: 'RequestTitle' },
  { name: 'Description' },
  { name: 'NeccesaryFile' }
]), async (req, res) => {
  try {

      const { RequestTitle, Description, currentEmployeeId } = req.body;
      const NeccesaryFile = req.files['NeccesaryFile'];
      
      const TransactionType = "Other Request";
      const Status = "Pending";
      const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const TurnAround = "3";
      const Application_Date = "";
      const Transaction_Number = "";
      const RequestType = "Other Request";
      const TypeOfDelivery = "";
      const OtherReq = "";
      const EmpId = currentEmployeeId;
      const ErroneousName = "";
      const CorrectName = "";
      const CompletionDate= "";
      const ReasonType="";
      const DeductionFor="";
      const PlaceOfConfinement ="";
      const BankAccount ="";

      const ReasonForInfoUpdate ="";
      const CurrentFullname ="";
      const NewFullname ="";
      const CurrentCivilStatus ="";
      const NewCivilStatus ="";

      const dbData = new thisDefaultContructor(TransactionType,Status,currentDate,TurnAround,Application_Date,Transaction_Number,RequestType,TypeOfDelivery,OtherReq,EmpId,ErroneousName,CorrectName,RequestTitle, Description,CompletionDate,ReasonType,DeductionFor,PlaceOfConfinement,BankAccount,ReasonForInfoUpdate, CurrentFullname, NewFullname, CurrentCivilStatus, NewCivilStatus);
      const dbDataPDF = new DefaultOneFile(NeccesaryFile);
      await dbOperationEmp.OtherRequest(dbData,dbDataPDF);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/UpdateRequest', upload.fields([
  { name: 'thisAction' },
  { name: 'thisSubmissionID' }
]), async (req, res) => {
  try {

      const { thisAction, thisSubmissionID} = req.body;
      
      await dbOperationEmp.UpdateRequest(thisAction, thisSubmissionID);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/GetLink', upload.fields([
  { name: 'LinkHeader' }
]), async (req, res) => {
  try {
    const LinkHeader = req.body.LinkHeader; 
    
    const linkData = await dbOperationEmp.LinkURL(LinkHeader);
    
    if (linkData) {
          res.status(200).json({ message: 'Link fetched successfully', data: linkData });
        } else {
          res.status(404).json({ message: 'Link not found' });
      }
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/setLink', async (req, res) => {
  try {
      const linkData = await dbOperationEmp.setLink();

      if (linkData) {
          res.status(200).json({ message: 'Links fetched successfully', data: linkData });
      } else {
          res.status(404).json({ message: 'Links not found' });
      }
  } catch (error) {
    console.error('Error fetching links:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}); 
      
app.post('/UpdateLink', upload.fields([
  { name: 'updatethisLabel' },
  { name: 'updatethisLink' }
]), async (req, res) => {
  try {

      const { updatethisLabel, updatethisLink } = req.body;
    
      await dbOperationEmp.UpdateLink(updatethisLabel, updatethisLink);

      res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));