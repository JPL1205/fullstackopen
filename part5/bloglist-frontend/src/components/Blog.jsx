import { useState } from 'react';

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const reset = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="hide">
        {blog.title} {blog.author}
        <button onClick={reset}>view</button>
      </div>
      <div style={showWhenVisible} className="show">
        <div>
          {blog.title} <button onClick={reset}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>
          {blog.author}
          <button onClick={() => handleRemove(blog)}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
