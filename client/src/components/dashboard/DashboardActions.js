import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/create-profile" className="btn btn-light">
        <i className="fas fa-user-circle text-primary">Edit Profile</i>
      </Link>
      <Link to="/add-experience" className="btn btn-light">
        <i className="fas fa-black-tie text-primary">Add Experience</i>
      </Link>
      <Link to="/add-education" className="btn btn-light">
        <i className="fas fa-graduation-cap text-primary">Add Education</i>
      </Link>
    </div>
  );
};

export default DashboardActions;
