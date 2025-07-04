// Blog.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React',
    author: 'J. Tester',
    url: 'http://test.com/',
    likes: 5,
  };

  test('5.13 renders title & author, but hides url and likes by default', () => {
    const { container } = render(
      <Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />
    );

    // title and author must be visible
    expect(container.querySelector('.hide')).toHaveTextContent('Testing React');
    expect(container.querySelector('.hide')).toHaveTextContent('J. Tester');

    // details div should be hidden
    const detailsDiv = container.querySelector('.show');
    expect(detailsDiv).toHaveStyle({ display: 'none' });
  });

  test('5.14 shows url and likes when the view button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />
    );

    await user.click(screen.getByText('view'));

    // details div should now be visible
    expect(container.querySelector('.show')).not.toHaveStyle('display: none');

    // url and likes rendered
    expect(screen.getByText('http://test.com/')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('5.15 if like button clicked twice, event handler is called twice', async () => {
    const mockLike = vi.fn();
    const user = userEvent.setup();
    render(<Blog blog={blog} handleLike={mockLike} handleRemove={() => {}} />);

    // open details first
    await user.click(screen.getByText('view'));

    // click like twice
    const likeBtn = screen.getByText('like');
    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(mockLike).toHaveBeenCalledTimes(2);
  });
});
