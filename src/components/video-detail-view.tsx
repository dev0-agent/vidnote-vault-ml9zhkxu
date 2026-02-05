import * as React from "react"
import { ArrowLeft, Clock, Save } from "lucide-react"
import { Video } from "@/types"
import { VideoPlayer, VideoPlayerRef } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addNote } from "@/lib/storage"
import { toast } from "sonner"

interface VideoDetailViewProps {
  video: Video
  onBack: () => void
}

export function VideoDetailView({ video, onBack }: VideoDetailViewProps) {
  const playerRef = React.useRef<VideoPlayerRef>(null)
  const [noteContent, setNoteContent] = React.useState("")
  const [noteTimestamp, setNoteTimestamp] = React.useState<number | null>(null)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleInputFocus = () => {
    playerRef.current?.pauseVideo()
    // Optional: Auto-capture time on focus if not already set?
    // prompt says: "When the user focuses the input, pause the video. Include a button to 'Capture Timestamp'..."
    // I will strictly follow pausing. User can click button to capture.
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

    // Default to current time if not captured? Or 0?
    // Let's force a timestamp or default to current player time if null.
    const timestampToSave = noteTimestamp !== null ? noteTimestamp : (playerRef.current?.getCurrentTime() || 0)

    const newNote = {
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
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold truncate">{video.title}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-[300px]">
          <div className="aspect-video bg-black rounded-lg overflow-hidden border">
            <VideoPlayer
              ref={playerRef}
              videoId={video.youtubeId}
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-card border rounded-lg p-4 space-y-4">
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
          
          {/* Placeholder for Note List - possibly next task */}
          <div className="flex-1 bg-muted/20 rounded-lg border p-4">
             <p className="text-sm text-muted-foreground text-center mt-4">Saved notes will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
