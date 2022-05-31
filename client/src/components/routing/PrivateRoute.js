import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
}) => {
  // if (loading) return <Spinner />;
  if (isAuthenticated) return <Component />;

  return <Navigate to="/login" />;
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PrivateRoute);
