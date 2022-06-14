import { EditNote } from "./index";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom";
import { store } from "../../store/store";
import { Provider } from "react-redux";
import { selectNote, onChangeNote, fetchAllNotes, onSaveChange } from "../../store/note/noteSlice";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { INote } from "../../store/note/interfaces";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

const server = setupServer(
    rest.get('http://localhost:8000/note',  (_, res, ctx) => {
      return res(
        ctx.text(JSON.stringify([{id: '123', title: 'titulo1', description: 'descricao1', note: 'note1'}]))
      )
    }),
    rest.patch('http://localhost:8000/note/*', (_, res, ctx) => {
        return res(
            ctx.text(JSON.stringify({id: '123', title: 'titulo1', description: 'descricao1', note: 'note1 a', temporaryNote: 'note1 a'}))
        )
    })
);

const renderComponent = () => {
    return render(
        <Provider store={store}>
            <EditNote/>
        </Provider>
    )
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('Component EditNote', () => {

    beforeEach( async () => {
        await store.dispatch(fetchAllNotes());
        store.dispatch(selectNote({id: '123', title: 'titulo1', description: 'descricao1', note: 'note1', temporaryNote: 'note1 a'} as INote))
    });

    it ("exists save button and cancel button", () => {
        renderComponent();

        expect(screen.getByText('Salvar alterações')).toBeInTheDocument()
        expect(screen.getByText('Desfazer alterações')).toBeInTheDocument();
    });

    it ('buttons disappear after click on cancel button', async () => {
        renderComponent();
        const cancelButton = screen.getByText('Desfazer alterações');
        userEvent.click(cancelButton);

        expect(cancelButton).not.toBeInTheDocument();
    })

    it ('on cancel temporaryNote is equal note', () => {
        renderComponent();
        const cancelButton = screen.getByText('Desfazer alterações');

        userEvent.click(cancelButton);

        expect(store.getState().notes.selectedNote?.temporaryNote).toEqual('note1');
    });

    it ('on save, note is equal temporaryNote', async () => {
        renderComponent();

        await act(async () => {
            await store.dispatch(onSaveChange({id: '123', title: 'titulo1', description: 'descricao1', note: 'note1', temporaryNote: 'note1 a'}))
        })

        expect(store.getState().notes.selectedNote?.note).toEqual('note1 a');
    })

})