import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import TopNavbar from './topnavbar';
import Footer from './footer';
import '../App.css';
import { Modal, Button } from 'react-bootstrap';
import 'jspdf-autotable';

 function UpdateEmployeeInfo() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddDependentModal, setShowAddDependentModal] = useState(false);
  const [showAddCompBenModal, setShowAddCompBenModal] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    EmployeeId: '',
    EmployeeName: '',
    LastName: '',
    FirstName: '',
    MiddleName: '',
    MaidenName: '',
    Birthdate: '',
    Age: '',
    BirthMonth: '',
    AgeBracket: '',
    Gender: '',
    MaritalStatus: '',
    SSS: '',
    PHIC: '',
    HDMF: '',
    TIN: '',
    ContactNumber: '',
    EmailAddress: '',
    is_Active: false,
    IsActive: false,
    Is_Active: false,
    IsDUHead: false, 
    IsEmergency:false,
    IsIndividualContributor: false,
    IsManager: false,
    IsPMPIC: false,
    IsPermanent: false,
    Is_Emergency: false,
    Is_Permanent: false,
    ProfilePhoto: "/img/user.png",
    HRANType: '',
    Remarks: ''
  });
  // Define initialOptions first
  const initialOptions = [
        'Re - Hire',
        'Recall',
        'Resignation',
        'Change of Position Title',
        'Salary Adjustment',
        'Transfer',
        'Force Leave',
        'End of Contract',
        'Extension of Fixed Term',
        'Revert Developmental',
        'Developmental Assignment',
        'Others'
  ];
  const [otherHRANType, setOtherHRANType] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [initialEmployeeData, setInitialEmployeeData] = useState({});
  const [dependents, setDependents] = useState([]);
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDependents, setFilteredDependents] = useState([]);
  const educationRef = useRef(null);
  const [compBenData, setcompBenData] = useState({
    Salary: '',
    DailyEquivalent: '',
    MonthlyEquivalent: '',
    AnnualEquivalent: '',
    RiceMonthly: '',
    RiceAnnual: '',
    RiceDifferentialAnnual: '',
    UniformAnnual: '',
    LeaveDays: '',
    LaundryAllowance: '',
    CommAllowance: '',
    CommAllowanceType: '',
    CashGift: '',
    MedicalInsurance: '',
    FreeHMODependent: '',
    MBL: '',
    LifeInsurance: '',
    Beneficiaries: '',
    PersonalAccidentInsuranceBenefit: '',
    PWDIDNumber: '',
    TendopayRegistered: '',
    CanteenUID: '',
    CanteenCreditLimit: '',
    CanteenBarcode: '',
    DAPMembershipNumber: '',
    DAPDependents: '',
    Stat_SSSNumber: '',
    Stat_SSSMonthlyContribution: '',
    Stat_PagIbigNumber: '',
    Stat_PagIbigMonthlyContribution: '',
    Stat_PHICNumber: '',
    Stat_PHICMonthlyContribution: '',
    Stat_TINNumber: ''
  });
  const [filteredCompBen, setFilteredCompBen] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedCompBen, setSelectedCompBen] = useState(null);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const [addressErrors, setAddressErrors] = useState({});
  const [ECaddressErrors, setECAddressErrors] = useState({});
  const [ECcountries, setECCountries] = useState([]);
  const [ECregions, setECRegions] = useState([]);
  const [ECprovinces, setECProvinces] = useState([]);
  const [ECcities, setECCities] = useState([]);
  const [ECbarangay, setECBarangay] = useState([]);
    // Initialize state for phone number and validation error
  const [EMphoneError, setEmPhoneError] = useState('');
  const [contactError, setContactError] = useState('');
  const [secondaryContactError, setSecondaryContactError] = useState('');
  const [newContactError, setNewContactError] = useState('');
  
  //handles to validate address
  const validateAddressForm = () => {
    const errors = {};
    if (employeeData.Country) {
      if (!employeeData.Province) errors.Province = 'Region is required';
      if (!employeeData.Region) errors.Region = 'Province is required';
      if (!employeeData.CityMunicipality) errors.CityMunicipality = 'City / Municipality is required';
      if (!employeeData.Barangay) errors.Barangay = 'Barangay is required';
      if (!employeeData.ZipCode) errors.ZipCode = 'ZipCode is required';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  useEffect(() => {
    updateCompleteAddress();
  }, [ employeeData.Landmark, employeeData.Barangay, employeeData.CityMunicipality, 
    employeeData.Province, employeeData.Region, employeeData.Country, employeeData.ZipCode]);

//handles to validate Emergency contact address
  const validateECAddressForm = () => {
    const errors = {};
    if (employeeData.EmContactCountry) {
      if (!employeeData.EmContactRegion) errors.EmContactRegion = 'Region is required';
      if (!employeeData.EmContactProvince) errors.EmContactProvince = 'Province is required';
      if (!employeeData.EmContactCityMunicipality) errors.EmContactCityMunicipality = 'City / Municipality is required';
      if (!employeeData.EmContactBarangay) errors.EmContactBarangay = 'Barangay is required';
      if (!employeeData.EmContactZipcode) errors.EmContactZipcode = 'ZipCode is required';
    }
    setECAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  useEffect(() => {
    updateECcompleteAddress();
  }, [employeeData.EmContactLandMark, employeeData.EmContactBarangay, employeeData.EmContactCityMunicipality, employeeData.EmContactProvince, 
    employeeData.EmContactRegion, employeeData.EmContactCountry, employeeData.EmContactZipcode]);

    // Function to handle input change in the search field
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
     // Go back to the previous page in history
  const handleNavigateBack = () => {
    // Navigate back one step in history (equivalent to pressing the browser's back button)
    navigate(-1);
  };

    // Effect to filter dependents based on search query
    useEffect(() => {
      if (dependents && dependents.length > 0) {
        const filtered = dependents.filter((dependent) =>
          dependent.FullName && dependent.FullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDependents(filtered);
      } else {
        setFilteredDependents([]);
      }
    }, [searchQuery, dependents]);

 // Define the fetchDependents function
 const fetchDependents = async () => {
  try {
    const response = await fetch(`http://localhost:5000/retrieve/dependents/${employeeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dependents');
    }
    const data = await response.json();
    setDependents(data);
  } catch (error) {
    console.error('Error fetching dependents:', error);
  }
};
// Define the fetchCompBen function
const fetchCompBen = async () => {
  console.log(employeeId);
  try {
    console.log(compBenData);
    const response = await fetch(`http://localhost:5000/retrieve/compBen/${employeeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch compensation benefits details: ${response.statusText}`);
    }
    const data = await response.json();

        // setcompBenData(data);
        // setCompBen(data); 
        setFilteredCompBen(data);
  } catch (error) {
    console.error('Error fetching compensation benefits details:', error);
  }
};
// Define the History function
const fetchHistory = async () => {
  console.log(employeeId);
  try {
    const response = await fetch(`http://localhost:5000/retrieve/history/${employeeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history details: ${response.statusText}`);
    }
    const data = await response.json();
    setFilteredHistory(data); // Update the state with fetched data
  } catch (error) {
    console.error('Error fetching history details:', error);
    // Handle error if needed
  }
};
useEffect(() => {
  fetchHistory();
}, [employeeId]);

// Call fetchDependents whenever employeeId changes
useEffect(() => {
  fetchDependents();
  fetchEmployeeData();
  fetchCompBen();
}, [employeeId]);

// Function to format date as 'MM/DD/YYYY'
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${month}/${day}/${year}`;
};
  // Function to reset form data
  const resetFormData = () => {
    setEmployeeData({
      //Dependent fields
      FullName: '',
      PhoneNum: '',
      Relationship: '',
      DateOfBirth: '',
      Occupation: '',
      Address: '',
      City: '',
      DepProvince: '',
      PostalCode: '',
      Beneficiary: '',
      BeneficiaryDate: '',
      TypeOfCoverage: '',
      Insurance: '',
      InsuranceDate: '',
      Remarks: '',
      CompanyPaid: '',
      HMOProvider: '',
      HMOPolicyNumber: ''
    });
  };
    // Function to reset form data
    const resetCompBenForm = () => {
      setcompBenData({
        //Compensation Benefits
        Salary: '',
        DailyEquivalent: '',
        MonthlyEquivalent: '',
        AnnualEquivalent: '',
        RiceMonthly: '',
        RiceAnnual: '',
        RiceDifferentialAnnual: '',
        UniformAnnual: '',
        LeaveDays: '',
        LaundryAllowance: '',
        CommAllowance: '',
        CommAllowanceType: '',
        CashGift: '',
        MedicalInsurance: '',
        FreeHMODependent: '',
        MBL: '',
        LifeInsurance: '',
        Beneficiaries: '',
        PersonalAccidentInsuranceBenefit: '',
        PWDIDNumber: '',
        TendopayRegistered: '',
        CanteenUID: '',
        CanteenCreditLimit: '',
        CanteenBarcode: '',
        DAPMembershipNumber: '',
        DAPDependents: '',
        Stat_SSSNumber: '',
        Stat_SSSMonthlyContribution: '',
        Stat_PagIbigNumber: '',
        Stat_PagIbigMonthlyContribution: '',
        Stat_PHICNumber: '',
        Stat_PHICMonthlyContribution: '',
        Stat_TINNumber: ''
      });
    };
  //Function to handle opening add modal for new dependent records
const handleShowAddDependentModal = () => {
  resetFormData(); // Clear form data
  setShowAddDependentModal(true);
};
const handleShowAddCompBenModal = () => {
  resetCompBenForm(); // Clear form data
  setShowAddCompBenModal(true);
};
//Function to handle closing add modal for new dependent records
const handleCloseAddModal = () => {
  setShowAddDependentModal(false); // Corrected line
  setShowAddCompBenModal(false);
};
  // Function to handle opening edit modal and set selected dependent
  const handleShowEditModal = (dependent) => {
    // setShowEditModal(true);
    setSelectedDependent(dependent);
  };
  // Function to handle closing edit modal
  const handleCloseEditModal = () => {
    // setShowEditModal(false);
    setSelectedDependent(null);
  };
    // Function to handle opening edit modal and set selected dependent
    const handleShowEditCompBenModal = (compBen) => {
      setSelectedCompBen(compBen);
    };
    // Function to handle closing edit modal
    const handleCloseEditCompBenModal = () => {
      setSelectedCompBen(null);
    };
//FETCHING ALL EMPLOYEE DATA EXCLUDING THE DEPENDENT RECORDS BASED ON EMPLOYEE ID
  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/retrieve/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }
      const data = await response.json();
    
      // Store the initial employee data
      setInitialEmployeeData(data);

      // Convert birthdate string to formatted date
      data.Birthdate = formatDate(data.Birthdate);
      data.DateHired = formatDate(data.DateHired);
      data.DateFrom = formatDate(data.DateFrom);
      data.DateTo = formatDate(data.DateFrom);
      data.DateOfBirth = formatDate(data.DateOfBirth);

      // To convert all the capital letters in a string to title case (capitalize the first letter of each word)
      function convertToTitleCase(str) {
        return str.toLowerCase().replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        });
      }

      // Convert names to title case before setting in state
      const formattedData = {
        ...data,
        EmployeeName: convertToTitleCase(data.EmployeeName),
        FirstName: convertToTitleCase(data.FirstName),
        MiddleName: convertToTitleCase(data.MiddleName),
        LastName: convertToTitleCase(data.LastName),
        BirthMonth: convertToTitleCase(data.BirthMonth),
        MaritalStatus: convertToTitleCase(data.MaritalStatus),
        Gender: convertToTitleCase(data.Gender),
      };

      setEmployeeData(formattedData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setErrorMessage('Error fetching employee data');
    }
  };
  //validate phone number
  const validatePhoneNumber = (value) => {
    const numberRegex = /^[0-9]*$/;
  
    if (!numberRegex.test(value)) {
      return 'Phone number must only contain numbers';
    } else if (value.length > 11) {
      return 'Phone number cannot exceed 11 digits';
    }
  
    return '';
  };
  
//HANDLES INPUT TO UPDATE DATA
const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';
    
    // Convert specific fields to booleans if necessary
    switch (name) {
      case 'is_Active':
      case 'IsActive':
      case 'Is_Active':
      case 'IsDUHead':
      case 'IsEmergency':
      case 'IsIndividualContributor':
      case 'IsManager':
      case 'IsPMPIC':
      case 'IsPermanent':
      case 'Is_Emergency':
      case 'Is_Permanent':
        newValue = value === 'true';
        break;
      default:
        break;
    }
        // Phone number validation
        if (name === 'EmContactPhoneNumber') {
          error = validatePhoneNumber(value);
          setEmPhoneError(error);
        } else if (name === 'ContactNumber') {
          error = validatePhoneNumber(value);
          setContactError(error);
        } else if (name === 'SecondaryContactNum') {
          error = validatePhoneNumber(value);
          setSecondaryContactError(error);
        } else if (name === 'newContactNumber') {
          error = validatePhoneNumber(value);
          setNewContactError(error);
        }

    setEmployeeData({
      ...employeeData,
      [name]: newValue
    });

      // Reset otherHRANType if it's not the "Others" option
      if (name === 'HRANType' && value !== 'Others') {
        setOtherHRANType('');
    }
  };
  //handles that validate remarks
  const validateRemarks = () => {
    if (initialOptions.includes(employeeData.HRANType) && employeeData.HRANType !== 'Others' && !employeeData.Remarks) {
      alert('Please enter remarks for the selected HRAN Type.');
      return false;
    }
    return true;
  };
  
  //function to handle the additional input for hran type
  const handleOtherInputChange = (event) => {
    setOtherHRANType(event.target.value);
};
  
//function that handles in adding other hran type details
// const addOtherHRANType = () => {
//     if (otherHRANType && !options.includes(otherHRANType)) {
//         setOptions([...options, otherHRANType]);
//         setEmployeeData({ ...employeeData, HRANType: otherHRANType });
//         setOtherHRANType('');
//     }
// };
const addOtherHRANType = () => {
  if (otherHRANType.trim() && !options.includes(otherHRANType)) {
    setOptions([...options, otherHRANType]);
    setEmployeeData({
      ...employeeData,
      HRANType: otherHRANType
    });
    setOtherHRANType('');
  }
};

// Handle form submission for adding new contact
const handleAddContactForm = async (e) => {
  e.preventDefault();
  console.log(employeeData.newContactNumber);
  try {
    const contactResponse = await fetch(`http://localhost:5000/addContactNumber/${employeeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( employeeData )
    });

    if (!contactResponse.ok) {
      throw new Error('Failed to add new contact number');
    }

    const contactData = await contactResponse.json();
    console.log('Contact number added:', contactData.message);

    // Refresh employee data after successful addition
    fetchEmployeeData();

    // Reload the tab
    // window.location.reload();

  } catch (error) {
    console.error('Error adding contact number:', error);
    alert('Failed to add contact number. Please try again.');
  }
};
  //UPDATE EMPLOYEE PERSONAL DETAILS
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/updateEmployee/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
  
    // Retrieve the name of the employee from employeeData
    const { FirstName, LastName } = employeeData;
    const employeeName = `${FirstName} ${LastName}`;

    // Compare initial employeeData with updated employeeData
    const updatedFields = [];
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== initialEmployeeData[key]) {
        updatedFields.push(key);
      }
    });

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No employee personal details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

      // Refresh employee data after successful addition
      fetchEmployeeData();

      // Reload the page after showing the alert
      window.location.reload();
  
      } catch (error) {
        console.error('Error updating employee personal details:', error);
        // Send alert message for failure
        alert('Failed to update employee personal details. Please try again later.');
      }
  };

// Function to handle in updating the employee information
// const handleFormEmpInfoSubmit = async (e) => {
//   e.preventDefault(); // Prevent the default form submission

//   // Validate HRANType is chosen
//   if (!employeeData.HRANType) {
//     alert('Please choose an HRANType before updating the employee information.');
//     return;
//   }
//    // Validate Remarks before submission
//    if (!validateRemarks()) {
//     return;
//   }
//   try {
//     // Fetch the current employee data
//     const currentDataResponse = await fetch(`http://localhost:5000/getEmployeeInfo/${employeeId}`);
//     if (!currentDataResponse.ok) {
//       throw new Error('Failed to fetch current employee data');
//     }
//     const currentData = await currentDataResponse.json();

//     // Store previous values for all the fields being updated
//     const previousValues = { ...currentData };


//     // Fetch call to update employee information
//     const response = await fetch(`http://localhost:5000/updateEmployeeInfo/${employeeId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(employeeData),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update employee');
//     }

//     // Retrieve the name of the employee from employeeData
//     const { FirstName, LastName } = employeeData;
//     const employeeName = `${FirstName} ${LastName}`;

//     // Compare initial employeeData with updated employeeData
//     const updatedFields = [];
//     Object.entries(employeeData).forEach(([key, value]) => {
//       if (value !== initialEmployeeData[key]) {
//         updatedFields.push(key);
//       }
//     });

//     // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
//     const filteredFields = updatedFields.filter(
//       (field) => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName', 'EmContactCompleteAddress'].includes(field)
//     );

//     // Generate success message based on updated fields
//     let successMessage;
//     if (filteredFields.length === 0) {
//       successMessage = `No employee information has been updated for ${employeeName}.`;
//     } else {
//       successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
//     }

//     // Retrieve user's first name from session storage
//     const updatedByFirstName = sessionStorage.getItem('firstName');
//     const updatedByLastName = sessionStorage.getItem('lastName');
//     const updatedByRole = sessionStorage.getItem('role');
//     const updatedBy = `${updatedByRole} ${updatedByFirstName} ${updatedByLastName}`;

//     // Insert into History table for each updated field
//     for (const field of filteredFields) {

//       const newValue = employeeData[field];
//       if (newValue === undefined || newValue === null) {
//         console.error(`Invalid value for field ${field}: ${newValue}`);
//         continue;
//       }

//       const historyData = {
//         EmployeeName: employeeName,
//         Action: 'Update',
//         FieldName: field,
//         OldValue: previousValues[field] || 'N/A',
//         NewValue: employeeData[field],
//         DateCreated: new Date().toISOString(),
//         UpdatedBy: updatedBy,
//         EmployeeId: employeeId,
//         Remarks: employeeData.Remarks,
//       };

//       const historyResponse = await fetch('http://localhost:5000/addToHistory', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(historyData),
//       });

//       if (!historyResponse.ok) {
//         throw new Error('Failed to add record to History');
//       }
//     }

//     // Display the success message
//     alert(successMessage);

//         // Refresh employee data after successful addition
//         fetchEmployeeData();

//      // Reload the page after showing the alert
//      window.location.reload();

