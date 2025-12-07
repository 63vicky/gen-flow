import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Workflow, Zap, GitBranch, Layers } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">FlowStudio</span>
          </div>
          <Link href="/workflows">
            <Button>
              Open Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Build Workflows
          <br />
          <span className="text-muted-foreground">Without Code</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Create powerful automation workflows with a visual drag-and-drop editor. Connect APIs, set conditions, and
          automate your business processes.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/workflows">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Everything you need</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Triggers</h3>
              <p className="text-sm text-muted-foreground">
                Start workflows with webhooks, schedules, or manual triggers.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Logic</h3>
              <p className="text-sm text-muted-foreground">
                Add conditions, loops, and branching to create complex flows.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Integrations</h3>
              <p className="text-sm text-muted-foreground">Connect to APIs, send emails, Slack messages, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Next.js and React Flow
        </div>
      </footer>
    </div>
  )
}
