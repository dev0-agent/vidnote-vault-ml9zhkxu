import * as React from "react"
import { Trash2, Play } from "lucide-react"
import { Video } from "@/types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditVideoDialog } from "./edit-video-dialog"

interface VideoCardProps {
  video: Video
  onDelete: (id: string) => void
  onSelect: (video: Video) => void
  onTagClick?: (tag: string) => void
  onVideoUpdated?: () => void
}

export function VideoCard({ video, onDelete, onSelect, onTagClick, onVideoUpdated }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`

  return (
    <Card className="overflow-hidden group flex flex-col h-full">
      <div 
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={() => onSelect(video)}
      >
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
            <Play className="h-6 w-6 fill-current" />
          </div>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle 
          className="text-lg leading-tight line-clamp-2 hover:text-primary cursor-pointer"
          onClick={() => onSelect(video)}
        >
          {video.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className="flex flex-wrap gap-1 mt-2">
          {video.tags.length > 0 ? (
            video.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0 cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
              >
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">No tags</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-1">
        <EditVideoDialog 
          video={video} 
          onVideoUpdated={onVideoUpdated}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete video</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{video.title}" and all its associated notes. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(video.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
