import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackForm } from '../components/FeedbackForm';

describe('FeedbackForm', () => {
  // Тест 1: Проверка заголовка
  test('отображает заголовок "Обратная связь"', () => {
    render(<FeedbackForm />);
    const heading = screen.getByRole('heading', { name: /обратная связь/i });
    expect(heading).toBeInTheDocument();
  });

  // Тест 2: Ввод имени и сообщения
  test('сохраняет введенные имя и сообщение', async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText(/ваше имя/i);
    const messageInput = screen.getByPlaceholderText(/ваше сообщение/i);

    await userEvent.type(nameInput, 'Иван');
    await userEvent.type(messageInput, 'Привет, это тестовое сообщение');

    expect(nameInput).toHaveValue('Иван');
    expect(messageInput).toHaveValue('Привет, это тестовое сообщение');
  });

  // Тест 3: Отправка формы с валидными данными
  test('показывает подтверждение после отправки формы', async () => {
    render(<FeedbackForm />);
    const user = userEvent.setup();

    // Вводим данные
    await user.type(screen.getByPlaceholderText('Ваше имя'), 'Иван');
    await user.type(screen.getByPlaceholderText('Ваше сообщение'), 'Тестовое сообщение');
    
    // Нажимаем кнопку отправки
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    // Ожидаем появления подтверждения
    await waitFor(() => {
      expect(screen.getByText(/Спасибо, Иван!/i)).toBeInTheDocument();
    }, { timeout: 2000 }); // Увеличиваем таймаут для setTimeout в компоненте
  });
  // Тест 4: Проверка, что сообщение не отправляется при пустом вводе
  test('не показывает подтверждение при пустом имени', async () => {
    render(<FeedbackForm />);
    const messageInput = screen.getByPlaceholderText(/ваше сообщение/i);
    const submitButton = screen.getByRole('button', { name: /отправить/i });

    await userEvent.type(messageInput, 'Тестовое сообщение');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/спасибо/i)).not.toBeInTheDocument();
    });
  });

  // Тест 5: Проверка, что кнопка существует и активна
  test('кнопка "Отправить" доступна', () => {
    render(<FeedbackForm />);
    const submitButton = screen.getByRole('button', { name: /отправить/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  // Тест 6: Проверка trim-валидации
  test('не принимает только пробелы как валидный ввод', async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText(/ваше имя/i);
    const messageInput = screen.getByPlaceholderText(/ваше сообщение/i);
    const submitButton = screen.getByRole('button', { name: /отправить/i });

    await userEvent.type(nameInput, '   ');
    await userEvent.type(messageInput, '   ');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/спасибо/i)).not.toBeInTheDocument();
    });
  });
});