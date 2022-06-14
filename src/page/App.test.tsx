import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import App from './Note';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import "@testing-library/jest-dom";
import { noteRepository } from '../repository/NoteRepository';
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.get('http://localhost:8000/note',  (_, res, ctx) => {
    return res(
      ctx.text(JSON.stringify([{id: '123', title: 'titulo1', description: 'descricao1', note: 'note1'}]))
    )
  })
)

const componente = () => render(<Provider store={store}><App/></Provider>)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Page Note', () => {
  
  it(`should show loading message`, () => {
    componente()
    const message = screen.getByText("Está carregando!");

    expect(message).toBeInTheDocument();
  });

  it('loading message should disappear', async () => {
    componente()
    await waitFor(() => {
      expect(screen.queryByText('Está carregando!')).not.toBeInTheDocument();
    })
  });

  it('should appear "..." when none note is selected', async () => {
    componente()
    
    await waitFor(() => {
      expect(screen.getByText('...')).toBeInTheDocument();
    })
  })
  
  it('Should list a note', async () => {
    componente()

    await waitFor(() => {
      expect(screen.getByText('titulo1')).toBeInTheDocument();
    })
  });

  it ('When click on title, note should appear', async () => {
    componente();

    const button = await waitFor(() => {
      return screen.getByRole("button", { name: 'titulo1' })
    })

    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('note1')).toBeInTheDocument();
    })
  })
});

