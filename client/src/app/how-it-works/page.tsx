import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up as an Artist to hire talent or as a Vixen to showcase your portfolio. Complete your profile with high-quality media.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Discover and Connect",
      description: "Artists can browse through vetted profiles, filter by location and rates, and connect directly with talent for their projects.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Secure Booking",
      description: "Agree on terms and book securely through our platform. Payments are held safely until the project is successfully completed.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Raven
            </Link>
            <Link href="/register">
              <Button variant="gradient" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            How Raven Works
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The professional standard for music video production. Simple, secure, and stunning results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative p-8 rounded-2xl bg-zinc-900 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="absolute -top-6 left-8 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 mt-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/5 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to elevate your production?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register?role=artist">
              <Button size="lg" variant="light" className="px-12">Hire Talent</Button>
            </Link>
            <Link href="/register?role=vixen">
              <Button size="lg" variant="outline" className="px-12 border-white/20">Become a Model</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
