import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({ profile, auth, getCurrentProfile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return <section className="container">Dashboard</section>;
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profileReducer,
  auth: state.authReducer,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