//   } catch (error) {
//     console.error('Error updating employee information:', error);
//     // Send alert message for failure
//     alert('Failed to update employee information. Please try again later.');
//   }
// };
const handleFormEmpInfoSubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Check if HRANType is selected and changed
  const isHRANTypeChanged = employeeData.HRANType !== initialEmployeeData.HRANType;

  // Validate Remarks only if HRANType is selected and changed
  if (isHRANTypeChanged && !validateRemarks()) {
    return;
  }

  try {
    // Fetch the current employee data
    const currentDataResponse = await fetch(`http://localhost:5000/getEmployeeInfo/${employeeId}`);
    if (!currentDataResponse.ok) {
      throw new Error('Failed to fetch current employee data');
    }
    const currentData = await currentDataResponse.json();

    // Store previous values for all the fields being updated
    const previousValues = { ...currentData };

    // Fetch call to update employee information
    const response = await fetch(`http://localhost:5000/updateEmployeeInfo/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    // Retrieve the name of the employee from employeeData
    const { FirstName, LastName } = employeeData;
    const employeeName = `${FirstName} ${LastName}`;

    // Compare initial employeeData with updated employeeData
    const updatedFields = [];
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== initialEmployeeData[key]) {
        updatedFields.push(key);
      }
    });

    // Filter out fields that should not trigger remarks validation
    const filteredFields = updatedFields.filter(
      (field) => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName', 'EmContactCompleteAddress'].includes(field)
    );

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No employee information has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

    // Retrieve user's first name from session storage
    const updatedByFirstName = sessionStorage.getItem('firstName');
    const updatedByLastName = sessionStorage.getItem('lastName');
    const updatedByRole = sessionStorage.getItem('role');
    const updatedBy = `${updatedByRole} ${updatedByFirstName} ${updatedByLastName}`;

    // Insert into History table for each updated field
    for (const field of filteredFields) {
      const newValue = employeeData[field];
      if (newValue === undefined || newValue === null) {
        console.error(`Invalid value for field ${field}: ${newValue}`);
        continue;
      }

      const historyData = {
        EmployeeName: employeeName,
        Action: 'Update',
        FieldName: field,
        OldValue: previousValues[field] || 'N/A',
        NewValue: employeeData[field],
        DateCreated: new Date().toISOString(),
        UpdatedBy: updatedBy,
        EmployeeId: employeeId,
        Remarks: isHRANTypeChanged ? employeeData.Remarks : '', // Include Remarks only if HRANType is changed
      };

      const historyResponse = await fetch('http://localhost:5000/addToHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      });

      if (!historyResponse.ok) {
        throw new Error('Failed to add record to History');
      }
    }

    // Display the success message
    alert(successMessage);

    // Refresh employee data after successful addition
    fetchEmployeeData();

    // Reload the page after showing the alert
    window.location.reload();

  } catch (error) {
    console.error('Error updating employee information:', error);
    // Send alert message for failure
    alert('Failed to update employee information. Please try again later.');
  }
};


      //UPDATE ADDRESS DETAILS
      const handleAddressFormSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        if (!validateAddressForm()) {
          return; // If validation fails, do not proceed with the API call
        }
    
        try {
          const response = await fetch(`http://localhost:5000/updateEmployeeAddress/${employeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
          });
    
          if (!response.ok) {
            throw new Error('Failed to update employee address');
          }
    
          // Retrieve the name of the employee from employeeData
          const { FirstName, LastName } = employeeData;
          const employeeName = `${FirstName} ${LastName}`;
    
          // Compare initial employeeData with updated employeeData
          const updatedFields = [];
          Object.entries(employeeData).forEach(([key, value]) => {
            if (value !== initialEmployeeData[key]) {
              updatedFields.push(key);
            }
          });
    
          // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
          const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
    
          // Generate success message based on updated fields
          let successMessage;
          if (filteredFields.length === 0) {
            successMessage = `No address details have been updated for ${employeeName}.`;
          } else {
            successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
          }
    
          // Display the success message
          alert(successMessage);
    
          // Reload the page after showing the alert
          // window.location.reload();
          // Navigate to report.js
          // navigate("/reports");

        // Refresh employee data after successful addition
        fetchEmployeeData();
    
        } catch (error) {
          console.error('Error updating employee address:', error);
        } 
      };

    //UPDATE PROJECT DETAILS
  const handleProjectFormSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData);
    try {
      const response = await fetch(`http://localhost:5000/updateProject/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update project details');
      }
  
    // Retrieve the name of the employee from employeeData
    const { FirstName, LastName } = employeeData;
    const employeeName = `${FirstName} ${LastName}`;

    // Compare initial employeeData with updated employeeData
    const updatedFields = [];
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== initialEmployeeData[key]) {
        updatedFields.push(key);
      }
    });

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No project details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

       // Reload the tab
       window.location.reload();
  
      // Navigate to report.js
    //   navigate("/reports");
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };
     //UPDATE EMPLOYEE EDUCATION DETAILS
     const handleEducationFormSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:5000/updateEmployeeEducation/${employeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
          });
          if (!response.ok) {
            throw new Error('Failed to update education details');
          }
      
    // Retrieve the name of the employee from employeeData
    const { FirstName, LastName } = employeeData;
    const employeeName = `${FirstName} ${LastName}`;

    // Compare initial employeeData with updated employeeData
    const updatedFields = [];
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== initialEmployeeData[key]) {
        updatedFields.push(key);
      }
    });

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No education details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }
        // Display the success message
        alert(successMessage);
      
         // Reload the page after showing the alert
        // window.location.reload();

        // Refresh employee data after successful addition
        fetchEmployeeData();

        } catch (error) {
          console.error('Error updating employee:', error);
        }
      };
        //UPDATE SHIFT DETAILS
  const handleShiftFormSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData);
    try {
      const response = await fetch(`http://localhost:5000/updateShift/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update shift details');
      }
  
    // Retrieve the name of the employee from employeeData
    const { FirstName, LastName } = employeeData;
    const employeeName = `${FirstName} ${LastName}`;

    // Compare initial employeeData with updated employeeData
    const updatedFields = [];
    Object.entries(employeeData).forEach(([key, value]) => {
      if (value !== initialEmployeeData[key]) {
        updatedFields.push(key);
      }
    });

    // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
    const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));

    // Generate success message based on updated fields
    let successMessage;
    if (filteredFields.length === 0) {
      successMessage = `No shift details has been updated for ${employeeName}.`;
    } else {
      successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
    }

  
      // Display the success message
      alert(successMessage);

       // Reload the tab
       window.location.reload();
  
      } catch (error) {
        console.error('Error updating shift unit details:', error);
        // Send alert message for failure
        alert('Failed to update shift unit details. Please try again later.');
      }
  };
        //UPDATE DELIVERY UNIT 
        const handleDUFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateDU/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update delivery unit details');
              }
          
            // Retrieve the name of the employee from employeeData
            const { FirstName, LastName } = employeeData;
            const employeeName = `${FirstName} ${LastName}`;
        
            // Compare initial employeeData with updated employeeData
            const updatedFields = [];
            Object.entries(employeeData).forEach(([key, value]) => {
              if (value !== initialEmployeeData[key]) {
                updatedFields.push(key);
              }
            });
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No delivery unit details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
        
              // Display the success message
              alert(successMessage);
        
               // Reload the tab
               window.location.reload();
          
              } catch (error) {
                console.error('Error updating delivery unit details:', error);
                // Send alert message for failure
                alert('Failed to update delivery unit details. Please try again later.');
              }
          };
        //UPDATE DEPARTMENT DETAILS
        const handleDepartmentFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateDepartment/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update employee department details');
              }
          
            // Retrieve the name of the employee from employeeData
            const { FirstName, LastName } = employeeData;
            const employeeName = `${FirstName} ${LastName}`;
        
            // Compare initial employeeData with updated employeeData
            const updatedFields = [];
            Object.entries(employeeData).forEach(([key, value]) => {
              if (value !== initialEmployeeData[key]) {
                updatedFields.push(key);
              }
            });
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No department details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
              // Display the success message
              alert(successMessage);
        
               // Reload the tab
               window.location.reload();
          
              } catch (error) {
                console.error('Error updating department details:', error);
                // Send alert message for failure
                alert('Failed to update department details. Please try again later.');
              }
          }; 
  // Function to handle dependent form submission for update
  const handleDependentFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDependent || !selectedDependent.DependentID) return;
      console.log(selectedDependent);
    try {
      const response = await fetch(`http://localhost:5000/updateDependent/${selectedDependent.DependentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedDependent) // Send updated dependent data
      });

      if (!response.ok) {
        throw new Error('Failed to update dependent details');
      }

      const data = await response.json();
      alert(data.message); // Display success message from backend
      handleCloseEditModal(); // Close modal after successful update
      fetchDependents(); // Refresh dependents data after update

      // Refresh employee data after successful addition
     fetchEmployeeData();

    } catch (error) {
      console.error('Error updating dependent details:', error);
      alert('Failed to update dependent details. Please try again later.');
    }
  };
  //ADD DEPENDENT DETAILS       
  const handleAddDependent = async (e) => {
    e.preventDefault();

    try {
      console.log(employeeData);
      const response = await fetch(`http://localhost:5000/addDependent/${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        throw new Error('Failed to add dependent details');
      }

      const data = await response.json();
      alert(data.message); // Display success message from backend
      handleCloseAddModal(); // Close modal after successful addition

       // Fetch updated dependents data after adding a new dependent
    fetchDependents(); 

     // Refresh employee data after successful addition
     fetchEmployeeData();

     // Reload the tab
    //  window.location.reload();
     // Close modal
     handleCloseAddModal();

    } catch (error) {
      console.error('Error adding dependent:', error);
      alert('Failed to add dependent. Please try again.');
    }
  };
        //UPDATE PRODUCT DETAILS
        const handleProductFormSubmit = async (e) => {
            e.preventDefault();
            console.log(employeeData);
            try {
              const response = await fetch(`http://localhost:5000/updateProduct/${employeeId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
              });
              if (!response.ok) {
                throw new Error('Failed to update product details');
              }
          
            // Retrieve the name of the employee from employeeData
            const { FirstName, LastName } = employeeData;
            const employeeName = `${FirstName} ${LastName}`;
        
            // Compare initial employeeData with updated employeeData
            const updatedFields = [];
            Object.entries(employeeData).forEach(([key, value]) => {
              if (value !== initialEmployeeData[key]) {
                updatedFields.push(key);
              }
            });
        
            // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
            const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
        
            // Generate success message based on updated fields
            let successMessage;
            if (filteredFields.length === 0) {
              successMessage = `No product details has been updated for ${employeeName}.`;
            } else {
              successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
            }
        
              // Display the success message
              alert(successMessage);

              // Reload the page after showing the alert
                window.location.reload();
              } catch (error) {
                console.error('Error updating product details:', error);
                // Send alert message for failure
                alert('Failed to update product details. Please try again later.');
              }
          };
  //UPDATE EMERGENCY CONTACT DETAILS
  const handleECFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateECAddressForm()) {
      return; // If validation fails, do not proceed with the API call
    }
    try {
      const response = await fetch(`http://localhost:5000/updateEmerContact/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update employee emergency contact');
      }
  
      // Retrieve the name of the employee from employeeData
      const { FirstName, LastName } = employeeData;
      const employeeName = `${FirstName} ${LastName}`;
  
      // Compare initial employeeData with updated employeeData
      const updatedFields = [];
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== initialEmployeeData[key]) {
          updatedFields.push(key);
        }
      });
  
      // Filter out fields that contain EmployeeName, FirstName, MiddleName, LastName
      const filteredFields = updatedFields.filter(field => !['EmployeeName', 'FirstName', 'MiddleName', 'LastName'].includes(field));
  
      // Generate success message based on updated fields
      let successMessage;
      if (filteredFields.length === 0) {
        successMessage = `No employee emergency contact details have been updated for ${employeeName}.`;
      } else {
        successMessage = `Employee ${employeeName} has successfully updated ${filteredFields.join(', ')}!`;
      }
  
      // Display the success message
      alert(successMessage);
  
      // Reload the page after showing the alert
      // window.location.reload();

      // Refresh employee data after successful addition
     fetchEmployeeData();

    } catch (error) {
      console.error('Error updating employee emergency contact:', error);
      // Send alert message for failure
      alert('Failed to update employee emergency contact. Please try again later.');
    }
  };
    // Handle navigation to employee profile page with employeeData and dependents
    const handleView = () => {
      navigate('/employeeProfile', { state: { employeeData, dependents } });
    };

    // Define a function to determine the color based on EmployeeStatus value
    const getStatusColor = (status) => {
      switch (status) {
        case 'Active': // Active
          return 'green';
        case 'Separated': // Separated
          return 'red';
        case 'Inactive - Maternity': // Inactive - Maternity
        case 'Inactive - Sickness': // Inactive - Sickness
        case 'Inactive - Absent with leave': // Inactive - Absent with leave
        case 'Inactive - Absent Without Leave': // Inactive - Absent Without Leave
        case 'Inactive - Suspension': // Inactive - Suspension
          return 'gray';
        default:
          return 'black'; // Default color
      }
    };
  
    const statusColor = getStatusColor(employeeData.EmployeeStatus);
//Address filtering starts here
    useEffect(() => {
      fetchCountries();
    }, []);
  //function to fecth the country in geoname api
    const fetchCountries = async () => {
      const username = 'innodata_test'; // GeoNames username
      try {
        const response = await fetch(`http://api.geonames.org/countryInfoJSON?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const countries = data.geonames.map(country => country.countryName);
        setCountries(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
   //function to handle in filtering annd mapping the country
   const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setEmployeeData({ ...employeeData, Country: selectedCountry });
    setRegions([]);
    setProvinces([]);
    setCities([]);
    setBarangay([]);
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedCountry}&featureCode=ADM1&username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch regions data');
      }
      const data = await response.json();
      const regions = data.geonames.map(region => region.name);
      setRegions(regions);
    } catch (error) {
      console.error('Error fetching regions data:', error);
    }
  };

  const handleRegionChange = async (e) => {
    const selectedRegion = e.target.value;
    setEmployeeData({ ...employeeData, Region: selectedRegion });
    setProvinces([]);
    setCities([]);
    setBarangay([]);
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedRegion}&featureCode=ADM2&username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces data');
      }
      const data = await response.json();
      const provinces = data.geonames.map(item => item.name);
      setProvinces(provinces);
    } catch (error) {
      console.error('Error fetching provinces data:', error);
    }
  };

  const handleProvinceChange = async (e) => {
    const selectedProvince = e.target.value;
    setEmployeeData({ ...employeeData, Province: selectedProvince });
    setCities([]);
    try {
      const username = 'innodata_test';
      const provinceResponse = await fetch(`http://api.geonames.org/searchJSON?q=${selectedProvince}&featureCode=PPLA&featureCode=PPLA3&username=${username}`);
      if (!provinceResponse.ok) {
        throw new Error('Failed to fetch cities data');
      }
      const provinceData = await provinceResponse.json();
      const provinceCities = provinceData.geonames.map(item => item.name);

      // Fetching highly urbanized cities separately
      const hucResponse = await fetch(`http://api.geonames.org/searchJSON?country=PH&featureCode=PPL&featureCode=PPLA2&featureCode=PPLA3&featureCode=PPLA4&username=${username}`);
      if (!hucResponse.ok) {
        throw new Error('Failed to fetch highly urbanized cities');
      }
      const hucData = await hucResponse.json();
      const hucCities = hucData.geonames
        .filter(item => item.adminName1 === selectedProvince)
        .map(item => item.name);

      const allCities = [...new Set([...provinceCities, ...hucCities])];
      setCities(allCities);
    } catch (error) {
      console.error('Error fetching cities data:', error);
    }
  };

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setEmployeeData({ ...employeeData, CityMunicipality: selectedCity });
    try {
      const username = 'innodata_test';
      // Fetch places (PPL or PPLX) within the selected city/municipality
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedCity}&featureCode=PPLX&username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch places data');
      }
      
      const data = await response.json();
      const barangays = data.geonames.map(item => item.name);
      setBarangay(barangays);
      
      // Autofill zip code based on the first entry (if available)
      if (data.geonames.length > 0) {
        const firstBarangay = data.geonames[0].name; // Use the first barangay for zip code lookup
        const zipCode = await fetchZipCode(selectedCity, firstBarangay);
        setEmployeeData(prevData => ({
          ...prevData,
          ZipCode: zipCode || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching places data:', error);
    }
  };
  const fetchZipCode = async (city, barangay) => {
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?placename=${barangay}&country=PH&adminCode1=&adminCode2=&adminCode3=&username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch zip code');
      }
      
      const data = await response.json();
      if (data.postalCodes.length > 0) {
        return data.postalCodes[0].postalCode; // Return the first zip code found
      } else {
        console.warn('No zip code found for the selected barangay');
        return '';
      }
    } catch (error) {
      console.error('Error fetching zip code:', error);
      return '';
    }
  };
