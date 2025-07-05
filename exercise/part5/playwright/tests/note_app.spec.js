const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Leo',
        username: 'Leoli1205',
        password: '2222',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2025'
      )
    ).toBeVisible();
  });

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click();

    await page.getByTestId('username').fill('Leoli1205');
    await page.getByTestId('password').fill('2222');

    // const textboxes = await page.getByRole('textbox').all();
    // await textboxes[0].fill('Leoli1205');
    // await textboxes[1].fill('2222');

    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Leo logged-in')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click();

    await page.getByTestId('username').fill('wrong password');
    await page.getByTestId('password').fill('wrong password');
    await page.getByRole('button', { name: 'login' }).click();

    const errorDiv = page.locator('.error');
    // await expect(errorDiv).toBeVisible({ timeout: 1000 });
    await expect(errorDiv).toContainText('Wrong credentials', {
      timeout: 1000,
    });

    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

    await expect(page.getByText('Leo logged in')).not.toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Leoli1205', '2222');
    });

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a new note create by playwright');

      await expect(
        page.getByText('a new note create by playwright')
      ).toBeVisible();
    });

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwrigh');
      });

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click();
        await expect(page.getByText('make important')).toBeVisible();
      });
    });

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note');
        await createNote(page, 'second note');
      });

      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = await page.getByText('first note');
        const otherNoteElement = await otherNoteText.locator('..');

        await otherNoteElement
          .getByRole('button', { name: 'make not important' })
          .click();
        await expect(
          otherNoteElement.getByText('make important')
        ).toBeVisible();
      });
    });
  });
});
