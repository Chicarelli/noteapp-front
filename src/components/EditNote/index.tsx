import './edit-note.css';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { onUndoChange, onSaveChange } from '../../store/note/noteSlice';
import { INote } from '../../store/note/interfaces';

export const EditNote = () => {
    const note: INote = useAppSelector(state => state.notes.selectedNote as INote);
    const {isActionLoading} = useAppSelector(state => state.notes);

    const dispatch = useAppDispatch();

    return (
        <div className="edit-note__container">

            {isActionLoading && 'salvando'}
            { note?.temporaryNote !== note?.note && (
            <>
                <button 
                    className="button cancel"
                    onClick={() => dispatch(onUndoChange(note))}
                    disabled={isActionLoading}
                    data-testid="undoChange"
                >
                    Desfazer alterações
                </button>

                <button 
                    className="button save"
                    onClick={() => dispatch(onSaveChange(note))}
                    disabled={isActionLoading}
                    data-testid="saveChange"
                >Salvar alterações</button>
            </>
            )}
        </div>
    )
}