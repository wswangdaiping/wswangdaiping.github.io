
export type ContentType = 'blog' | 'note';

export interface Entry {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  entries: Entry[];
  activeEntryId: string | null;
  searchQuery: string;
  isSidebarOpen: boolean;
  view: 'edit' | 'preview' | 'ai-chat';
}
