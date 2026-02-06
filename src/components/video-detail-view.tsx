import * as React from "react"
import { ArrowLeft, Clock, Save, Play, Trash2 } from "lucide-react"
import { Video, Note } from "@/types"
import { VideoPlayer, VideoPlayerRef } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addNote, getLibrary, deleteNote } from "@/lib/storage"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VideoDetailViewProps {
  video: Video
  onBack: () => void
}

export function VideoDetailView({ video, onBack }: VideoDetailViewProps) {
  const playerRef = React.useRef<VideoPlayerRef>(null)
  const [noteContent, setNoteContent] = React.useState("")
  const [noteTimestamp, setNoteTimestamp] = React.useState<number | null>(null)
  const [notes, setNotes] = React.useState<Note[]>([])

  const loadNotes = React.useCallback(() => {
    const library = getLibrary()
    const videoNotes = library.notes
      .filter((n) => n.videoId === video.id)
      .sort((a, b) => a.timestamp - b.timestamp)
    setNotes(videoNotes)
  }, [video.id])

  React.useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleInputFocus = () => {
    playerRef.current?.pauseVideo()
  }

  const handleCaptureTimestamp = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0
    setNoteTimestamp(currentTime)
  }

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast.error("Please enter some content for the note")
      return
    }

    const timestampToSave = noteTimestamp !== null ? noteTimestamp : (playerRef.current?.getCurrentTime() || 0)

    const newNote: Note = {
      id: crypto.randomUUID(),
      videoId: video.id,
      timestamp: timestampToSave,
      content: noteContent,
      createdAt: Date.now(),
    }

    addNote(newNote)
    toast.success("Note saved!")
    setNoteContent("")
    setNoteTimestamp(null)
    loadNotes()
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    toast.success("Note deleted")
    loadNotes()
  }

  const handleSeek = (timestamp: number) => {
    playerRef.current?.seekTo(timestamp, true)
    playerRef.current?.playVideo()
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 lg:overflow-hidden">
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold truncate">{video.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-[250px] sm:min-h-[300px] lg:min-h-0 sticky top-0 z-10 bg-background lg:relative lg:top-auto lg:z-0 lg:bg-transparent py-2 lg:py-0">
          <div className="aspect-video bg-black rounded-lg overflow-hidden border shadow-sm">
            <VideoPlayer
              ref={playerRef}
              videoId={video.youtubeId}
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0 pb-4 lg:pb-0">
          <div className="bg-card border rounded-lg p-4 space-y-4 shrink-0 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Add Note
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <span className="text-sm text-muted-foreground">
                   Timestamp: {noteTimestamp !== null ? formatTime(noteTimestamp) : "--:--"}
                 </span>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleCaptureTimestamp}
                   className="h-8 text-xs"
                 >
                   Capture Timestamp
                 </Button>
              </div>
              
              <Textarea
                placeholder="Type your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                onFocus={handleInputFocus}
                className="min-h-[100px] resize-none"
              />
              
              <Button onClick={handleSaveNote} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </div>
          </div>
          
          <div className="flex-1 bg-muted/20 rounded-lg border flex flex-col min-h-0 shadow-sm">
             <div className="p-4 border-b bg-muted/40">
                <h3 className="font-semibold">Notes ({notes.length})</h3>
             </div>
             <ScrollArea className="flex-1">
               {notes.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground">
                   <p className="text-sm">No notes yet. Add one above!</p>
                 </div>
               ) : (
                 <div className="flex flex-col divide-y">
                   {notes.map((note) => (
                     <div 
                       key={note.id} 
                       className="p-4 hover:bg-muted/50 transition-colors group"
                     >
                       <div className="flex items-start gap-3">
                         <button
                           onClick={() => handleSeek(note.timestamp)}
                           className="flex items-center gap-1.5 text-xs font-mono font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors shrink-0 mt-0.5"
                           title="Jump to timestamp"
                         >
                           <Play className="h-3 w-3" />
                           {formatTime(note.timestamp)}
                         </button>
                         <div className="flex-1 space-y-1">
                           <div className="flex items-start justify-between gap-2">
                             <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                               onClick={() => handleDeleteNote(note.id)}
                             >
                               <Trash2 className="h-3 w-3" />
                               <span className="sr-only">Delete note</span>
                             </Button>
                           </div>
                           <p className="text-[10px] text-muted-foreground">
                             {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
