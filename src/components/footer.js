import React from "react";
import '../App.css';
// import { variables } from '../variables';

function Footer() {
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <img src="/img/logo-innodata.png" alt="companyLogo" className="footer-logo" />
          <p style={{ marginBottom: '10px' }}>Innodata Knowledge Services, Inc.</p>
          <span>Copyright &copy;2024</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
