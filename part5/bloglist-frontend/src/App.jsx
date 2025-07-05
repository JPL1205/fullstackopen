import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/Blogform';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const allBlogs = async () => {
      const blog = await blogService.getAll();
      blog.sort((a, b) => b.likes - a.likes);
      setBlogs(blog);
    };
    allBlogs();
  }, []);

  useEffect(() => {
    const logUser = window.localStorage.getItem('UserLoggedIn');
    if (logUser) {
      const user = JSON.parse(logUser);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    // 1. login in with axios
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      console.log(user);
      console.log(user.token);
      console.log(`login successful for user ${username}`);
      window.localStorage.setItem('UserLoggedIn', JSON.stringify(user));

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError('wrong username or password');
      setTimeout(() => {
        setError(null);
      }, 5000);

      console.log('login unsuccess');
      console.error(err.response ? err.response.data : err.message);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('UserLoggedIn');
    setUser(null);
  };
  const loginForm = () => (
    <div className="loginForm">
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            data-testid="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const addForm = async (object) => {
    const data = await blogService.create(object);
    console.log('create data app 79', data);

    setBlogs(blogs.concat(data));
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    const returnData = await blogService.update(blog.id, updatedBlog);
    console.log(returnData);

    setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnData)));
  };

  const handleRemove = async (blog) => {
    const returnData = await blogService.remove(blog.id);
    console.log(returnData);

    setBlogs(blogs.filter((b) => b.id !== blog.id));
  };

  if (user === null) {
    return (
      <div>
        <h1>log in to application</h1>
        {error && <div className="error">{error}</div>}
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="new note">
        <BlogForm createForm={addForm} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default App;
