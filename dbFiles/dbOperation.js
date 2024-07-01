const config = require("./dbConfig");
const sql = require("mssql");
const xlsx = require("xlsx");

//get employee id and password for login
const getEmployees = async (EmployeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, EmployeeId)
      .query(`
        SELECT UA.*, EI.EmployeeStatus, EI.Facility, EI.Level 
        FROM UserAccount UA
        JOIN EmployeeInfo EI ON UA.EmployeeId = EI.EmployeeId
        WHERE UA.EmployeeId = @EmployeeId
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  }
};
//to check if employee data exists
const getUserEmpId = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId",  sql.VarChar, employeeId)
      .query(`
          SELECT * FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId;
      `);
    
    // Return the user if found, or null if not found
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("Error fetching employee id:", error);
    throw new Error("Error fetching employee id");
  }
};
//check if  emp id and email address exist
const checkEmployeeAndEmail = async (employeeId, email) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("EmailAddress", sql.VarChar, email)
      .query(`
          SELECT * FROM EmpPersonalDetails 
          WHERE EmployeeId = @EmployeeId AND EmailAddress = @EmailAddress;
      `);
    
    // Return true if employee ID and email exist, otherwise false
    return result.recordset.length > 0;
  } catch (error) {
    console.error("Error checking employee ID and email:", error);
    throw new Error("Error checking employee ID and email");
  }
};

// Database operation to reset the user's password
const resetPassword = async (email, newPassword) => {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input("EmailAddress", sql.VarChar, email)
      .input("Password", sql.VarChar, newPassword)
      .query(`
        UPDATE UserAccount SET Password = @Password WHERE EmailAddress = @EmailAddress;
      `);
    
    // If the query was successful, return true
    return true;
  } catch (error) {
    console.error("Error resetting password in the database:", error);
    // If the query failed, return false
    return false;
  }
};
// Database operation to retrieve employee by ID
const getUserById = async (employeeId) => {
  try {
    const pool = await sql.connect(); 
    const request = pool.request();
    request.input('EmployeeId', sql.VarChar, employeeId);
    const result = await request.query('SELECT * FROM UserAccount WHERE EmployeeId = @EmployeeId');
    return result.recordset[0]; 
  } catch (error) {
    console.error('Error retrieving employee by ID:', error);
    throw error;
  }
};
// insert user account to USER ACCOUNT table
const insertEmployee = async (Employee) => {
  try {
    let pool = await sql.connect(config);
    let employee = await pool
      .request()
      .input("EmployeeId", Employee.EmployeeId)
      .input("LastName", Employee.LastName)
      .input("FirstName", Employee.FirstName)
      .input("MiddleName", Employee.MiddleName)
      .input("EmailAddress", Employee.EmailAddress)
      .input("Password", Employee.Password)
      .input("Role", Employee.Role)
      .query(`
              INSERT INTO UserAccount (EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role)
              VALUES (@EmployeeId, @LastName, @FirstName, @MiddleName, @EmailAddress, @Password, @Role)
          `);
    return employee;
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting employee");
  }
};
//insertion of the list of employee data to multiple table
const insertNewHire = async (newHire, password) => {
  try {
    let pool = await sql.connect(config);

    // Validate and convert bit fields
    const validateAndConvertBit = (value) => {
      if (value === "0" || value === "1") {
        return Boolean(parseInt(value));
      } else {
        throw new Error(
          "Invalid value for bit field. Please enter either '0' for 'yes' or '1' for 'no'."
        );
      }
    };

    // Insert into EmpPersonalDetails table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("EmployeeName", newHire.EmployeeName)
      .input("FirstName", newHire.FirstName)
      .input("MiddleName", newHire.MiddleName)
      .input("LastName", newHire.LastName)
      .input("MaidenName", newHire.MaidenName)
      .input("Birthdate", newHire.Birthdate)
      .input("Age", newHire.Age)
      .input("BirthMonth", newHire.BirthMonth)
      .input("AgeBracket", newHire.AgeBracket)
      .input("Gender", newHire.Gender)
      .input("MaritalStatus", newHire.MaritalStatus)
      .input("SSS", newHire.SSS)
      .input("PHIC", newHire.PHIC)
      .input("HDMF", newHire.HDMF)
      .input("TIN", newHire.TIN)
      .input("HmoProvider", newHire.HmoProvider)
      .input("HmoPolicyNumber", newHire.HmoPolicyNumber)
      .input("EmailAddress", newHire.EmailAddress).query(`
        INSERT INTO EmpPersonalDetails (EmployeeId, EmployeeName, FirstName, MiddleName, LastName, MaidenName, 
          Birthdate, Age, BirthMonth, AgeBracket, Gender, MaritalStatus, SSS, PHIC, HDMF, TIN, HmoProvider, HmoPolicyNumber, EmailAddress) 
        VALUES (@EmployeeId, @EmployeeName, @FirstName, @MiddleName, @LastName, @MaidenName,
          @Birthdate, @Age, @BirthMonth, @AgeBracket, @Gender, @MaritalStatus, @SSS, @PHIC, @HDMF, @TIN, @HmoProvider, @HmoPolicyNumber, @EmailAddress)
      `);
    //insert contact number to Contact table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ContactNumber", newHire.ContactNumber)
      .query(`INSERT INTO Contact (EmployeeId, ContactNumber)
      VALUES (@EmployeeId, @ContactNumber)`);

    // Insert into Address table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("HouseNumber", newHire.HouseNumber)
      .input("CompleteAddress", newHire.CompleteAddress)
      .input("Barangay", newHire.Barangay)
      .input("CityMunicipality", newHire.CityMunicipality)
      .input("Province", newHire.Province)
      .input("Region", newHire.Region)
      .input("Country", newHire.Country)
      .input("Zipcode", newHire.Zipcode)
      .input("LandMark", newHire.LandMark)
      .input("IsPermanent", validateAndConvertBit(newHire.IsPermanent))
      .input("IsEmergency", validateAndConvertBit(newHire.IsEmergency)).query(`
      INSERT INTO Address (EmployeeId, HouseNumber, CompleteAddress, Barangay, CityMunicipality, Province, 
        Region, Country, Zipcode, LandMark, IsPermanent, IsEmergency) 
      VALUES (@EmployeeId, @HouseNumber, @CompleteAddress, @Barangay, @CityMunicipality, @Province,
        @Region, @Country, @Zipcode, @LandMark, @IsPermanent, @IsEmergency)
    `);
    //insert into Education table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("EducationLevel", newHire.EducationLevel)
      .input("School", newHire.School)
      .input("Degree", newHire.Degree)
      .input("MajorCourse", newHire.MajorCourse)
      .input("HonorRank", newHire.HonorRank)
      .input("UnitsEarned", newHire.UnitsEarned)
      .input("DateFrom", newHire.DateFrom)
      .input("DateTo", newHire.DateTo)
      .input("Session", newHire.Session)
      .input("MonthCompleted", newHire.MonthCompleted)
      .input("Completed", newHire.Completed).query(`
    INSERT INTO Education (EmployeeId, EducationLevel, School, Degree, MajorCourse, HonorRank, UnitsEarned, DateFrom, 
      DateTo, Session, MonthCompleted, Completed)
      VALUES (@EmployeeId, @EducationLevel, @School, @Degree, @MajorCourse, @HonorRank, @UnitsEarned, @DateFrom, 
        @DateTo, @Session, @MonthCompleted, @Completed)
    `);

// Insert into Emergency Contact Address table
if (newHire.IsEmergency) {
const addressResult = await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("HouseNumber", newHire.EmContactHouseNo)
    .input("CompleteAddress", newHire.EmContactCompleteAddress)
    .input("Barangay", newHire.EmContactBarangay)
    .input("CityMunicipality", newHire.EmContactCityMunicipality)
    .input("Province", newHire.EmContactProvince)
    .input("Region", newHire.EmContactRegion)
    .input("Country", newHire.EmContactCountry)
    .input("Zipcode", newHire.EmContactZipcode)
    .input("LandMark", newHire.EmContactLandMark)
    .input("IsPermanent", validateAndConvertBit(newHire.Is_Permanent))
    .input("IsEmergency", validateAndConvertBit(newHire.Is_Emergency))
    .query(`
        INSERT INTO Address (EmployeeId, HouseNumber, CompleteAddress, Barangay, CityMunicipality, Province, 
            Region, Country, Zipcode, LandMark, IsPermanent, IsEmergency) 
        OUTPUT INSERTED.AddressID
        VALUES (@EmployeeId, @HouseNumber, @CompleteAddress, @Barangay, @CityMunicipality, @Province,
            @Region, @Country, @Zipcode, @LandMark, @IsPermanent, @IsEmergency);
    `);
        

const addressID = addressResult.recordset[0].AddressID;

// Insert contact number into EmergencyContact Contact table
const contactResult = await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("ContactNumber", newHire.EmContactPhoneNumber)
    .query(`
        INSERT INTO Contact (EmployeeId, ContactNumber)
        OUTPUT INSERTED.ContactId
        VALUES (@EmployeeId, @ContactNumber);
    `);

const contactID = contactResult.recordset[0].ContactId;

// Insert into EmergencyContact table
await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("EmContactFullName", newHire.EmContactFullName)
    .input("AddressID", addressID)
    .input("ContactId", contactID)
    .query(`
        INSERT INTO EmergencyContactNumber (EmployeeId, EmContactFullName, ContactId, AddressID)
        VALUES (@EmployeeId, @EmContactFullName, @ContactId, @AddressID);
    `);
  }

    // Insert into DeliveryUnit table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("DUCode", newHire.DUCode)
      .input("DUName", newHire.DUName)
      .input("Is_Active", validateAndConvertBit(newHire.Is_Active)).query(`
  INSERT INTO DeliveryUnit ( EmployeeId, DUCode, DUName, Is_Active)
  VALUES ( @EmployeeId, @DUCode, @DUName, @Is_Active)
`);
    // Insert into Project table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ProjectCode", newHire.ProjectCode)
      .input("ProjectName", newHire.ProjectName)
      .input("is_Active", validateAndConvertBit(newHire.is_Active)).query(`
    INSERT INTO Project(EmployeeId, DUID, ProjectCode, ProjectName, is_Active)
    SELECT @EmployeeId, DU.DUID, @ProjectCode, @ProjectName, @is_Active
    FROM DeliveryUnit DU
    WHERE DU.EmployeeId = @EmployeeId
`);

    //Insert into Shift table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ShiftCode", newHire.ShiftCode)
      .input("ShiftName", newHire.ShiftName)
      .input("LevelID", newHire.LevelID)
      .input("ShiftType", newHire.ShiftType).query(`
      INSERT INTO Shift ( EmployeeId, ShiftCode, ShiftName, LevelID, ShiftType)
      VALUES ( @EmployeeId, @ShiftCode, @ShiftName, @LevelID, @ShiftType)
      `);
    //insert into Department table
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("DUID", newHire.DUID)
      .input("DepartmentName", newHire.DepartmentName).query(`
      INSERT INTO Department (EmployeeId, DUID, DepartmentName)
      SELECT @EmployeeId, DU.DUID, @DepartmentName
    FROM DeliveryUnit DU
    WHERE DU.EmployeeId = @EmployeeId
      `);

    //INSERT INTO PRODUCT
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("ProdCode", newHire.ProdCode)
      .input("ProdDesc", newHire.ProdDesc).query(`
      INSERT INTO Product (EmployeeId, ProdCode, ProdDesc)
      VALUES (@EmployeeId, @ProdCode, @ProdDesc)`);
    // INSERT INTO DEPENDENT
    await pool
      .request()
      .input("EmployeeId", newHire.EmployeeId)
      .input("FullName", newHire.FullName)
      .input("Relationship", newHire.Relationship)
      .input("DateOfBirth", newHire.DateOfBirth)
      .input("Occupation", newHire.Occupation)
      .input("Address", newHire.Address)
      .input("City", newHire.City)
      .input("DepProvince", newHire.DepProvince)
      .input("PostalCode", newHire.PostalCode)
      .input("PhoneNum", newHire.PhoneNum)
      .input("Beneficiary", newHire.Beneficiary)
      .input("BeneficiaryDate", newHire.BeneficiaryDate)
      .input("Insurance", newHire.Insurance)
      .input("InsuranceDate", newHire.InsuranceDate)
      .input("Remarks", newHire.Remarks)
      .input("CompanyPaid", newHire.CompanyPaid)
      .input("HMOProvider", newHire.HMOProvider)
      .input("HMOPolicyNumber", newHire.HMOPolicyNumber)
      .input("TypeOfCoverage", newHire.TypeOfCoverage).query(`
      INSERT INTO Dependent 
      (
        EmployeeId, FullName, Relationship, DateOfBirth, Occupation,
        Address, City, DepProvince, PostalCode, PhoneNum, Beneficiary,
        BeneficiaryDate, Insurance, InsuranceDate, Remarks, CompanyPaid,
        HMOProvider, HMOPolicyNumber, TypeOfCoverage
      )
      VALUES 
      (
        @EmployeeId, @FullName, @Relationship, @DateOfBirth, @Occupation,
        @Address, @City, @DepProvince, @PostalCode, @PhoneNum, @Beneficiary,
        @BeneficiaryDate, @Insurance, @InsuranceDate, @Remarks, @CompanyPaid,
        @HMOProvider, @HMOPolicyNumber, @TypeOfCoverage
      )`);
    // Insert into EmployeeInformation table with validated bit fields
    await pool
    .request()
    .input("EmployeeId", newHire.EmployeeId)
    .input("HRANID", newHire.HRANID)
    .input("DateHired", newHire.DateHired)
    .input("Tenure", newHire.Tenure)
    .input("Level", newHire.Level)
    .input("Department", newHire.Department)
    .input("EmploymentStatus", newHire.EmploymentStatus)
    .input("EmployeeStatus", newHire.EmployeeStatus)
    .input("WorkWeekType", newHire.WorkWeekType)
    .input("WorkArrangement", newHire.WorkArrangement)
    .input("RateClass", newHire.RateClass)
    .input("Rate", newHire.Rate)
    .input("ManagerID", newHire.ManagerID)
    .input("ManagerName", newHire.ManagerName)
    .input("PMPICID", newHire.PMPICID)
    .input("PMPICIDName", newHire.PMPICIDName)
    .input("DUHID", newHire.DUHID)
    .input("DUHName", newHire.DUHName)
    .input("IsManager", validateAndConvertBit(newHire.IsManager))
    .input("IsPMPIC", validateAndConvertBit(newHire.IsPMPIC))
    .input(
      "IsIndividualContributor",
      validateAndConvertBit(newHire.IsIndividualContributor)
    )
    .input("IsActive", validateAndConvertBit(newHire.IsActive))
    .input("HRANType", newHire.HRANType)
    .input("TITOType", newHire.TITOType)
    .input("Position", newHire.Position)
    .input("PositionLevel", newHire.PositionLevel)
    .input("IsDUHead", validateAndConvertBit(newHire.IsDUHead))
    .input("Facility", newHire.Facility)
    .input("EmployeeRole", newHire.EmployeeRole)
    .input("EmployeeCategory", newHire.EmployeeCategory)
    .query(`
    INSERT INTO EmployeeInfo (
      EmployeeId, ProjectId, DepartmentId, ProdId, ShiftId, DUID,
      HRANID, DateHired, Tenure, Level, EmploymentStatus, EmployeeStatus,
      WorkWeekType, WorkArrangement, RateClass, Rate, ManagerID, ManagerName, PMPICID,
      PMPICIDName, DUHID, DUHName, IsManager, IsPMPIC, IsIndividualContributor, IsActive,
      HRANType, TITOType, Position, IsDUHead, Facility, EmployeeRole, EmployeeCategory
    )
    SELECT 
      @EmployeeId, P.ProjectId, D.DepartmentId, Pr.ProdId, S.ShiftId, DU.DUID, 
      @HRANID, @DateHired, @Tenure, @Level, @EmploymentStatus, 
      @EmployeeStatus, @WorkWeekType, @WorkArrangement, @RateClass, @Rate, 
      @ManagerID, @ManagerName, @PMPICID, @PMPICIDName, @DUHID, @DUHName, 
      @IsManager, @IsPMPIC, @IsIndividualContributor, @IsActive, @HRANType, 
      @TITOType, @Position, @IsDUHead, @Facility, @EmployeeRole, @EmployeeCategory
    FROM 
      Project P, Department D, Product Pr, Shift S,
      DeliveryUnit DU
    WHERE 
      P.EmployeeId = @EmployeeId
      AND D.EmployeeId = @EmployeeId
      AND Pr.EmployeeId = @EmployeeId
      AND S.EmployeeId = @EmployeeId
      AND DU.EmployeeId = @EmployeeId
  `);

    //insertion of user account
    await pool
      .request()
      .input('EmployeeId', newHire.EmployeeId)
      .input('LastName', newHire.LastName)
      .input('FirstName', newHire.FirstName)
      .input('MiddleName', newHire.MiddleName)
      .input('EmailAddress', newHire.EmailAddress)
      .input('Password', password)
      .input('Role', newHire.Role)
    //  .input('Role', newHire.Role || 'Employee')
      .query(`
        INSERT INTO UserAccount (EmployeeId, LastName, FirstName, MiddleName, EmailAddress, Password, Role)
        VALUES (@EmployeeId, @LastName, @FirstName, @MiddleName, @EmailAddress, @Password, @Role)
      `);

    return 'Data successfully uploaded and account has been created.';
  } catch (error) {
    console.error('Error occurred while inserting new data:', error);
    throw new Error('Failed to insert new data.');
  }
};
//update password / changing of password
const updateUserPassword = async (employeeId, newPassword) => {
  try {
    const pool = await sql.connect(config); 
    const request = pool.request();
    const query = `
      UPDATE UserAccount 
      SET Password = @Password,
          ChangePasswordRequired = 0  -- Set the flag to indicate password change is not required
      WHERE EmployeeId = @EmployeeId
    `;
    request.input("EmployeeId", sql.VarChar, employeeId);
    request.input("Password", sql.VarChar, newPassword);
    const result = await request.query(query); // Execute the query
    console.log("Password updated successfully");
    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Function to insert a new contact record into the database
const getAddNewContactId = async (employeeId, newContactData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('EmployeeId', sql.VarChar, employeeId)
      .input('SecondaryContactNum', sql.VarChar(255), newContactData.newContactNumber)
      .query(`
            UPDATE Contact
            SET SecondaryContactNum = @SecondaryContactNum
            WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error('Error inserting contact record:', error);
    throw error;
  }
};
//retrieve employee data 
const getAllNewHireEmployees = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
    .query(`
    SELECT 
    EP.EmployeeId,
    EP.EmployeeName,
    EI.Facility,
    EI.EmployeeStatus,
    EI.EmploymentStatus,
    EI.EmployeeRole,
    EI.DateHired,
    EI.Position,
    EI.Level,
    EI.WorkArrangement,
    EI.WorkWeekType,
    PR.ProjectCode,
    Dept.DepartmentName,
    DU.DUName,
    SHFT.ShiftCode,
    SHFT.ShiftName,
    SHFT.ShiftType
    FROM EmpPersonalDetails AS EP
    INNER JOIN EmployeeInfo AS EI ON EP.EmployeeId = EI.EmployeeId
    LEFT JOIN Project AS PR ON EP.EmployeeId = PR.EmployeeId
    LEFT JOIN DeliveryUnit AS DU ON EP.EmployeeId = DU.EmployeeId
    LEFT JOIN Department AS Dept ON EP.EmployeeId = Dept.EmployeeId
    LEFT JOIN Shift AS SHFT ON EP.EmployeeId = SHFT.EmployeeId
    WHERE EI.EmployeeId IS NOT NULL;
 
    `);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching new hire employees:", error);
    throw error;
  }
  };

