import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('5.16 calls createForm with correct details when a new blog is created', async () => {
  const createForm = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createForm={createForm} />);

  // all three inputs are type="text" → role="textbox"
  const [titleInput, authorInput, urlInput] = screen.getAllByRole('textbox');

  await user.type(titleInput, 'React Patterns');
  await user.type(authorInput, 'Michael Chan');
  await user.type(urlInput, 'https://reactpatterns.com');

  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(createForm).toHaveBeenCalledTimes(1);
  expect(createForm).toHaveBeenCalledWith({
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
  });
});
