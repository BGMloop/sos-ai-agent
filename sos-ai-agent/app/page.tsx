import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 flex items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#e5e5f7] bg-opacity-30" style={{
        backgroundImage: `linear-gradient(30deg, #111010 12%, transparent 12.5%, transparent 87%, #111010 87.5%, #111010), 
                         linear-gradient(150deg, #111010 12%, transparent 12.5%, transparent 87%, #111010 87.5%, #111010),
                         linear-gradient(30deg, #111010 12%, transparent 12.5%, transparent 87%, #111010 87.5%, #111010),
                         linear-gradient(150deg, #111010 12%, transparent 12.5%, transparent 87%, #111010 87.5%, #111010),
                         linear-gradient(60deg, #11101077 25%, transparent 25.5%, transparent 75%, #11101077 75%, #11101077),
                         linear-gradient(60deg, #11101077 25%, transparent 25.5%, transparent 75%, #11101077 75%, #11101077)`,
        backgroundSize: "40px 70px",
        backgroundPosition: "0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px"
      }} />

      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
        {/* Hero content */}
        <header className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-indigo-600 via-black to-black bg-clip-text text-transparent">
            SOS AI Agent
          </h1>
          <p className="max-w-[600px] text-lg text-gray-700 md:text-xl/relaxed xl:text-2xl/relaxed">
            Your AI-powered emergency assistant that goes beyond basic help - it
            can coordinate responses and get you the support you need!
            <br />
            <span className="text-gray-500 text-sm font-medium">
              Powered by IBM&apos;s WxTools & your favourite LLM&apos;s.
            </span>
          </p>
        </header>

        {/* CTA Button */}
        <SignedIn>
          <Link href="/dashboard">
            <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-black rounded-full hover:from-indigo-500 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-black/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            forceRedirectUrl={"/dashboard"}
          >
            <button className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-black rounded-full hover:from-indigo-500 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/20 to-black/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </SignInButton>
        </SignedOut>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-8 max-w-3xl mx-auto">
          {[
            { title: "Instant", description: "Real-time streamed responses" },
            {
              title: "Reliable",
              description: "Next.js 15, Tailwind CSS, Convex, Clerk",
            },
            { title: "Intelligent", description: "Powered by Your Favourite LLM's" },
          ].map(({ title, description }) => (
            <div key={title} className="text-center">
              <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-black bg-clip-text text-transparent">
                {title}
              </div>
              <div className="text-sm text-gray-600 mt-1">{description}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