// Retrieve all employees from the database
const getAllEmployees = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`
    SELECT 
    PD.EmployeeId,
    UA.Role,
    PD.FirstName,
    PD.LastName,
    PD.Birthdate,
    PD.MiddleName, 
    PD.MaidenName,
    PD.EmployeeName,
    EI.*,
    ADDRESS.CompleteAddress AS EmContactCompleteAddress,
    ADDRESS.HouseNumber AS EmContactHouseNo,
    ADDRESS.Barangay AS EmContactBarangay,
    ADDRESS.CityMunicipality AS EmContactCityMunicipality,
    ADDRESS.Province AS EmContactProvince,
    ADDRESS.Region AS EmContactRegion,
    ADDRESS.Country AS EmContactCountry,
    ADDRESS.ZipCode AS EmContactZipcode,
    ADDRESS.LandMark AS EmContactLandMark,
    ADDRESS.IsPermanent AS Is_Permanent,
    ADDRESS.IsEmergency AS Is_Emergency,
    CONTACT.ContactNumber AS EmContactPhoneNumber,
    EDUC.*,
    EC.*,    
    SHFT.*,
    COMPBEN.*,
    DEPDNT.*,   
    DU.DUCode,
    DU.DUName AS DUName,
    DEPT.DepartmentName,
    PROD.*
FROM (
    SELECT DISTINCT EmployeeId FROM EmpPersonalDetails
) AS DistinctEmployeeIds
INNER JOIN EmpPersonalDetails AS PD ON DistinctEmployeeIds.EmployeeId = PD.EmployeeId
INNER JOIN EmployeeInfo AS EI ON PD.EmployeeId = EI.EmployeeId
INNER JOIN Address AS ADDRESS ON PD.EmployeeId = ADDRESS.EmployeeId
INNER JOIN Contact AS CONTACT ON PD.EmployeeId = CONTACT.EmployeeId
INNER JOIN Education AS EDUC ON PD.EmployeeId = EDUC.EmployeeId
INNER JOIN UserAccount AS UA ON PD.EmployeeId = UA.EmployeeId
LEFT JOIN EmergencyContactNumber AS EC ON PD.EmployeeId = EC.EmployeeId
LEFT JOIN DeliveryUnit AS DU ON PD.EmployeeId = DU.EmployeeId
LEFT JOIN Department AS DEPT ON PD.EmployeeId = DEPT.EmployeeId
LEFT JOIN Shift AS SHFT ON PD.EmployeeId = SHFT.EmployeeId
LEFT JOIN CompensationBenefits AS COMPBEN ON PD.EmployeeId = COMPBEN.EmployeeId
LEFT JOIN Dependent AS DEPDNT ON PD.EmployeeId = DEPDNT.EmployeeId
LEFT JOIN Product AS PROD ON PD.EmployeeId = PROD.EmployeeId;
    `);

     const employees = result.recordset.reduce((acc, employee) => {
      if (employee.EmployeeId && !acc[employee.EmployeeId]) {
          acc[employee.EmployeeId] = employee;
      }
      return acc;
  }, {});

  return Object.values(employees);

  } catch (error) {
    console.error("Error fetching all employees:", error);
    throw error;
  }
};

