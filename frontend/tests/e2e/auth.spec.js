import { expect, test } from '@playwright/test';

const user = {
  nome: 'Usuario Teste',
  email: 'usuario.teste@email.com',
  senha: '123456'
};

test.beforeEach(async ({ page }) => {
  await page.route('http://localhost:3000/auth/register', async (route) => {
    const request = route.request();
    const body = request.postDataJSON();

    expect(body).toEqual({
      nome: user.nome,
      email: user.email,
      senha: user.senha
    });

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'token-cadastro',
        user: {
          id: 1,
          nome: user.nome,
          email: user.email
        }
      })
    });
  });

  await page.route('http://localhost:3000/auth/login', async (route) => {
    const request = route.request();
    const body = request.postDataJSON();

    expect(body).toEqual({
      email: user.email,
      senha: user.senha
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'token-login',
        user: {
          id: 1,
          nome: user.nome,
          email: user.email
        }
      })
    });
  });
});

test('deve cadastrar usuario pelo formulario do frontend', async ({ page }) => {
  await page.goto('/cadastro');

  await page.getByLabel('Nome').fill(user.nome);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Senha', { exact: true }).fill(user.senha);
  await page.getByLabel('Confirmar senha').fill(user.senha);
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Perfil' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe('token-cadastro');
});

test('deve fazer login pelo formulario do frontend', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Senha').fill(user.senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Perfil' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe('token-login');
});

test('deve exibir alerta quando as senhas do cadastro forem diferentes', async ({ page }) => {
  await page.goto('/cadastro');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Senhas não conferem');
    await dialog.accept();
  });

  await page.getByLabel('Nome').fill(user.nome);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Senha', { exact: true }).fill(user.senha);
  await page.getByLabel('Confirmar senha').fill('654321');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page).toHaveURL('/cadastro');
});

test('deve exibir alerta quando o login falhar', async ({ page }) => {
  await page.route('http://localhost:3000/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Credenciais inválidas' })
    });
  });

  await page.goto('/login');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Credenciais inválidas');
    await dialog.accept();
  });

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Senha').fill(user.senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL('/login');
});
