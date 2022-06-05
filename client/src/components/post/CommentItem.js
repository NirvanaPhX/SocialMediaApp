import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { deleteComment } from "../../actions/post";

const CommentItem = ({
  auth,
  post_id,
  deleteComment,
  comment: { _id, text, name, avatar, user, date },
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img src={avatar} alt="" className="round-img" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">Posted on {formatDate(date)}</p>
        {!auth.loading && user === auth.user._id && (
          <button
            className="btn btn-danger"
            onClick={() => deleteComment(post_id, _id)}
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post_id: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