//this handles the complete address autofill
  const updateCompleteAddress = () => {
    const { Landmark, Barangay, CityMunicipality, Province, Region, Country, ZipCode } = employeeData;
    const completeAddress = `${Landmark}, ${Barangay}, ${CityMunicipality}, ${Region}, ${Province}, ${Country}, ${ZipCode}`;
    setEmployeeData({ ...employeeData, CompleteAddress: completeAddress });
  };

    const ensureOption = (options, value) => {
      if (value && !options.includes(value)) {
        return [value, ...options];
      }
      return options;
    };
  
    const countriesWithExisting = ensureOption(countries, employeeData.Country);
    const regionsWithExisting = ensureOption(regions, employeeData.Region);
    const provincesWithExisting = ensureOption(provinces, employeeData.Province);
    const citiesWithExisting = ensureOption(cities, employeeData.CityMunicipality);

    //emergency contact address filtering starts here
    useEffect(() => {
      fetchECCountries();
    }, []);
  //function to fecth the country in geoname api
    const fetchECCountries = async () => {
      const username = 'innodata_test'; // GeoNames username
      try {
        const response = await fetch(`http://api.geonames.org/countryInfoJSON?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const ECcountries = data.geonames.map(ECcountry => ECcountry.countryName);
        setECCountries(ECcountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
   //function to handle in filtering annd mapping the country
   const handleECCountryChange = async (e) => {
    const selectedECCountry = e.target.value;
    setEmployeeData({ ...employeeData, EmContactCountry: selectedECCountry });
    setECRegions([]);
    setECProvinces([]);
    setECCities([]);
    setECBarangay([]);
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedECCountry}&featureCode=ADM1&username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch regions data');
      }
      const data = await response.json();
      const regions = data.geonames.map(region => region.name);
      setECRegions(regions);
    } catch (error) {
      console.error('Error fetching regions data:', error);
    }
  };

  const handleECRegionChange = async (e) => {
    const selectedECRegion = e.target.value;
    setEmployeeData({ ...employeeData, EmContactRegion: selectedECRegion });
    setECProvinces([]);
    setECCities([]);
    setECBarangay([]);
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedECRegion}&featureCode=ADM2&username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces data');
      }
      const data = await response.json();
      const provinces = data.geonames.map(item => item.name);
      setECProvinces(provinces);
    } catch (error) {
      console.error('Error fetching provinces data:', error);
    }
  };

  const handleECProvinceChange = async (e) => {
    const selectedECProvince = e.target.value;
    setEmployeeData({ ...employeeData, EmContactProvince: selectedECProvince });
    setECCities([]);
    try {
      const username = 'innodata_test';
      const provinceResponse = await fetch(`http://api.geonames.org/searchJSON?q=${selectedECProvince}&featureCode=PPLA&featureCode=PPLA3&username=${username}`);
      if (!provinceResponse.ok) {
        throw new Error('Failed to fetch emergency contact city/municipality data');
      }
      const provinceData = await provinceResponse.json();
      const provinceCities = provinceData.geonames.map(item => item.name);

      // Fetching highly urbanized cities separately
      const hucResponse = await fetch(`http://api.geonames.org/searchJSON?country=PH&featureCode=PPL&featureCode=PPLA2&featureCode=PPLA3&featureCode=PPLA4&username=${username}`);
      if (!hucResponse.ok) {
        throw new Error('Failed to fetch highly urbanized cities');
      }
      const hucData = await hucResponse.json();
      const hucCities = hucData.geonames
        .filter(item => item.adminName1 === selectedECProvince)
        .map(item => item.name);

      const allCities = [...new Set([...provinceCities, ...hucCities])];
      setECCities(allCities);
    } catch (error) {
      console.error('Error fetching city/municipality data:', error);
    }
  };

  const handleECCityChange = async (e) => {
    const selectedECCity = e.target.value;
    setEmployeeData({ ...employeeData, EmContactCityMunicipality: selectedECCity });
    try {
      const username = 'innodata_test';
      // Fetch places (PPL or PPLX) within the selected city/municipality
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${selectedECCity}&featureCode=PPLX&username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch places data');
      }
      
      const data = await response.json();
      const barangays = data.geonames.map(item => item.name);
      setECBarangay(barangays);
      
      // Autofill zip code based on the first entry (if available)
      if (data.geonames.length > 0) {
        const firstBarangay = data.geonames[0].name; // Use the first barangay for zip code lookup
        const zipCode = await fetchECZipCode(selectedECCity, firstBarangay);
        setEmployeeData(prevData => ({
          ...prevData,
          EmContactZipcode: zipCode || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching places data:', error);
    }
  };
  const fetchECZipCode = async (ECcity, ECbarangay) => {
    try {
      const username = 'innodata_test';
      const response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?placename=${ECbarangay}&country=PH&adminCode1=&adminCode2=&adminCode3=&username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch zip code');
      }
      
      const data = await response.json();
      if (data.postalCodes.length > 0) {
        return data.postalCodes[0].postalCode; // Return the first zip code found
      } else {
        console.warn('No zip code found for the selected barangay');
        return '';
      }
    } catch (error) {
      console.error('Error fetching zip code:', error);
      return '';
    }
  };

    //this handles the emergency contact complete address autofill
    const updateECcompleteAddress = () => {
      const { EmContactLandMark, EmContactBarangay, EmContactCityMunicipality, EmContactProvince, EmContactRegion, EmContactCountry, EmContactZipcode } = employeeData;
      const completeAddress = `${EmContactLandMark}, ${EmContactBarangay}, ${EmContactCityMunicipality}, ${EmContactProvince }, ${EmContactRegion}, ${EmContactCountry}, ${EmContactZipcode}`;
      setEmployeeData({ ...employeeData, EmContactCompleteAddress: completeAddress });
    };

    const ECensureOption = (options, value) => {
      if (value && !options.includes(value)) {
        return [value, ...options];
      }
      return options;
    };
  
    const ECcountriesWithExisting = ECensureOption(ECcountries, employeeData.EmContactCountry);
    const ECregionsWithExisting = ECensureOption(ECregions, employeeData.EmContactRegion);
    const ECprovincesWithExisting = ECensureOption(ECprovinces, employeeData.EmContactProvince);
    const ECcitiesWithExisting = ECensureOption(ECcities, employeeData.EmContactCityMunicipality);

  //array lists all the fields that are mandatory
  const requiredFields = [
    'Salary', 'DailyEquivalent', 'MonthlyEquivalent', 'AnnualEquivalent', 
    'RiceMonthly', 'RiceAnnual', 'RiceDifferentialAnnual', 'UniformAnnual', 
    'LeaveDays', 'LaundryAllowance', 'CommAllowance', 'CashGift', 
    'MedicalInsurance', 'FreeHMODependent', 'MBL', 'LifeInsurance', 
    'PersonalAccidentInsuranceBenefit', 'PWDIDNumber', 'TendopayRegistered', 
    'CanteenUID', 'CanteenCreditLimit', 'CanteenBarcode', 'DAPMembershipNumber', 
    'DAPDependents', 'Stat_SSSNumber', 'Stat_SSSMonthlyContribution', 
    'Stat_PagIbigNumber', 'Stat_PagIbigMonthlyContribution', 'Stat_PHICNumber', 
    'Stat_PHICMonthlyContribution', 'Stat_TINNumber'
  ];
  // function performs validation on each keystroke
    const handleInputCompBenChange = (e) => {
      const { name, value } = e.target;
      let validatedValue = value;
      let error = '';   
  
      switch (name) {
        case 'Salary':
        case 'DailyEquivalent':
        case 'MonthlyEquivalent':
        case 'AnnualEquivalent':
        case 'RiceMonthly':
        case 'RiceAnnual':
        case 'RiceDifferentialAnnual':
        case 'UniformAnnual':
        case 'LeaveDays':
        case 'LaundryAllowance':
        case 'CommAllowance':
        case 'CashGift':
        case 'MedicalInsurance':
        case 'FreeHMODependent':
        case 'MBL':
        case 'LifeInsurance':
        case 'PersonalAccidentInsuranceBenefit':
        case 'CanteenCreditLimit':
        case 'Stat_SSSMonthlyContribution':
        case 'Stat_PagIbigMonthlyContribution':
        case 'Stat_PHICMonthlyContribution':
                // Validation logic for numeric fields
                validatedValue = validatedValue.replace(/[^\d]/g, ''); // Allow only digits
                if (validatedValue === '') {
                  error = `${name} must be a number.`;
                }
          break;
        case 'PWDIDNumber':
        case 'TendopayRegistered':
        case 'CanteenUID':
        case 'CanteenBarcode':
        case 'DAPMembershipNumber':
        case 'Stat_SSSNumber':
        case 'Stat_PagIbigNumber':
        case 'Stat_PHICNumber':
        case 'Stat_TINNumber':
        // Add cases for other alphanumeric fields
        validatedValue = validatedValue.replace(/[^\w]/g, ''); // Allow alphanumeric
        if (validatedValue === '') {
          error = `${name} must be alphanumeric.`;
        }
          break;
        default:
          break;
      }
  
  // Validate if field is required and check if it's empty
  if (!validatedValue && requiredFields.includes(name)) {
    error = `${name} is required.`;
  }

  setcompBenData({
    ...compBenData,
    [name]: validatedValue
  });

  setErrors({
    ...errors,
    [name]: error
  });
};    
//function that handles in adding the compensation benefit record
const handleAddCompBen = async (e) => {
  e.preventDefault();

  try {
    // console.log(compBenData);
    const response = await fetch(`http://localhost:5000/addCompBen/${employeeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(compBenData)
    });

    if (!response.ok) {
      throw new Error('Failed to add compensation benefit details');
    }

    const data = await response.json();
    alert(data.message); // Display success message from backend
    handleCloseAddModal(); // Close modal after successful addition

    //fetch the updated data after adding the compensation benefits details
    fetchCompBen();

    // Fetch updated dependents data after adding a new dependent
    fetchDependents(); 

   // Refresh employee data after successful addition
   fetchEmployeeData();

   // Reload the tab
  //  window.location.reload();
  
  // Close modal
  handleCloseAddModal();

  } catch (error) {
    console.error('Error adding compensation benefit:', error);
    alert('Failed to add compensation benefit. Please try again.');
  }
};
  // Function to handle compensation benefits form submission for update
  const handleEditCompBenFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompBen || !selectedCompBen.CompBenId) return;
      console.log(selectedCompBen);
    try {
      const response = await fetch(`http://localhost:5000/updateCompBen/${selectedCompBen.CompBenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCompBen) // Send updated compensation benefits data
      });

      if (!response.ok) {
        throw new Error('Failed to update compensation benefits details');
      }

      const data = await response.json();
      alert(data.message); // Display success message from backend
      fetchCompBen();
      handleCloseEditCompBenModal(); // Close modal after successful update
       // Refresh compensation benefits data after update

    } catch (error) {
      console.error('Error updating compensation benefits details:', error);
      alert('Failed to update compensation benefits details. Please try again later.');
    }
  };
// Function to format text into sentence case
const toSentenceCase = (text) => {
  if (!text) return ''; // Handle null or undefined input
  return text
    .toLowerCase() // Convert the text to lowercase first
    .split(' ') // Split the text into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back together
};
// Function to check if a value is a valid date
function isValidDate(dateString) {
  const d = new Date(dateString);
  return !isNaN(d);
}

  if (!employeeData) {
    return <div>Loading...</div>;
  }

    return (
      <div id="wrapper">
          <Navbar />
          <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <TopNavbar />
              <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-xl-9">
              <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <button
                className="seeProfile btn btn-xs mr-2"
                onClick={handleView} >
                <i className="fas fa-eye"></i> View Profile
               </button>
               <div className="d-flex align-items-center">
                  <button
                    className="update-button btn btn-xs mr-2"
                    onClick={handleNavigateBack}
                  >
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                </div>
              </div>
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <ul className="nav nav-tabs nav-fill">
                      <li className="nav-item">
                          <a className="nav-link active " id="personalDetails-tab" data-toggle="tab" href="#personalDetails" role="tab" aria-controls="personalDetails" aria-selected="false">Employee Personal Details</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link" id="employmentInfo-tab" data-toggle="tab" href="#employmentInfo" role="tab" aria-controls="employmentInfo" aria-selected="false">Employment Information</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="address-tab" data-toggle="tab" href="#address" role="tab" aria-controls="address" aria-selected="false">Address & Contact Info</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="education-tab" data-toggle="tab" href="#education" role="tab" aria-controls="education" aria-selected="false">Education</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="dependent-tab" data-toggle="tab" href="#dependent" role="tab" aria-controls="dependent" aria-selected="false">Dependent</a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link " id="compBen-tab" data-toggle="tab" href="#compBen" role="tab" aria-controls="compBen" aria-selected="false">CompBen</a>
                      </li>
                      <li className='nav-item'>
                        <a className='nav-link' id='history-tab' data-toggle='tab' href='#history' role='tab' aria-controls='history' aria-selected='false'>History</a>                       
                      </li>
                  </ul>
                  </div>
                 <br/>
                  <div className="tab-content">
                      <div className="tab-pane fade show active" id="personalDetails" role="tabpanel" aria-labelledby="personalDetails-tab">
                          {/* Personal Details Form */}
                        <div className="container">
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            <form onSubmit={handleFormSubmit}>
                            {/* <div className='card-body' id="employee-details-form" ref={personalDetailsRef}> */}
                            <div className='card-body'>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Employee ID</label>
                                            <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="emailAddress">Email Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmailAddress} placeholder="enter email address" onChange={handleInputChange} name="EmailAddress" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name</label>
                                            <input type="text" className="form-control" value={employeeData.EmployeeName} onChange={handleInputChange} name="EmployeeName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text" className="form-control" value={employeeData.LastName} onChange={handleInputChange} name="LastName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input type="text" className="form-control" value={employeeData.FirstName} onChange={handleInputChange} name="FirstName"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="middleName">Middle Name</label>
                                            <input type="text" className="form-control" value={employeeData.MiddleName} onChange={handleInputChange} name="MiddleName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="maidenName">Maiden Name</label>
                                            <input type="text" className="form-control" value={employeeData.MaidenName} onChange={handleInputChange} name="MaidenName"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="birthdate">Birthdate</label>
                                              {/* <input type="text" className="form-control" value={employeeData.Birthdate} onChange={handleInputChange} name="Birthdate"/> */}
                                              <input
                                              type="date"
                                              className="form-control"
                                              value={employeeData.Birthdate ? new Date(employeeData.Birthdate).toISOString().substr(0, 10) : ''}
                                              placeholder="Birth Date"
                                              name="Birthdate"
                                              onChange={handleInputChange}
                                            />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="age">Age</label>
                                              <input type="number" className="form-control" value={employeeData.Age} onChange={handleInputChange} name="Age"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="birthMonth">Birth Month</label>
                                              <input type="text" className="form-control" value={employeeData.BirthMonth} onChange={handleInputChange} name="BirthMonth"/>      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="ageBracket">Age Bracket</label>
                                              <input type="text" className="form-control" value={employeeData.AgeBracket} onChange={handleInputChange} name="AgeBracket"/>
                                              </div>
                                            </div>

                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="gender">Gender</label>
                                              <input type="text" className="form-control" value={employeeData.Gender} onChange={handleInputChange} name="Gender"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="maritalStatus">Marital Status</label>
                                              <input type="text" className="form-control" value={employeeData.MaritalStatus} onChange={handleInputChange} name="MaritalStatus"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="SSS">SSS No.</label>
                                              <input type="text" className="form-control" value={employeeData.SSS} onChange={handleInputChange} name="SSS"/>     
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="PHIC">PHIC</label>
                                              <input type="text" className="form-control" value={employeeData.PHIC} onChange={handleInputChange} name="PHIC"/>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="HDMF">HDMF</label>
                                              <input type="text" className="form-control" value={employeeData.HDMF} onChange={handleInputChange} name="HDMF"/>      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="TIN">TIN</label>
                                              <input type="text" className="form-control" value={employeeData.TIN} onChange={handleInputChange} name="TIN"/>
                                              </div>
                                            </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="employmentInfo" role="tabpanel" aria-labelledby="employmentInfo-tab">
                          {/* Employment Information Form */}
                          <div className="container">
                            <form onSubmit={handleFormEmpInfoSubmit}>
                            <div className='card-body'>
                              {/* <h5 className='text-primary'>Section 1</h5> */}
                                {/* <hr className="hr-cobalt-blue"/> */}
                                <br/>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="EmpID">Employee Id</label>
                                              <span className="form-control">{Array.isArray(employeeData.EmployeeId) ? employeeData.EmployeeId[0] : employeeData.EmployeeId}</span>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="tenure">Tenure</label>
                                            <input type="text" className="form-control" value={employeeData.Tenure} onChange={handleInputChange} name="Tenure"/> 
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateHired">Date Hired</label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              value={employeeData.DateHired ? new Date(employeeData.DateHired).toISOString().substr(0, 10) : ''}
                                              placeholder="Date Hired"
                                              name="DateHired"
                                              onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                        <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="empStatus">Employee Status</label>
                                                    <select
                                                      value={employeeData.EmployeeStatus}
                                                      name="EmployeeStatus"
                                                      onChange={handleInputChange}
                                                      style={{ color: statusColor }} 
                                                      className='form-control'
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Separated">Separated</option>
                                                        <option value="Inactive - Maternity">Inactive - Maternity</option>
                                                        <option value="Inactive - Sickness">Inactive - Sickness</option>
                                                        <option value="Inactive - Absent with leave">Inactive - Absent with leave</option>
                                                        <option value="Inactive - Absent Without Leave">Inactive - Absent Without Leave</option>
                                                        <option value="Inactive - Suspension">Inactive - Suspension</option>
                                                    </select>
                                                </div>
                                        </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Employment Status</label>
                                              <select className= 'form-control' 
                                                    value={employeeData.EmploymentStatus} name="EmploymentStatus" onChange={handleInputChange}>
                                                        <option value="Probationary">Probationary</option>
                                                        <option value="Permanent">Permanent</option>
                                                        <option value="Project">Project</option>
                                                        <option value="Fixed Term">Fixed Term</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="empCategory"> Employee Category </label>
                                              <select className= 'form-control' 
                                                    value={employeeData.EmployeeCategory} name="EmployeeCategory" onChange={handleInputChange}>
                                                        <option value="Associate">Associate</option>
                                                        <option value="Management">Management</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                        <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="Role">Role</label>
                                                    <select className= 'form-control' 
                                                    value={employeeData.EmployeeRole} name="EmployeeRole" onChange={handleInputChange}>
                                                        <option value="Individual Contributor">Individual Contributor</option>
                                                        <option value="People Manager">People Manager</option>
                                                    </select>
                                                </div>
                                        </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="Rate"> Rate</label>
                                              <input type="text" className="form-control" value={employeeData.Rate} placeholder="enter rate" name="Rate" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label >Rate Class</label>
                                              <select className= 'form-control' 
                                                    value={employeeData.RateClass} name="RateClass" onChange={handleInputChange}>
                                                        <option value="0">Daily</option>
                                                        <option value="1">Monthly</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <div className="row ">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="position">Position</label>
                                                      <select 
                                                        className='form-control' 
                                                        value={employeeData.Position} 
                                                        name="Position" 
                                                        onChange={handleInputChange}
                                                      >
                                                  <option value="Associate">Associate</option>
                                                  <option value="Lead Associate">Lead Associate</option>
                                                  <option value="VP-Country Head, Philippines">VP-Country Head, Philippines</option>
                                                  <option value="Sr. Associate">Sr. Associate</option>
                                                  <option value="Group Manager-HR">Group Manager-HR</option>
                                                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                                                  <option value="Junior Specialist">Junior Specialist</option>
                                                  <option value="Indexer/ Abstractor">Indexer/ Abstractor</option>
                                                  <option value="Production Associate">Production Associate</option>
                                                  <option value="Team Manager">Team Manager</option>
                                                  <option value="Indexer">Indexer</option>
                                                  <option value="Senior Project Coordinator">Senior Project Coordinator</option>
                                                  <option value="Solutions Architect">Solutions Architect</option>
                                                  <option value="Software Engineer - Level 2">Software Engineer - Level 2</option>
                                                  <option value="Project Manager">Project Manager</option>
                                                  <option value="Jr. Specialist">Jr. Specialist</option>
                                                  <option value="Sr. Software Engineer">Sr. Software Engineer</option>
                                                  <option value="Project Support - Level 1">Project Support - Level 1</option>
                                                  <option value="Group Manager - Training">Group Manager - Training</option>
                                                  <option value="Project Analyst">Project Analyst</option>
                                                  <option value="Specialist - Finance">Specialist - Finance</option>
                                                  <option value="Group Manager">Group Manager</option>
                                                  <option value="Software Engineer - Level 1">Software Engineer - Level 1</option>
                                                  <option value="Quality Assurance Analyst">Quality Assurance Analyst</option>
                                                  <option value="Senior Production Manager">Senior Production Manager</option>
                                                  <option value="Process Analyst">Process Analyst</option>
                                                  <option value="Team Manager - Finance">Team Manager - Finance</option>
                                                  <option value="Customer Service Account Executive">Customer Service Account Executive</option>
                                                  <option value="Specialist">Specialist</option>
                                                  <option value="Lead Associate - FIN">Lead Associate - FIN</option>
                                                  <option value="Sr. Specialist">Sr. Specialist</option>
                                                  <option value="Engineer">Engineer</option>
                                                  <option value="Content Manager">Content Manager</option>
                                                  <option value="Division Manager">Division Manager</option>
                                                  <option value="Project Support - Level 2">Project Support - Level 2</option>
                                                  <option value="Sr. Production Manager">Sr. Production Manager</option>
                                                  <option value="Senior Manager-Finance">Senior Manager-Finance</option>
                                                  <option value="Division Manager-HR">Division Manager-HR</option>
                                                  <option value="Team Manager - Finance">Team Manager - Finance</option>
                                                  <option value="Customer Service Account Executive">Customer Service Account Executive</option>
                                                  <option value="Admin Manager">Admin Manager</option>
                                                  <option value="Team Manager-Fac">Team Manager-Fac</option>
                                                  <option value="Head of Talent Acquisition, PH">Head of Talent Acquisition, PH</option>
                                                  <option value="VP-Delivery Unit Head, Project Delivery">VP-Delivery Unit Head, Project Delivery</option>
                                                  <option value="Senior Specialist">Senior Specialist</option>
                                                  <option value="Senior Manager-HR">Senior Manager-HR</option>
                                                  <option value="Senior Manager - Facilities Admin">Senior Manager - Facilities Admin</option>
                                                  <option value="Manager-Finance">Manager-Finance</option>
                                                  <option value="Sr. Administrator">Sr. Administrator</option>
                                                  <option value="Associate Vice President">Associate Vice President</option>
                                                  <option value="Division Manager-Finance">Division Manager-Finance</option>
                                                  <option value="Head of Infrastructure">Head of Infrastructure</option>
                                                  <option value="Senior Manager-QA">Senior Manager-QA</option>
                                                  <option value="Group Manager-Fac">Group Manager-Fac</option>
                                                  <option value="Head of Finance">Head of Finance</option>
                                                  <option value="Group Manager-QA">Group Manager-QA</option>
                                                  <option value="Executive-HR">Executive-HR</option>
                                                  <option value="Lead Specialist">Lead Specialist</option>
                                                  <option value="Lead Analyst">Lead Analyst</option>
                                                  <option value="Manager-HR">Manager-HR</option>
                                                  <option value="Executive HR - Learning and Culture Specialist">Executive HR - Learning and Culture Specialist</option>
                                                  <option value="Analyst - AI/LLM Practice">Analyst - AI/LLM Practice</option>
                                                  <option value="Trainer">Trainer</option>
                                                  <option value="Senior Analyst - AI/LLM Practice">Senior Analyst - AI/LLM Practice</option>
                                                  <option value="Editor-Analyst - AI/LLM Practice">Editor-Analyst - AI/LLM Practice</option>
                                                  <option value="Team Manager, Trainer">Team Manager, Trainer"</option>
                                                  <option value="Sr. Manager-FP&A">Sr. Manager-FP&A</option>
                                                  <option value="Admin Manager">Admin Manager</option>
                                                  <option value="Senior Manager-GT">Senior Manager-GT</option>
                                                  <option value="Head of Infrastructure - Data Center Support">Head of Infrastructure - Data Center Support</option>
                                                  <option value="AVP, Project Delivery">AVP, Project Delivery</option>
                                              </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="positionLevel">Position Level</label>
                                              <select className="form-control" value={employeeData.Level} name="Level" onChange={handleInputChange}>
                                                        <option value="Level 1">Level 1</option>
                                                        <option value="Level 2">Level 2</option>
                                                        <option value="Level 3">Level 3</option>
                                                        <option value="Level 4">Level 4</option>
                                                        <option value="Level 5">Level 5</option>
                                                        <option value="Level 6">Level 6</option>
                                                        <option value="Level 7">Level 7</option>
                                                        <option value="Level 8">Level 8</option>
                                                        <option value="Level 9">Level 9</option>
                                                        <option value="Level 10">Level 10</option>
                                                        <option value="Level 11">Level 11</option>
                                                        <option value="Level 12">Level 12</option>
                                                        <option value="Level 13">Level 13</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="facility">Facility</label>
                                              <select className="form-control" value={employeeData.Facility} name="Facility" onChange={handleInputChange}>
                                                        <option value="Mandaue">Mandaue</option>
                                                        <option value="Manila">Manila</option>
                                                        <option value="Legazpi">Legazpi</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="titoType">TITO Type</label>
                                              <input type="text" className="form-control" value={employeeData.TITOType} placeholder="enter tito type" name="TitoType" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="RoleType">Employee Role Type</label>
                                              <select className='form-control' 
                                                    value={employeeData.Role} name="Role" onChange={handleInputChange}>
                                                        <option value="HRAdmin">HRAdmin</option>
                                                        <option value="Employee">Employee</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div>
                                <hr/>
                                  {/* <h5 className='text-primary'>Section 2</h5> */}
                                  {/* <hr className="hr-cobalt-blue"/> */}
                                <br/>
                                <div className="row ">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shiftCode"> Shift Code </label>
                                              <select className= 'form-control' 
                                                    value={employeeData.ShiftCode} name="ShiftCode" onChange={handleInputChange}>
                                                        <option value="G1">G1</option>
                                                        <option value="F54">F54</option>
                                                        <option value="G3">G3</option>
                                                        <option value="F39">F39</option>
                                                        <option value="F47">F47</option>
                                                        <option value="C3">C3</option>
                                                        <option value="G2">G2</option>
                                                        <option value="F14">F14</option>
                                                        <option value="F11">F11</option>
                                                        <option value="C9 ">C9</option>
                                                        <option value="F40">F40</option>
                                                        <option value="F43">F43</option>
                                                        <option value="HB">HB</option>
                                                        <option value="F1">F1</option>
                                                        <option value="F4">F4</option>
                                                        <option value="N1">N1</option>
                                                        <option value="F13">F13</option>
                                                        <option value="F3">F3</option>
                                                        <option value="F18">F18</option>
                                                        <option value="N2">N2</option>
                                                        <option value="F55">F55</option>
                                                        <option value="F77">F77</option>
                                                        <option value="N9">N9</option>
                                                        <option value="F41">F41</option>
                                                        <option value="F46">F46</option>
                                                        <option value="C1">C1</option>
                                                        <option value="F81">F81</option>
                                                        <option value="N10">N10</option>
                                                        <option value="N3">N3</option>
                                                        <option value="F62">F62</option>
                                                        <option value="F48">F48</option>
                                                        <option value="C7">C7</option>
                                                        <option value="F7">F7</option>
                                                        <option value="F86">F86</option>
                                                        <option value="F69">F69</option>
                                                        <option value="F12">F12</option>
                                                        <option value="G79">G79</option>
                                                        <option value="G59">G59</option>
                                                        <option value="C10">C10</option>
                                                        <option value="F2">F2</option>
                                                        <option value="F61">F61</option>
                                                        <option value="G4">G4</option>
                                                        <option value="N4">N4</option>
                                                        <option value="N8">N8</option>
                                                        <option value="C2">C2</option>
                                                        <option value="N6">N6</option>
                                                        <option value="C6">C6</option>
                                                        <option value="F15">F15</option>
                                                        <option value="F82 ">F82</option>
                                                        <option value="F57">F57</option>
                                                        <option value="G41">G41</option>
                                                        <option value="F60">F60</option>
                                                        <option value="N11">N11</option>
                                                        <option value="F76">F76</option>
                                                        <option value="N5">N5</option>
                                                        <option value="F17">F17</option>
                                                        <option value="F72">F72</option>
                                                        <option value="F73">F73</option>
                                                        <option value="F84">F84</option>
                                                        <option value="F68">F68</option>
                                                        <option value="C4">C4</option>
                                                        <option value="N12">N12</option>
                                                        <option value="F5">F5</option>
                                                        <option value="F83">F83</option>
                                                        <option value="F50">F50</option>
                                                        <option value="F9">F9</option>
                                                        <option value="C5">C5</option>
                                                        <option value="C11">C11</option>
                                                        <option value="C8">C8</option>
                                                        <option value="G5">G5</option>
                                                        <option value="F63">F63</option>
                                                        <option value="G61">G61</option>
                                                        <option value="F16 ">F16</option>
                                                        <option value="F64">F64</option>
                                                        <option value="F80">F80</option>
                                                        <option value="F74">F74</option>
                                                        <option value="F59">F59</option>
                                                        <option value="F6">F6</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shiftname">Shift Name</label>
                                              <select className="form-control" value={employeeData.ShiftName} name="ShiftName" onChange={handleInputChange}>
                                                <option value=" FIXED - 6 Day 6:00AM to 2:00PM">FIXED - 6 Day 6:00AM to 2:00PM</option>
                                                <option value=" FIXED - 5 Day 8:00PM to 5:12AM"> FIXED - 5 Day 8:00PM to 5:12AM</option>
                                                <option value=" FIXED - 6 Day 10:00PM to 6:00AM"> FIXED - 6 Day 10:00PM to 6:00AM</option>
                                                <option value=" FIXED - 5 Day 9:00PM to 6:12AM"> FIXED - 5 Day 9:00PM to 6:12AM</option>
                                                <option value=" FIXED - 5 Day 9:00AM to 6:12PM"> FIXED - 5 Day 9:00AM to 6:12PM</option>
                                                <option value=" FLEXI - 8:00AM to 8:00PM"> FLEXI - 8:00AM to 8:00PM</option>
                                                <option value=" FIXED - 6 Day 2:00PM to 10:00PM"> FIXED - 6 Day 2:00PM to 10:00PM</option>
                                                <option value=" FIXED - 5 Day 11:00AM to 8:12PM"> FIXED - 5 Day 11:00AM to 8:12PM</option>
                                                <option value=" FIXED - 5 Day 6:00AM to 3:12PM"> FIXED - 5 Day 6:00AM to 3:12PM</option>
                                                <option value=" FLEXI - 10:00AM to 10:00PM"> FLEXI - 10:00AM to 10:00PM</option>
                                                <option value=" FIXED - 5 Day 12:00PM to 9:12PM"> FIXED - 5 Day 12:00PM to 9:12PM</option>
                                                <option value=" FIXED - 5 Day 11:00PM to 8:12AM">FIXED - 5 Day 11:00PM to 8:12AM</option>
                                                <option value=" HOME-BASED ONLY"> HOME-BASED ONLY</option>
                                                <option value=" FIXED - 6 Day 6:00AM to 2:00PM"> FIXED - 6 Day 6:00AM to 2:00PM</option>
                                                <option value=" FIXED - 6 Day 9:00AM to 5:00PM"> FIXED - 6 Day 9:00AM to 5:00PM</option>
                                                <option value=" FLEXI 2 - 6:00AM to 6:00PM"> FLEXI 2 - 6:00AM to 6:00PM</option>
                                                <option value=" FIXED - 5 Day 10:00AM to 7:12PM"> FIXED - 5 Day 10:00AM to 7:12PM</option>
                                                <option value=" FIXED - 6 Day 10:00PM to 6:00AM"> FIXED - 6 Day 10:00PM to 6:00AM</option>
                                                <option value=" FIXED - 5 Day 10:00PM to 7:12AM"> FIXED - 5 Day 10:00PM to 7:12AM</option>
                                                <option value=" FLEXI 2 - 12:00PM to 12:00AM"> FLEXI 2 - 12:00PM to 12:00AM</option>
                                                <option value="FIXED - 5 Day 4:00PM to 1:12AM"> FIXED - 5 Day 4:00PM to 1:12AM</option>
                                                <option value=" FIXED - 5 Day 5:00AM to 2:12PM"> FIXED - 5 Day 5:00AM to 2:12PM</option>
                                                <option value=" FLEXI 2 - 10:00AM to 10:00PM"> FLEXI 2 - 10:00AM to 10:00PM</option>
                                                <option value=" FIXED - 6 Day 10:00AM to 6:00PM"> FIXED - 6 Day 10:00AM to 6:00PM</option>
                                                <option value=" FIXED - 5 Day 4:00AM to 1:12PM"> FIXED - 5 Day 4:00AM to 1:12PM</option>
                                                <option value=" FLEXI - 6:00AM to 6:00PM"> FLEXI - 6:00AM to 6:00PM</option>
                                                <option value=" FIXED - 5 Day 3:15PM to 12:27AM"> FIXED - 5 Day 3:15PM to 12:27AM</option>
                                                <option value=" FLEXI 2 - 9:00AM to 9:00PM"> FLEXI 2 - 9:00AM to 9:00PM</option>
                                                <option value=" FLEXI 2 - 8:00AM to 8:00PM"> FLEXI 2 - 8:00AM to 8:00PM</option>
                                                <option value=" FIXED - 5 Day 3:00PM to 12:12AM"> FIXED - 5 Day 3:00PM to 12:12AM</option>
                                                <option value=" FIXED - 5 Day 12:00MN to 9:12AM"> FIXED - 5 Day 12:00MN to 9:12AM</option>
                                                <option value=" FLEXI - 7:00AM to 7:00PM"> FLEXI - 7:00AM to 7:00PM</option>
                                                <option value=" FIXED - 6 Day 12:00AM to 8:00AM"> FIXED - 6 Day 12:00AM to 8:00AM</option>
                                                <option value=" FIXED - 5 Day 6:20AM to 3:32PM"> FIXED - 5 Day 6:20AM to 3:32PM</option>
                                                <option value=" FIXED - 5 Day 7:00AM to 4:12PM"> FIXED - 5 Day 7:00AM to 4:12PM</option>
                                                <option value=" FIXED - 5 Day 8:00AM to 5:12PM"> FIXED - 5 Day 8:00AM to 5:12PM</option>
                                                <option value=" FIXED - 6 Day 12:00AM to 8:00AM"> FIXED - 6 Day 12:00AM to 8:00AM</option>
                                                <option value=" FIXED - 6 Day 8:00AM to 4:00PM"> FIXED - 6 Day 8:00AM to 4:00PM</option>
                                                <option value=" FLEXI - 9:00AM to 9:00PM"> FLEXI - 9:00AM to 9:00PM</option>
                                                <option value=" FIXED - 6 Day 2:00PM to 10:00PM"> FIXED - 6 Day 2:00PM to 10:00PM</option>
                                                <option value=" FIXED - 6 Day 7:00AM to 3:00PM"> FIXED - 6 Day 7:00AM to 3:00PM</option>
                                                <option value=" FIXED - 6 Day 9:00AM to 5:00PM"> FIXED - 6 Day 9:00AM to 5:00PM</option>
                                                <option value=" FLEXI 2 - 3:00PM to 3:00AM"> FLEXI 2 - 3:00PM to 3:00AM</option>
                                                <option value=" FLEXI 2 - 5:00PM to 5:00AM"> FLEXI 2 - 5:00PM to 5:00AM</option>
                                                <option value=" FLEXI - 12:00PM to 12:00AM"> FLEXI - 12:00PM to 12:00AM</option>
                                                <option value=" FLEXI 2 - 10:00PM to 10:00AM"> FLEXI 2 - 10:00PM to 10:00AM</option>
                                                <option value=" FLEXI - 10:00PM to 10:00AM"> FLEXI - 10:00PM to 10:00AM</option>
                                                <option value=" FIXED - 5 Day 1:00PM to 10:12PM"> FIXED - 5 Day 1:00PM to 10:12PM</option>
                                                <option value=" FIXED - 5 Day 2:12PM to 11:24PM"> FIXED - 5 Day 2:12PM to 11:24PM</option>
                                                <option value=" FIXED - 5 Day 11:30AM to 8:42PM"> FIXED - 5 Day 11:30AM to 8:42PM</option>
                                                <option value=" FIXED - 6 Day 10:00AM to 6:00PM"> FIXED - 6 Day 10:00AM to 6:00PM</option>
                                                <option value=" FIXED - 6 Day 3:00PM to 11:00PM"> FIXED - 6 Day 3:00PM to 11:00PM</option>
                                                <option value=" FLEXI 2 - 11:00AM to 11:00PM"> FLEXI 2 - 11:00AM to 11:00PM</option>
                                                <option value=" FIXED - 5 Day 10:30PM to 7:42AM"> FIXED - 5 Day 10:30PM to 7:42AM</option>
                                                <option value=" FLEXI 2 - 8:00PM to 8:00AM"> FLEXI 2 - 8:00PM to 8:00AM</option>
                                                <option value=" FIXED - 5 Day 3:12PM to 12:25AM"> FIXED - 5 Day 3:12PM to 12:25AM</option>
                                                <option value=" FIXED - 5 Day 5:00PM to 2:12AM"> FIXED - 5 Day 5:00PM to 2:12AM</option>
                                                <option value=" FIXED - 5 Day 6:00PM to 3:12AM"> FIXED - 5 Day 6:00PM to 3:12AM</option>
                                                <option value=" FIXED - 5 Day 7:20AM to 4:32PM"> FIXED - 5 Day 7:20AM to 4:32PM</option>
                                                <option value=" FIXED - 6 Day 6:00PM to 2:00AM"> FIXED - 6 Day 6:00PM to 2:00AM</option>
                                                <option value=" FLEXI - 3:00PM to 3:00AM"> FLEXI - 3:00PM to 3:00AM</option>
                                                <option value=" FLEXI 2 - 2:00PM to 2:00AM"> FLEXI 2 - 2:00PM to 2:00AM</option>
                                                <option value=" FIXED - 6 Day 12:00PM to 8:00PM"> FIXED - 6 Day 12:00PM to 8:00PM</option>
                                                <option value=" FIXED - 5 Day 12:40PM to 9:52PM"> FIXED - 5 Day 12:40PM to 9:52PM</option>
                                                <option value=" FIXED - 5 Day 2:00AM to 11:12AM"> FIXED - 5 Day 2:00AM to 11:12AM</option>
                                                <option value=" FIXED - 6 Day 4:00PM to 12:00AM"> FIXED - 6 Day 4:00PM to 12:00AM</option>
                                                <option value=" FLEXI - 8:00PM to 8:00AM"> FLEXI - 8:00PM to 8:00AM</option>
                                                <option value=" FLEXI - 11:00AM to 11:00PM"> FLEXI - 11:00AM to 11:00PM</option>
                                                <option value=" FLEXI - 5:00PM to 5:00AM"> FLEXI - 5:00PM to 5:00AM</option>
                                                <option value=" FIXED - 6 Day 12:00PM to 8:00PM"> FIXED - 6 Day 12:00PM to 8:00PM</option>
                                                <option value=" FIXED - 5 Day 7:00PM to 4:12AM"> FIXED - 5 Day 7:00PM to 4:12AM</option>
                                                <option value=" FIXED - 6 Day 7:00AM to 3:00PM"> FIXED - 6 Day 7:00AM to 3:00PM</option>
                                                <option value=" FIXED - 5 Day 2:00PM to 11:12PM"> FIXED - 5 Day 2:00PM to 11:12PM</option>
                                                <option value=" FIXED - 5 Day 1:00AM to 10:12AM"> FIXED - 5 Day 1:00AM to 10:12AM</option>
                                                <option value=" FIXED - 5 Day 8:20AM to 5:32PM"> FIXED - 5 Day 8:20AM to 5:32PM</option>
                                                <option value=" FIXED - 5 Day 3:00AM to 12:12PM"> FIXED - 5 Day 3:00AM to 12:12PM</option>
                                                <option value=" FIXED - 6 Day 8:00AM to 4:00PM"> FIXED - 6 Day 8:00AM to 4:00PM</option>
                                                <option value=" FIXED - 6 Day 8:00PM to 4:00AM"> FIXED - 6 Day 8:00PM to 4:00AM</option>
                                            </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="shifttype">Shift Type</label>
                                              <select className="form-control" value={employeeData.ShiftType} name="ShiftType" onChange={handleInputChange}>
                                                        <option value="1st">1st</option>
                                                        <option value="2nd">2nd</option>
                                                        <option value="3rd">3rd</option>
                                                        <option value="MOD(8:00-6:00 PM)">MOD(8:00-6:00 PM)</option>
                                                    </select>   
                                              </div>
                                            </div>
                                </div>
                                <div className="row ">
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="workWeekType"> Work week type</label>
                                              <select className="form-control" value={employeeData.WorkWeekType} name="WorkWeekType" onChange={handleInputChange}>
                                                        <option value="Non-Compressed Work Week">Non-Compressed Work Week</option>
                                                        <option value="Compressed Work Week (Philippines Facilities)">Compressed Work Week (Philippines Facilities)</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group">
                                              <label htmlFor="workArrangement">Work Arrangement</label>
                                              <select className="form-control" value={employeeData.WorkArrangement} name="WorkArrangement" onChange={handleInputChange}>
                                                        <option value="WOS">Work On Site</option>
                                                        <option value="WFH">Work From Home</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                              </div>
                                            </div>
                                            
                                </div>
                                <hr/>
                                  {/* <h5 className='text-primary'>Section 3</h5> */}
                                  {/* <hr className="hr-cobalt-blue"/> */}
                                <br/>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerId">Manager Id</label>
                                              <input type="text" className="form-control" value={employeeData.ManagerID} placeholder="enter manager Id" name="ManagerID" onChange={handleInputChange} />   
                                              {/* <span className="form-control">{employeeData.ManagerID}</span> */}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="managerName">Manager Name</label>
                                              <input type="text" className="form-control" value={employeeData.ManagerName} placeholder="enter manager name" name="ManagerName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicid">PM/PIC ID</label>
                                              <input type="text" className="form-control" value={employeeData.PMPICID} placeholder="enter pmpicid" name="PMPICID" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="pmpicIdName">PM/PIC Name</label>
                                              <input type="text" className="form-control" value={employeeData.PMPICIDName} placeholder="enter PMPICID Name" name="PMPICIDName" onChange={handleInputChange} />     
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duhid">Delivery Unit Head ID</label>
                                              {/* <input type="text" className="form-control" value={employeeData.DUHID} placeholder="enter duhid" name="DUHID" onChange={handleInputChange} /> */}
                                              <span className="form-control">{employeeData.DUHID}</span>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="du">Delivery Unit Head Name</label>
                                              <input type="text" className="form-control" value={employeeData.DUHName} placeholder="enter DUH Name" name="DUHName" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                            
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="duName">Delivery Unit</label>
                                              {/* <input type="text" className="form-control" value={employeeData.DUName} name="DeliveryUnit" /> */}
                                              <select className="form-control" value={employeeData.DUName} name="DUName" onChange={handleInputChange}>
                                                        <option value="Conversion and BPO">Conversion and BPO</option>
                                                        <option value="WK Europe">WK Europe</option>
                                                        <option value="Synodex">Synodex</option>
                                                        <option value="AI/LLM Practice">AI/LLM Practice</option>
                                                        <option value="Elsevier Delivery Unit (EDU)">Elsevier Delivery Unit (EDU)</option>
                                                        <option value="Legal Regulatory Delivery Unit (LRDU)">Legal Regulatory Delivery Unit (LRDU)</option>
                                                        <option value="Legal">Legal</option>
                                                        <option value="Quality Assurance">Quality Assurance</option>
                                                        <option value="KPO Services">KPO Services</option>
                                                        <option value="ITO">ITO</option>
                                                        <option value="Other Projs">Other Projs</option>
                                                    </select>
                                              </div>
                                            </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectCode">Project Code</label>
                                            {/* <input type="text" className="form-control" value={employeeData.ProjectCode} placeholder="enter project code" name="ProjectCode" onChange={handleInputChange} /> */}
                                            <select className="form-control" value={employeeData.ProjectCode} name="ProjectCode" onChange={handleInputChange}>
                                              <option value="AAIDS">AAIDS</option>
                                              <option value="AAISD">AAISD</option>
                                              <option value="ACSFF">ACSFF</option>
                                              <option value="ACSFG">ACSFG</option>
                                              <option value="ACSGB">ACSGB</option>
                                              <option value="ACUEB">ACUEB</option>
                                              <option value="AFLAC">AFLAC</option>
                                              <option value="AFLAN">AFLAN</option>
                                              <option value="AFMAE">AFMAE</option>
                                              <option value="AGIDC">AGIDC</option>
                                              <option value="AGWIS">AGWIS</option>
                                              <option value="AMZCU">AMZCU</option>
                                              <option value="AMZIS">AMZIS</option>
                                              <option value="AMZPD">AMZPD</option>
                                              <option value="AMZPF">AMZPF</option>
                                              <option value="AMZPR">AMZPR</option>
                                              <option value="AMZSA">AMZSA</option>
                                              <option value="AMZSD">AMZSD</option>
                                              <option value="AMZSV">AMZSV</option>
                                              <option value="ANUEB">ANUEB</option>
                                              <option value="APMRN">APMRN</option>
                                              <option value="APPEB">APPEB</option>
                                              <option value="APTIB">APTIB</option>
                                              <option value="ATLIN">ATLIN</option>
                                              <option value="ATLIS">ATLIS</option>
                                              <option value="ATMWA">ATMWA</option>
                                              <option value="AWSSC">AWSSC</option>
                                              <option value="AWWSM">AWWSM</option>
                                              <option value="AWWSN">AWWSN</option>
                                              <option value="AWWSO">AWWSO</option>
                                              <option value="AXACS">AXACS</option>
                                              <option value="BLPCL">BLPCL</option>
                                              <option value="BLPFL">BLPFL</option>
                                              <option value="BLPHM">BLPHM</option>
                                              <option value="BLPIT">BLPIT</option>
                                              <option value="BLPTA">BLPTA</option>
                                              <option value="BLPTL">BLPTL</option>
                                              <option value="BLPUK">BLPUK</option>
                                              <option value="BNYDC">BNYDC</option>
                                              <option value="BNYSR">BNYSR</option>
                                              <option value="BONJC">BONJC</option>
                                              <option value="BQBEB">BQBEB</option>
                                              <option value="BRLCL">BRLCL</option>
                                              <option value="BRLLR">BRLLR</option>
                                              <option value="BRLNL">BRLNL</option>
                                              <option value="BRLNZ">BRLNZ</option>
                                              <option value="BSI18">BSI18</option>
                                              <option value="BSICF">BSICF</option>
                                              <option value="BSICX">BSICX</option>
                                              <option value="BSIEC">BSIEC</option>
                                              <option value="BSIMI">BSIMI</option>
                                              <option value="BSIQA">BSIQA</option>
                                              <option value="BSITP">BSITP</option>
                                              <option value="BSITW">BSITW</option>
                                              <option value="BTIDE">BTIDE</option>
                                              <option value="BTIDM">BTIDM</option>
                                              <option value="BVDDM">BVDDM</option>
                                              <option value="BVDTD">BVDTD</option>
                                              <option value="CABAC">CABAC</option>
                                              <option value="CABAG">CABAG</option>
                                              <option value="CABBC">CABBC</option>
                                              <option value="CABCD">CABCD</option>
                                              <option value="CABEF">CABEF</option>
                                              <option value="CABHS">CABHS</option>
                                              <option value="CABIA">CABIA</option>
                                              <option value="CABKB">CABKB</option>
                                              <option value="CABNP">CABNP</option>
                                              <option value="CABNR">CABNR</option>
                                              <option value="CABPC">CABPC</option>
                                              <option value="CABPH">CABPH</option>
                                              <option value="CABPK">CABPK</option>
                                              <option value="CABPL">CABPL</option>
                                              <option value="CABPS">CABPS</option>
                                              <option value="CABSA">CABSA</option>
                                              <option value="CABSE">CABSE</option>
                                              <option value="CAIBJ">CAIBJ</option>
                                              <option value="CAPEB">CAPEB</option>
                                              <option value="CCCBT">CCCBT</option>
                                              <option value="CCCDI">CCCDI</option>
                                              <option value="CCHAL">CCHAL</option>
                                              <option value="CCHIN">CCHIN</option>
                                              <option value="CCHPP">CCHPP</option>
                                              <option value="CCICM">CCICM</option>
                                              <option value="CHBAR">CHBAR</option>
                                              <option value="CHMEB">CHMEB</option>
                                              <option value="CHVAD">CHVAD</option>
                                              <option value="CHVCM">CHVCM</option>
                                              <option value="CHVDP">CHVDP</option>
                                              <option value="CHVGA">CHVGA</option>
                                              <option value="CHVGP">CHVGP</option>
                                              <option value="CHVNO">CHVNO</option>
                                              <option value="CITDS">CITDS</option>
                                              <option value="CNA05">CNA05</option>
                                              <option value="CNAMC">CNAMC</option>
                                              <option value="CNOAE">CNOAE</option>
                                              <option value="COBIA">COBIA</option>
                                              <option value="COPAA">COPAA</option>
                                              <option value="COPAD">COPAD</option>
                                              <option value="COPAM">COPAM</option>
                                              <option value="COPFE">COPFE</option>
                                              <option value="COPFR">COPFR</option>
                                              <option value="COPSW">COPSW</option>
                                              <option value="COPVA">COPVA</option>
                                              <option value="CPPIA">CPPIA</option>
                                              <option value="CRAST">CRAST</option>
                                              <option value="CREMA">CREMA</option>
                                              <option value="CSGPR">CSGPR</option>
                                              <option value="CSGPS">CSGPS</option>
                                              <option value="CSTCC">CSTCC</option>
                                              <option value="CTCAS">CTCAS</option>
                                              <option value="CTCBL">CTCBL</option>
                                              <option value="CTCCR">CTCCR</option>
                                              <option value="CTCDE">CTCDE</option>
                                              <option value="CTCEC">CTCEC</option>
                                              <option value="CTLCH">CTLCH</option>
                                              <option value="CTLRS">CTLRS</option>
                                              <option value="CTLUC">CTLUC</option>
                                              <option value="CUNMU">CUNMU</option>
                                              <option value="DFCRB">DFCRB</option>
                                              <option value="DGIAD">DGIAD</option>
                                              <option value="DGIDC">DGIDC</option>
                                              <option value="DHCES">DHCES</option>
                                              <option value="DHIGE">DHIGE</option>
                                              <option value="DHIOE">DHIOE</option>
                                              <option value="DHIWC">DHIWC</option>
                                              <option value="DOGEB">DOGEB</option>
                                              <option value="EBDEC">EBDEC</option>
                                              <option value="EBDTI">EBDTI</option>
                                              <option value="EBIEO">EBIEO</option>
                                              <option value="EBPCP">EBPCP</option>
                                              <option value="EBPIV">EBPIV</option>
                                              <option value="EBPQO">EBPQO</option>
                                              <option value="EDFCS">EDFCS</option>
                                              <option value="EELEB">EELEB</option>
                                              <option value="EFLAS">EFLAS</option>
                                              <option value="EISCF">EISCF</option>
                                              <option value="EISPE">EISPE</option>
                                              <option value="ELLCS">ELLCS</option>
                                              <option value="ESCFS">ESCFS</option>
                                              <option value="ESP07">ESP07</option>
                                              <option value="ESP09">ESP09</option>
                                              <option value="ESPAB">ESPAB</option>
                                              <option value="ESPBD">ESPBD</option>
                                              <option value="ESPBE">ESPBE</option>
                                              <option value="ESPBS">ESPBS</option>
                                              <option value="ESPCL">ESPCL</option>
                                              <option value="ESPCN">ESPCN</option>
                                              <option value="ESPCP">ESPCP</option>
                                              <option value="ESPFB">ESPFB</option>
                                              <option value="ESPFP">ESPFP</option>
                                              <option value="ESPGI">ESPGI</option>
                                              <option value="ESPIA">ESPIA</option>
                                              <option value="ESPIS">ESPIS</option>
                                              <option value="ESPLC">ESPLC</option>
                                              <option value="ESPPS">ESPPS</option>
                                              <option value="ESPPV">ESPPV</option>
                                              <option value="ESPRA">ESPRA</option>
                                              <option value="ESPRC">ESPRC</option>
                                              <option value="ESPRN">ESPRN</option>
                                              <option value="ESPRP">ESPRP</option>
                                              <option value="ESPRS">ESPRS</option>
                                              <option value="ESPSC">ESPSC</option>
                                              <option value="ESPSD">ESPSD</option>
                                              <option value="ESPTR">ESPTR</option>
                                              <option value="ESSBI">ESSBI</option>
                                              <option value="ESSEQ">ESSEQ</option>
                                              <option value="EXPTA">EXPTA</option>
                                              <option value="FDBMC">FDBMC</option>
                                              <option value="FDBMO">FDBMO</option>
                                              <option value="FGIVC">FGIVC</option>
                                              <option value="FLADE">FLADE</option>
                                              <option value="FRGEE">FRGEE</option>
                                              <option value="GMMEB">GMMEB</option>
                                              <option value="GWLAE">GWLAE</option>
                                              <option value="HAYEC">HAYEC</option>
                                              <option value="HGPEB">HGPEB</option>
                                              <option value="HMCAE">HMCAE</option>
                                              <option value="HMSAL">HMSAL</option>
                                              <option value="HMSBK">HMSBK</option>
                                              <option value="HMSBS">HMSBS</option>
                                              <option value="HMSBT">HMSBT</option>
                                              <option value="HMSCC">HMSCC</option>
                                              <option value="HMSDL">HMSDL</option>
                                              <option value="HMSDT">HMSDT</option>
                                              <option value="HMSEB">HMSEB</option>
                                              <option value="HMSEK">HMSEK</option>
                                              <option value="HMSJC">HMSJC</option>
                                              <option value="HMSJL">HMSJL</option>
                                              <option value="HMSJS">HMSJS</option>
                                              <option value="HMSJU">HMSJU</option>
                                              <option value="HMSLL">HMSLL</option>
                                              <option value="HMSLN">HMSLN</option>
                                              <option value="HMSMC">HMSMC</option>
                                              <option value="HMSMS">HMSMS</option>
                                              <option value="HMSNL">HMSNL</option>
                                              <option value="HMSNS">HMSNS</option>
                                              <option value="HMSOA">HMSOA</option>
                                              <option value="HMSOL">HMSOL</option>
                                              <option value="HMSOM">HMSOM</option>
                                              <option value="HMSOV">HMSOV</option>
                                              <option value="HMSSA">HMSSA</option>
                                              <option value="HMSSD">HMSSD</option>
                                              <option value="HMSSS">HMSSS</option>
                                              <option value="HSBMS">HSBMS</option>
                                              <option value="IATCX">IATCX</option>
                                              <option value="IATEP">IATEP</option>
                                              <option value="IATSS">IATSS</option>
                                              <option value="IEECP">IEECP</option>
                                              <option value="IEECT">IEECT</option>
                                              <option value="IEEDC">IEEDC</option>
                                              <option value="IEEIA">IEEIA</option>
                                              <option value="IEETC">IEETC</option>
                                              <option value="IELCE">IELCE</option>
                                              <option value="IELDE">IELDE</option>
                                              <option value="IIIOE">IIIOE</option>
                                              <option value="INACD">INACD</option>
                                              <option value="INADG">INADG</option>
                                              <option value="INAMD">INAMD</option>
                                              <option value="INART">INART</option>
                                              <option value="INCEB">INCEB</option>
                                              <option value="ITH01">ITH01</option>
                                              <option value="JAYSD">JAYSD</option>
                                              <option value="JHLFL">JHLFL</option>
                                              <option value="JHLSO">JHLSO</option>
                                              <option value="KIPRM">KIPRM</option>
                                              <option value="KMIDE">KMIDE</option>
                                              <option value="KPIBC">KPIBC</option>
                                              <option value="KPIEB">KPIEB</option>
                                              <option value="LICDE">LICDE</option>
                                              <option value="LNKCL">LNKCL</option>
                                              <option value="LNKDC">LNKDC</option>
                                              <option value="LNKDS">LNKDS</option>
                                              <option value="LNRRA">LNRRA</option>
                                              <option value="LNXRW">LNXRW</option>
                                              <option value="LNXTI">LNXTI</option>
                                              <option value="MCIEP">MCIEP</option>
                                              <option value="MDIDR">MDIDR</option>
                                              <option value="MDYAP">MDYAP</option>
                                              <option value="MDYDE">MDYDE</option>
                                              <option value="MGFCC">MGFCC</option>
                                              <option value="MGFOE">MGFOE</option>
                                              <option value="MLA05">MLA05</option>
                                              <option value="MLGDC">MLGDC</option>
                                              <option value="MRIUI">MRIUI</option>
                                              <option value="MSCDA">MSCDA</option>
                                              <option value="MSICS">MSICS</option>
                                              <option value="MSIXM">MSIXM</option>
                                              <option value="MYRMS">MYRMS</option>
                                              <option value="NATCS">NATCS</option>
                                              <option value="NATPC">NATPC</option>
                                              <option value="NATPC">NATPC</option>
                                              <option value="NBICL">NBICL</option>
                                              <option value="NLGCA">NLGCA</option>
                                              <option value="NLIDE">NLIDE</option>
                                              <option value="NMLDE">NMLDE</option>
                                              <option value="NWBXM">NWBXM</option>
                                              <option value="OEAEB">OEAEB</option>
                                              <option value="OPSCM">OPSCM</option>
                                              <option value="OPSCS">OPSCS</option>
                                              <option value="OTSAS">OTSAS</option>
                                              <option value="OUPBA">OUPBA</option>
                                              <option value="OUPDP">OUPDP</option>
                                              <option value="OUPEP">OUPEP</option>
                                              <option value="OUPLO">OUPLO</option>
                                              <option value="OUPTP">OUPTP</option>
                                              <option value="PALAE">PALAE</option>
                                              <option value="PENPM">PENPM</option>
                                              <option value="PFHCS">PFHCS</option>
                                              <option value="PLIPM">PLIPM</option>
                                              <option value="PMLAE">PMLAE</option>
                                              <option value="POSMP">POSMP</option>
                                              <option value="PPCAS">PPCAS</option>
                                              <option value="PPCPK">PPCPK</option>
                                              <option value="PRACC">PRACC</option>
                                              <option value="PRAMO">PRAMO</option>
                                              <option value="PSY02">PSY02</option>
                                              <option value="PSYIA">PSYIA</option>
                                              <option value="PSYPS">PSYPS</option>
                                              <option value="QICCS">QICCS</option>
                                              <option value="RBIXE">RBIXE</option>
                                              <option value="RBSDN">RBSDN</option>
                                              <option value="RBSEC">RBSEC</option>
                                              <option value="RIAEC">RIAEC</option>
                                              <option value="RIAST">RIAST</option>
                                              <option value="RIAWB">RIAWB</option>
                                              <option value="S&MAC">S&MAC</option>
                                              <option value="S&MDC">S&MDC</option>
                                              <option value="S&MEC">S&MEC</option>
                                              <option value="S&MID">S&MID</option>
                                              <option value="SAU03">SAU03</option>
                                              <option value="SCRDL">SCRDL</option>
                                              <option value="SMBEW">SMBEW</option>
                                              <option value="SOSEB">SOSEB</option>
                                              <option value="SPWIA">SPWIA</option>
                                              <option value="SRMDJ">SRMDJ</option>
                                              <option value="SRMMS">SRMMS</option>
                                              <option value="STFFP">STFFP</option>
                                              <option value="SWSFD">SWSFD</option>
                                              <option value="TBNTD">TBNTD</option>
                                              <option value="TCBRT">TCBRT</option>
                                              <option value="TCTIA">TCTIA</option>
                                              <option value="TES04">TES04</option>
                                              <option value="TFUVS">TFUVS</option>
                                              <option value="THLAJ">THLAJ</option>
                                              <option value="THLHI">THLHI</option>
                                              <option value="THLHO">THLHO</option>
                                              <option value="THLOR">THLOR</option>
                                              <option value="THLOV">THLOV</option>
                                              <option value="THMAC">THMAC</option>
                                              <option value="THMCD">THMCD</option>
                                              <option value="THMLS">THMLS</option>
                                              <option value="THSEB">THSEB</option>
                                              <option value="THUAB">THUAB</option>
                                              <option value="THUAT">THUAT</option>
                                              <option value="THUCL">THUCL</option>
                                              <option value="THUCW">THUCW</option>
                                              <option value="THUFS">THUFS</option>
                                              <option value="THUMT">THUMT</option>
                                              <option value="THUPS">THUPS</option>
                                              <option value="THURT">THURT</option>
                                              <option value="THUSL">THUSL</option>
                                              <option value="THUTS">THUTS</option>
                                              <option value="THUVC">THUVC</option>
                                              <option value="TLRAA">TLRAA</option>
                                              <option value="TLRCL">TLRCL</option>
                                              <option value="TLRDP">TLRDP</option>
                                              <option value="TLRJC">TLRJC</option>
                                              <option value="TLRLP">TLRLP</option>
                                              <option value="TLRLR">TLRLR</option>
                                              <option value="TLRNZ">TLRNZ</option>
                                              <option value="TLROP">TLROP</option>
                                              <option value="TLRTR">TLRTR</option>
                                              <option value="TLRWT">TLRWT</option>
                                              <option value="TNIDA">TNIDA</option>
                                              <option value="TPCAS">TPCAS</option>
                                              <option value="TPCCC">TPCCC</option>
                                              <option value="TPCCE">TPCCE</option>
                                              <option value="TPCCR">TPCCR</option>
                                              <option value="TPCCS">TPCCS</option>
                                              <option value="TPCFC">TPCFC</option>
                                              <option value="TPCFL">TPCFL</option>
                                              <option value="TPCFP">TPCFP</option>
                                              <option value="TPCHN">TPCHN</option>
                                              <option value="TPCLF">TPCLF</option>
                                              <option value="TPCLR">TPCLR</option>
                                              <option value="TPCLT">TPCLT</option>
                                              <option value="TPCLV">TPCLV</option>
                                              <option value="TPCOS">TPCOS</option>
                                              <option value="TPCPA">TPCPA</option>
                                              <option value="TPCPB">TPCPB</option>
                                              <option value="TPCPP">TPCPP</option>
                                              <option value="TPCRE">TPCRE</option>
                                              <option value="TPCRL">TPCRL</option>
                                              <option value="TPCSU">TPCSU</option>
                                              <option value="TPCTL">TPCTL</option>
                                              <option value="TRLHK">TRLHK</option>
                                              <option value="TRNRV">TRNRV</option>
                                              <option value="TRPEU">TRPEU</option>
                                              <option value="TRPIP">TRPIP</option>
                                              <option value="TRPJC">TRPJC</option>
                                              <option value="TRPLE">TRPLE</option>
                                              <option value="TRPLF">TRPLF</option>
                                              <option value="TRPLN">TRPLN</option>
                                              <option value="TRPLW">TRPLW</option>
                                              <option value="TRPPR">TRPPR</option>
                                              <option value="TRPRU">TRPRU</option>
                                              <option value="TXPEB">TXPEB</option>
                                              <option value="UBUPS">UBUPS</option>
                                              <option value="UBUSU">UBUSU</option>
                                              <option value="UDLEB">UDLEB</option>
                                              <option value="ULIST">ULIST</option>
                                              <option value="UPIDE">UPIDE</option>
                                              <option value="UTDDM">UTDDM</option>
                                              <option value="VLTLL">VLTLL</option>
                                              <option value="VODIL">VODIL</option>
                                              <option value="WAPDF">WAPDF</option>
                                              <option value="WCFED">WCFED</option>
                                              <option value="WHMEB">WHMEB</option>
                                              <option value="WKBCC">WKBCC</option>
                                              <option value="WKBCP">WKBCP</option>
                                              <option value="WKBDB">WKBDB</option>
                                              <option value="WKBDC">WKBDC</option>
                                              <option value="WKBDL">WKBDL</option>
                                              <option value="WKBDT">WKBDT</option>
                                              <option value="WKBEE">WKBEE</option>
                                              <option value="WKBET">WKBET</option>
                                              <option value="WKBEU">WKBEU</option>
                                              <option value="WKBFB">WKBFB</option>
                                              <option value="WKBFP">WKBFP</option>
                                              <option value="WKBHC">WKBHC</option>
                                              <option value="WKBJC">WKBJC</option>
                                              <option value="WKBJK">WKBJK</option>
                                              <option value="WKBJM">WKBJM</option>
                                              <option value="WKBLC">WKBLC</option>
                                              <option value="WKBLL">WKBLL</option>
                                              <option value="WKBMG">WKBMG</option>
                                              <option value="WKBOM">WKBOM</option>
                                              <option value="WKBWX">WKBWX</option>
                                              <option value="WKBXM">WKBXM</option>
                                              <option value="WKDIG">WKDIG</option>
                                              <option value="WKFCS">WKFCS</option>
                                              <option value="WKFEE">WKFEE</option>
                                              <option value="WKFII">WKFII</option>
                                              <option value="WKFPD">WKFPD</option>
                                              <option value="WKGPL">WKGPL</option>
                                              <option value="WKGPS">WKGPS</option>
                                              <option value="WKGPT">WKGPT</option>
                                              <option value="WKGSD">WKGSD</option>
                                              <option value="WKIJU">WKIJU</option>
                                              <option value="WKINL">WKINL</option>
                                              <option value="WKIPX">WKIPX</option>
                                              <option value="WKIRL">WKIRL</option>
                                              <option value="WKLCE">WKLCE</option>
                                              <option value="WKLTR">WKLTR</option>
                                              <option value="WKNDE">WKNDE</option>
                                              <option value="WKUEB">WKUEB</option>
                                              <option value="WKZEP">WKZEP</option>
                                              <option value="WKZIT">WKZIT</option>
                                              <option value="WKZPT">WKZPT</option>
                                              <option value="WPCJR">WPCJR</option>
                                              <option value="WPCJX">WPCJX</option>
                                              <option value="WPCPL">WPCPL</option>
                                              <option value="WPCPT">WPCPT</option>
                                              <option value="XPOBP">XPOBP</option>
                                              <option value="XSB02">XSB02</option>
                                              <option value="XSB03">XSB03</option>
                                              <option value="Y23BR">Y23BR</option>
                                              <option value="Y23CI">Y23CI</option>
                                              <option value="Y23CP">Y23CP</option>
                                              <option value="ZELWM">ZELWM</option>
                                              <option value="UPIDS">UPIDS</option>
                                              <option value="OXOIA">OXOIA</option>
                                              <option value="BRLXM">BRLXM</option>
                                              <option value="CFREB">CFREB</option>
                                              <option value="CSGES">CSGES</option>
                                              <option value="CSGPC">CSGPC</option>
                                              <option value="CTCOB">CTCOB</option>
                                              <option value="ESPPP">ESPPP</option>
                                              <option value="JHLEP">JHLEP</option>
                                              <option value="MMLDE">MMLDE</option>
                                              <option value="NENDS">NENDS</option>
                                              <option value="TPCCH">TPCCH</option>
                                              <option value="TRPLJ">TRPLJ</option>
                                              <option value="VAKCP">VAKCP</option>
                                              <option value="WKBFL">WKBFL</option>
                                              <option value="WKLEP">WKLEP</option>
                                              <option value="CHVDE">CHVDE</option>
                                              <option value="HEMCA">HEMCA</option>
                                              <option value="MDYAR">MDYAR</option>
                                              <option value="UTECM">UTECM</option>
                                              <option value="AAIDA">AAIDA</option>
                                              <option value="CLIIA">CLIIA</option>
                                              <option value="TES05">TES05</option>
                                              <option value="BSICC">BSICC</option>
                                              <option value="HUMCS">HUMCS</option>
                                              <option value="PALAF">PALAF</option>
                                              <option value="USNDE">USNDE</option>
                                              <option value="ESPQA">ESPQA</option>
                                              <option value="TYPCE">TYPCE</option>
                                              <option value="KALMC">KALMC</option>
                                              <option value="00SYB">00SYB</option>
                                              <option value="ESSRF">ESSRF</option>
                                              <option value="QWEMC">QWEMC</option>
                                              <option value="AMSCS">AMSCS</option>
                                              <option value="AMZBS">AMZBS</option>
                                              <option value="WKBPS">WKBPS</option>
                                              <option value="ALLRA">ALLRA</option>
                                              <option value="NEUPC">NEUPC</option>
                                              <option value="ESPPR">ESPPR</option>
                                              <option value="KENEB">KENEB</option>
                                              <option value="LNRDE">LNRDE</option>
                                              <option value="POSVM">POSVM</option>
                                              <option value="PWHDA">PWHDA</option>
                                              <option value="CTYDE">CTYDE</option>
                                              <option value="ICICL">ICICL</option>
                                              <option value="FDBDM">FDBDM</option>
                                              <option value="MDYFD">MDYFD</option>
                                              <option value="FNAOJ">FNAOJ</option>
                                              <option value="BCCDE">BCCDE</option>
                                              <option value="CTHIA">CTHIA</option>
                                              <option value="MGFCQ">MGFCQ</option>
                                              <option value="AMSCO">AMSCO</option>
                                              <option value="ROTDE">ROTDE</option>
                                              <option value="NTRFE">NTRFE</option>
                                              <option value="ESCWD">ESCWD</option>
                                              <option value="DYSSL">DYSSL</option>
                                              <option value="DHIHC">DHIHC</option>
                                              <option value="AMSCV">AMSCV</option>
                                              <option value="AMSCP">AMSCP</option>
                                              <option value="AMSCM">AMSCM</option>
                                              <option value="AIRDA">AIRDA</option>
                                              <option value="BSI14">BSI14</option>
                                              <option value="ESSDI">ESSDI</option>
                                              <option value="AMZAC">AMZAC</option>
                                              <option value="AMZTA">AMZTA</option>
                                              <option value="ESPRT">ESPRT</option>
                                              <option value="OCUKA">OCUKA</option>
                                              <option value="WAPQA">WAPQA</option>
                                              <option value="AAIDC">AAIDC</option>
                                              <option value="AMSER">AMSER</option>
                                              <option value="COTDE">COTDE</option>
                                              <option value="CRURM">CRURM</option>
                                              <option value="GRCWM">GRCWM</option>
                                              <option value="OLCSC">OLCSC</option>
                                              <option value="TRPST">TRPST</option>
                                              <option value="WKELB">WKELB</option>
                                              <option value="Y23DT">Y23DT</option>
                                              <option value="INVTA">INVTA</option>
                                              <option value="AMSPE">AMSPE</option>
                                              <option value="SAMTO">SAMTO</option>
                                              <option value="RDIAD">RDIAD</option>
                                              <option value="ZYNHC">ZYNHC</option>
                                              <option value="THLIP">THLIP</option>
                                              <option value="WKAPG">WKAPG</option>
                                              <option value="ZYNCC">ZYNCC</option>
                                              <option value="PFHAC">PFHAC</option>
                                              <option value="ATLES">ATLES</option>
                                              <option value="DHIFS">DHIFS</option>
                                              <option value="PFHTE">PFHTE</option>
                                              <option value="ALLFR">ALLFR</option>
                                              <option value="KINDE">KINDE</option>
                                              <option value="PINDE">PINDE</option>
                                              <option value="AMSOR">AMSOR</option>
                                              <option value="SGCIA">SGCIA</option>
                                              <option value="MEPAI">MEPAI</option>
                                              <option value="ZYNFC">ZYNFC</option>
                                              <option value="FFWTU">FFWTU</option>
                                              <option value="AMSAZ">AMSAZ</option>
                                              <option value="JAYSC">JAYSC</option>
                                              <option value="ARSIA">ARSIA</option>
                                              <option value="AMSRT">AMSRT</option>
                                              <option value="FINDE">FINDE</option>
                                              <option value="VLTFC">VLTFC</option>
                                              <option value="LNXGI">LNXGI</option>
                                              <option value="AMSCC">AMSCC</option>
                                              <option value="AMSAL">AMSAL</option>
                                              <option value="HEICS">HEICS</option>
                                              <option value="AMSRF">AMSRF</option>
                                              <option value="CARQA">CARQA</option>
                                              <option value="MSCPC">MSCPC</option>
                                              <option value="KWEMC">KWEMC</option>
                                              <option value="AMSDD">AMSDD</option>
                                              <option value="WKNPO">WKNPO</option>
                                              <option value="GGLCS">GGLCS</option>
                                              <option value="AMSKE">AMSKE</option>
                                              <option value="IMADC">IMADC</option>
                                              <option value="AMSKM">AMSKM</option>
                                              <option value="ESPDD">ESPDD</option>
                                              <option value="AMSOO">AMSOO</option>
                                              <option value="AMSAC">AMSAC</option>
                                              <option value="AMSOM">AMSOM</option>
                                              <option value="WKUPO">WKUPO</option>
                                              <option value="AMSRB">AMSRB</option>
                                              <option value="AMSSE">AMSSE</option>
                                              <option value="VLTMV">VLTMV</option>
                                              <option value="MSCOS">MSCOS</option>
                                              <option value="VLTAP">VLTAP</option>
                                              <option value="AMSDP">AMSDP</option>
                                              <option value="VLTCR">VLTCR</option>
                                              <option value="MDYMS">MDYMS</option>
                                              <option value="LEVAT">LEVAT</option>
                                              <option value="AMSRG">AMSRG</option>
                                              <option value="STADE">STADE</option>
                                              <option value="RPAHA">RPAHA</option>
                                              <option value="VLTMO">VLTMO</option>
                                              <option value="MDYDD">MDYDD</option>
                                              <option value="PLIDP">PLIDP</option>
                                              <option value="UTETS">UTETS</option>
                                              <option value="TLRMS">TLRMS</option>
                                              <option value="NOVMC">NOVMC</option>
                                              <option value="PFHCI">PFHCI</option>
                                              <option value="AMSGT">AMSGT</option>
                                              <option value="AMSGC">AMSGC</option>
                                              <option value="ESSST">ESSST</option>
                                              <option value="TCHIA">TCHIA</option>
                                              <option value="ESPTF">ESPTF</option>
                                              <option value="AMSGO">AMSGO</option>
                                              <option value="LNRWC">LNRWC</option>
                                              <option value="TFLIA">TFLIA</option>
                                              <option value="AIRRA">AIRRA</option>
                                              <option value="WKECT">WKECT</option>
                                              <option value="WKEHL">WKEHL</option>
                                              <option value="GRABI">GRABI</option>
                                              <option value="VLTDD">VLTDD</option>
                                              <option value="UPILP">UPILP</option>
                                              <option value="UPIDL">UPIDL</option>
                                              <option value="ESSSR">ESSSR</option>
                                              <option value="TAXMU">TAXMU</option>
                                              <option value="LNXGF">LNXGF</option>
                                              <option value="ESPQE">ESPQE</option>
                                              <option value="LMVDE">LMVDE</option>
                                              <option value="SDSPO">SDSPO</option>
                                              <option value="ZEUSS">ZEUSS</option>
                                              <option value="SENAD">SENAD</option>
                                              <option value="TVIDA">TVIDA</option>
                                              <option value="WKNAT">WKNAT</option>
                                              <option value="00DAN">00DAN</option>
                                              <option value="00SAD">00SAD</option>
                                              <option value="00LEG">00LEG</option>
                                              <option value="00ITO">00ITO</option>
                                              <option value="00BPO">00BPO</option>
                                              <option value="00BLW">00BLW</option>
                                              <option value="00ELS">00ELS</option>
                                              <option value="918GD">918GD</option>
                                              <option value="914AJ">914AJ</option>
                                              <option value="918GE">918GE</option>
                                              <option value="914AO">914AO</option>
                                              <option value="918AI">918AI</option>
                                              <option value="914AL">914AL</option>
                                              <option value="914AM">914AM</option>
                                              <option value="927AE">927AE</option>
                                              <option value="927BA">927BA</option>
                                              <option value="927BB">927BB</option>
                                              <option value="927BC">927BC</option>
                                              <option value="927BD">927BD</option>
                                              <option value="927BE">927BE</option>
                                              <option value="918AJ">918AJ</option>
                                              <option value="914BB">914BB</option>
                                              <option value="918AK">918AK</option>
                                              <option value="914BC">914BC</option>
                                              <option value="918AB">918AB</option>
                                              <option value="914AG">914AG</option>
                                              <option value="918FA">918FA</option>
                                              <option value="918BB">918BB</option>
                                              <option value="918BD">918BD</option>
                                              <option value="918AA">918AA</option>
                                              <option value="918AF">918AF</option>
                                              <option value="918AL">918AL</option>
                                              <option value="919AF">919AF</option>
                                              <option value="919AH">919AH</option>
                                              <option value="919AJ">919AJ</option>
                                              <option value="919AO">919AO</option>
                                              <option value="919AK">919AK</option>
                                              <option value="919AI">919AI</option>
                                              <option value="919AP">919AP</option>
                                              <option value="919AQ">919AQ</option>
                                              <option value="926BP">926BP</option>
                                              <option value="926AJ">926AJ</option>
                                              <option value="926CN">926CN</option>
                                              <option value="926CP">926CP</option>
                                              <option value="926CL">926CL</option>
                                              <option value="726AA">726AA</option>
                                              <option value="911AA">911AA</option>
                                              <option value="911AC">911AC</option>
                                              <option value="912AC">912AC</option>
                                              <option value="912AD">912AD</option>
                                              <option value="921AI">921AI</option>
                                              <option value="921AJ">921AJ</option>
                                              <option value="914AA">914AA</option>
                                              <option value="914CE">914CE</option>
                                              <option value="914BF">914BF</option>
                                              <option value="913AO">913AO</option>
                                              <option value="DI001">DI001</option>
                                              <option value="913BA">913BA</option>
                                              <option value="924AA">924AA</option>
                                              <option value="931AE">931AE</option>
                                              <option value="IA001">IA001</option>
                                              <option value="931AF">931AF</option>
                                              <option value="931AG">931AG</option>
                                              <option value="AP001">AP001</option>
                                              <option value="HS001">HS001</option>
                                              <option value="931AD">931AD</option>
                                              <option value="914DA">914DA</option>
                                              <option value="914DB">914DB</option>
                                              <option value="914DC">914DC</option>
                                              <option value="914DD">914DD</option>
                                              <option value="913DA">913DA</option>
                                              <option value="913DB">913DB</option>
                                              <option value="913DC">913DC</option>
                                              <option value="924DA">924DA</option>
                                              <option value="931DA">931DA</option>
                                              <option value="931DB">931DB</option>
                                              <option value="931DC">931DC</option>
                                              <option value="931DE">931DE</option>
                                              <option value="982AE">982AE</option>
                                              <option value="982AA">982AA</option>
                                              <option value="983AO">983AO</option>
                                              <option value="922AG">922AG</option>
                                              <option value="922AH">922AH</option>
                                              <option value="982AF">982AF</option>
                                              <option value="982AG">982AG</option>
                                              <option value="922AI">922AI</option>
                                              <option value="922AJ">922AJ</option>
                                              <option value="982AI">982AI</option>
                                              <option value="982AN">982AN</option>
                                              <option value="983AA">983AA</option>
                                              <option value="983AB">983AB</option>
                                              <option value="983AF">983AF</option>
                                              <option value="982AC">982AC</option>
                                              <option value="931AB">931AB</option>
                                              <option value="931AC">931AC</option>
                                              <option value="983AR">983AR</option>
                                              <option value="983AI">983AI</option>
                                              <option value="983AJ">983AJ</option>
                                              <option value="983AD">983AD</option>
                                              <option value="911AM">911AM</option>
                                              <option value="911AD">911AD</option>
                                              <option value="911AE">911AE</option>
                                              <option value="911AF">911AF</option>
                                              <option value="911AG">911AG</option>
                                              <option value="911AH">911AH</option>
                                              <option value="911AI">911AI</option>
                                              <option value="911AJ">911AJ</option>
                                              <option value="911AK">911AK</option>
                                              <option value="911AL">911AL</option>
                                              <option value="983AG">983AG</option>
                                              <option value="982AK">982AK</option>
                                              <option value="983AP">983AP</option>
                                              <option value="983AL">983AL</option>
                                              <option value="983AM">983AM</option>
                                              <option value="983AE">983AE</option>
                                              <option value="818AA">818AA</option>
                                              <option value="818AB">818AB</option>
                                              <option value="827AA">827AA</option>
                                              <option value="819AA">819AA</option>
                                              <option value="819AB">819AB</option>
                                              <option value="883AO">883AO</option>
                                              <option value="819AC">819AC</option>
                                              <option value="822AA">822AA</option>
                                              <option value="883AA">883AA</option>
                                              <option value="814CC">814CC</option>
                                              <option value="883AH">883AH</option>
                                              <option value="826AA">826AA</option>
                                              <option value="SG001">SG001</option>
                                              <option value="ML001">ML001</option>
                                              <option value="ML002">ML002</option>
                                              <option value="IW001">IW001</option>
                                              <option value="DD001">DD001</option>
                                              <option value="ME001">ME001</option>
                                              <option value="QC001">QC001</option>
                                              <option value="CU001">CU001</option>
                                              <option value="AC001">AC001</option>
                                              <option value="PI001">PI001</option>
                                              <option value="LC001">LC001</option>
                                              <option value="EH001">EH001</option>
                                              <option value="EH002">EH002</option>
                                              <option value="883AD">883AD</option>
                                              <option value="882AK">882AK</option>
                                              <option value="883AP">883AP</option>
                                              <option value="883AL">883AL</option>
                                              <option value="821AA">821AA</option>
                                              <option value="821AB">821AB</option>
                                              <option value="883AM">883AM</option>
                                              <option value="883AE">883AE</option>
                                              <option value="513AA">513AA</option>
                                              <option value="513AB">513AB</option>
                                              <option value="513AC">513AC</option>
                                              <option value="513BA">513BA</option>
                                              <option value="514AE">514AE</option>
                                              <option value="514AF">514AF</option>
                                              <option value="518AC">518AC</option>
                                              <option value="518AD">518AD</option>
                                              <option value="518AF">518AF</option>
                                              <option value="518AG">518AG</option>
                                              <option value="518BA">518BA</option>
                                              <option value="518BB">518BB</option>
                                              <option value="518BC">518BC</option>
                                              <option value="518BD">518BD</option>
                                              <option value="524AA">524AA</option>
                                              <option value="526AA">526AA</option>
                                              <option value="526AB">526AB</option>
                                              <option value="527AA">527AA</option>
                                              <option value="529AA">529AA</option>
                                              <option value="529AB">529AB</option>
                                              <option value="582AK">582AK</option>
                                              <option value="582AN">582AN</option>
                                              <option value="583AA">583AA</option>
                                              <option value="583AB">583AB</option>
                                              <option value="583AD">583AD</option>
                                              <option value="583AM">583AM</option>
                                              <option value="583AP">583AP</option>
                                              <option value="583AE">583AE</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="projectName">Project Name</label>
                                            {/* <input type="text" className="form-control" value={employeeData.ProjectName} placeholder="enter project name" name="ProjectName" onChange={handleInputChange} /> */}
                                            <select className="form-control" value={employeeData.ProjectName} name="ProjectName" onChange={handleInputChange}>
                                                        <option value="Document Sourcing And Data Annotation">Document Sourcing And Data Annotation</option>
                                                        <option value="Synthetic Document Creation">Synthetic Document Creation</option>
                                                        <option value="Frontlist Content Project">Frontlist Content Project</option>
                                                        <option value="XML Conversion & Indexing">XML Conversion & Indexing</option>
                                                        <option value="Generic Book Cover Creation Project">Generic Book Cover Creation Project</option>
                                                        <option value="Ebook Conversion">Ebook Conversion</option>
                                                        <option value="APS Extraction">APS Extraction</option>
                                                        <option value="Data Extraction">Data Extraction</option>
                                                        <option value="Docanalytics">Docanalytics</option>
                                                        <option value="Agriculture Project">Agriculture Project</option>
                                                        <option value="PDF Ingestion">PDF Ingestion</option>
                                                        <option value="AWS: Image Sourcing Project">AWS: Image Sourcing Project</option>
                                                        <option value="Print-On-Demand Project">Print-On-Demand Project</option>
                                                        <option value="PDF Preflighting">PDF Preflighting</option>
                                                        <option value="Print Replica Conversion">Print Replica Conversion</option>
                                                        <option value="AWS: Annotation Services">AWS: Annotation Services</option>
                                                        <option value="AWS: Synthetic Documents Project">AWS: Synthetic Documents Project</option>
                                                        <option value="Re-Writing Of News Articles">Re-Writing Of News Articles</option>
                                                        <option value="Manage Service & Ebook Conversion Service">Manage Service & Ebook Conversion Service</option>
                                                        <option value="Image Annotation Project">Image Annotation Project</option>
                                                        <option value="Minimal Indexing & Workflow Support">Minimal Indexing & Workflow Support</option>
                                                        <option value="Full Level Indexing Services">Full Level Indexing Services</option>
                                                        <option value="Writing Informative Abstracts">Writing Informative Abstracts</option>
                                                        <option value="Standards Conversion Project">Standards Conversion Project</option>
                                                        <option value="Standards And Manuals Project">Standards And Manuals Project</option>
                                                        <option value="IXBRL Conversion Services">IXBRL Conversion Services</option>
                                                        <option value="Cyber Law Project">Cyber Law Project</option>
                                                        <option value="Family Law Legislation Project">Family Law Legislation Project</option>
                                                        <option value="HMRC Manuals Project">HMRC Manuals Project</option>
                                                        <option value="Irish Tax Product Project">Irish Tax Product Project</option>
                                                        <option value="Tax And Accounting Current Awareness">Tax And Accounting Current Awareness</option>
                                                        <option value="Tax Legislation Project">Tax Legislation Project</option>
                                                        <option value="UK Companies Legislation Product">UK Companies Legislation Product</option>
                                                        <option value="Document Conversion">Document Conversion</option>
                                                        <option value="Development Work And Support For SR-14">Development Work And Support For SR-14</option>
                                                        <option value="Journal Aggregation">Journal Aggregation</option>
                                                        <option value="EPUB2 And Children's Book Conversion">EPUB2 And Children's Book Conversion</option>
                                                        <option value="New Zealand Legislation Project">New Zealand Legislation Project</option>
                                                        <option value="New Zealand Law Reportst">New Zealand Law Reports</option>
                                                        <option value="New Zealand Receipting - Legislation">New Zealand Receipting - Legislation</option>
                                                        <option value="New Zealand Case Recpting Project">New Zealand Case Receipting Project</option>
                                                        <option value="Software Development Project">Software Development Project</option>
                                                        <option value="XML Conversion Frontlist Project">XML Conversion Frontlist Project</option>
                                                        <option value="Conversion To ISOSTS Schema">Conversion To ISOSTS Schema</option>
                                                        <option value="Extyles Conversion Project">Extyles Conversion Project</option>
                                                        <option value="QA Of Converted Content Project">QA Of Converted Content Project</option>
                                                        <option value="Tracked Changes PDF Production Project">Tracked Changes PDF Production Project</option>
                                                        <option value="Triggered Workflow And Production Support">Triggered Workflow And Production Support</option>
                                                        <option value="PDF Form Data Extraction">PDF Form Data Extraction</option>
                                                        <option value="Data Management">Data Management</option>
                                                        <option value="Directors And Managers Data Project">Directors And Managers Data Project</option>
                                                        <option value="Trade Description Project">Trade Description Project</option>
                                                        <option value="Accessions Outsourcing">Accessions Outsourcing</option>
                                                        <option value="Agricultural Animal Science & Vet. Medicine">Agricultural Animal Science & Vet. Medicine</option>
                                                        <option value="CABI Database Backfill Content Processing">CABI Database Backfill Content Processing</option>
                                                        <option value="Compendia Datasheets Project">Compendia Datasheets Project</option>
                                                        <option value="Electronic Feeds">Electronic Feeds</option>
                                                        <option value="Pest Horizon Scanning Project (Pilot)">Pest Horizon Scanning Project (Pilot)</option>
                                                        <option value="International Health">International Health</option>
                                                        <option value="KBART Metadata Creation">KBART Metadata Creation</option>
                                                        <option value="CABI Abstracting, Indexing And Data Capture Project">CABI Abstracting, Indexing And Data Capture Project</option>
                                                        <option value="Natural Resources">Natural Resources</option>
                                                        <option value="Plant Clinic Data Capture For Plantwise">Plant Clinic Data Capture For Plantwise</option>
                                                        <option value="Plantwise Health Data Sheets (Factsheets)">Plantwise Health Data Sheets (Factsheets)</option>
                                                        <option value="Maintenance Of Plantwise Knowledge Bank">Maintenance Of Plantwise Knowledge Bank</option>
                                                        <option value="Plantwise Project">Plantwise Project</option>
                                                        <option value="Plant Sciences">Plant Sciences</option>
                                                        <option value="CASA Project">CASA Project</option>
                                                        <option value="Socio Economics">Socio Economics</option>
                                                        <option value="Books And Journal Products">Books And Journal Products</option>
                                                        <option value="Kindle Conversion">Kindle Conversion</option>
                                                        <option value="Branded Titles & PPV Ads Pilot">Branded Titles & PPV Ads Pilot</option>
                                                        <option value="Dealer Inventory Forms">Dealer Inventory Forms</option>
                                                        <option value="Advance Law XML Conv & Print Production">Advance Law XML Conv & Print Production</option>
                                                        <option value="LOB/SLOB Projects And Functions">LOB/SLOB Projects And Functions</option>
                                                        <option value="On-Going Print Production">On-Going Print Production</option>
                                                        <option value="RBSourceContent Maintenance">RBSourceContent Maintenance</option>
                                                        <option value="Administrative Regulations (State Of Hessen)v">Administrative Regulations (State Of Hessen)</option>
                                                        <option value="EPUB And Amazon Files Project">EPUB And Amazon Files Project</option>
                                                        <option value="Advanced Document Manufacturing">Advanced Document Manufacturing</option>
                                                        <option value="Books And Journal Products">Books And Journal Products</option>
                                                        <option value="Common MARC Cataloging Project">Common MARC Cataloging Project</option>
                                                        <option value="Dissertation Citation Prospective Content">Dissertation Citation Prospective Content</option>
                                                        <option value="USGPI Annual Review">USGPI Annual Review</option>
                                                        <option value="USGPI Government Periodicals Index">USGPI Government Periodicals Index</option>
                                                        <option value="Normalization Outsourcing-Serial Solution">Normalization Outsourcing-Serial Solution</option>
                                                        <option value="Data Preparation Services">Data Preparation Services</option>
                                                        <option value="Workflow Application">Workflow Application</option>
                                                        <option value="Magazine Conversion">Magazine Conversion</option>
                                                        <option value="Image Training Data Annotation Project">Image Training Data Annotation Project</option>
                                                        <option value="Adding Articles To Client's Digital Library">Adding Articles To Client's Digital Library</option>
                                                        <option value="AD Research">AD Research</option>
                                                        <option value="AD Research: Metadata Extract From PDF">AD Research: Metadata Extract From PDF</option>
                                                        <option value="RightFindEnterprise PrivateRecordResearch">RightFindEnterprise PrivateRecordResearch</option>
                                                        <option value="FAS Research Project">FAS Research Project</option>
                                                        <option value="COP Survey Work">COP Survey Work</option>
                                                        <option value="Value Added Research">Value Added Research</option>
                                                        <option value="Intelligent Automation Solution Platform">Intelligent Automation Solution Platform</option>
                                                        <option value="SC Media Weekly And MSR Daily News Report Summaries">SC Media Weekly And MSR Daily News Report Summaries</option>
                                                        <option value="Magazine Archive Project">Magazine Archive Project</option>
                                                        <option value="Product Portfolio - Conversion">Product Portfolio - Conversion</option>
                                                        <option value="Proofing Services-NISO And CSA Standards">Proofing Services-NISO And CSA Standards</option>
                                                        <option value="CSAG T&C Checklist Pilot">CSAG T&C Checklist Pilot</option>
                                                        <option value="Agent Services">Agent Services</option>
                                                        <option value="Business License Managed Services">Business License Managed Services</option>
                                                        <option value="Customer & Record Maintenance">Customer & Record Maintenance</option>
                                                        <option value="Professional Services Team">Professional Services Team</option>
                                                        <option value="ECMS DE Pre-Filing Summary Compilation">ECMS DE Pre-Filing Summary Compilation</option>
                                                        <option value="Follow Up Process & Houston/Louisiana Doc">Follow Up Process & Houston/Louisiana Doc</option>
                                                        <option value="Residential Searches Project">Residential Searches Project</option>
                                                        <option value="UCC STR Search">UCC STR Search</option>
                                                        <option value="Metadata Update And Distribution Services">Metadata Update And Distribution Services</option>
                                                        <option value="Runner-Bib Identification">Runner-Bib Identification</option>
                                                        <option value="Golf Digest Archives Digitization Project">Golf Digest Archives Digitization Project</option>
                                                        <option value="Golf Digest Conversion">Golf Digest Conversion</option>
                                                        <option value="EMBASE Conferences">EMBASE Conferences</option>
                                                        <option value="Target Insight Project">Target Insight Project</option>
                                                        <option value="Fulfillment Svcs-EU Order EntryProcessing">Fulfillment Svcs-EU Order EntryProcessing</option>
                                                        <option value="Fulfillment Services-Claims Processing">Fulfillment Services-Claims Processing</option>
                                                        <option value="Fulfillment Services-Invoice Processing">Fulfillment Services-Invoice Processing</option>
                                                        <option value="Fulfillment Svcs-Quatation&OrderEntryProc">Fulfillment Svcs-Quatation&OrderEntryProc</option>
                                                        <option value="Synodex APS Summary Service">Synodex APS Summary Service</option>
                                                        <option value="Beilstein CF Excerption">Beilstein CF Excerption</option>
                                                        <option value="Patent Excerption">Patent Excerption</option>
                                                        <option value="Content Services Project (Pilot)">Content Services Project (Pilot)</option>
                                                        <option value="Flex Staff Augmentation">Flex Staff Augmentation</option>
                                                        <option value="Beilstein CF Excerption">Beilstein CF Excerption</option>
                                                        <option value="Patent Excerption">Patent Excerption</option>
                                                        <option value="Content Services Project (Pilot)">Content Services Project (Pilot)</option>
                                                        <option value="Flex Staff Augmentation">Flex Staff Augmentation</option>
                                                        <option value="Encompass PAT & NewStar App-Maintenance & Support">Encompass PAT & NewStar App-Maintenance & Support</option>
                                                        <option value="Medline Conversion">Medline Conversion</option>
                                                        <option value="Paperchem Indexing">Paperchem Indexing</option>
                                                        <option value="BD-OPS CAR Processing">BD-OPS CAR Processing</option>
                                                        <option value="Elsevier-Abstract Creation">Elsevier-Abstract Creation</option>
                                                        <option value="CAR Bundling Project">CAR Bundling Project</option>
                                                        <option value="Content Conversion Services-Chinese Language Publication">Content Conversion Services-Chinese Language Publication</option>
                                                        <option value="Chemical Business Newsbase (CBNB)">Chemical Business Newsbase (CBNB)</option>
                                                        <option value="CAR Preprint Forward Flow Conversion">CAR Preprint Forward Flow Conversion</option>
                                                        <option value="FB Data Accuracy Assessment Project">FB Data Accuracy Assessment Project</option>
                                                        <option value="Pharmapendium Project">Pharmapendium Project</option>
                                                        <option value="Geobase Indexing & Abstracting">Geobase Indexing & Abstracting</option>
                                                        <option value="Regular Articles, Indexing & Abstracting">Regular Articles, Indexing & Abstracting</option>
                                                        <option value="Elsevier-ISM">Elsevier-ISM</option>
                                                        <option value="Library Contact Data Collection">Library Contact Data Collection</option>
                                                        <option value="Pathway Studios - CAR Bundling">Pathway Studios - CAR Bundling</option>
                                                        <option value="EMBASE PV Translation Project">EMBASE PV Translation Project</option>
                                                        <option value="Reaxys Excerption Of Asian Patents">Reaxys Excerption Of Asian Patents</option>
                                                        <option value="Reaxys Commercial Compounds">Reaxys Commercial Compounds</option>
                                                        <option value="CAR Preprint-SSRN Conversion">CAR Preprint-SSRN Conversion</option>
                                                        <option value="Reaxys And RMC Patent Conversion">Reaxys And RMC Patent Conversion</option>
                                                        <option value="CAR Preprint: Research Square And TechRxiv">CAR Preprint: Research Square And TechRxiv</option>
                                                        <option value="1Science Content Analysis & Development">1Science Content Analysis & Development</option>
                                                        <option value="San Diego Journal Indexing Project">San Diego Journal Indexing Project</option>
                                                        <option value="ESP Translation">ESP Translation</option>
                                                        <option value="Health Sciences Book Indexing">Health Sciences Book Indexing</option>
                                                        <option value="End To End EMBASE Quality Assessment Project">End To End EMBASE Quality Assessment Project</option>
                                                        <option value="Transamerica – APS Summary">Transamerica – APS Summary</option>
                                                        <option value="Manufacturer Outreach Canada Project">Manufacturer Outreach Canada Project</option>
                                                        <option value="Manufacturer Outreach Project">Manufacturer Outreach Project</option>
                                                        <option value="Video Content Moderation">Video Content Moderation</option>
                                                        <option value="Editorial Enrichment Of Jurisprudence">Editorial Enrichment Of Jurisprudence</option>
                                                        <option value="E-Pub Conversion Project">E-Pub Conversion Project</option>
                                                        <option value="Composition - Full Auto Looseleafs">Composition - Full Auto Looseleafs</option>
                                                        <option value="Copy Editing - Books">Copy Editing - Books</option>
                                                        <option value="Composition - Full Auto Books">Composition - Full Auto Books</option>
                                                        <option value="Compo-Books Traditional -Non-Standardized">Compo-Books Traditional -Non-Standardized</option>
                                                        <option value="Character Counting Services">Character Counting Services</option>
                                                        <option value="Digital Library Services And Bookmarking">Digital Library Services And Bookmarking</option>
                                                        <option value="Downtime Project">Downtime Project</option>
                                                        <option value="KBA Jurisprudence Coordination Services">KBA Jurisprudence Coordination Services</option>
                                                        <option value="Copy Editing - Journals">Copy Editing - Journals</option>
                                                        <option value="Composition - Journals">Composition - Journals</option>
                                                        <option value="Primary Source - Jurisprudence">Primary Source - Jurisprudence</option>
                                                        <option value="Copy Editing - Looseleaf">Copy Editing - Looseleaf</option>
                                                        <option value="Primary Source - Legislation">Primary Source - Legislation</option>
                                                        <option value="Composition - Manufacturing Coordinator">Composition - Manufacturing Coordinator</option>
                                                        <option value="Monthly Support Staff Services">Monthly Support Staff Services</option>
                                                        <option value="Copy Editing - Newsletters">Copy Editing - Newsletters</option>
                                                        <option value="Composition - Newsletters">Composition - Newsletters</option>
                                                        <option value="Open Access">Open Access</option>
                                                        <option value="Copy Editing - Online Lexplicatie">Copy Editing - Online Lexplicatie</option>
                                                        <option value="Copy Editing - Online Modules">Copy Editing - Online Modules</option>
                                                        <option value="Copy Editing - Online Vakstudie">Copy Editing - Online Vakstudie</option>
                                                        <option value="Composition-Books Semi-Auto -Standardized">Composition-Books Semi-Auto -Standardized</option>
                                                        <option value="Smart Docs Interactive Forms Conversion">Smart Docs Interactive Forms Conversion</option>
                                                        <option value="Editorial Support Services">Editorial Support Services</option>
                                                        <option value="Mystery Shoppers Project">Mystery Shoppers Project</option>
                                                        <option value="Outsource Composition And XML Conversion">Outsource Composition And XML Conversion</option>
                                                        <option value="EPUB Creation From XML Project">EPUB Creation From XML Project</option>
                                                        <option value="Content Authoring Tool">Content Authoring Tool</option>
                                                        <option value="PDF To XML Conversion Project">PDF To XML Conversion Project</option>
                                                        <option value="Chinese Translation Project">Chinese Translation Project</option>
                                                        <option value="INSPEC Bibliographic Data Capture">INSPEC Bibliographic Data Capture</option>
                                                        <option value="Indexing">Indexing</option>
                                                        <option value="Video Transcription And Closed Captioning">Video Transcription And Closed Captioning</option>
                                                        <option value="Conference Editorial Content Review">Conference Editorial Content Review</option>
                                                        <option value="Hotel Contracts Data Extraction">Hotel Contracts Data Extraction</option>
                                                        <option value="Ongoing-EMARC Express Service Project">Ongoing-EMARC Express Service Project</option>
                                                        <option value="CD Archiving">CD Archiving</option>
                                                        <option value="LP Digitization">LP Digitization</option>
                                                        <option value="Microfilm Digitization">Microfilm Digitization</option>
                                                        <option value="Republishing">Republishing</option>
                                                        <option value="Portico E-Journals Preservation Service">Portico E-Journals Preservation Service</option>
                                                        <option value="CMS Content Delivery">CMS Content Delivery</option>
                                                        <option value="JH Full Life Project">JH Full Life Project</option>
                                                        <option value="Sort And Organize APS Documents">Sort And Organize APS Documents</option>
                                                        <option value="Rights Management Services Project">Rights Management Services Project</option>
                                                        <option value="Data Entry/Update/Reporting/Auditing Project">Data Entry/Update/Reporting/Auditing Project</option>
                                                        <option value="Inkling Conversion">Inkling Conversion</option>
                                                        <option value="Consolidated Legislation-Live Phase">Consolidated Legislation-Live Phase</option>
                                                        <option value="Digest Cumulative Supplement">Digest Cumulative Supplement</option>
                                                        <option value="Digest Supplement Project">Digest Supplement Project</option>
                                                        <option value="Project BANG-Rooftop Annotation">Project BANG-Rooftop Annotation</option>
                                                        <option value="Redaction Work">Redaction Work</option>
                                                        <option value="Tabling Project">Tabling Project</option>
                                                        <option value="NDA On Going Project">NDA On Going Project</option>
                                                        <option value="Automation Project">Automation Project</option>
                                                        <option value="Deals Data Extraction Project">Deals Data Extraction Project</option>
                                                        <option value="CAD To CNC Conversion Project">CAD To CNC Conversion Project</option>
                                                        <option value="Order Entry Project">Order Entry Project</option>
                                                        <option value="Level-3 Support Maintenance For Web Bibliography Platform (Phase 2A And 2B)">Level-3 Support Maintenance For Web Bibliography Platform (Phase 2A And 2B)</option>
                                                        <option value="Data Capture Automation Project">Data Capture Automation Project</option>
                                                        <option value="Implementation & Maintenance Of M&O Tool">Implementation & Maintenance Of M&O Tool</option>
                                                        <option value="Project Name – LITW Support">Project Name – LITW Support</option>
                                                        <option value="Semantic Workflow And Web Content Conversion">Semantic Workflow And Web Content Conversion</option>
                                                        <option value="AWS: Clinical Annotation">AWS: Clinical Annotation</option>
                                                        <option value="AWS: Kendra Model Evaluation">AWS: Kendra Model Evaluation</option>
                                                        <option value="AWS: Obsidian Multilingual HEMC">AWS: Obsidian Multilingual HEMC</option>
                                                        <option value="Data Annotation And Data Transcription">Data Annotation And Data Transcription</option>
                                                        <option value="Obsidian Prompt Evaluation">Obsidian Prompt Evaluation</option>
                                                        <option value="Data Extraction And Annotation Services">Data Extraction And Annotation Services</option>
                                                        <option value="Generative AI Tasks For LLM">Generative AI Tasks For LLM</option>
                                                        <option value="Generative AI Tasks For LLM - French Canadian">Generative AI Tasks For LLM - French Canadian</option>
                                                        <option value="AWS RAI Truthfulness">AWS RAI Truthfulness</option>
                                                        <option value="AWS RAI Doctor-Patient Audio Collection">AWS RAI Doctor-Patient Audio Collection</option>
                                                        <option value="Retinal Image Annotation Project">Retinal Image Annotation Project</option>
                                                        <option value="Entity Relationships - Pilot">Entity Relationships - Pilot</option>
                                                        <option value="Defined Term Annotation Project">Defined Term Annotation Project</option>
                                                        <option value="Text Annotation Project">Text Annotation Project</option>
                                                        <option value="X-Ray Keypoint Annotation Project">X-Ray Keypoint Annotation Project</option>
                                                        <option value="Image Segmentation Labeling Project">Image Segmentation Labeling Project</option>
                                                        <option value="Video Collection And Annotation Project">Video Collection And Annotation Project</option>
                                                        <option value="Data Extraction Project-Pilot">Data Extraction Project-Pilot</option>
                                                        <option value="AWS – EU Video Moderation">AWS – EU Video Moderation</option>
                                                        <option value="Ebook Conversion Project">Ebook Conversion Project</option>
                                                        <option value="EPUB Conversion Project">EPUB Conversion Project</option>
                                                        <option value="MOBI Ebook Conversion">MOBI Ebook Conversion</option>
                                                        <option value="Copyediting Of Book Abstracts">Copyediting Of Book Abstracts</option>
                                                        <option value="Book Abstracts">Book Abstracts</option>
                                                        <option value="XML Content Conversion">XML Content Conversion</option>
                                                    </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="productCode">Product Code</label>
                                              <input type="text" className="form-control" value={employeeData.ProdCode} name="ProductCode"  />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="prodDesc"> Product Description</label>
                                              <input type="text" className="form-control" value={employeeData.ProdDesc} name="ProdDesc" />      
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="department">Department</label>
                                              <input type="text" className="form-control" value={employeeData.DepartmentName} name="Department" />
                                              </div>
                                            </div>
                                   </div>
                                   <hr/>
                                  {/* <h5 className='text-primary'>Section 4</h5> */}
                                  {/* <hr className="hr-cobalt-blue"/> */}
                                <br/>
                                <div className="row justify-content-center">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="HRANType">HRAN Type</label>
                                      <select
                                        className="form-control"
                                        value={employeeData.HRANType}
                                        name="HRANType"
                                        onChange={handleInputChange}
                                      >
                                        {options.map((option, index) => (
                                          <option key={index} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                      <br />
                                      {employeeData.HRANType === 'Others' && (
                                        <div className="d-flex align-items-center">
                                          <input
                                            type="text"
                                            className="form-control mr-2"
                                            placeholder="Please specify"
                                            value={otherHRANType}
                                            onChange={handleOtherInputChange}
                                          />
                                          <button type="button" className="btn btn-primary" onClick={addOtherHRANType}>Add</button>
                                        </div>
                                      )}
                                      {employeeData.HRANType !== 'Others' && employeeData.HRANType && (
                                        <div className="form-group mt-3">
                                          <label htmlFor="Remarks">Remarks</label>
                                          <textarea
                                            className="form-control"
                                            name="Remarks"
                                            value={employeeData.Remarks}
                                            onChange={handleInputChange}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="isManager">Is Manager</label>
                                      <select className="form-control" value={employeeData.IsManager} name="IsManager" onChange={handleInputChange}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="form-group">
                                      <label htmlFor="isPmpic">Is PMPIC</label>
                                      <select className="form-control" value={employeeData.IsPMPIC} name="IsPMPIC" onChange={handleInputChange}>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                  {/* <div className="row justify-content-center">
                                              <div className="col-md-4">
                                                <div className="form-group">
                                                <label htmlFor="HRANType">HRAN Type</label>
                                                            <select
                                                                className="form-control"
                                                                value={employeeData.HRANType}
                                                                name="HRANType"
                                                                onChange={handleInputChange}
                                                            >
                                                                {options.map((option, index) => (
                                                                    <option key={index} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <br />
                                                            {employeeData.HRANType === 'Others' && (
                                                                <div className="d-flex align-items-center">
                                                                  <input
                                                                      type="text"
                                                                      className="form-control mr-2"
                                                                      placeholder="Please specify"
                                                                      value={otherHRANType}
                                                                      onChange={handleOtherInputChange}
                                                                  />
                                                                     <button type="button" className="btn btn-primary" onClick={addOtherHRANType}>Add</button>
                                                                </div>
                                                            )}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isManager">Is Manager</label>
                                              <select className="form-control" value={employeeData.IsManager} name="IsManager" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isPmpic">Is PMPIC</label>
                                              <select className="form-control" value={employeeData.IsPMPIC} name="IsPMPIC" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                </div> */}
                                <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isIndContributor">Is Individual Contributor</label>
                                              <select className="form-control" value={employeeData.IsIndividualContributor} name="IsIndividualContributor" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="isActive">Is Active</label>
                                              <select className="form-control" value={employeeData.IsActive} name="IsActive" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                              </div>
                                            </div>
                                              <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="isDuHead">Is DU Head</label>
                                                    <select className="form-control" value={employeeData.IsDUHead} name="IsDUHead" onChange={handleInputChange}>
                                                        <option value={true}>Yes</option>
                                                        <option value={false}>No</option>
                                                    </select>
                                                </div>
                                     </div>
                                </div> 
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                                    {/* Address Form */}
                                    <div className="container">
                                      <h5 className="text-primary">Contact Details</h5>
                                      <hr className="hr-cobalt-blue" />
                                      <br />
                                      <div className="row">
                                    <form onSubmit={handleFormSubmit}>
                                      <div className="form-group">
                                        <label>Update Contact Number</label>
                                        <div className="d-flex align-items-center">
                                          <input
                                            type="tel"
                                            className={`form-control mr-2 ${contactError && 'is-invalid'}`}
                                            value={employeeData.ContactNumber}
                                            placeholder="update contact number"
                                            name="ContactNumber"
                                            onChange={handleInputChange}
                                          />
                                          {contactError && <div className="invalid-feedback">{contactError}</div>}
                                          <button type="submit" className="btn btn-primary">
                                            <i className="fas fa-pencil-alt"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                    {employeeData.SecondaryContactNum && employeeData.SecondaryContactNum !== 'N/A' && (
                                      <div className="col-md-4">
                                        <div>
                                          <label>Secondary Contact Number</label>
                                          <span className="form-control">{employeeData.SecondaryContactNum}</span>
                                        </div>
                                      </div>
                                    )}
                                    <div className="col-md-4">
                                      <form onSubmit={handleAddContactForm}>
                                        <div className="form-group">
                                          {employeeData.SecondaryContactNum ? (
                                            <>
                                              <label>Update Secondary Contact Number</label>
                                              <div className="d-flex align-items-center">
                                                <input
                                                  type="tel"
                                                  className={`form-control mr-2 ${newContactError && 'is-invalid'}`}
                                                  value={employeeData.newContactNumber}
                                                  placeholder="update contact number"
                                                  name="newContactNumber"
                                                  onChange={handleInputChange}
                                                />
                                                {newContactError && <div className="invalid-feedback">{newContactError}</div>}
                                                <button type="submit" className="btn btn-primary">
                                                  <i className="fas fa-pencil-alt"></i>
                                                </button>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <label>Add New Contact Number</label>
                                              <div className="d-flex align-items-center">
                                                <input
                                                  type="tel"
                                                  className={`form-control mr-2 ${newContactError && 'is-invalid'}`}
                                                  value={employeeData.newContactNumber}
                                                  placeholder="add new contact number"
                                                  name="newContactNumber"
                                                  onChange={handleInputChange}
                                                />
                                                {newContactError && <div className="invalid-feedback">{newContactError}</div>}
                                                <button type="submit" className="btn btn-primary">
                                                  <i className="fas fa-plus"></i>
                                                </button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                    <hr/>
                                      <form onSubmit={handleAddressFormSubmit}>
                                        <h5 className='text-primary'>Address Details</h5>
                                        <hr className="hr-cobalt-blue"/>
                                        <br/>
                                        <div className="row">
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="houseNumber">House Number</label>
                                              <input type="text" className="form-control" placeholder="enter house number" value={employeeData.HouseNumber} name="HouseNumber" onChange={handleInputChange} />
                                            </div>
                                          </div>
                                          <div className="col-md-8">
                                            <div className="form-group">
                                              <label htmlFor="completeAddress">Complete Address</label>
                                              <input type="text" className="form-control" placeholder="Enter Complete Address" name="CompleteAddress" value={employeeData.CompleteAddress} onChange={handleInputChange} />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row justify-content-center">
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="country">Country</label>
                                              <select
                                                id="countryDropdown"
                                                className="form-control"
                                                value={employeeData.Country || ""}
                                                name="Country"
                                                onChange={handleCountryChange}
                                              >
                                                {countriesWithExisting.map(country => (
                                                  <option key={country} value={country}>{country}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="region">Region</label>
                                              <select
                                                id="regionDropdown"
                                                className="form-control"
                                                value={employeeData.Region || ""}
                                                name="Region"
                                                onChange={handleRegionChange}
                                              >
                                                {regionsWithExisting.map(region => (
                                                  <option key={region} value={region}>{region}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="province">Province</label>
                                              <select
                                                id="provinceDropdown"
                                                className="form-control"
                                                value={employeeData.Province || ""}
                                                name="Province"
                                                onChange={handleProvinceChange}
                                              >
                                                {provincesWithExisting.map(province => (
                                                  <option key={province} value={province}>{province}</option>
                                                ))}
                                              </select>
                                              {addressErrors.Province && <div className="text-danger">{addressErrors.Province}</div>}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row justify-content-center">
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="cityMunicipality">City / Municipality</label>
                                              <select
                                                id="cityDropdown"
                                                className="form-control"
                                                value={employeeData.CityMunicipality || ""}
                                                name="CityMunicipality"
                                                onChange={handleCityChange}
                                              >
                                                {citiesWithExisting.map(city => (
                                                  <option key={city} value={city}>{city}</option>
                                                ))}
                                              </select>
                                              {addressErrors.CityMunicipality && <div className="text-danger">{addressErrors.CityMunicipality}</div>}
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="brgy">Barangay</label>
                                              <input type="text" className="form-control" placeholder="Enter Barangay" name="Barangay" value={employeeData.Barangay} onChange={handleInputChange} />
                                              {addressErrors.Barangay && <div className="text-danger">{addressErrors.Barangay}</div>}
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="zipcode">Zip Code</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Zip Code"
                                                name="ZipCode"
                                                value={employeeData.ZipCode}
                                                onChange={handleInputChange}
                                              />
                                              {addressErrors.ZipCode && <div className="text-danger">{addressErrors.ZipCode }</div>}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row justify-content-center">
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="landmark">Land Mark</label>
                                              <input type="text" className="form-control" placeholder="Enter Land Mark" name="Landmark" value={employeeData.Landmark} onChange={handleInputChange} />
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="isPermanent">is Permanent</label>
                                              <select className="form-control" value={employeeData.IsPermanent} name="IsPermanent" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="form-group">
                                              <label htmlFor="isEmergency">is Emergency</label>
                                              <select className="form-control" value={employeeData.IsEmergency} name="IsEmergency" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                                      </form>
                            <hr/>
                            <h5 className='text-primary'>Emergency Contact Details</h5>
                                <hr className="hr-cobalt-blue"/>
                                <br/>
                            <form onSubmit={handleECFormSubmit}>
                            <div className='card-body'>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactFullName} placeholder="Enter full name" name="EmContactFullName" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group">
                                          <label>Phone Number</label>
                                          <input 
                                            type="text" 
                                            className={`form-control ${EMphoneError ? 'is-invalid' : ''}`} 
                                            value={employeeData.EmContactPhoneNumber} 
                                            placeholder="Enter contact number" 
                                            name="EmContactPhoneNumber" 
                                            onChange={handleInputChange} 
                                        />
                                        {EMphoneError && <div className="invalid-feedback">{EMphoneError}</div>}
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>House Number</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactHouseNo} placeholder="Enter house number" name="EmContactHouseNo" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Complete Address</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactCompleteAddress} placeholder="Enter complete address" name="EmContactCompleteAddress" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <select
                                                id="countryDropdown"
                                                className="form-control"
                                                value={employeeData.EmContactCountry || ""}
                                                name="EmContactCountry"
                                                onChange={handleECCountryChange}
                                              >
                                                {ECcountriesWithExisting.map(country => (
                                                  <option key={country} value={country}>{country}</option>
                                                ))}
                                              </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Region</label>
                                             <select
                                                id="regionDropdown"
                                                className="form-control"
                                                value={employeeData.EmContactRegion || ""}
                                                name="EmContactRegion"
                                                onChange={handleECRegionChange}
                                              >
                                                {ECregionsWithExisting.map(region => (
                                                  <option key={region} value={region}>{region}</option>
                                                ))}
                                              </select>
                                              {ECaddressErrors.EmContactRegion && <div className="text-danger">{ECaddressErrors.EmContactRegion}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Province</label>
                                            <select
                                                id="provinceDropdown"
                                                className="form-control"
                                                value={employeeData.EmContactProvince || ""}
                                                name="EmContactProvince"
                                                onChange={handleECProvinceChange}
                                              >
                                                {ECprovincesWithExisting.map(province => (
                                                  <option key={province} value={province}>{province}</option>
                                                ))}
                                              </select>
                                              {ECaddressErrors.EmContactProvince && <div className="text-danger">{ECaddressErrors.EmContactProvince}</div>}
                                       </div>
                                    </div>
                                </div>
                                  <div className="row justify-content-center">
                                  <div className="col-md-4">
                                    <div className="form-group">
                                              <label htmlFor="ECcityMunicipality">City / Municipality</label>
                                              <select
                                                id="municipalityDropdown"
                                                className="form-control"
                                                value={employeeData.EmContactCityMunicipality || ""}
                                                name="EmContactCityMunicipality"
                                                onChange={handleECCityChange}
                                              >
                                                {ECcitiesWithExisting.map(municipality => (
                                                  <option key={municipality} value={municipality}>{municipality}</option>
                                                ))}
                                              </select>
                                              {ECaddressErrors.EmContactCityMunicipality && <div className="text-danger">{ECaddressErrors.EmContactCityMunicipality}</div>}
                                            </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Barangay</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactBarangay} placeholder="Enter Barangay" name="EmContactBarangay" onChange={handleInputChange} />
                                            {ECaddressErrors.EmContactBarangay && <div className="text-danger">{ECaddressErrors.EmContactBarangay}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactZipcode} placeholder="Enter zip code" name="EmContactZipcode" onChange={handleInputChange} />
                                            {ECaddressErrors.EmContactZipcode && <div className="text-danger">{ECaddressErrors.EmContactZipcode}</div>}
                                        </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                  <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Land Mark</label>
                                            <input type="text" className="form-control" value={employeeData.EmContactLandMark} placeholder="Enter landmark" name="EmContactLandMark" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Permanent</label>
                                            <select className="form-control" value={employeeData.Is_Permanent} name="Is_Permanent" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Is Emergency</label>
                                            <select className="form-control" value={employeeData.Is_Emergency} name="Is_Emergency" onChange={handleInputChange}>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                        </div>
                                      </div>
                                   </div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                          {/* Education Form */}
                          <div className="container">
                            <form onSubmit={handleEducationFormSubmit}>
                            <div className='card-body' ref={educationRef}>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label> School </label>
                                            <input type="text" className="form-control" value={employeeData.School} placeholder="Enter School" name="School" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Education Level</label>
                                            <input type="text" className="form-control" value={employeeData.EducationLevel} placeholder="Enter Education Level" name="EducationLevel" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Degree</label>
                                            <input type="text" value={employeeData.Degree} className="form-control" placeholder="Enter Degree" name="Degree" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="majorCourse">Major course</label>
                                            <input type="text" className="form-control" value={employeeData.MajorCourse} placeholder="Enter Major Course" name="MajorCourse" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="honorRank">Honor Rank</label>
                                            <input type="text" className="form-control" value={employeeData.HonorRank} placeholder="Enter Honor Rank" name="HonorRank" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                              <div className="form-group">
                                              <label htmlFor="session">Session</label>
                                              <input type="text" className="form-control" value={employeeData.Session} placeholder="Enter Session" name="Session" onChange={handleInputChange} />
                                              </div>
                                            </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="dateFrom">Date From</label>
                                            {/* <input type="text" className="form-control" value={employeeData.DateFrom} placeholder="Enter date From" name="DateFrom" onChange={handleInputChange} /> */}
                                            <input
                                              type="date"
                                              className="form-control"
                                              value={employeeData.DateFrom ? new Date(employeeData.DateFrom).toISOString().substr(0, 10) : ''}
                                              placeholder="Date From"
                                              name="DateFrom"
                                              onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="dateTo">Date To</label>
                                            {/* <input type="text" className="form-control" value={employeeData.DateTo} placeholder="Enter date To" name="DateTo" onChange={handleInputChange} /> */}
                                            <input
                                              type="date"
                                              className="form-control"
                                              value={employeeData.DateTo ? new Date(employeeData.DateTo).toISOString().substr(0, 10) : ''}
                                              placeholder="Date To"
                                              name="BirthdDateToate"
                                              onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="monthCompleted">Month Completed</label>
                                            <input type="text" className="form-control" value={employeeData.MonthCompleted} placeholder="Enter Month Completed" name="MonthCompleted" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                <div className="col-md-4">
                                        <div className="form-group">
                                        <label>Units Earned</label>
                                            <input type="text" className="form-control" value={employeeData.UnitsEarned} placeholder="Enter Units Earned" name="UnitsEarned" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                        <label htmlFor="completed">Completed</label>
                                            <input type="text" className="form-control" value={employeeData.Completed} placeholder="Enter Completed" name="Completed" onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <button type="submit" className="btn btn-primary d-block mx-auto">Save Changes</button>
                            </form>
                        </div>
                      <br/>
                      </div>
                      <div className="tab-pane fade" id="dependent" role="tabpanel" aria-labelledby="dependent-tab">
                        {/* Dependent Form */}
                                <div className="card-body d-flex justify-content-between align-items-center">
                                  {/* New Record button */}
                                  <button className="btn btn-xs btn-primary mr-2" onClick={handleShowAddDependentModal}>
                                    <i className="fas fa-plus"></i> New Record
                                  </button>

                                  {/* Search form */}
                                  <form className="form-inline ml-auto">
                                  <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                          <i className="fas fa-search fa-sm"></i>
                                        </button>
                                      </div>
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control bg-light border-0 small"
                                        placeholder="Search by Name"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                      />
                                    </div>
                                  </form>
                                </div>
                              {/* Add Dependent Modal */}
                              <Modal show={showAddDependentModal} onHide={handleCloseAddModal} dialogClassName="custom-modal">
                                  <Modal.Header>
                                      <Modal.Title>Add New Dependent</Modal.Title>
                                      <Button variant="default" onClick={handleCloseAddModal}> X </Button>
                                  </Modal.Header>
                                  <Modal.Body>
                                      {/*  adding new dependent form*/}
                                      <form >
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Full Name</label>
                                                                  <input type="text" className="form-control" value={employeeData.FullName} placeholder="enter dependent full name" name="FullName" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Phone Number</label>
                                                                  <input type="tel" className="form-control" value={employeeData.PhoneNum} placeholder="Enter Phone Number" name="PhoneNum" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Relationship</label>
                                                                  <input type="text" className="form-control" value={employeeData.Relationship} placeholder="enter relationship" name="Relationship" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Date of Birth</label>
                                                                  <input type="date" className="form-control" value={employeeData.DateOfBirth} placeholder="enter date of birth" name="DateOfBirth" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Occupation</label>
                                                                  <input type="text" className="form-control" value={employeeData.Occupation} placeholder="enter  occupation" name="Occupation" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Address</label>
                                                                  <input type="text" className="form-control" value={employeeData.Address} placeholder="Enter address" name="Address" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>City</label>
                                                                  <input type="text" className="form-control" value={employeeData.City} placeholder="Enter City" name="City" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Province</label>
                                                                  <input type="text" className="form-control" value={employeeData.DepProvince} placeholder="Enter Province" name="DepProvince" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Postal Code</label>
                                                                    <input type="text" className="form-control" value={employeeData.PostalCode} placeholder="Enter Postal Code" name="PostalCode" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Beneficiary</label>
                                                                  <input type="text" className="form-control" value={employeeData.Beneficiary} placeholder="Enter Beneficiary" name="Beneficiary" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Beneficiary Date</label>
                                                                    <input type="date" className="form-control" value={employeeData.BeneficiaryDate} placeholder="Enter Beneficiary Date" name="BeneficiaryDate" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Type of coverage</label>
                                                                  <input type="text" className="form-control" value={employeeData.TypeOfCoverage} placeholder="Enter Type of coverage" name="TypeOfCoverage" onChange={handleInputChange} />
                                                          </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance</label>
                                                                  <input type="text" className="form-control" value={employeeData.Insurance} placeholder="Enter Insurance" name="Insurance" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance Date</label>
                                                                  <input type="date" className="form-control" value={employeeData.InsuranceDate} placeholder="Enter Insurance Date" name="InsuranceDate" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Remarks</label>
                                                                    <input type="text" className="form-control" value={employeeData.Remarks} placeholder="Enter Remarks" name="Remarks" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Company Paid</label>
                                                                  <input type="text" className="form-control" value={employeeData.CompanyPaid} placeholder="Enter Company Paid" name="CompanyPaid" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >HMO Provider</label>
                                                                  <input type="text" className="form-control" value={employeeData.HMOProvider} placeholder="Enter HMO Provider" name="HMOProvider" onChange={handleInputChange} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >HMO Policy Number</label>
                                                                    <input type="text" className="form-control" value={employeeData.HMOPolicyNumber} placeholder="Enter HMO Policy Number" name="HMOPolicyNumber" onChange={handleInputChange} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <br/>
                                      </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseAddModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleAddDependent}>
                                          Add Dependent
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                              {/* Edit Dependent Modal */}
                            <Modal show={!!selectedDependent} onHide={handleCloseEditModal} dialogClassName="custom-modal">
                              <Modal.Header>
                                <Modal.Title>Update Dependent Records</Modal.Title>
                                <Button variant="default" onClick={handleCloseEditModal}> X </Button>
                              </Modal.Header>
                              <Modal.Body>
                                      {/*  edit dependent form*/}
                                      <form>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Full Name</label>
                                                                  <input type="text" className="form-control" placeholder="enter dependent full name" value={selectedDependent?.FullName || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, FullName: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Phone Number</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Phone Number" value={selectedDependent?.PhoneNum || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, PhoneNum: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Relationship</label>
                                                                  <input type="text" className="form-control" placeholder="enter relationship" value={selectedDependent?.Relationship || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Relationship: e.target.value })} />
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Date of Birth</label>
                                                                  <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={selectedDependent && selectedDependent.DateOfBirth && isValidDate(selectedDependent.DateOfBirth) ? new Date(selectedDependent.DateOfBirth).toISOString().substr(0, 10) : ''}
                                                                    placeholder="Date Of Birth"
                                                                    onChange={(e) => {
                                                                      const newValue = e.target.value !== '' ? e.target.value : null;
                                                                      setSelectedDependent({ ...selectedDependent, DateOfBirth: newValue });
                                                                    }}
                                                                  />
                                                                  {/* <input type="date" className="form-control" placeholder="enter date of birth" value={selectedDependent?.DateOfBirth || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, DateOfBirth: e.target.value })} /> */}
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Occupation</label>
                                                                  <input type="text" className="form-control" placeholder="enter  occupation" value={selectedDependent?.Occupation || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Occupation: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Address</label>
                                                                  <input type="text" className="form-control" placeholder="Enter address" value={selectedDependent?.Address || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Address: e.target.value })}/>
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>City</label>
                                                                  <input type="text" className="form-control" placeholder="Enter City" value={selectedDependent?.City || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, City: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label>Province</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Province" value={selectedDependent?.DepProvince || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, DepProvince: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Postal Code</label>
                                                                    <input type="text" className="form-control" placeholder="Enter Postal Code" value={selectedDependent?.PostalCode || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, PostalCode: e.target.value })}/>
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Beneficiary</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Beneficiary" value={selectedDependent?.Beneficiary || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Beneficiary: e.target.value })}/>
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Beneficiary Date</label>
                                                                   <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={selectedDependent && selectedDependent.BeneficiaryDate && isValidDate(selectedDependent.BeneficiaryDate) ? new Date(selectedDependent.BeneficiaryDate).toISOString().substr(0, 10) : ''}
                                                                    placeholder="Beneficiary Date"
                                                                    onChange={(e) => {
                                                                      const newValue = e.target.value !== '' ? e.target.value : null;
                                                                      setSelectedDependent({ ...selectedDependent, BeneficiaryDate: newValue });
                                                                    }}
                                                                  />
                                                                    {/* <input type="date" className="form-control" placeholder="Enter Beneficiary Date" value={selectedDependent?.BeneficiaryDate || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, BeneficiaryDate: e.target.value })} /> */}
                                                                    </div>
                                                                  </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Type of coverage</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Type of coverage" value={selectedDependent?.TypeOfCoverage || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, TypeOfCoverage: e.target.value })} />
                                                          </div>
                                                          </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance</label>
                                                                  <input type="tel" className="form-control" placeholder="Enter Insurance" value={selectedDependent?.Insurance || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Insurance: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Insurance Date</label>
                                                                  <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={selectedDependent && selectedDependent.InsuranceDate && isValidDate(selectedDependent.InsuranceDate) ? new Date(selectedDependent.BeneficiaryDate).toISOString().substr(0, 10) : ''}
                                                                    placeholder="Beneficiary Date"
                                                                    onChange={(e) => {
                                                                      const newValue = e.target.value !== '' ? e.target.value : null;
                                                                      setSelectedDependent({ ...selectedDependent, InsuranceDate: newValue });
                                                                    }}
                                                                  />
                                                                  {/* <input type="text" className="form-control" placeholder="Enter Insurance Date" value={selectedDependent?.InsuranceDate || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, InsuranceDate: e.target.value })} /> */}
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >Remarks</label>
                                                                    <input type="text" className="form-control" placeholder="Enter Remarks" value={selectedDependent?.Remarks || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, Remarks: e.target.value })}/>
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <div className="row justify-content-center">
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >Company Paid</label>
                                                                  <input type="text" className="form-control" placeholder="Enter Company Paid" value={selectedDependent?.CompanyPaid || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, CompanyPaid: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                              <div className="form-group">
                                                                  <label >HMO Provider</label>
                                                                  <input type="text" className="form-control" placeholder="Enter HMO Provider" value={selectedDependent?.HMOProvider || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, HMOProvider: e.target.value })} />
                                                              </div>
                                                          </div>
                                                          <div className="col-md-4">
                                                                    <div className="form-group">
                                                                    <label >HMO Policy Number</label>
                                                                    <input type="text" className="form-control" placeholder="Enter HMO Policy Number" value={selectedDependent?.HMOPolicyNumber || ''} onChange={(e) => setSelectedDependent({ ...selectedDependent, HMOPolicyNumber: e.target.value })} />
                                                                    </div>
                                                                  </div>
                                                      </div>
                                                      <br/>
                                      </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseEditModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleDependentFormSubmit}>
                                          Save Changes
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                          {/* </div> */}
                                 {/* Dependent Table */}
                                 <div className='card-body'>
                                {/* <div className="card-body"> */}
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th scope="col">Action</th>
                                          <th scope="col">Full Name</th>
                                          <th scope="col">Phone Number</th>
                                          <th scope="col">Relationship</th>
                                          <th scope="col">Date of Birth</th>
                                          <th scope="col">Occupation</th>
                                          <th scope="col">Address</th>
                                          <th scope="col">City</th>
                                          <th scope="col">Province</th>
                                          <th scope="col">Postal Code</th>
                                          <th scope="col">Beneficiary</th>
                                          <th scope="col">Beneficiary Date</th>
                                          <th scope="col">Type of Coverage</th>
                                          <th scope="col">Insurance</th>
                                          <th scope="col">Insurance Date</th>
                                          <th scope="col">Remarks</th>
                                          <th scope="col">Company Paid</th>
                                          <th scope="col">HMO Provider</th>
                                          <th scope="col">HMO Policy Number</th>
                                          <th scope="col">Timestamp</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                        {filteredDependents.length > 0 ? (
                          filteredDependents.map((dependent, index) => (
                            <tr key={index}>
                              <td>
                              <button className="btn btn-xs btn-primary mr-2" onClick={() => handleShowEditModal(dependent)}>
                                      <i className="fas fa-pencil-alt"></i>
                              </button>
                                </td>
                              <td>{dependent.FullName}</td>
                              <td>{dependent.PhoneNum}</td>
                              <td>{dependent.Relationship}</td>
                              <td>{dependent.DateOfBirth}</td>
                              <td>{dependent.Occupation}</td>
                              <td>{dependent.Address}</td>
                              <td>{dependent.City}</td>
                              <td>{dependent.DepProvince}</td>
                              <td>{dependent.PostalCode}</td>
                              <td>{dependent.Beneficiary}</td>
                              <td>{dependent.BeneficiaryDate}</td>
                              <td>{dependent.TypeOfCoverage}</td>
                              <td>{dependent.Insurance}</td>
                              <td>{dependent.InsuranceDate}</td>
                              <td>{dependent.Remarks}</td>
                              <td>{dependent.CompanyPaid}</td>
                              <td>{dependent.HMOProvider}</td>
                              <td>{dependent.HMOPolicyNumber}</td>
                              <td>{dependent.CreatedAt}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="19">No dependents data yet.</td>
                          </tr>
                        )}
                      </tbody>
                     </table>
                    </div>
                  </div>
                <br/>
                      </div>
                      <div className="tab-pane fade" id="compBen" role="tabpanel" aria-labelledby="compBen-tab">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                  {/* New Record button */}
                                  <button className="btn btn-xs btn-primary mr-2" onClick={handleShowAddCompBenModal}>
                                    <i className="fas fa-plus"></i> New Record
                                  </button>
                                </div>
                              {/* Add CompBen Modal */}
                              <Modal show={showAddCompBenModal} onHide={handleCloseAddModal} dialogClassName="custom-modal">
                                  <Modal.Header>
                                      <Modal.Title>Add Compensation Benefit</Modal.Title>
                                      <Button variant="default" onClick={handleCloseAddModal}> X </Button>
                                  </Modal.Header>
                                  <Modal.Body>
                                      {/*  adding of  compensation benefit form*/}
                                      <form>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Salary</label>
                                                <input type="number" className="form-control" value={compBenData.Salary} placeholder="Enter Salary" name="Salary" onChange={handleInputCompBenChange} />
                                                {errors.Salary && <div className="text-danger">{errors.Salary}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Daily Equivalent</label>
                                                <input type="number" className="form-control" value={compBenData.DailyEquivalent} placeholder="Enter Daily Equivalent" name="DailyEquivalent" onChange={handleInputCompBenChange} />
                                                {errors.DailyEquivalent && <div className="text-danger">{errors.DailyEquivalent}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Monthly Equivalent</label>
                                                <input type="number" className="form-control" value={compBenData.MonthlyEquivalent} placeholder="Enter Monthly Equivalent" name="MonthlyEquivalent" onChange={handleInputCompBenChange} />
                                                {errors.MonthlyEquivalent && <div className="text-danger">{errors.MonthlyEquivalent}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Annual Equivalent</label>
                                                <input type="number" className="form-control" value={compBenData.AnnualEquivalent} placeholder="Enter Annual Equivalent" name="AnnualEquivalent" onChange={handleInputCompBenChange} />
                                                {errors.AnnualEquivalent && <div className="text-danger">{errors.AnnualEquivalent}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Rice Monthly</label>
                                                <input type="number" className="form-control" value={compBenData.RiceMonthly} placeholder="Enter Rice Monthly" name="RiceMonthly" onChange={handleInputCompBenChange} />
                                                {errors.RiceMonthly && <div className="text-danger">{errors.RiceMonthly}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Rice Annual</label>
                                                <input type="number" className="form-control" value={compBenData.RiceAnnual} placeholder="Enter Rice Annual" name="RiceAnnual" onChange={handleInputCompBenChange} />
                                                {errors.RiceAnnual && <div className="text-danger">{errors.RiceAnnual}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Rice Differential Annual</label>
                                                <input type="number" className="form-control" value={compBenData.RiceDifferentialAnnual} placeholder="Enter Rice Differential Annual" name="RiceDifferentialAnnual" onChange={handleInputCompBenChange} />
                                                {errors.RiceDifferentialAnnual && <div className="text-danger">{errors.RiceDifferentialAnnual}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Uniform Annual</label>
                                                <input type="number" className="form-control" value={compBenData.UniformAnnual} placeholder="Enter Uniform Annual" name="UniformAnnual" onChange={handleInputCompBenChange} />
                                                {errors.UniformAnnual && <div className="text-danger">{errors.UniformAnnual}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Leave Days</label>
                                                <input type="number" className="form-control" value={compBenData.LeaveDays} placeholder="Enter Leave Days" name="LeaveDays" onChange={handleInputCompBenChange} />
                                                {errors.LeaveDays && <div className="text-danger">{errors.LeaveDays}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Laundry Allowance</label>
                                                <input type="number" className="form-control" value={compBenData.LaundryAllowance} placeholder="Enter Laundry Allowance" name="LaundryAllowance" onChange={handleInputCompBenChange} />
                                                {errors.LaundryAllowance && <div className="text-danger">{errors.LaundryAllowance}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Comm Allowance</label>
                                                <input type="number" className="form-control" value={compBenData.CommAllowance} placeholder="Enter Comm Allowance" name="CommAllowance" onChange={handleInputCompBenChange} />
                                                {errors.CommAllowance && <div className="text-danger">{errors.CommAllowance}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Comm Allowance Type</label>
                                                <input type="text" className="form-control" value={compBenData.CommAllowanceType} placeholder="Enter Comm Allowance Type" name="CommAllowanceType" onChange={handleInputCompBenChange} />
                                                {errors.CommAllowanceType && <div className="text-danger">{errors.CommAllowanceType}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Cash Gift</label>
                                                <input type="number" className="form-control" value={compBenData.CashGift} placeholder="Enter Cash Gift" name="CashGift" onChange={handleInputCompBenChange} />
                                                {errors.CashGift && <div className="text-danger">{errors.CashGift}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Medical Insurance</label>
                                                <input type="number" className="form-control" value={compBenData.MedicalInsurance} placeholder="Enter Medical Insurance" name="MedicalInsurance" onChange={handleInputCompBenChange} />
                                                {errors.MedicalInsurance && <div className="text-danger">{errors.MedicalInsurance}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Free HMO Dependent</label>
                                                <input type="number" className="form-control" value={compBenData.FreeHMODependent} placeholder="Enter Free HMO Dependent" name="FreeHMODependent" onChange={handleInputCompBenChange} />
                                                {errors.FreeHMODependent && <div className="text-danger">{errors.FreeHMODependent}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>MBL</label>
                                                <input type="number" className="form-control" value={compBenData.MBL} placeholder="Enter MBL" name="MBL" onChange={handleInputCompBenChange} />
                                                {errors.MBL && <div className="text-danger">{errors.MBL}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Life Insurance</label>
                                                <input type="number" className="form-control" value={compBenData.LifeInsurance} placeholder="Enter Life Insurance" name="LifeInsurance" onChange={handleInputCompBenChange} />
                                                {errors.LifeInsurance && <div className="text-danger">{errors.LifeInsurance}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Beneficiaries</label>
                                                <input type="text" className="form-control" value={compBenData.Beneficiaries} placeholder="Enter Beneficiaries" name="Beneficiaries" onChange={handleInputCompBenChange} />
                                                {errors.Beneficiaries && <div className="text-danger">{errors.Beneficiaries}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Personal Accident Insurance Benefit</label>
                                                <input type="number" className="form-control" value={compBenData.PersonalAccidentInsuranceBenefit} placeholder="Enter Personal Accident Insurance Benefit" name="PersonalAccidentInsuranceBenefit" onChange={handleInputCompBenChange} />
                                                {errors.PersonalAccidentInsuranceBenefit && <div className="text-danger">{errors.PersonalAccidentInsuranceBenefit}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>PWD ID Number</label>
                                                <input type="text" className="form-control" value={compBenData.PWDIDNumber} placeholder="Enter PWD ID Number" name="PWDIDNumber" onChange={handleInputCompBenChange} />
                                                {errors.PWDIDNumber && <div className="text-danger">{errors.PWDIDNumber}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Tendopay Registered</label>
                                                <input type="text" className="form-control" value={compBenData.TendopayRegistered} placeholder="Enter Tendopay Registered" name="TendopayRegistered" onChange={handleInputCompBenChange} />
                                                {errors.TendopayRegistered && <div className="text-danger">{errors.TendopayRegistered}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Canteen UID</label>
                                                <input type="text" className="form-control" value={compBenData.CanteenUID} placeholder="Enter Canteen UID" name="CanteenUID" onChange={handleInputCompBenChange} />
                                                {errors.CanteenUID && <div className="text-danger">{errors.CanteenUID}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Canteen Credit Limit</label>
                                                <input type="number" className="form-control" value={compBenData.CanteenCreditLimit} placeholder="Enter Canteen Credit Limit" name="CanteenCreditLimit" onChange={handleInputCompBenChange} />
                                                {errors.CanteenCreditLimit && <div className="text-danger">{errors.CanteenCreditLimit}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Canteen Barcode</label>
                                                <input type="text" className="form-control" value={compBenData.CanteenBarcode} placeholder="Enter Canteen Barcode" name="CanteenBarcode" onChange={handleInputCompBenChange} />
                                                {errors.CanteenBarcode && <div className="text-danger">{errors.CanteenBarcode}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>DAP Membership Number</label>
                                                <input type="text" className="form-control" value={compBenData.DAPMembershipNumber} placeholder="Enter DAP Membership Number" name="DAPMembershipNumber" onChange={handleInputCompBenChange} />
                                                {errors.DAPMembershipNumber && <div className="text-danger">{errors.DAPMembershipNumber}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>DAP Dependents</label>
                                                <input type="text" className="form-control" value={compBenData.DAPDependents} placeholder="Enter DAP Dependents" name="DAPDependents" onChange={handleInputCompBenChange} />
                                                {errors.DAPDependents && <div className="text-danger">{errors.DAPDependents}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>SSS Number</label>
                                                <input type="text" className="form-control" value={compBenData.Stat_SSSNumber} placeholder="Enter SSS Number" name="Stat_SSSNumber" onChange={handleInputCompBenChange} />
                                                {errors.Stat_SSSNumber && <div className="text-danger">{errors.Stat_SSSNumber}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>SSS Monthly Contribution</label>
                                                <input type="number" className="form-control" value={compBenData.Stat_SSSMonthlyContribution} placeholder="Enter SSS Monthly Contribution" name="Stat_SSSMonthlyContribution" onChange={handleInputCompBenChange} />
                                                {errors.Stat_SSSMonthlyContribution && <div className="text-danger">{errors.Stat_SSSMonthlyContribution}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Pag-IBIG Number</label>
                                                <input type="text" className="form-control" value={compBenData.Stat_PagIbigNumber} placeholder="Enter Pag-IBIG Number" name="Stat_PagIbigNumber" onChange={handleInputCompBenChange} />
                                                {errors.Stat_PagIbigNumber && <div className="text-danger">{errors.Stat_PagIbigNumber}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>Pag-IBIG Monthly Contribution</label>
                                                <input type="number" className="form-control" value={compBenData.Stat_PagIbigMonthlyContribution} placeholder="Enter Pag-IBIG Monthly Contribution" name="Stat_PagIbigMonthlyContribution" onChange={handleInputCompBenChange} />
                                                {errors.Stat_PagIbigMonthlyContribution && <div className="text-danger">{errors.Stat_PagIbigMonthlyContribution}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row justify-content-center">
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>PHIC Number</label>
                                                <input type="text" className="form-control" value={compBenData.Stat_PHICNumber} placeholder="Enter PHIC Number" name="Stat_PHICNumber" onChange={handleInputCompBenChange} />
                                                {errors.Stat_PHICNumber && <div className="text-danger">{errors.Stat_PHICNumber}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>PHIC Monthly Contribution</label>
                                                <input type="number" className="form-control" value={compBenData.Stat_PHICMonthlyContribution} placeholder="Enter PHIC Monthly Contribution" name="Stat_PHICMonthlyContribution" onChange={handleInputCompBenChange} />
                                                {errors.Stat_PHICMonthlyContribution && <div className="text-danger">{errors.Stat_PHICMonthlyContribution}</div>}
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-group">
                                                <label>TIN Number</label>
                                                <input type="text" className="form-control" value={compBenData.Stat_TINNumber} placeholder="Enter TIN Number" name="Stat_TINNumber" onChange={handleInputCompBenChange} />
                                                {errors.Stat_TINNumber && <div className="text-danger">{errors.Stat_TINNumber}</div>}
                                              </div>
                                            </div>
                                          </div>
                                          <br/>
                                        </form>
                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseAddModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleAddCompBen}>
                                          Add Compensation Benefit
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                              {/* Edit Compensation Benefit Modal */}
                            <Modal show={!!selectedCompBen} onHide={handleCloseEditCompBenModal} dialogClassName="custom-modal">
                              <Modal.Header>
                                <Modal.Title>Update CompBen Records</Modal.Title>
                                <Button variant="default" onClick={handleCloseEditCompBenModal}> X </Button>
                              </Modal.Header>
                              <Modal.Body>
                                      {/*  edit compensation benefits form*/}
                                      <form>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Salary</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Salary"
                                              value={selectedCompBen?.Salary || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({ ...selectedCompBen, Salary: e.target.value })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Daily Equivalent</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Daily Equivalent"
                                              value={selectedCompBen?.DailyEquivalent || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  DailyEquivalent: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Monthly Equivalent</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Monthly Equivalent"
                                              value={selectedCompBen?.MonthlyEquivalent || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  MonthlyEquivalent: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Annual Equivalent</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Annual Equivalent"
                                              value={selectedCompBen?.AnnualEquivalent || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  AnnualEquivalent: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Rice Monthly</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Rice Monthly"
                                              value={selectedCompBen?.RiceMonthly || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  RiceMonthly: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Rice Annual</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Rice Annual"
                                              value={selectedCompBen?.RiceAnnual || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({ ...selectedCompBen, RiceAnnual: e.target.value })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Rice Differential Annual</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Rice Differential Annual"
                                              value={selectedCompBen?.RiceDifferentialAnnual || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  RiceDifferentialAnnual: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Uniform Annual</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Uniform Annual"
                                              value={selectedCompBen?.UniformAnnual || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  UniformAnnual: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Leave Days</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Leave Days"
                                              value={selectedCompBen?.LeaveDays || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({ ...selectedCompBen, LeaveDays: e.target.value })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Laundry Allowance</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Laundry Allowance"
                                              value={selectedCompBen?.LaundryAllowance || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  LaundryAllowance: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Comm Allowance</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Comm Allowance"
                                              value={selectedCompBen?.CommAllowance || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  CommAllowance: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Cash Gift</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Cash Gift"
                                              value={selectedCompBen?.CashGift || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({ ...selectedCompBen, CashGift: e.target.value })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Medical Insurance</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Medical Insurance"
                                              value={selectedCompBen?.MedicalInsurance || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  MedicalInsurance: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Free HMO Dependent</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Free HMO Dependent"
                                              value={selectedCompBen?.FreeHMODependent || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  FreeHMODependent: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>MBL</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter MBL"
                                              value={selectedCompBen?.MBL || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({ ...selectedCompBen, MBL: e.target.value })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Life Insurance</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Life Insurance"
                                              value={selectedCompBen?.LifeInsurance || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  LifeInsurance: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Personal Accident Insurance Benefit</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Personal Accident Insurance Benefit"
                                              value={selectedCompBen?.PersonalAccidentInsuranceBenefit || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  PersonalAccidentInsuranceBenefit: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>PWD ID Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter PWD ID Number"
                                              value={selectedCompBen?.PWDIDNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  PWDIDNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Tendopay Registered</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Tendopay Registered"
                                              value={selectedCompBen?.TendopayRegistered || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  TendopayRegistered: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Canteen UID</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Canteen UID"
                                              value={selectedCompBen?.CanteenUID || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  CanteenUID: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Canteen Credit Limit</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Canteen Credit Limit"
                                              value={selectedCompBen?.CanteenCreditLimit || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  CanteenCreditLimit: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Canteen Barcode</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Canteen Barcode"
                                              value={selectedCompBen?.CanteenBarcode || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  CanteenBarcode: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>DAP Membership Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter DAP Membership Number"
                                              value={selectedCompBen?.DAPMembershipNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  DAPMembershipNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>DAP Dependents</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter DAP Dependents"
                                              value={selectedCompBen?.DAPDependents || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  DAPDependents: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat SSS Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat SSS Number"
                                              value={selectedCompBen?.Stat_SSSNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_SSSNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat SSS Monthly Contribution</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat SSS Monthly Contribution"
                                              value={selectedCompBen?.Stat_SSSMonthlyContribution || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_SSSMonthlyContribution: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat PagIbig Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat PagIbig Number"
                                              value={selectedCompBen?.Stat_PagIbigNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_PagIbigNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat PagIbig Monthly Contribution</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat PagIbig Monthly Contribution"
                                              value={selectedCompBen?.Stat_PagIbigMonthlyContribution || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_PagIbigMonthlyContribution: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat PHIC Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat PHIC Number"
                                              value={selectedCompBen?.Stat_PHICNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_PHICNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat PHIC Monthly Contribution</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat PHIC Monthly Contribution"
                                              value={selectedCompBen?.Stat_PHICMonthlyContribution || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_PHICMonthlyContribution: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row justify-content-center">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label>Stat TIN Number</label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Enter Stat TIN Number"
                                              value={selectedCompBen?.Stat_TINNumber || ''}
                                              onChange={(e) =>
                                                setSelectedCompBen({
                                                  ...selectedCompBen,
                                                  Stat_TINNumber: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <br />
                                    </form>

                                  </Modal.Body>
                                  <Modal.Footer>
                                      <Button variant="secondary" onClick={handleCloseEditCompBenModal}>
                                          Close
                                      </Button>
                                      <Button variant="primary" onClick={handleEditCompBenFormSubmit}>
                                          Save Changes
                                      </Button>
                                  </Modal.Footer>
                              </Modal>
                          {/* </div> */}
                                 {/* Compensation Table */}
                                 <div className='card-body'>
                                {/* <div classN ame="card-body"> */}
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                        <th scope="col">Action</th>
                                        <th scope="col">Salary</th>
                                        <th scope="col">Daily Equivalent</th>
                                        <th scope="col">Monthly Equivalent</th>
                                        <th scope="col">Annual Equivalent</th>
                                        <th scope="col">Rice Monthly</th>
                                        <th scope="col">Rice Annual</th>
                                        <th scope="col">Rice Differential Annual</th>
                                        <th scope="col">Uniform Annual</th>
                                        <th scope="col">Leave Days</th>
                                        <th scope="col">Laundry Allowance</th>
                                        <th scope="col">Comm Allowance</th>
                                        <th scope="col">Comm Allowance Type</th>
                                        <th scope="col">Cash Gift</th>
                                        <th scope="col">Medical Insurance</th>
                                        <th scope="col">Free HMO Dependent</th>
                                        <th scope="col">MBL</th>
                                        <th scope="col">Life Insurance</th>
                                        <th scope="col">Beneficiaries</th>
                                        <th scope="col">Personal Accident Insurance Benefit</th>
                                        <th scope="col">PWD ID Number</th>
                                        <th scope="col">Tendopay Registered</th>
                                        <th scope="col">Canteen UID</th>
                                        <th scope="col">Canteen Credit Limit</th>
                                        <th scope="col">Canteen Barcode</th>
                                        <th scope="col">DAP Membership Number</th>
                                        <th scope="col">DAP Dependents</th>
                                        <th scope="col">Stat SSS Number</th>
                                        <th scope="col">Stat SSS Monthly Contribution</th>
                                        <th scope="col">Stat PagIbig Number</th>
                                        <th scope="col">Stat PagIbig Monthly Contribution</th>
                                        <th scope="col">Stat PHIC Number</th>
                                        <th scope="col">Stat PHIC Monthly Contribution</th>
                                        <th scope="col">Stat TIN Number</th>
                                        <th scope="col">Created at</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                        {filteredCompBen.length > 0 ? (
                          filteredCompBen.map((compBen, index) => (
                            <tr key={index}>
                              <td>
                              <button className="btn btn-xs btn-primary mr-2" onClick={() => handleShowEditCompBenModal(compBen)}>
                                              <i className="fas fa-pencil-alt"></i>
                              </button>
                                </td>
                                <td>₱{compBen.Salary}</td>  
                                <td>₱{compBen.DailyEquivalent}</td> 
                                <td>₱{compBen.MonthlyEquivalent}</td>
                                <td>₱{compBen.AnnualEquivalent}</td>
                                <td>₱{compBen.RiceMonthly}</td>
                                <td>₱{compBen.RiceAnnual}</td>
                                <td>₱{compBen.RiceDifferentialAnnual}</td>
                                <td>₱{compBen.UniformAnnual}</td>
                                <td>{compBen.LeaveDays}</td>
                                <td>₱{compBen.LaundryAllowance}</td>
                                <td>₱{compBen.CommAllowance}</td>
                                <td>{compBen.CommAllowanceType}</td>
                                <td>₱{compBen.CashGift}</td>
                                <td>₱{compBen.MedicalInsurance}</td>
                                <td>{compBen.FreeHMODependent}</td>
                                <td>₱{compBen.MBL}</td>
                                <td>₱{compBen.LifeInsurance}</td>
                                <td>{compBen.Beneficiaries}</td>
                                <td>{compBen.PersonalAccidentInsuranceBenefit}</td>
                                <td>{compBen.PWDIDNumber}</td>
                                <td>{compBen.TendopayRegistered}</td>
                                <td>{compBen.CanteenUID}</td>
                                <td>{compBen.CanteenCreditLimit}</td>
                                <td>{compBen.CanteenBarcode}</td>
                                <td>{compBen.DAPMembershipNumber}</td>
                                <td>{compBen.DAPDependents}</td>
                                <td>{compBen.Stat_SSSNumber}</td>
                                <td>{compBen.Stat_SSSMonthlyContribution}</td>
                                <td>{compBen.Stat_PagIbigNumber}</td>
                                <td>{compBen.Stat_PagIbigMonthlyContribution}</td>
                                <td>{compBen.Stat_PHICNumber}</td>
                                <td>{compBen.Stat_PHICMonthlyContribution}</td>
                                <td>{compBen.Stat_TINNumber}</td>
                                <td>{compBen.CreatedAt}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="19">No compensation benefit data yet.</td>
                          </tr>
                        )}
                      </tbody>
                                    </table>
                                  </div>
                           </div>
                      <br/>
                      </div>
                      <div className='tab-pane fade' id='history' role='tabpanel' aria-labelledby='history-tab'>
                         {/* History Table */}
                         <div className='card-body'>
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">Employee ID</th>
                                  <th scope="col">Employee Name</th>
                                  <th scope="col">Field Name</th>
                                  <th scope="col">Action</th>
                                  <th scope="col">Old</th>
                                  <th scope="col">New</th>
                                  <th scope="col">Remarks</th>
                                  <th scope="col">Date Created</th>
                                  <th scope="col">Updated By</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredHistory.length > 0 ? (
                                  filteredHistory.map((history, index) => (
                                    <tr key={index}>
                                    <td>{history.EmployeeId}</td>
                                    <td>{toSentenceCase(history.EmployeeName)}</td>
                                    <td>{toSentenceCase(history.FieldName)}</td>
                                    <td>{toSentenceCase(history.Action)}</td>
                                    <td>{history.OldValue}</td>
                                    <td>{history.NewValue}</td>
                                    <td>{toSentenceCase(history.Remarks)}</td>
                                    <td>{history.DateCreated}</td>
                                    <td>{toSentenceCase(history.UpdatedBy)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8">No history data available.</td>
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
      </div>
     </div>
    <Footer />
  </div>
 </div>
  );
}

export default UpdateEmployeeInfo;