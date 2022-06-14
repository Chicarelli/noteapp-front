import { INote } from './../store/note/interfaces';
import { Fetch } from '../services/fetch';

class NoteRepository {
    private fetch = new Fetch();

    async getAllNotes() {
        return await this.fetch.get('/note');
    }

    async createNote(note: INote) {
        return await this.fetch.post('/note', note);
    }

    async getOneNote(id: string) {
        return await this.fetch.get(`/note/${id}`);
    }

    async editNote(note: INote) {
        return await this.fetch.patch(`/note/${note.id}`, note);
    }

    async deleteNote(id: string) {
        return await this.fetch.delete(`/note/${id}`);
    }
}

export const noteRepository = new NoteRepository();
