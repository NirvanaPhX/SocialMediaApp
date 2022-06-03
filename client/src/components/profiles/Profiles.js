import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllProfiles } from "../../actions/profile";
import Spinner from "../layout/Spinner/Spinner";
import ProfileItem from "./ProfileItem";

import "./Profiles.css";

const Profiles = ({ profile: { profiles, loading }, getAllProfiles }) => {
  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i>Browse and connect with
        developers
      </p>
      <div className="profiles">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileItem key={profile._id} profile={profile} />
          ))
        ) : (
          <h4>No Profiles Found...</h4>
        )}
      </div>
    </section>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profileReducer,
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
