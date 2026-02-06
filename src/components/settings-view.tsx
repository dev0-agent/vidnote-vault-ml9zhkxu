import * as React from "react"
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
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
import { toast } from "sonner"
import { getLibrary, replaceLibrary } from "@/lib/storage"

export function SettingsView() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      const library = getLibrary()
      const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `vidnote-vault-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("Library exported successfully")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Failed to export library")
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        replaceLibrary(data)
        toast.success("Library imported successfully")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error("Import failed:", error)
        toast.error(error instanceof Error ? error.message : "Failed to import library. Please ensure the file is a valid JSON backup.")
      }
    }
    reader.onerror = () => {
      toast.error("Failed to read file")
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    try {
      replaceLibrary({ videos: [], notes: [] })
      toast.success("All data cleared")
    } catch (error) {
      toast.error("Failed to clear data")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your library data and application preferences.
        </p>
      </div>

      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export your library to a file for backup, or import data from a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download your entire library including videos, notes, and tags as a JSON file.
                </p>
                <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export Library
                </Button>
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-medium">Import Data</h4>
                <p className="text-sm text-muted-foreground">
                  Restore your library from a previously exported JSON file. This will replace your current data.
                </p>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Library
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that will permanently delete your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Clear All Data</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all videos, notes, and tags from this browser.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      entire library of videos and notes from this browser.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
