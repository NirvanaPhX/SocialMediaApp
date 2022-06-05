import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getProfileByUserId } from "../../actions/profile";

import Spinner from "../layout/Spinner/Spinner";
import ProfileTop from "./ProfileTop/ProfileTop";
import ProfileAbout from "./ProfileAbout/ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub/ProfileGithub";

import "./Profile.css";

const Profile = ({ auth, profile: { profile }, getProfileByUserId }) => {
  const { id } = useParams();

  useEffect(() => {
    getProfileByUserId(id);
  }, [getProfileByUserId, id]);

  return (
    <section className="container">
      {!profile ? (
        <Spinner />
      ) : (
        <>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((exp) => (
                    <ProfileExperience key={exp._id} experience={exp} />
                  ))}
                </>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((edu) => (
                    <ProfileEducation key={edu._id} education={edu} />
                  ))}
                </>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getProfileByUserId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
  profile: state.profileReducer,
});

export default connect(mapStateToProps, { getProfileByUserId })(Profile);
