import { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { selectNote, fetchAllNotes } from '../store/note/noteSlice';

import { INote } from '../store/note/interfaces';
import { CardNote } from '../components/CardNote';
import  './page-note.css';

function Notes() {
  const notes = useAppSelector((state) => state.notes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [])

  return (
    <> 
       <div className="page-note__container">
        {notes.isLoading && 'Está carregando!'}

        { !notes.isLoading && (<>
          <aside className="page-note__container-aside">
          { notes.list.map((note: INote) => (
            <section className="page-note__container-aside-card" key={note.id}>
              <button 
                className="page-note__container-aside-card-title" 
                onClick={() => dispatch(selectNote(note))}
              >
                {note.title}
              </button>
              <p>{note.description}</p>
            </section>
          ))}
          </aside>
          <main className="page-note__container-main">
            { !notes.selectedNote && <p>...</p>}
            { notes.selectedNote  && <CardNote/>}
          </main>
        </>)}
        
      </div>
    </>
  );
}

export default Notes;
