import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { connect } from "react-redux";
import { likePost, unlikePost } from "../../../actions/post";

import "./PostItem.css";

const PostItem = ({
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  likePost,
  unlikePost,
  showActions,
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>

        {showActions && (
          <>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => likePost(_id)}
            >
              <i className="fas fa-thumbs-up" />{" "}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => unlikePost(_id)}
            >
              <i className="fas fa-thumbs-down" />
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button type="button" className="btn btn-danger">
                <i className="fas fa-times" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { likePost, unlikePost })(PostItem);
