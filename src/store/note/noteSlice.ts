import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noteRepository } from '../../repository/NoteRepository';
import { INote, NoteState } from './interfaces';

const initialState: NoteState = {
    list: [],
    isLoading: false,
    selectedNote: null,
    isActionLoading: false,
}

const fetchAllNotes = createAsyncThunk(
    'note/fetchAllNotes',
    async() => {
        let result: INote[] = await noteRepository.getAllNotes();

        result = result.map(note => ({
            ...note,
            temporaryNote: note.note
        }));

        return result;
    }
)

const onSaveChange = createAsyncThunk(
    'note/updateOneNote',
    async(note: INote) => {
        try {
            let result: INote = await noteRepository.editNote({
                ...note,
                note: note.temporaryNote
            });
            return result;
        }
        catch(error) {
            return ({
                ...note,
                temporaryNote: note.note
            })
        }
    }
)

export const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<INote>) => {
            const newNotes: INote[] = state.list;
            newNotes.push(action.payload);
            state.list = newNotes;
        },

        selectNote: (state, action: PayloadAction<INote>) => {
            state.selectedNote = action.payload;
        },

        unselectNote: (state) => {
            state.selectedNote = null;
        },

        onChangeNote: (state, action: PayloadAction<INote>) => {
            state.list = state.list.map((singleNote) => {
                if (singleNote.id === action.payload.id) {
                    return action.payload
                }
                return singleNote
            });

            if (state.selectedNote) {
                state.selectedNote = state.list.find(item => item.id === state.selectedNote?.id);
            }
        },

        onUndoChange: (state, action: PayloadAction<INote>) => {
            state.list = state.list.map((singleNote) => {
                if (singleNote.id === action.payload.id) {
                    return ({
                        ...singleNote,
                        temporaryNote: singleNote.note
                    })
                }
                return singleNote;
            })

            if (state.selectedNote) {
                state.selectedNote = state.list.find(singleNote => singleNote.id === state.selectedNote?.id);
            }
        },

    },

    extraReducers: (builder) => {
        builder.addCase(fetchAllNotes.pending, (state, action) => {
            state.isLoading = true;
        });

        builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });

        builder.addCase(onSaveChange.pending, (state, action) => {
            state.isActionLoading = true;
        })

        builder.addCase(onSaveChange.fulfilled, (state, action) => {
            state.list = state.list.map((singleNote) => {
                if (singleNote.id === action.payload.id) {
                    console.log('found');
                    return ({
                        ...action.payload
                    })
                }
                return singleNote;
            });

            if (state.selectedNote) {
                state.selectedNote = state.list.find(singleNote => singleNote.id === state.selectedNote?.id);
            }

            state.isActionLoading = false;
        })
    }
})

export const { 
    addNote,
    selectNote, 
    unselectNote, 
    onChangeNote,
    onUndoChange,
} = noteSlice.actions;

export { fetchAllNotes, onSaveChange };
