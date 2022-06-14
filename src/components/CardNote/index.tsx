import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { unselectNote, onChangeNote } from '../../store/note/noteSlice';

import './card-note.css';
import { INote } from '../../store/note/interfaces';
import { EditNote } from '../EditNote';

export const CardNote = () => {
    const {selectedNote: note} = useAppSelector(state => state.notes);
    const dispatch = useAppDispatch();

    return (
        <article className="card-note__container">
            <h2>{note?.title}</h2>
            <span>{note?.description}</span>

            <textarea 
                className="card-note__container-note" 
                value={note?.temporaryNote}
                onChange={(e) => dispatch(onChangeNote({...note, temporaryNote: e.target.value} as INote))}    
            >
            </textarea>

            <EditNote/>
        </article>
    )
}