// Retrieve new hire employees for the current month
const getAllCountNewHireEmployees = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(`
        SELECT 
        EP.EmployeeId,
        EP.EmployeeName,
        EI.Facility,
        EI.EmployeeStatus,
        EI.EmploymentStatus,
        EI.EmployeeRole,
        EI.DateHired,
        EI.Position,
        EI.Level,
        EI.WorkArrangement,
        EI.WorkWeekType,
        PR.ProjectCode,
        Dept.DepartmentName,
        DU.DUName,
        SHFT.ShiftCode,
        SHFT.ShiftName,
        SHFT.ShiftType
        FROM EmpPersonalDetails AS EP
        INNER JOIN EmployeeInfo AS EI ON EP.EmployeeId = EI.EmployeeId
        LEFT JOIN Project AS PR ON EP.EmployeeId = PR.EmployeeId
        LEFT JOIN DeliveryUnit AS DU ON EP.EmployeeId = DU.EmployeeId
        LEFT JOIN Department AS Dept ON EP.EmployeeId = Dept.EmployeeId
        LEFT JOIN Shift AS SHFT ON EP.EmployeeId = SHFT.EmployeeId
        WHERE TRY_CAST(EI.DateHired AS DATE) >= CAST(DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0) AS DATE)
          AND TRY_CAST(EI.DateHired AS DATE) < CAST(DATEADD(month, DATEDIFF(month, 0, GETDATE()) + 1, 0) AS DATE);
      `);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching new hire employees:", error);
    throw error;
  }
};
// Retrieve new hire count by month for the current year
const getMonthlyNewHireCount = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(`
        SELECT
          DATEPART(month, TRY_CAST(DateHired AS DATE)) AS Month,
          COUNT(*) AS NewHireCount
        FROM EmployeeInfo
        WHERE DATEPART(year, TRY_CAST(DateHired AS DATE)) = DATEPART(year, GETDATE())
        GROUP BY DATEPART(month, TRY_CAST(DateHired AS DATE))
        ORDER BY Month;
      `);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching monthly new hire count:", error);
    throw error;
  }
};

// Retrieve new hire count by year
const getYearlyNewHireCount = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(`
        SELECT
          DATEPART(year, TRY_CAST(DateHired AS DATE)) AS Year,
          COUNT(*) AS NewHireCount
        FROM EmployeeInfo
        GROUP BY DATEPART(year, TRY_CAST(DateHired AS DATE))
        ORDER BY Year;
      `);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching yearly new hire count:", error);
    throw error;
  }
};

// Retrieve all users account from the database
const getAllUserAccount = async () => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query("SELECT * FROM UserAccount");
    return result.recordset;
  } catch (error) {
    console.error("Error fetching users account:", error);
    throw error;
  }
};
// Retrieve employee by ID from the database
const getEmployeeById = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(`
        SELECT 
          PD.*, EI.*, ADDRESS.*, CONTACT.*, EDUC.*, EC.*,
          PROJ.ProjectId AS ProjectId, PROJ.DUID AS ProjectDUID, PROJ.ProjectCode, 
          PROJ.ProjectName, PROJ.is_Active,
          DU.DUID AS DUID, DU.DUCode, DU.DUName AS DUName, DU.Is_Active,
          DEPT.DepartmentId, DEPT.DepartmentName, DEPT.DUID AS DeptDUID,
          PROD.*, SHFT.*,
          C.ContactNumber AS EmContactPhoneNumber,
          A.CompleteAddress AS EmContactCompleteAddress,
          A.HouseNumber AS EmContactHouseNo,
          A.Barangay AS EmContactBarangay,
          A.CityMunicipality AS EmContactCityMunicipality,
          A.Province AS EmContactProvince,
          A.Region AS EmContactRegion,
          A.Country AS EmContactCountry,
          A.ZipCode AS EmContactZipcode,
          A.LandMark AS EmContactLandMark,
          A.IsPermanent AS Is_Permanent,
          A.IsEmergency AS Is_Emergency,
          UA.Role,
          UA.ProfilePhoto -- Include ProfilePhoto from UserAccount table
        FROM EmpPersonalDetails AS PD
        INNER JOIN EmployeeInfo AS EI ON PD.EmployeeId = EI.EmployeeId
        INNER JOIN Address AS ADDRESS ON PD.EmployeeId = ADDRESS.EmployeeId
        INNER JOIN Contact AS CONTACT ON PD.EmployeeId = CONTACT.EmployeeId
        INNER JOIN Education AS EDUC ON PD.EmployeeId = EDUC.EmployeeId
        LEFT JOIN EmergencyContactNumber AS EC ON PD.EmployeeId = EC.EmployeeId
        INNER JOIN Contact AS C ON EC.ContactId = C.ContactId
        INNER JOIN Address AS A ON EC.AddressID = A.AddressID
        LEFT JOIN Project AS PROJ ON PD.EmployeeId = PROJ.EmployeeId
        LEFT JOIN Shift AS SHFT ON PD.EmployeeId = SHFT.EmployeeId
        LEFT JOIN DeliveryUnit AS DU ON PD.EmployeeId = DU.EmployeeId
        LEFT JOIN Department AS DEPT ON PD.EmployeeId = DEPT.EmployeeId
        LEFT JOIN Product AS PROD ON PD.EmployeeId = PROD.EmployeeId
        LEFT JOIN UserAccount AS UA ON PD.EmployeeId = UA.EmployeeId 
        WHERE PD.EmployeeId = @EmployeeId;
      `);

    if (result.recordset.length === 0) {
      return null; // Return null if employee with given ID is not found
    }

    return result.recordset[0]; // Return the first employee found with the given ID

  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
}

