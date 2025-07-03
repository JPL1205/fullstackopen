import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const logUser = window.localStorage.getItem('UserLoggedIn');
    if (logUser) {
      const user = JSON.parse(logUser);
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
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const addForm = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    const data = await blogService.create(newBlog);
    setBlogs(blogs.concat(data));

    setNotification(`a new blog ${title} by ${author} added`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);

    setAuthor('');
    setTitle('');
    setUrl('');
  };

  const newBlogForm = () => (
    <form onSubmit={addForm}>
      <div>
        title:
        <input type="text" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        author:
        <input type="text" onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div>
        url:
        <input type="text" onChange={(e) => setUrl(e.target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  );

  const notificationBlock = () => <div>{notification}</div>;

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
      {notification !== null && notificationBlock()}
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>
      {newBlogForm()}

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
