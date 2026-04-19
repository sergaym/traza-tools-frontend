import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  Puzzle,
  Zap,
  GitBranch,
  Code2,
  Shield,
  Terminal,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

const FEATURES = [
  {
    icon: Puzzle,
    title: "200+ integrations",
    description:
      "Connect your entire stack in minutes. Every integration ships with a typed schema your agents can introspect at runtime.",
  },
  {
    icon: Zap,
    title: "Typed tool actions",
    description:
      "Every action is a first-class function with validated inputs and outputs. No more prompt engineering around brittle JSON.",
  },
  {
    icon: GitBranch,
    title: "Real-time triggers",
    description:
      "Subscribe to webhooks, database changes, or scheduled crons. Your agents react to the world, not just user messages.",
  },
  {
    icon: Code2,
    title: "SDK-first",
    description:
      "Drop in our TypeScript or Python SDK with one import. Works with OpenAI, Anthropic, LangChain, and raw model calls.",
  },
  {
    icon: Shield,
    title: "Scoped permissions",
    description:
      "Fine-grained OAuth scopes per integration. Agents get exactly what they need — nothing more.",
  },
  {
    icon: Terminal,
    title: "Full observability",
    description:
      "Every tool call logged with latency, inputs, outputs, and errors. Debug agents like you debug code.",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect your tools",
    description: "OAuth or API key. One click to connect GitHub, Slack, Notion, or your own internal APIs.",
  },
  {
    step: "02",
    title: "Define what your agent can do",
    description: "Pick the actions to expose. Each tool is a typed function the model can call directly.",
  },
  {
    step: "03",
    title: "Ship",
    description: "Drop two lines of SDK code into your agent loop. Traza handles auth, execution, and logging.",
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-5 max-w-3xl mx-auto">
          The tool layer for<br />
          <span style={{ color: "var(--traza-blue)" }}>AI agents</span>
        </h1>

        <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
          Give your agents typed, authenticated access to every tool in your stack.
          Connect integrations, define actions, and ship in minutes — not weeks.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button size="sm" className="h-9 px-5 text-sm gap-1.5" render={<Link href="/dashboard" />} nativeButton={false}>
            Start building
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 px-5 text-sm border-border" render={<Link href="/docs" />} nativeButton={false}>
            Read the docs
          </Button>
        </div>

        <div className="mt-14 max-w-2xl mx-auto text-left">
          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-sm">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-[#f5f5f5]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="text-xs text-[#6e6e6e] ml-2 font-mono">agent.ts</span>
            </div>
            <pre className="px-5 py-4 text-xs font-mono leading-relaxed overflow-x-auto bg-white text-[#1e1e1e]">
              <code>
                <span className="text-[#6a9955]">{"// Connect your stack to any AI agent"}</span>{"\n"}
                <span className="text-[#0000ff]">import</span>
                <span className="text-[#1e1e1e]">{" { "}</span>
                <span className="text-[#267f99]">TrazaClient</span>
                <span className="text-[#1e1e1e]">{" } "}</span>
                <span className="text-[#0000ff]">from</span>
                <span className="text-[#a31515]">{' "@traza/sdk"'}</span>
                {"\n\n"}
                <span className="text-[#0000ff]">const</span>
                <span className="text-[#1e1e1e]">{" traza = "}</span>
                <span className="text-[#0000ff]">new</span>
                <span className="text-[#267f99]">{" TrazaClient"}</span>
                <span className="text-[#1e1e1e]">{"()\n"}</span>
                <span className="text-[#0000ff]">const</span>
                <span className="text-[#1e1e1e]">{" tools = "}</span>
                <span className="text-[#0000ff]">await</span>
                <span className="text-[#1e1e1e]">{" traza."}</span>
                <span className="text-[#795e26]">getTools</span>
                <span className="text-[#1e1e1e]">{"(["}</span>
                <span className="text-[#a31515]">{"\"github\""}</span>
                <span className="text-[#1e1e1e]">{", "}</span>
                <span className="text-[#a31515]">{"\"linear\""}</span>
                <span className="text-[#1e1e1e]">{", "}</span>
                <span className="text-[#a31515]">{"\"slack\""}</span>
                <span className="text-[#1e1e1e]">{"])\n\n"}</span>
                <span className="text-[#6a9955]">{"// Pass to your model directly"}</span>{"\n"}
                <span className="text-[#0000ff]">const</span>
                <span className="text-[#1e1e1e]">{" response = "}</span>
                <span className="text-[#0000ff]">await</span>
                <span className="text-[#1e1e1e]">{" openai.chat.completions."}</span>
                <span className="text-[#795e26]">create</span>
                <span className="text-[#1e1e1e]">{"({\n  model: "}</span>
                <span className="text-[#a31515]">{"\"gpt-4o\""}</span>
                <span className="text-[#1e1e1e]">{",\n  messages,\n  tools,\n})\n\n"}</span>
                <span className="text-[#6a9955]">{"// Execute the tool call"}</span>{"\n"}
                <span className="text-[#0000ff]">await</span>
                <span className="text-[#1e1e1e]">{" traza."}</span>
                <span className="text-[#795e26]">execute</span>
                <span className="text-[#1e1e1e]">{"(response.choices[0].message.tool_calls)"}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
            Everything your agent needs to act
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Stop re-implementing auth, retries, and schema parsing for every new tool.
            Traza handles the plumbing so your agent can focus on reasoning.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-5 rounded-lg border border-border bg-card hover:border-border/80 transition-colors"
            >
              <div className="p-2 rounded-md bg-muted w-fit mb-4">
                <Icon className="w-4 h-4 text-foreground/70" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1.5">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
            Up and running in minutes
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No YAML configs. No infra to manage. Just connect, configure, and go.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, title, description }, i) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center gap-2 pt-0.5">
                <span className="text-xs font-mono font-medium text-muted-foreground/60">{step}</span>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>
              <div className="pb-8">
                <p className="text-sm font-medium text-foreground mb-1.5">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
            Simple pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            Start free. Scale as you go.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              description: "For hobbyists and side projects",
              features: ["5 integrations", "1,000 tool calls/mo", "Community support"],
              cta: "Get started",
              primary: false,
            },
            {
              name: "Pro",
              price: "$49",
              period: "per month",
              description: "For teams shipping production agents",
              features: ["Unlimited integrations", "100,000 tool calls/mo", "Priority support", "Audit logs", "Custom triggers"],
              cta: "Start free trial",
              primary: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              description: "For orgs with advanced requirements",
              features: ["Unlimited everything", "SSO / SAML", "SLA guarantee", "Dedicated support", "On-prem option"],
              cta: "Talk to us",
              primary: false,
            },
          ].map(({ name, price, period, description, features, cta, primary }) => (
            <div
              key={name}
              className={`p-6 rounded-lg border flex flex-col gap-5 ${
                primary
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{name}</p>
                  {primary && (
                    <Badge className="text-xs font-normal bg-primary text-primary-foreground border-0 h-5 px-1.5">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className="text-2xl font-semibold text-foreground">{price}</span>
                  {period && <span className="text-xs text-muted-foreground">{period}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                className="h-8 text-xs w-full"
                variant={primary ? "default" : "outline"}
                render={<Link href="/dashboard" />}
                nativeButton={false}
              >
                {cta}
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
