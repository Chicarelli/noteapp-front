export interface INote {
    id: string;
    title: string;
    description: string;
    note: string;
    temporaryNote: string;
}

export interface NoteState {
    list: INote[],
    isLoading: boolean,
    isActionLoading: boolean,
    selectedNote?: INote|null,
}