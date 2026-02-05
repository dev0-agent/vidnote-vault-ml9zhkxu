import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { AddVideoDialog } from "@/components/add-video-dialog"
import { VideoGrid } from "@/components/video-grid"
import { VideoDetailView } from "@/components/video-detail-view"
import { Video } from "@/types"
import { getLibrary } from "@/lib/storage"

export function App() {
  const [currentTab, setCurrentTab] = React.useState("library")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null)
  const [libraryVersion, setLibraryVersion] = React.useState(0)

  React.useEffect(() => {
    const handleLibraryUpdated = () => setLibraryVersion(v => v + 1)
    window.addEventListener("library-updated", handleLibraryUpdated)
    window.addEventListener("storage", handleLibraryUpdated)
    return () => {
      window.removeEventListener("library-updated", handleLibraryUpdated)
      window.removeEventListener("storage", handleLibraryUpdated)
    }
  }, [])

  const allTags = React.useMemo(() => {
    const library = getLibrary()
    const tags = new Set<string>()
    library.videos.forEach(v => v.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [libraryVersion])

  const renderContent = () => {
    if (selectedVideo) {
      return (
        <VideoDetailView 
          video={selectedVideo} 
          onBack={() => setSelectedVideo(null)} 
        />
      )
    }

    switch (currentTab) {
      case "library":
        return (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Library</h2>
              <AddVideoDialog onVideoAdded={() => {
                toast.success("Video added successfully")
                window.dispatchEvent(new CustomEvent("library-updated"))
              }} />
            </div>
            <VideoGrid 
              searchQuery={searchQuery} 
              onClearSearch={() => setSearchQuery("")}
              onVideoSelect={setSelectedVideo}
              onTagClick={(tag) => setSearchQuery(tag)}
            />
          </div>
        )
      case "tags":
        return (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
            <p className="text-muted-foreground">Browse videos by tag.</p>
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag)
                      setCurrentTab("library")
                    }}
                    className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-xl bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">No tags found. Add tags to your videos to see them here.</p>
              </div>
            )}
          </div>
        )
      case "settings":
        return (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <div className="max-w-2xl space-y-6">
              <section>
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-muted-foreground mb-4">Export your library or import from a backup.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Export Library</button>
                  <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium">Import Library</button>
                </div>
              </section>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getPageTitle = () => {
    if (selectedVideo) return selectedVideo.title
    switch (currentTab) {
      case "library":
        return "Library"
      case "tags":
        return "Tags"
      case "settings":
        return "Settings"
      default:
        return ""
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab)
          setSelectedVideo(null)
        }} 
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex-1 ml-auto max-w-sm relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search videos and notes..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-y-auto">
          {renderContent()}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default App;