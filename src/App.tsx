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

export function App() {
  const [currentTab, setCurrentTab] = React.useState("library")
  const [searchQuery, setSearchQuery] = React.useState("")

  const renderContent = () => {
    switch (currentTab) {
      case "library":
        return (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Library</h2>
              <AddVideoDialog onVideoAdded={() => {
                toast.success("Video added successfully")
                window.dispatchEvent(new CustomEvent("video-added"))
              }} />
            </div>
            <VideoGrid 
              searchQuery={searchQuery} 
              onClearSearch={() => setSearchQuery("")}
            />
          </div>
        )
      case "tags":
        return (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold tracking-tight">Tags</h2>
            <p className="text-muted-foreground">Manage your video tags here.</p>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Education</div>
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Tutorials</div>
              <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Research</div>
            </div>
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
      <AppSidebar currentTab={currentTab} onTabChange={setCurrentTab} />
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