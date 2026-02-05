import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { extractYoutubeId, fetchVideoTitle, isValidYoutubeUrl } from "@/lib/youtube"
import { saveVideo } from "@/lib/storage"
import { Video } from "@/types"
import { TagInput } from "@/components/tag-input"

interface AddVideoDialogProps {
  onVideoAdded?: () => void;
}

export function AddVideoDialog({ onVideoAdded }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isFetchingTitle, setIsFetchingTitle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setUrl("")
      setTitle("")
      setTags([])
      setError(null)
      setIsFetchingTitle(false)
    }
  }, [open])

  const handleUrlBlur = async () => {
    const videoId = extractYoutubeId(url)
    if (videoId && !title) {
      setIsFetchingTitle(true)
      setError(null)
      try {
        const fetchedTitle = await fetchVideoTitle(videoId)
        if (fetchedTitle) {
          setTitle(fetchedTitle)
        }
      } catch (err) {
        console.error("Failed to fetch title", err)
        // Don't set error here, just let user type manually
      } finally {
        setIsFetchingTitle(false)
      }
    } else if (url && !videoId) {
      setError("Invalid YouTube URL")
    } else {
      setError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const videoId = extractYoutubeId(url)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title")
      return
    }

    const newVideo: Video = {
      id: crypto.randomUUID(),
      youtubeId: videoId,
      title: title.trim(),
      url: url.trim(),
      tags: tags,
      createdAt: Date.now(),
    }

    try {
      saveVideo(newVideo)
      setOpen(false)
      if (onVideoAdded) {
        onVideoAdded()
      }
    } catch (err) {
      setError("Failed to save video. Storage might be full.")
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>
            Enter a YouTube URL to add it to your library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError(null)
                }}
                onBlur={handleUrlBlur}
                disabled={isFetchingTitle}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <div className="relative">
                <Input
                  id="title"
                  placeholder="Video Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isFetchingTitle}
                />
                {isFetchingTitle && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput 
                tags={tags} 
                onChange={setTags} 
                placeholder="Add tags (Education, React, etc.)"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive font-medium">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isFetchingTitle || !url || !title}>
              Add to Library
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
