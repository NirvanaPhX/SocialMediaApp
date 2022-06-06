import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPost } from "../../actions/post";
import { Link, useParams } from "react-router-dom";
import PostItem from "../posts/PostItem/PostItem";
import Spinner from "../layout/Spinner/Spinner";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({ post: { post, loading }, getPost }) => {
  const { post_id } = useParams();

  useEffect(() => {
    getPost(post_id);
  }, [getPost, post_id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <section className="container">
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem showActions={false} post={post} />
      <CommentForm post_id={post._id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem comment={comment} post_id={post._id} key={comment._id} />
        ))}
      </div>
    </section>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.postReducer,
});
export default connect(mapStateToProps, { getPost })(Post);
