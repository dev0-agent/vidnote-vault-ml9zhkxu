import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { saveVideo } from "@/lib/storage"
import { Video } from "@/types"
import { TagInput } from "@/components/tag-input"
import { toast } from "sonner"

interface EditVideoDialogProps {
  video: Video;
  onVideoUpdated?: () => void;
  trigger?: React.ReactNode;
}

export function EditVideoDialog({ video, onVideoUpdated, trigger }: EditVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(video.title)
  const [tags, setTags] = useState<string[]>([...video.tags])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTitle(video.title)
      setTags([...video.tags])
      setError(null)
    }
  }, [open, video])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError("Please enter a title")
      return
    }

    const updatedVideo: Video = {
      ...video,
      title: title.trim(),
      tags: tags,
    }

    try {
      saveVideo(updatedVideo)
      window.dispatchEvent(new CustomEvent("library-updated"))
      toast.success("Video updated successfully")
      setOpen(false)
      if (onVideoUpdated) {
        onVideoUpdated()
      }
    } catch (err) {
      setError("Failed to save video.")
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit video</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
          <DialogDescription>
            Update the title and tags for your video.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                value={video.url}
                disabled
                className="bg-muted"
              />
              <p className="text-[10px] text-muted-foreground">URL cannot be changed.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
            <Button type="submit" disabled={!title}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
