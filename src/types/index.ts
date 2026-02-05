export type Video = {
  id: string;
  youtubeId: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: number;
};

export type Note = {
  id: string;
  videoId: string;
  timestamp: number;
  content: string;
  createdAt: number;
};

export type Library = {
  videos: Video[];
  notes: Note[];
};
