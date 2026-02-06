import * as React from "react"
import { Video, Library } from "@/types"
import { getLibrary, deleteVideo, searchLibrary } from "@/lib/storage"
import { VideoCard } from "@/components/video-card"
import { toast } from "sonner"
import { LayoutGrid, List, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddVideoDialog } from "@/components/add-video-dialog"

interface VideoGridProps {
  searchQuery?: string
  onClearSearch?: () => void
  onVideoSelect?: (video: Video) => void
  onTagClick?: (tag: string) => void
}

export function VideoGrid({ searchQuery = "", onClearSearch, onVideoSelect, onTagClick }: VideoGridProps) {
  const [library, setLibrary] = React.useState<Library>({ videos: [], notes: [] })
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  const loadLibrary = React.useCallback(() => {
    setLibrary(getLibrary())
  }, [])

  React.useEffect(() => {
    loadLibrary()
    // Listen for storage changes in other tabs
    window.addEventListener("storage", loadLibrary)
    return () => window.removeEventListener("storage", loadLibrary)
  }, [loadLibrary])

  // Custom event listener for when the library is updated (video added, updated, or deleted)
  React.useEffect(() => {
    const handleLibraryUpdated = () => loadLibrary()
    window.addEventListener("library-updated", handleLibraryUpdated)
    return () => window.removeEventListener("library-updated", handleLibraryUpdated)
  }, [loadLibrary])

  const handleDelete = (id: string) => {
    deleteVideo(id)
    window.dispatchEvent(new CustomEvent("library-updated"))
    loadLibrary()
    toast.success("Video deleted")
  }

  const filteredVideos = React.useMemo(() => {
    return searchLibrary(searchQuery, library).sort((a, b) => b.createdAt - a.createdAt)
  }, [searchQuery, library])

  if (library.videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl bg-muted/30 p-8 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <LayoutGrid className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Your library is empty</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mb-6">
          Start by adding a YouTube video URL to your collection.
        </p>
        <AddVideoDialog onVideoAdded={() => {
          toast.success("Video added successfully")
          window.dispatchEvent(new CustomEvent("library-updated"))
          loadLibrary()
        }} />
      </div>
    )
  }

  if (filteredVideos.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-muted-foreground">No videos found matching "{searchQuery}"</p>
        {onClearSearch && (
          <Button 
            variant="link" 
            onClick={onClearSearch}
            className="mt-2"
          >
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVideos.length} video{filteredVideos.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
      }>
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onDelete={handleDelete}
            onSelect={onVideoSelect || (() => {})}
            onTagClick={onTagClick}
            onVideoUpdated={loadLibrary}
          />
        ))}
      </div>
    </div>
  )
}