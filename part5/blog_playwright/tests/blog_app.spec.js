const { test, describe, expect, beforeEach } = require('@playwright/test');
const { log } = require('node:console');
const { before } = require('node:test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users/', {
      data: {
        username: 'Leoli1205',
        name: 'Leo',
        password: '2222',
      },
    });
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('.loginForm')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Leoli1205');
      await page.getByTestId('password').fill('2222');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('Leo logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('wrong');
      await page.getByTestId('password').fill('wrong');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('Blog app', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
    });

    describe('When logged in', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('Leoli1205');
        await page.getByTestId('password').fill('2222');
        await page.getByRole('button', { name: 'login' }).click();
      });

      test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click();

        const textboxes = await page.getByRole('textbox').all();
        await textboxes[0].fill('new blog from playwright');
        await textboxes[1].fill('Leo');
        await textboxes[2].fill('http:playwright');

        await page.getByRole('button', { name: 'create' }).click();

        const blog = page.locator('div', {
          hasText: 'new blog from playwright',
        });

        await expect(blog).toContainText('Leo');
      });

      describe('When one blog exists', () => {
        test.beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'new note' }).click();

          const textboxes = await page.getByRole('textbox').all();
          await textboxes[0].fill('new blog from playwright');
          await textboxes[1].fill('Leo');
          await textboxes[2].fill('http:playwright');

          await page.getByRole('button', { name: 'create' }).click();
        });

        test('blog can be liked', async ({ page }) => {
          const blog = page
            .locator('div', {
              hasText: 'new blog from playwright',
            })
            .first();

          await blog.getByRole('button', { name: 'view' }).click();
          await blog.getByRole('button', { name: 'like' }).click();

          await expect(blog).toContainText('1');
        });

        test('blog can be remove', async ({ page, request }) => {
          const blog = page
            .locator('div', {
              hasText: 'new blog from playwright',
            })
            .first();

          await blog.getByRole('button', { name: 'view' }).click();
          await blog.getByRole('button', { name: 'remove' }).click();

          const response = await request.get('http://localhost:3003/api/blogs');
          const blogs = await response.json();
          expect(blogs).toHaveLength(0);
        });
      });

      describe('When multiple blogs exist', () => {
        test.beforeEach(async ({ page, request }) => {
          // create three blogs with preset like counts
          const blogs = [
            { title: 'Low Likes', author: 'A', url: 'u1', likes: 2 },
            { title: 'Mid Likes', author: 'B', url: 'u2', likes: 5 },
            { title: 'High Likes', author: 'C', url: 'u3', likes: 9 },
          ];
          for (const blog of blogs) {
            await request.post(`http://localhost:3003/api/blogs`, {
              data: blog,
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          await page.goto(APP_URL);
        });

        test('blogs are sorted by descending likes', async ({ page }) => {
          // assume each blog is rendered in <div class="blog">…</div>
          const items = page.locator('div.blog');
          await expect(items).toHaveCount(3);

          // extract titles in DOM order
          const titles = await items.allTextContents();
          const orderedTitles = titles.map((txt) => txt.split('\n')[0].trim());

          expect(orderedTitles).toEqual([
            'High Likes',
            'Mid Likes',
            'Low Likes',
          ]);
        });
      });
    });
  });
});
