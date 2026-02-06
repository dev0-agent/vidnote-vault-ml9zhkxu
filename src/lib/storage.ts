import { z } from 'zod';
import { Video, Note, Library } from '../types';

const VideoSchema = z.object({
  id: z.string(),
  youtubeId: z.string(),
  title: z.string(),
  url: z.string(),
  tags: z.array(z.string()),
  createdAt: z.number(),
});

const NoteSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  timestamp: z.number(),
  content: z.string(),
  createdAt: z.number(),
});

const LibrarySchema = z.object({
  videos: z.array(VideoSchema),
  notes: z.array(NoteSchema),
});

const STORAGE_KEY = 'vidnote-vault-library';

/**
 * Retrieves the entire library from localStorage.
 * Validates the data using Zod to ensure it matches the expected schema.
 */
export const getLibrary = (): Library => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { videos: [], notes: [] };
    }
    
    const parsed = JSON.parse(data);
    const result = LibrarySchema.safeParse(parsed);
    
    if (!result.success) {
      console.error('Library data validation failed:', result.error);
      return { videos: [], notes: [] };
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to read library from localStorage:', error);
    return { videos: [], notes: [] };
  }
};

/**
 * Overwrites the entire library in localStorage with new data.
 * Validates the data before saving.
 */
export const replaceLibrary = (data: unknown): void => {
  const result = LibrarySchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid library data format.');
  }
  saveLibrary(result.data);
  window.dispatchEvent(new CustomEvent('library-updated'));
};

/**
 * Persists the entire library to localStorage.
 * Handles quota limits by throwing a user-friendly error.
 */
const saveLibrary = (library: Library): void => {
  try {
    const data = JSON.stringify(library);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      throw new Error('Storage quota exceeded. Please delete some videos or notes to free up space.');
    }
    console.error('Failed to save library to localStorage:', error);
    throw error;
  }
};

/**
 * Saves a video to the library. If the video already exists (by ID), it updates it.
 */
export const saveVideo = (video: Video): void => {
  const library = getLibrary();
  const existingIndex = library.videos.findIndex((v) => v.id === video.id);
  
  if (existingIndex > -1) {
    library.videos[existingIndex] = video;
  } else {
    library.videos.push(video);
  }
  
  saveLibrary(library);
};

/**
 * Deletes a video and all its associated notes from the library.
 */
export const deleteVideo = (videoId: string): void => {
  const library = getLibrary();
  library.videos = library.videos.filter((v) => v.id !== videoId);
  library.notes = library.notes.filter((n) => n.videoId !== videoId);
  saveLibrary(library);
};

/**
 * Adds a note to the library. If a note with the same ID exists, it updates it.
 */
export const addNote = (note: Note): void => {
  const library = getLibrary();
  const existingIndex = library.notes.findIndex((n) => n.id === note.id);
  
  if (existingIndex > -1) {
    library.notes[existingIndex] = note;
  } else {
    library.notes.push(note);
  }
  
  saveLibrary(library);
};

/**
 * Deletes a specific note from the library by its ID.
 */
export const deleteNote = (noteId: string): void => {
  const library = getLibrary();
  library.notes = library.notes.filter((n) => n.id !== noteId);
  saveLibrary(library);
};

/**
 * Searches the library for videos matching the query string.
 * Checks video title, tags, and content of associated notes.
 * Can optionally accept a library object to avoid re-reading from localStorage.
 */
export const searchLibrary = (query: string, library: Library = getLibrary()): Video[] => {
  if (!query.trim()) {
    return library.videos;
  }

  const searchLower = query.toLowerCase();

  return library.videos.filter((video) => {
    // Check video title
    if (video.title.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Check tags
    if (video.tags.some((tag) => tag.toLowerCase().includes(searchLower))) {
      return true;
    }

    // Check associated notes
    const videoNotes = library.notes.filter((n) => n.videoId === video.id);
    if (videoNotes.some((note) => note.content.toLowerCase().includes(searchLower))) {
      return true;
    }

    return false;
  });
};
