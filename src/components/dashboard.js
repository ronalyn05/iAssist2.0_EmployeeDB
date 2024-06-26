import React, { useState, useEffect, useRef } from "react";
import Navbar from "./navbar";
import Chart from "chart.js/auto";
import "../App.css";
import TopNavbar from "./topnavbar";
import Footer from "./footer";
import axios from "axios";

function Dashboard() {
  const chartRef = useRef(null);

  const [numberOfEmployees, setNumberOfEmployees] = useState(0);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [monthlyNewHireData, setMonthlyNewHireData] = useState([]);
  const [yearlyNewHireData, setYearlyNewHireData] = useState([]);
  const [isMonthlyView, setIsMonthlyView] = useState(true);

  const firstName = sessionStorage.getItem("firstName");

  useEffect(() => {
    const fetchNumberOfUsers = async () => {
      try {
        const response = await axios.get("/usersAccount");
        const usersCount = response.data.length;
        setNumberOfUsers(usersCount);
      } catch (error) {
        console.error("Error fetching number of users:", error);
      }
    };

    fetchNumberOfUsers();
  }, []);

  useEffect(() => {
    const fetchNumberOfEmployees = async () => {
      try {
        const response = await axios.get("/newHireEmp");
        const employeesCount = response.data.length;
        setNumberOfEmployees(employeesCount);
      } catch (error) {
        console.error("Error fetching number of employees:", error);
      }
    };

    fetchNumberOfEmployees();
  }, []);

  useEffect(() => {
    const fetchMonthlyNewHireData = async () => {
      try {
        const response = await axios.get("/monthlyNewHireCount");
        setMonthlyNewHireData(response.data);
      } catch (error) {
        console.error("Error fetching monthly new hire data:", error);
      }
    };

    fetchMonthlyNewHireData();
  }, []);

  useEffect(() => {
    const fetchYearlyNewHireData = async () => {
      try {
        const response = await axios.get("/yearlyNewHireCount");
        setYearlyNewHireData(response.data);
      } catch (error) {
        console.error("Error fetching yearly new hire data:", error);
      }
    };

    fetchYearlyNewHireData();
  }, []);

  useEffect(() => {
    let chartInstance = null;

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const renderChart = (labels, data, colors) => {
      const chartCtx = chartRef.current.getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(chartCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'New Hires',
            data: data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    if (isMonthlyView && monthlyNewHireData.length > 0) {
      const labels = monthlyNewHireData.map(data => months[data.Month - 1]);
      const data = monthlyNewHireData.map(data => data.NewHireCount);
      const colors = labels.map((_, index) => `hsl(${(index / labels.length) * 360}, 100%, 75%)`);
      renderChart(labels, data, colors);
    } else if (!isMonthlyView && yearlyNewHireData.length > 0) {
      const labels = yearlyNewHireData.map(data => data.Year);
      const data = yearlyNewHireData.map(data => data.NewHireCount);
      const colors = labels.map((_, index) => `hsl(${(index / labels.length) * 360}, 100%, 75%)`);
      renderChart(labels, data, colors);
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [isMonthlyView, monthlyNewHireData, yearlyNewHireData]);

  const handleViewToggle = () => {
    setIsMonthlyView(!isMonthlyView);
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
              <span>Hi there, {toSentenceCase(firstName)}!</span>
              <p>Nice to have you here! Let's make today great together!</p>
            </div>
            <br />
            {/* Page content begins here */}
            <div className="row justify-content-center">
              <div className="col-xl-4 col-md-6 mb-8">
                {/* Earnings (Monthly) Card */}
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Numbers of new hire employees this month
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {numberOfEmployees}
                        </div>
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
                          Numbers of Total Registered Employees
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {numberOfUsers}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-users fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            {/* NEW HIRE CHART OVERVIEW */}
            <div className="row justify-content-center">
              <div className="col-xl-12 col-lg-7">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">New Hire Chart Overview</h6>
                    <button onClick={handleViewToggle} className="btn btn-primary">
                      {isMonthlyView ? 'Switch to Yearly View' : 'Switch to Monthly View'}
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="chart-area" style={{ height: '400px' }}>
                      <canvas ref={chartRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row justify-content-center">
              <div className="col-xl-12 col-lg-7">
                <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">New Hire Chart Overview</h6>
                    <div className="dropdown no-arrow">
                      <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                      </a>
                    </div>
                    <button onClick={handleViewToggle} className="btn btn-primary">
                      {isMonthlyView ? 'Switch to Yearly View' : 'Switch to Monthly View'}
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="chart-area" style={{ height: '400px' }}>
                      <canvas ref={chartRef}></canvas>
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