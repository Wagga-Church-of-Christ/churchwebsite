import React from 'react';
import './Footer.scss';

const Footer = (props) => {
  return (
    <div className="footer">
      <div className="footer-links">
        <a href="/">Home</a><span className="footer-link-slash">/</span>
        <a href="/who-we-are">Who we are</a><span className="footer-link-slash">/</span>
        <a href="/confession-of-faith">Confession of Faith</a><span className="footer-link-slash">/</span>
        <a href="/sermons">Sermons</a>
      </div>
      <div className="row">
        <div className="col-sm">
          <p>Wagga Church of Christ<br />49 Fernleigh Rd, Turvey Park, 2650<br />2021 &copy; Wagga Church of Christ</p>
          <br />
          <p><a href="https://app.contentful.com/spaces/ge1yh6v33o8l">Edit page content</a></p>
        </div>
        <div className="col-sm">
          <p>Contact us: <a href="mailto:ttopscoc@gmail.com">ttopscoc@gmail.com</a></p>
        </div>
        <div className="col-sm d-none d-sm-none d-md-none d-lg-block">
          <img alt="footer-logo" className="footer-logo float-right" src="/logos/logo-512.png" />
        </div>
      </div>
    </div>
  )
};

export default Footer;
