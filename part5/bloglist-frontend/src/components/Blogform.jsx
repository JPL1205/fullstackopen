import { useState } from 'react';

const BlogForm = ({ createForm }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState(null);

  const addForm = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    await createForm(newBlog);

    setNotification(`a new blog ${title} by ${author} added`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);

    setAuthor('');
    setTitle('');
    setUrl('');
  };

  const notificationBlock = () => <div>{notification}</div>;

  return (
    <div>
      {notification !== null && notificationBlock()}
      <h2>create new</h2>
      <form onSubmit={addForm}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
