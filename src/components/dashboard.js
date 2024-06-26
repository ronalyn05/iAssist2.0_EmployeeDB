import React, { useState, useEffect, useRef } from "react";
import Navbar from "./navbar";
import Chart from "chart.js/auto";
import "../App.css";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import axios from "axios";

function Dashboard() {
  const areaChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const [numberOfEmployees, setNumberOfEmployees] = useState(0);
  const [numberOfusers, setNumberOfusers] = useState(0);

 
  const firstName = sessionStorage.getItem("firstName");

  useEffect(() => {

    const fetchNumberOfUsers = async () => {
      try {
        const response = await axios.get("/usersAccount"); // API endpoint to fetch employees count is '/UserAccount'
        const employeesCount = response.data.length; // response data is an array of users account
        setNumberOfusers(employeesCount);
        
      } catch (error) {
        console.error("Error fetching number of users:", error);
      }
    };

    
    fetchNumberOfUsers();
  }, []);

  useEffect(() => {
    const fetchNumberOfEmployees = async () => {
      try {
        const response = await axios.get("/newHireEmp"); // API endpoint to fetch employees count is '/newHireEmp'
        const employeesCount = response.data.length; //response data is an array of employees
        setNumberOfEmployees(employeesCount);
      } catch (error) {
        console.error("Error fetching number of employees:", error);
      }
    };

    fetchNumberOfEmployees();
  }, []);

  // useEffect(() => {

  //     // Chart.js initialization for area chart
  //     const areaChartCtx = areaChartRef.current.getContext('2d');
  //     const areaChartInstance = new Chart(areaChartCtx, {
  //         type: 'line',
  //         data: {
  //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //             datasets: [{
  //                 label: 'Number of Employee',
  //                 data: [65, 59, 80, 81, 56, 55, 40],
  //                 backgroundColor: 'rgba(75,192,192,0.2)',
  //                 borderColor: 'rgba(75,192,192,1)',
  //                 borderWidth: 1
  //             }]
  //         },
  //         options: {
  //             scales: {
  //                 y: {
  //                     beginAtZero: true
  //                 }
  //             }
  //         }

  //     });

  //     // Chart.js initialization for pie chart
  //     const pieChartCtx = pieChartRef.current.getContext('2d');
  //     const pieChartInstance = new Chart(pieChartCtx, {
  //         type: 'pie',
  //         data: {
  //             labels: ['New hire', 'Sick Leave', 'Average Salary'],
  //             datasets: [{
  //                 data: [30, 20, 10],
  //                 backgroundColor: ['#007bff', '#28a745', '#17a2b8'],
  //                 borderColor: ['#007bff', '#28a745', '#17a2b8']
  //             }]
  //         }
  //     });

  //     // Cleanup function
  //     return () => {
  //         if (areaChartInstance) {
  //             areaChartInstance.destroy();
  //         }
  //         if (pieChartInstance) {
  //             pieChartInstance.destroy();
  //         }
  //     };

  // }, []);

  return (
    <div id="wrapper">
      {/* Sidebar */}
      <Navbar />
      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* Topbar */}
          <TopNavbar />
          {/* page content begin here */}

          <div className="container-fluid">
            {/* Welcome Message */}
            <div className="welcome-message">
              <span>Hi there, {firstName}!</span>
              <p> Nice to have you here! Let's make today great together!</p>
            </div>
            <br />
            {/* Page content begins here */}
            <div className="row justify-content-center">
              <div className="col-xl-4 col-md-6 mb-8">
                {/* Earnings (Monthly) Card  */}
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Numbers of new hire employee
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {numberOfEmployees}
                        </div>
                        {/* <div className="h5 mb-0 font-weight-bold text-gray-800">50 </div> */}
                        {/* <h6 className="font-weight-bold text-center text-danger"> static pa ni </h6> */}
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6 mb-8">
                {/* Number of Users */}
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Numbers of Users
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {numberOfusers}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-users fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Self service movement card*/}
              {/* <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                        <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Self-Service Movement Record</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">5</div>
                                    <h6 className="font-weight-bold text-center text-danger"> static pa ni </h6>
                                </div>
                                <div className="col-auto">
                                <i className="fas fa-user-cog fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

              {/* Pending Exit Card */}
              {/* <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                        <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                    Pending Exit Approval</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">10</div>
                                    <h6 className="font-weight-bold text-center text-danger"> static pa ni </h6>
                                </div>
                                <div className="col-auto">
                                <i className="fas fa-sign-out-alt fa-2x text-gray-300"></i>

                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <div className="row">
            <div className="col-xl-8 col-lg-7">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">HRIS Overview</h6>
                        <div className="dropdown no-arrow">
                            <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                            </a>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="chart-area">
                            <canvas ref={areaChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 col-lg-7">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">Revenue Sources</h6>
                        <div className="dropdown no-arrow">
                            <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                            </a>
                        </div>
                    </div>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <div className="chart-pie pt-4 pb-2">
                    <canvas ref={pieChartRef} style={{ display: 'block', margin: 'auto', maxWidth: 'auto', maxHeight: 'auto%' }}></canvas>
                    </div>
                </div>
                </div>
            </div>
        </div> */}
            {/* Page content ends here */}
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;