//update employee personal details  by id
const updateEmployeeById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("EmployeeName", sql.VarChar(255), updatedEmployeeData.EmployeeName.trim())
      .input("LastName", sql.VarChar(255), updatedEmployeeData.LastName.trim())
      .input("FirstName", sql.VarChar(255), updatedEmployeeData.FirstName.trim())
      .input("MiddleName", sql.VarChar(255), updatedEmployeeData.MiddleName.trim())
      .input("MaidenName", sql.VarChar(255), updatedEmployeeData.MaidenName.trim())
      .input("Birthdate", sql.VarChar(255), updatedEmployeeData.Birthdate.trim())
      .input("Age", sql.VarChar(255), updatedEmployeeData.Age.trim())
      .input("BirthMonth", sql.VarChar(255), updatedEmployeeData.BirthMonth.trim())
      .input("AgeBracket", sql.VarChar(255), updatedEmployeeData.AgeBracket.trim())
      .input("Gender", sql.VarChar(255), updatedEmployeeData.Gender.trim())
      .input(
        "MaritalStatus",
        sql.VarChar(255),
        updatedEmployeeData.MaritalStatus.trim()
      )
      .input("SSS", sql.VarChar(255), updatedEmployeeData.SSS.trim())
      .input("PHIC", sql.VarChar(255), updatedEmployeeData.PHIC.trim())
      .input("HDMF", sql.VarChar(255), updatedEmployeeData.HDMF.trim())
      .input("TIN", sql.VarChar(255), updatedEmployeeData.TIN.trim())
      .input("EmailAddress", sql.VarChar(255), updatedEmployeeData.EmailAddress.trim())
      .input("HmoProvider", sql.VarChar(255), updatedEmployeeData.HmoProvider.trim())
      .input("HmoPolicyNumber", sql.VarChar(255), updatedEmployeeData.HmoPolicyNumber.trim())
      .query(`
          UPDATE EmpPersonalDetails 
          SET EmployeeId = @EmployeeId,
              EmployeeName = @EmployeeName,
              LastName = @LastName, 
              FirstName = @FirstName,
              MiddleName = @MiddleName,
              MaidenName = @MaidenName, 
              Birthdate = @Birthdate,
              Age = @Age,
              BirthMonth = @BirthMonth,
              AgeBracket = @AgeBracket,
              Gender = @Gender,
              MaritalStatus = @MaritalStatus,
              SSS = @SSS,
              PHIC = @PHIC,
              HDMF = @HDMF,
              TIN = @TIN,
              EmailAddress = @EmailAddress,
              HmoProvider = @HmoProvider,
              HmoPolicyNumber = @HmoPolicyNumber
          WHERE EmployeeId = @employeeId
        `);
        // Update the contact number in the Contact table first
        await pool
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .input("ContactNumber", sql.VarChar(255), updatedEmployeeData.ContactNumber)
        .query(`
          UPDATE Contact
          SET ContactNumber = @ContactNumber
          WHERE EmployeeId = @EmployeeId
          AND NOT EXISTS (
            SELECT 1
            FROM EmergencyContactNumber
            WHERE ContactId = Contact.ContactId
          );
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee by ID:", error);
    throw error;
  }
};
//update employee info by id
const updateEmployeeInfoById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await // Add inputs for other fields similarly
    pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("HRANID", sql.VarChar(255), updatedEmployeeData.HRANID)
      .input("DateHired", sql.Date, updatedEmployeeData.DateHired)
      .input("Tenure", sql.VarChar(255), updatedEmployeeData.Tenure)
      .input("Level", sql.VarChar(255), updatedEmployeeData.Level)
      .input("EmploymentStatus", sql.VarChar(255), updatedEmployeeData.EmploymentStatus)
      .input("EmployeeStatus", sql.VarChar(255), updatedEmployeeData.EmployeeStatus)
      .input("EmployeeRole", sql.VarChar(255), updatedEmployeeData.EmployeeRole)
      .input("EmployeeCategory", sql.VarChar(255), updatedEmployeeData.EmployeeCategory)
      .input("Facility", sql.VarChar(255), updatedEmployeeData.Facility)
      .input("WorkWeekType", sql.VarChar(255), updatedEmployeeData.WorkWeekType)
      .input("WorkArrangement", sql.VarChar(255), updatedEmployeeData.WorkArrangement)
      .input("RateClass", sql.VarChar(255), updatedEmployeeData.RateClass)
      .input("Rate", sql.VarChar(255), updatedEmployeeData.Rate)
      .input("ManagerID", sql.VarChar(255), updatedEmployeeData.ManagerID)
      .input("ManagerName", sql.VarChar(255), updatedEmployeeData.ManagerName)
      .input("PMPICID", sql.VarChar(255), updatedEmployeeData.PMPICID)
      .input("PMPICIDName", sql.VarChar(255), updatedEmployeeData.PMPICIDName)
      .input("DUHID", sql.VarChar(255), updatedEmployeeData.DUHID)
      .input("DUHName", sql.VarChar(255), updatedEmployeeData.DUHName)
      .input("IsManager", sql.Bit, updatedEmployeeData.IsManager ? 1 : 0)
      .input("IsPMPIC", sql.Bit, updatedEmployeeData.IsPMPIC ? 1 : 0)
      .input("IsIndividualContributor", sql.Bit, updatedEmployeeData.IsIndividualContributor ? 1 : 0)
      .input("IsActive", sql.Bit, updatedEmployeeData.IsActive ? 1 : 0)
      .input("HRANType", sql.VarChar(255), updatedEmployeeData.HRANType)
      .input("TITOType", sql.VarChar(255), updatedEmployeeData.TITOType)
      .input("Position", sql.VarChar(255), updatedEmployeeData.Position)
      .input("IsDUHead", sql.Bit, updatedEmployeeData.IsDUHead ? 1 : 0)
      .query(`
          UPDATE EmployeeInfo 
          SET HRANID = @HRANID,
              DateHired = @DateHired,
              Tenure = @Tenure,
              Level = @Level,
              EmploymentStatus = @EmploymentStatus,
              EmployeeStatus = @EmployeeStatus,
              EmployeeRole = @EmployeeRole,
              EmployeeCategory = @EmployeeCategory,
              Facility = @Facility,
              WorkWeekType = @WorkWeekType,
              WorkArrangement = @WorkArrangement,
              RateClass = @RateClass,
              Rate = @Rate,
              ManagerID = @ManagerID,
              ManagerName = @ManagerName,
              PMPICID = @PMPICID,
              PMPICIDName = @PMPICIDName,
              DUHID = @DUHID,
              DUHName = @DUHName,
              IsManager = @IsManager,
              IsPMPIC = @IsPMPIC,
              IsIndividualContributor = @IsIndividualContributor,
              IsActive = @IsActive,
              HRANType = @HRANType,
              TITOType = @TITOType,
              Position = @Position,
              IsDUHead = @IsDUHead
          WHERE EmployeeId = @EmployeeId
        `);

        //update project table
        await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProjectCode", sql.VarChar(255), updatedEmployeeData.ProjectCode)
      .input("ProjectName", sql.VarChar(255), updatedEmployeeData.ProjectName)
      .input("is_Active", sql.Bit, updatedEmployeeData.is_Active ? 1 : 0)
      .query(`
          UPDATE Project 
          SET ProjectCode = @ProjectCode,
          ProjectName = @ProjectName,
          is_Active = @is_Active
          WHERE EmployeeId = @EmployeeId
        `);

        //update product table
        await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProdCode", sql.VarChar(255), updatedEmployeeData.ProdCode)
      .input("ProdDesc", sql.VarChar(255), updatedEmployeeData.ProdDesc)
      .query(`
          UPDATE Product 
          SET ProdCode = @ProdCode,
          ProdDesc  = @ProdDesc
          WHERE EmployeeId = @EmployeeId
        `);
        
        //update shift details
        await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ShiftCode", sql.VarChar(255), updatedEmployeeData.ShiftCode)
      .input("ShiftName", sql.VarChar(255), updatedEmployeeData.ShiftName)
      .input("ShiftType", sql.VarChar(255), updatedEmployeeData.ShiftType)
      .input("LevelID", sql.VarChar(255), updatedEmployeeData.LevelID)
      .query(`
          UPDATE Shift 
          SET ShiftCode = @ShiftCode,
          ShiftName = @ShiftName,
          ShiftType = @ShiftType,
          LevelID = @LevelID
          WHERE EmployeeId = @EmployeeId
        `);
        //update department details
        await pool
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .input("DepartmentName", sql.VarChar(255), updatedEmployeeData.DepartmentName)
        .query(`
            UPDATE Department 
            SET DepartmentName = @DepartmentName
            WHERE EmployeeId = @EmployeeId
          `);
          //update delivery unit details
          await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DUCode", sql.VarChar(255), updatedEmployeeData.DUCode)
      .input("DUName", sql.VarChar(255), updatedEmployeeData.DUName)
      .input("Is_Active", sql.Bit, updatedEmployeeData.Is_Active ? 1 : 0)
      .query(`
          UPDATE DeliveryUnit 
          SET DUCode = @DUCode,
          DUName = @DUName,
          Is_Active = @Is_Active
          WHERE EmployeeId = @EmployeeId
        `);
         //update employee user account role
         await pool
         .request()
         .input("EmployeeId", sql.VarChar, employeeId)
         .input("Role", sql.VarChar(255), updatedEmployeeData.Role)
         .query(`
             UPDATE UserAccount 
             SET Role = @Role
             WHERE EmployeeId = @EmployeeId
           `);
        
    return result;
  } catch (error) {
    console.error("Error updating employee information by ID:", error);
    throw error;
  }
};
// SQL query to insert a record into the History table
const addToHistory = async (historyData) => {
  try {
      let pool = await sql.connect(config);
      let result = await pool.request()
          .input('EmployeeName', sql.VarChar(100), historyData.EmployeeName)
          .input('Action', sql.VarChar(100), historyData.Action)
          .input('FieldName', sql.VarChar(100), historyData.FieldName)
          .input('OldValue', sql.VarChar(100), historyData.OldValue)
          .input('NewValue', sql.VarChar(100), historyData.NewValue)
          .input('Remarks', sql.VarChar(1000), historyData.Remarks)
          .input('DateCreated', sql.DateTime, historyData.DateCreated)
          .input('UpdatedBy', sql.VarChar(100), historyData.UpdatedBy)
          .input('EmployeeId', sql.VarChar(100), historyData.EmployeeId)
          .query(`
              INSERT INTO History (EmployeeName, Action, FieldName, OldValue, NewValue, Remarks, DateCreated, UpdatedBy, EmployeeId)
              VALUES (@EmployeeName, @Action, @FieldName, @OldValue, @NewValue, @Remarks, @DateCreated, @UpdatedBy, @EmployeeId)
          `);

      return result;
  } catch (error) {
      console.error('Error adding record to History:', error);
      throw error;
  }
};
//retrieve employee info and user account
const getEmployeeInfoById = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('EmployeeId', sql.VarChar, employeeId)
      .query(`
        SELECT e.*, ua.Role
        FROM EmployeeInfo e
        JOIN UserAccount ua ON e.EmployeeId = ua.EmployeeId
        WHERE e.EmployeeId = @EmployeeId
      `);
    return result.recordset[0];
  } catch (error) {
    console.error('Error fetching employee information by ID:', error);
    throw error;
  }
};
//update employee address by id
const updateEmployeeAddressById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("AddressId", sql.Int, updatedEmployeeData.AddressId)
      .input("HouseNumber", sql.VarChar(255), updatedEmployeeData.HouseNumber)
      .input("CompleteAddress", sql.VarChar(255), updatedEmployeeData.CompleteAddress)
      .input("Barangay", sql.VarChar(255), updatedEmployeeData.Barangay)
      .input("CityMunicipality", sql.VarChar(255), updatedEmployeeData.CityMunicipality)
      .input("Province", sql.VarChar(255), updatedEmployeeData.Province)
      .input("Region", sql.VarChar(255), updatedEmployeeData.Region)
      .input("Country", sql.VarChar(255), updatedEmployeeData.Country)
      .input("ZipCode", sql.VarChar(255), updatedEmployeeData.ZipCode)
      .input("Landmark", sql.VarChar(255), updatedEmployeeData.Landmark)
      .input("IsPermanent", sql.Bit, updatedEmployeeData.IsPermanent ? 1 : 0)
      .input("IsEmergency", sql.Bit, updatedEmployeeData.IsEmergency ? 1 : 0)
      .query(`
          UPDATE Address 
          SET HouseNumber = @HouseNumber,
              CompleteAddress = @CompleteAddress,
              Barangay = @Barangay,
              CityMunicipality = @CityMunicipality,
              Province = @Province,
              Region = @Region,
              Country = @Country,
              Zipcode = @Zipcode,
              Landmark = @Landmark,
              IsPermanent = @IsPermanent,
              IsEmergency = @IsEmergency
          WHERE EmployeeId = @EmployeeId
          AND AddressId NOT IN (SELECT AddressId FROM EmergencyContactNumber);
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee address by ID:", error);
    throw error;
  }
};
//update employee project details
const updateEmployeeProjectById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProjectCode", sql.VarChar(255), updatedEmployeeData.ProjectCode)
      .input("ProjectName", sql.VarChar(255), updatedEmployeeData.ProjectName)
      .input("is_Active", sql.Bit, updatedEmployeeData.is_Active ? 1 : 0)
      .query(`
          UPDATE Project 
          SET ProjectCode = @ProjectCode,
          ProjectName = @ProjectName,
          is_Active = @is_Active
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee project by ID:", error);
    throw error;
  }
};
//update employee education details
const updateEmployeeEducationById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("School", sql.VarChar(255), updatedEmployeeData.School)
      .input("EducationLevel", sql.VarChar(255), updatedEmployeeData.EducationLevel)
      .input("UnitsEarned", sql.VarChar(255), updatedEmployeeData.UnitsEarned)
      .input("Degree", sql.VarChar(255), updatedEmployeeData.Degree)
      .input("MajorCourse", sql.VarChar(255), updatedEmployeeData.MajorCourse)
      .input("HonorRank", sql.VarChar(255), updatedEmployeeData.HonorRank)
      .input("Session", sql.VarChar(255), updatedEmployeeData.Session)
      .input("DateFrom", sql.VarChar(255), updatedEmployeeData.DateFrom)
      .input("DateTo", sql.VarChar(255), updatedEmployeeData.DateTo)
      .input("MonthCompleted", sql.VarChar(255), updatedEmployeeData.MonthCompleted)
      .input("Completed", sql.VarChar(255), updatedEmployeeData.Completed)
      .query(`
          UPDATE Education 
          SET 
          School = @School,
          EducationLevel = @EducationLevel,
          Degree = @Degree,
          UnitsEarned =@UnitsEarned,
          MajorCourse = @MajorCourse,
          HonorRank = @HonorRank,
          Session = @Session,
          DateFrom = @DateFrom,
          DateTo = @DateTo,
          MonthCompleted = @MonthCompleted,
          Completed = @Completed
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee eduaction by ID:", error);
    throw error;
  }
};
//update employee shift details
const updateEmployeeShiftById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ShiftCode", sql.VarChar(255), updatedEmployeeData.ShiftCode)
      .input("ShiftName", sql.VarChar(255), updatedEmployeeData.ShiftName)
      .input("ShiftType", sql.VarChar(255), updatedEmployeeData.ShiftType)
      .input("LevelID", sql.VarChar(255), updatedEmployeeData.LevelID)
      .query(`
          UPDATE Shift 
          SET ShiftCode = @ShiftCode,
          ShiftName = @ShiftName,
          ShiftType = @ShiftType,
          LevelID = @LevelID
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee shift by ID:", error);
    throw error;
  }
};
//update employee delivery unit details
const updateEmployeeDUById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DUCode", sql.VarChar(255), updatedEmployeeData.DUCode)
      .input("DUName", sql.VarChar(255), updatedEmployeeData.DUName)
      .input("Is_Active", sql.Bit, updatedEmployeeData.Is_Active ? 1 : 0)
      .query(`
          UPDATE DeliveryUnit 
          SET DUCode = @DUCode,
          DUName = @DUName,
          Is_Active = @Is_Active
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
//update employee department details
const updateEmployeeDepartmentById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentName", sql.VarChar(255), updatedEmployeeData.DepartmentName)
      .query(`
          UPDATE Department 
          SET DepartmentName = @DepartmentName
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
 //update employee dependent details
const updateDependentById = async (dependentId, updatedDependentData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("DependentId", sql.Int, dependentId)
      .input("FullName", sql.VarChar(255), updatedDependentData.FullName)
      .input("PhoneNum", sql.VarChar(255), updatedDependentData.PhoneNum)
      .input("Relationship", sql.VarChar(255), updatedDependentData.Relationship)
      .input("DateOfBirth", sql.VarChar(255), updatedDependentData.DateOfBirth)
      .input("Occupation", sql.VarChar(255), updatedDependentData.Occupation)
      .input("Address", sql.VarChar(255), updatedDependentData.Address)
      .input("City", sql.VarChar(255), updatedDependentData.City)
      .input("DepProvince", sql.VarChar(255), updatedDependentData.DepProvince)
      .input("PostalCode", sql.VarChar(255), updatedDependentData.PostalCode)
      .input("Beneficiary", sql.VarChar(255), updatedDependentData.Beneficiary)
      .input("BeneficiaryDate", sql.VarChar(255), updatedDependentData.BeneficiaryDate)
      .input("TypeOfCoverage", sql.VarChar(255), updatedDependentData.TypeOfCoverage)
      .input("Insurance", sql.VarChar(255), updatedDependentData.Insurance)
      .input("InsuranceDate", sql.VarChar(255), updatedDependentData.InsuranceDate)
      .input("Remarks", sql.VarChar(255), updatedDependentData.Remarks)
      .input("CompanyPaid", sql.VarChar(255), updatedDependentData.CompanyPaid)
      .input("HMOProvider", sql.VarChar(255), updatedDependentData.HMOProvider)
      .input("HMOPolicyNumber", sql.VarChar(255), updatedDependentData.HMOPolicyNumber)
      .query(`
          UPDATE Dependent 
          SET FullName = @FullName,
              PhoneNum = @PhoneNum,
              Relationship = @Relationship,
              DateOfBirth = @DateOfBirth,
              Occupation = @Occupation,
              Address = @Address,
              City = @City,
              DepProvince = @DepProvince,
              PostalCode = @PostalCode,
              Beneficiary = @Beneficiary,
              BeneficiaryDate = @BeneficiaryDate,
              TypeOfCoverage = @TypeOfCoverage,
              Insurance = @Insurance,
              InsuranceDate = @InsuranceDate,
              Remarks = @Remarks,
              CompanyPaid = @CompanyPaid,
              HMOProvider = @HMOProvider,
              HMOPolicyNumber = @HMOPolicyNumber
          WHERE DependentId = @DependentId
        `);

    return result;
  } catch (error) {
    console.error("Error updating dependent by ID:", error);
    throw error;
  }
};
// Function to insert a new dependent record into the database
const insertDependent = async (employeeId, newDependentData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("FullName", sql.VarChar(255), newDependentData.FullName)
      .input("PhoneNum", sql.VarChar(255), newDependentData.PhoneNum)
      .input("Relationship", sql.VarChar(255), newDependentData.Relationship)
      .input("DateOfBirth", sql.VarChar(255), newDependentData.DateOfBirth)
      .input("Occupation", sql.VarChar(255), newDependentData.Occupation)
      .input("Address", sql.VarChar(255), newDependentData.Address)
      .input("City", sql.VarChar(255), newDependentData.City)
      .input("DepProvince", sql.VarChar(255), newDependentData.DepProvince)
      .input("PostalCode", sql.VarChar(255), newDependentData.PostalCode)
      .input("Beneficiary", sql.VarChar(255), newDependentData.Beneficiary)
      .input("BeneficiaryDate", sql.VarChar(255), newDependentData.BeneficiaryDate)
      .input("TypeOfCoverage", sql.VarChar(255), newDependentData.TypeOfCoverage)
      .input("Insurance", sql.VarChar(255), newDependentData.Insurance)
      .input("InsuranceDate", sql.VarChar(255), newDependentData.InsuranceDate)
      .input("Remarks", sql.VarChar(255), newDependentData.Remarks)
      .input("CompanyPaid", sql.VarChar(255), newDependentData.CompanyPaid)
      .input("HMOProvider", sql.VarChar(255), newDependentData.HMOProvider)
      .input("HMOPolicyNumber", sql.VarChar(255), newDependentData.HMOPolicyNumber)
      .input("CreatedAt", sql.DateTime, new Date())
      .query(`
          INSERT INTO Dependent (EmployeeId, FullName, PhoneNum, Relationship, DateOfBirth, Occupation, Address, City, DepProvince, 
            PostalCode, Beneficiary, BeneficiaryDate, TypeOfCoverage, Insurance, InsuranceDate, Remarks, CompanyPaid, HMOProvider, 
            HMOPolicyNumber, CreatedAt)
          VALUES (@EmployeeId, @FullName, @PhoneNum, @Relationship, @DateOfBirth, @Occupation, @Address, @City, @DepProvince, @PostalCode, 
            @Beneficiary, @BeneficiaryDate, @TypeOfCoverage, @Insurance, @InsuranceDate, @Remarks, @CompanyPaid, @HMOProvider, 
            @HMOPolicyNumber, @CreatedAt)
        `);

    return result;
  } catch (error) {
    console.error("Error inserting dependent record:", error);
    throw error;
  }
};
// Retrieve dependents by Employee ID from the database
const getDependentsByEmployeeId = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(`
        SELECT *
        FROM Dependent
        WHERE EmployeeId = @EmployeeId;
      `);

    return result.recordset; // Return dependents found with the given EmployeeId

  } catch (error) {
    console.error("Error fetching dependents by Employee ID:", error);
    throw error;
  }
}
//update employee product details
const updateProductById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ProdCode", sql.VarChar(255), updatedEmployeeData.ProdCode)
      .input("ProdDesc", sql.VarChar(255), updatedEmployeeData.ProdDesc)
      .query(`
          UPDATE Product 
          SET ProdCode = @ProdCode,
          ProdDesc  = @ProdDesc
          WHERE EmployeeId = @EmployeeId
        `);

    return result;
  } catch (error) {
    console.error("Error updating employee delivery unit by ID:", error);
    throw error;
  }
};
//function that handles in updating the emergency contact by employee id
const updateEmergencyContactById = async (employeeId, updatedEmployeeData) => {
  try {
    let pool = await sql.connect(config);

    // Update the address details for the emergency contact
    let addressResult = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("AddressId", sql.Int, updatedEmployeeData.AddressId)
      .input("HouseNumber", sql.VarChar(255), updatedEmployeeData.EmContactHouseNo)
      .input("CompleteAddress",  sql.VarChar(255), updatedEmployeeData.EmContactCompleteAddress)
      .input("Barangay", sql.VarChar(255), updatedEmployeeData.EmContactBarangay)
      .input("CityMunicipality", sql.VarChar(255), updatedEmployeeData.EmContactCityMunicipality)
      .input("Province", sql.VarChar(255), updatedEmployeeData.EmContactProvince)
      .input("Region", sql.VarChar(255), updatedEmployeeData.EmContactRegion)
      .input("Country", sql.VarChar(255), updatedEmployeeData.EmContactCountry)
      .input("ZipCode", sql.VarChar(255), updatedEmployeeData.EmContactZipcode)
      .input("Landmark", sql.VarChar(255), updatedEmployeeData.EmContactLandMark)
      .input("IsPermanent", sql.Bit, updatedEmployeeData.Is_Permanent ? 1 : 0)
      .input("IsEmergency", sql.Bit, updatedEmployeeData.Is_Emergency ? 1 : 0.)
      .query(`
          UPDATE Address 
          SET HouseNumber = @HouseNumber,
              CompleteAddress = @CompleteAddress,
              Barangay = @Barangay,
              CityMunicipality = @CityMunicipality,
              Province = @Province,
              Region = @Region,
              Country = @Country,
              Zipcode = @ZipCode,
              Landmark = @Landmark,
              IsPermanent = @IsPermanent,
              IsEmergency = @IsEmergency
          WHERE EmployeeId = @EmployeeId
           AND AddressID IN (SELECT AddressID FROM EmergencyContactNumber)
        `);

    // Update the contact details for the emergency contact
    let contactResult = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("EmContactFullName", sql.VarChar(255), updatedEmployeeData.EmContactFullName)
      .query(`
          UPDATE EmergencyContactNumber
          SET EmContactFullName = @EmContactFullName
          WHERE EmployeeId = @EmployeeId;
        `);

    // Update the contact number for the emergency contact
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("ContactNumber", sql.VarChar(255), updatedEmployeeData.EmContactPhoneNumber)
      .query(`
          UPDATE Contact 
          SET ContactNumber = @ContactNumber
          WHERE EmployeeId = @EmployeeId
          AND ContactId IN (SELECT ContactId FROM EmergencyContactNumber);
        `);

    return { addressResult, contactResult, result };
  } catch (error) {
    console.error("Error updating emergency contact address and details by ID:", error);
    throw error;
  }
};
//delete employee data
const deleteEmployeeById = async (employeeId) => {  
  try {
    let pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {
      // Begin a transaction
      await transaction.begin();

      // Delete from EmployeeInformation table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM EmployeeInfo WHERE EmployeeId = @EmployeeId");

        // Delete from EmergencyContactNumber table
      await transaction
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query("DELETE FROM EmergencyContactNumber WHERE EmployeeId = @EmployeeId");

        // Delete from EmergencyContactNumber table
        await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM UserAccount WHERE EmployeeId = @EmployeeId");  

      // Delete from Address table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Address WHERE EmployeeId = @EmployeeId");

      // Delete from Education table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Education WHERE EmployeeId = @EmployeeId");

      // Delete from Project table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Project WHERE EmployeeId = @EmployeeId");

      // Delete from Product table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Product WHERE EmployeeId = @EmployeeId");

      // Delete from Dependent table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Dependent WHERE EmployeeId = @EmployeeId");

      // Delete from Department table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Department WHERE EmployeeId = @EmployeeId");

      // Delete from Shift table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Shift WHERE EmployeeId = @EmployeeId");

      // Delete from DeliveryUnit table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM DeliveryUnit WHERE EmployeeId = @EmployeeId");

      // Delete from Contact table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM Contact WHERE EmployeeId = @EmployeeId");

      // Delete from EmpPersonalDetails table
      await transaction
        .request()
        .input("EmployeeId", sql.VarChar, employeeId)
        .query("DELETE FROM EmpPersonalDetails WHERE EmployeeId = @EmployeeId");

      // Commit the transaction if all DELETE operations succeed
      await transaction.commit();

      // Return success message or result
      return { message: "Employee deleted successfully" };
    } catch (error) {
      // Rollback the transaction if any DELETE operation fails
      await transaction.rollback();
      console.error("Error deleting employee:", error);
      throw error; // handle or rethrow the error as necessary
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};
//route to delete employee by ID from the database
const deleteUsersById = async (userId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserId", sql.VarChar, userId)
      .query("DELETE FROM UserAccount WHERE UserId = @UserId");

    return result;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};
//DELETE EMPLOYEE INFORMATION
const deleteEmpInfoById = async (empInfoId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmpInfoID", sql.VarChar, empInfoId)
      .query("DELETE FROM EmployeeInfo WHERE EmpInfoID = @EmpInfoID");

    return result;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};
//DELETE EMERGENCY CONTACT INFORMATION
const deleteEmContactById = async (emergencyNumId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmergencyNumID", sql.Int, emergencyNumId)
      .query("DELETE FROM EmergencyContactNumber WHERE EmergencyNumID = @EmergencyNumID");

    return result;
  } catch (error) {
    console.error("Error deleting emergency contact:", error);
    throw error;
  }
};
// Function to retrieve personal details by UserId
const getPersonalDetailsByUserId = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(
        `SELECT LastName, FirstName, MiddleName, EmailAddress, EmployeeId, ISNULL(ProfilePhoto, '/img/user.png') AS ProfilePhoto FROM UserAccount WHERE EmployeeId = @EmployeeId`
      );

    if (result.recordset.length === 0) {
      return null; // Return null if employee with given ID is not found
    }

    return result.recordset[0]; // Return the first employee found with the given ID
  } catch (error) {
    console.error("Error retrieving personal details:", error);
    throw error;
  }
};
// Function to retrieve user data from the database based on userId
const getUserData = async (employeeId) => {
  try {
    // Connect to the database
    const pool = await sql.connect(config);

    // SQL query to fetch user data based on userId
    const query = `
      SELECT 
       FirstName, LastName, EmployeeId, EmailAddress, MiddleName, ISNULL(ProfilePhoto, '/img/user.png') AS ProfilePhoto 
      FROM 
        UserAccount 
      WHERE 
      EmployeeId = @EmployeeId
    `;

    // Execute the query with the provided userId
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(query);

    // If user data found, return it
    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      // If no user data found for the provided userId, return null
      return null;
    }
  } catch (error) {
    // Log any errors that occur during the database operation
    console.error("Error fetching user data:", error);
    throw error;
  }
};
// Function to update profile photo by UserId
const updateProfilePhoto = async (employeeId, profilePhoto) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const query = `UPDATE UserAccount SET ProfilePhoto = @ProfilePhoto WHERE EmployeeId = @EmployeeId`;
    request.input("EmployeeId", sql.VarChar, employeeId);
    request.input("ProfilePhoto", sql.VarChar, profilePhoto);

    await request.query(query);
    console.log("Profile photo updated successfully");
  } catch (err) {
    console.error("Error updating profile photo:", err);
    throw err;
  }
};
// Database operation to update users details
const updatePersonalDetails = async (employeeId, updatedDetails) => {
  try {
    const { FirstName, LastName, MiddleName, EmailAddress } = updatedDetails;
    const pool = await sql.connect(); // Establish DB connection
    const request = pool.request();
    const query = `
      UPDATE UserAccount 
      SET
        FirstName = @FirstName,
        LastName = @LastName,
        MiddleName = @MiddleName,
        EmailAddress = @EmailAddress
      WHERE EmployeeId = @EmployeeId
    `;
    request.input("EmployeeId", sql.VarChar, employeeId);
    request.input("FirstName", sql.VarChar, FirstName);
    request.input("LastName", sql.VarChar, LastName);
    request.input("MiddleName", sql.VarChar, MiddleName);
    request.input("EmailAddress", sql.VarChar, EmailAddress);
    const result = await request.query(query); // Execute the query
    console.log("Personal details updated successfully");
    return result;
  } catch (err) {
    console.error("Error updating personal details:", err);
    throw err;
  }
};
//fucntion that handles in deleting the data from all table
const deleteAllFromTable = async (transaction, tableName) => {
  const query = `DELETE FROM ${tableName}`;
  await transaction.request().query(query);
};

const deleteAllEmployeeData = async () => {
  try {
    const pool = await sql.connect(config);

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Delete records from EmployeeInfo table
    await transaction.request().query("DELETE FROM EmployeeInfo");
    // await transaction.request().query("DELETE FROM Product");
    
    // Delete records from other related tables
    await deleteAllFromTable(transaction, "Department");
    await deleteAllFromTable(transaction, "Project");
    await deleteAllFromTable(transaction, "Product");
    await deleteAllFromTable(transaction, "Shift");
    await deleteAllFromTable(transaction, "DeliveryUnit");
    await deleteAllFromTable(transaction, "EmergencyContactNumber");
    // await deleteAllFromTable(transaction, "EmployeeInfo");
    await deleteAllFromTable(transaction, "Contact");
    await deleteAllFromTable(transaction, "Dependent");
    await deleteAllFromTable(transaction, "Education");
    await deleteAllFromTable(transaction, "Address");
    await deleteAllFromTable(transaction, "UserAccount");
    await deleteAllFromTable(transaction, "History");
    await deleteAllFromTable(transaction, "CompensationBenefits");
    
    await deleteAllFromTable(transaction, "EmpPersonalDetails");

    

    await transaction.commit();
    await pool.close();
    
    return { message: "All employee data deleted successfully" };
  } catch (error) {
    throw error;
  }
};
//INSERT NEW PASSWORD
const getUserByEmployeeId = async (employeeId) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("EmployeeId", sql.VarChar, employeeId);
    const query = 'SELECT * FROM UserAccount WHERE EmployeeId = @EmployeeId';
    const result = await request.query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error retrieving user by EmployeeId:', error);
    throw error;
  }
};
// Function to insert a new dependent record into the database
const insertCompBen = async (employeeId, newCompBenData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("Salary", sql.VarChar(255), newCompBenData.Salary)
      .input("DailyEquivalent", sql.VarChar(255), newCompBenData.DailyEquivalent)
      .input("MonthlyEquivalent", sql.VarChar(255), newCompBenData.MonthlyEquivalent)
      .input("AnnualEquivalent", sql.VarChar(255), newCompBenData.AnnualEquivalent)
      .input("RiceMonthly", sql.VarChar(255), newCompBenData.RiceMonthly)
      .input("RiceAnnual", sql.VarChar(255), newCompBenData.RiceAnnual)
      .input("RiceDifferentialAnnual", sql.VarChar(255), newCompBenData.RiceDifferentialAnnual)
      .input("UniformAnnual", sql.VarChar(255), newCompBenData.UniformAnnual)
      .input("LeaveDays", sql.VarChar(255), newCompBenData.LeaveDays)
      .input("LaundryAllowance", sql.VarChar(255), newCompBenData.LaundryAllowance)
      .input("CommAllowance", sql.VarChar(255), newCompBenData.CommAllowance)
      .input("CommAllowanceType", sql.VarChar(255), newCompBenData.CommAllowanceType)
      .input("CashGift", sql.VarChar(255), newCompBenData.CashGift)
      .input("MedicalInsurance", sql.VarChar(255), newCompBenData.MedicalInsurance)
      .input("FreeHMODependent", sql.VarChar(255), newCompBenData.FreeHMODependent)
      .input("MBL", sql.VarChar(255), newCompBenData.MBL)
      .input("LifeInsurance", sql.VarChar(255), newCompBenData.LifeInsurance)
      .input("Beneficiaries", sql.VarChar(255), newCompBenData.Beneficiaries)
      .input("PersonalAccidentInsuranceBenefit", sql.VarChar(255), newCompBenData.PersonalAccidentInsuranceBenefit)
      .input("PWDIDNumber", sql.VarChar(255), newCompBenData.PWDIDNumber)
      .input("TendopayRegistered", sql.VarChar(255), newCompBenData.TendopayRegistered)
      .input("CanteenUID", sql.VarChar(255), newCompBenData.CanteenUID)
      .input("CanteenCreditLimit", sql.VarChar(255), newCompBenData.CanteenCreditLimit)
      .input("CanteenBarcode", sql.VarChar(255), newCompBenData.CanteenBarcode)
      .input("DAPMembershipNumber", sql.VarChar(255), newCompBenData.DAPMembershipNumber)
      .input("DAPDependents", sql.VarChar(255), newCompBenData.DAPDependents)
      .input("Stat_SSSNumber", sql.VarChar(255), newCompBenData.Stat_SSSNumber)
      .input("Stat_SSSMonthlyContribution", sql.VarChar(255), newCompBenData.Stat_SSSMonthlyContribution)
      .input("Stat_PagIbigNumber", sql.VarChar(255), newCompBenData.Stat_PagIbigNumber)
      .input("Stat_PagIbigMonthlyContribution", sql.VarChar(255), newCompBenData.Stat_PagIbigMonthlyContribution)
      .input("Stat_PHICNumber", sql.VarChar(255), newCompBenData.Stat_PHICNumber)
      .input("Stat_PHICMonthlyContribution", sql.VarChar(255), newCompBenData.Stat_PHICMonthlyContribution)
      .input("Stat_TINNumber", sql.VarChar(255), newCompBenData.Stat_TINNumber)
      .input("CreatedAt", sql.DateTime, new Date())
      .query(`
          INSERT INTO CompensationBenefits (EmployeeId, Salary, DailyEquivalent, MonthlyEquivalent, AnnualEquivalent, RiceMonthly, 
            RiceAnnual, RiceDifferentialAnnual, UniformAnnual, LeaveDays, LaundryAllowance, CommAllowance, CommAllowanceType, 
            CashGift, MedicalInsurance, FreeHMODependent, MBL, LifeInsurance, Beneficiaries, PersonalAccidentInsuranceBenefit, PWDIDNumber, 
            TendopayRegistered, CanteenUID, CanteenCreditLimit, CanteenBarcode, 
            DAPMembershipNumber, DAPDependents, Stat_SSSNumber, Stat_SSSMonthlyContribution, Stat_PagIbigNumber, 
            Stat_PagIbigMonthlyContribution, Stat_PHICNumber, Stat_PHICMonthlyContribution, Stat_TINNumber, CreatedAt )
          VALUES (@EmployeeId, @Salary, @DailyEquivalent, @MonthlyEquivalent, @AnnualEquivalent, @RiceMonthly, @RiceAnnual,
             @RiceDifferentialAnnual, @UniformAnnual, @LeaveDays, @LaundryAllowance, @CommAllowance, @CommAllowanceType, @CashGift, @MedicalInsurance, 
             @FreeHMODependent, @MBL, @LifeInsurance, @Beneficiaries, @PersonalAccidentInsuranceBenefit, @PWDIDNumber, @TendopayRegistered, @CanteenUID,  
             @CanteenCreditLimit, @CanteenBarcode, @DAPMembershipNumber, @DAPDependents, @Stat_SSSNumber, @Stat_SSSMonthlyContribution, @Stat_PagIbigNumber, 
             @Stat_PagIbigMonthlyContribution, @Stat_PHICNumber, @Stat_PHICMonthlyContribution, @Stat_TINNumber, @CreatedAt )
        `);

    return result;
  } catch (error) {
    console.error("Error inserting compensation benefit record:", error);
    throw error;
  }
};
// Retrieve compensation benefits by Employee ID from the database
const getCompBenByEmployeeId = async (employeeId) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(`
        SELECT *
        FROM CompensationBenefits
        WHERE EmployeeId = @EmployeeId;
      `);

      console.log(`Query result for Employee ID ${employeeId}:`, result.recordset);

    return result.recordset; // Return compensation benefits found with the given EmployeeId

  } catch (error) {
    console.error("Error fetching compensation benefits by Employee ID:", error);
    throw error;
  }
}
 //update employee compensation benefits details
 const updateCompBenById = async (compBenId, updatedcompBenData) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("CompBenId", sql.Int, compBenId)
      .input("Salary", sql.VarChar(255), updatedcompBenData.Salary)
      .input("DailyEquivalent", sql.VarChar(255), updatedcompBenData.DailyEquivalent)
      .input("MonthlyEquivalent", sql.VarChar(255), updatedcompBenData.MonthlyEquivalent)
      .input("AnnualEquivalent", sql.VarChar(255), updatedcompBenData.AnnualEquivalent)
      .input("RiceMonthly", sql.VarChar(255), updatedcompBenData.RiceMonthly)
      .input("RiceAnnual", sql.VarChar(255), updatedcompBenData.RiceAnnual)
      .input("RiceDifferentialAnnual", sql.VarChar(255), updatedcompBenData.RiceDifferentialAnnual)
      .input("LeaveDays", sql.VarChar(255), updatedcompBenData.LeaveDays)
      .input("LaundryAllowance", sql.VarChar(255), updatedcompBenData.LaundryAllowance)
      .input("CommAllowance", sql.VarChar(255), updatedcompBenData.CommAllowance)
      .input("CommAllowanceType", sql.VarChar(255), updatedcompBenData.CommAllowanceType)
      .input("CashGift", sql.VarChar(255), updatedcompBenData.CashGift)
      .input("MedicalInsurance", sql.VarChar(255), updatedcompBenData.MedicalInsurance)
      .input("FreeHMODependent", sql.VarChar(255), updatedcompBenData.FreeHMODependent)
      .input("MBL", sql.VarChar(255), updatedcompBenData.MBL)
      .input("LifeInsurance", sql.VarChar(255), updatedcompBenData.LifeInsurance)
      .input("Beneficiaries", sql.VarChar(255), updatedcompBenData.Beneficiaries)
      .input("PersonalAccidentInsuranceBenefit", sql.VarChar(255), updatedcompBenData.PersonalAccidentInsuranceBenefit)
      .input("PWDIDNumber", sql.VarChar(255), updatedcompBenData.PWDIDNumber)
      .input("TendopayRegistered", sql.VarChar(255), updatedcompBenData.TendopayRegistered)
      .input("CanteenUID", sql.VarChar(255), updatedcompBenData.CanteenUID)
      .input("CanteenCreditLimit", sql.VarChar(255), updatedcompBenData.CanteenCreditLimit)
      .input("CanteenBarcode", sql.VarChar(255), updatedcompBenData.CanteenBarcode)
      .input("DAPMembershipNumber", sql.VarChar(255), updatedcompBenData.DAPMembershipNumber)
      .input("DAPDependents", sql.VarChar(255), updatedcompBenData.DAPDependents)
      .input("Stat_SSSNumber", sql.VarChar(255), updatedcompBenData.Stat_SSSNumber)
      .input("Stat_SSSMonthlyContribution", sql.VarChar(255), updatedcompBenData.Stat_SSSMonthlyContribution)
      .input("Stat_PagIbigNumber", sql.VarChar(255), updatedcompBenData.PersonalAccidentInsuranceBenefit)
      .input("Stat_PagIbigMonthlyContribution", sql.VarChar(255), updatedcompBenData.Stat_PagIbigMonthlyContribution)
      .input("Stat_PHICNumber", sql.VarChar(255), updatedcompBenData.Stat_PHICNumber)
      .input("Stat_PHICMonthlyContribution", sql.VarChar(255), updatedcompBenData.Stat_PHICMonthlyContribution)
      .input("Stat_TINNumber", sql.VarChar(255), updatedcompBenData.Stat_TINNumber)
      .query(`
          UPDATE CompensationBenefits 
          SET Salary = @Salary,
              DailyEquivalent = @DailyEquivalent,
              MonthlyEquivalent = @MonthlyEquivalent,
              AnnualEquivalent = @AnnualEquivalent,
              RiceMonthly = @RiceMonthly,
              RiceAnnual = @RiceAnnual,
              RiceDifferentialAnnual = @RiceDifferentialAnnual,
              LeaveDays = @LeaveDays,
              LaundryAllowance = @LaundryAllowance,
              CommAllowance = @CommAllowance,
              CommAllowanceType = @CommAllowanceType,
              CashGift = @CashGift,
              MedicalInsurance = @MedicalInsurance,
              FreeHMODependent = @FreeHMODependent,
              MBL = @MBL,
              LifeInsurance = @LifeInsurance,
              Beneficiaries = @Beneficiaries,
              PersonalAccidentInsuranceBenefit = @PersonalAccidentInsuranceBenefit,
              PWDIDNumber = @PWDIDNumber,
              TendopayRegistered = @TendopayRegistered,
              CanteenUID = @CanteenUID,
              CanteenCreditLimit = @CanteenCreditLimit,
              CanteenBarcode = @CanteenBarcode,
              DAPMembershipNumber = @DAPMembershipNumber,
              DAPDependents = @DAPDependents,
              Stat_SSSNumber = @Stat_SSSNumber,
              Stat_SSSMonthlyContribution = @Stat_SSSMonthlyContribution,
              Stat_PagIbigNumber = @Stat_PagIbigNumber,
              Stat_PagIbigMonthlyContribution = @Stat_PagIbigMonthlyContribution,
              Stat_PHICNumber = @Stat_PHICNumber,
              Stat_PHICMonthlyContribution = @Stat_PHICMonthlyContribution,
              Stat_TINNumber = Stat_TINNumber
          WHERE CompBenId = @CompBenId
        `);

    return result;
  } catch (error) {
    console.error("Error updating compensation benefits by ID:", error);
    throw error;
  }
};
// Retrieve history by Employee ID from the database
const getHistoryByEmployeeId = async (employeeId) => {
  try {
    // Connect to the database
    let pool = await sql.connect(config);
    
    // Query history data based on employeeId
    let result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .query(`
        SELECT *
        FROM History
        WHERE EmployeeId = @EmployeeId;
      `);

    // Log the query result
    console.log(`Query result for Employee ID ${employeeId}:`, result.recordset);

    return result.recordset; // Return history data
  } catch (error) {
    console.error("Error fetching history by Employee ID:", error);
    throw error;
  }
};
//function that handles in fetching all the employee details to download as excel file
const getAllEmployeesToDownload = async () => {
  try {
      let pool = await sql.connect(config);

      let result = await pool.request().query(`
          SELECT 
              e.EmployeeId,
              e.FirstName,
              e.MiddleName,
              e.LastName,
              e.EmailAddress,
              e.Birthdate,
              e.Gender,
              e.MaritalStatus,
              e.SSS,
              e.PHIC,
              e.HDMF,
              e.TIN,
              e.DateHired,
              e.EmploymentStatus,
              e.EmployeeStatus,
              e.Rate,
              e.ManagerID,
              e.PMPICID,
              e.DUHID,
              e.IsManager,
              e.IsPMPIC,
              e.IsIndividualContributor,
              e.IsActive,
              e.Position,
              e.IsDUHead,
              e.Facility,
              e.EmployeeRole,
              e.EmployeeCategory,
              C.ContactNumber AS EmContactPhoneNumber,
        A.CompleteAddress AS EmContactCompleteAddress,
        A.HouseNumber AS EmContactHouseNo,
        A.Barangay AS EmContactBarangay,
        A.CityMunicipality AS EmContactCityMunicipality,
        A.Province AS EmContactProvince,
        A.Region AS EmContactRegion,
        A.Country AS EmContactCountry,
        A.ZipCode AS EmContactZipcode,
        A.LandMark AS EmContactLandMark,
        A.IsPermanent AS Is_Permanent,
        A.IsEmergency AS Is_Emergency
          FROM EmpPersonalDetails e
          LEFT JOIN EmployeeInfo ep ON e.EmployeeId = ep.EmployeeId
          LEFT JOIN Contact c ON e.EmployeeId = c.EmployeeId
          LEFT JOIN Address a ON e.EmployeeId = a.EmployeeId
          LEFT JOIN Education edu ON e.EmployeeId = edu.EmployeeId
          LEFT JOIN EmergencyContactNumber ec ON e.EmployeeId = ec.EmployeeId
          LEFT JOIN DeliveryUnit du ON e.EmployeeId = du.EmployeeId
          LEFT JOIN Project p ON e.EmployeeId = p.EmployeeId
          LEFT JOIN Shift s ON e.EmployeeId = s.EmployeeId
          LEFT JOIN Department d ON e.EmployeeId = d.EmployeeId
          LEFT JOIN Product pr ON e.EmployeeId = pr.EmployeeId
          LEFT JOIN Dependent dep ON e.EmployeeId = dep.EmployeeId
      `);

      return result.recordset;
  } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees.');
  }
};

module.exports = {
  updateUserPassword,
  getUserByEmployeeId,
  insertEmployee,
  getEmployees,
  insertNewHire,
  getAllNewHireEmployees,
  updateEmployeeById,
  getEmployeeById,
  deleteEmployeeById,
  updateProfilePhoto,
  updatePersonalDetails,
  getPersonalDetailsByUserId,
  getAllUserAccount,
  getUserData,
  deleteUsersById,
  updateEmployeeInfoById,
  updateEmployeeAddressById,
  updateEmployeeProjectById,
  updateEmployeeEducationById,
  deleteEmpInfoById,
  updateEmployeeShiftById,
  updateEmployeeDUById,
  updateEmployeeDepartmentById,
  updateProductById, 
  deleteEmContactById,
  updateEmergencyContactById,
  getUserEmpId,
  getUserById,
  insertDependent,
  deleteAllEmployeeData,
  getDependentsByEmployeeId,
  updateDependentById,
  getAddNewContactId,
  insertCompBen,
  getCompBenByEmployeeId,
  updateCompBenById,
  addToHistory,
  getEmployeeInfoById,
  checkEmployeeAndEmail,
  resetPassword,
  getHistoryByEmployeeId,
  getAllCountNewHireEmployees,
  getMonthlyNewHireCount,
  getYearlyNewHireCount,
  getAllEmployees,
  getAllEmployeesToDownload
};