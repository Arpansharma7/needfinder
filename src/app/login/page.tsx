import { login, signup } from './actions'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col items-center justify-center relative p-6">
      
      {/* Background visual flair */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {searchParams.message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${searchParams.error ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
            {searchParams.message}
          </div>
        )}

        <div className="bg-card-dark rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h1 className="headline-font text-4xl mb-2 tracking-wide uppercase">Welcome</h1>
          <p className="text-slate-400 mb-8">Sign in or create an account to start tracking deals and making API queries.</p>

          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-300 mb-2" htmlFor="email">Email</label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold uppercase tracking-widest text-slate-300 mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              formAction={login}
              className="w-full py-4 rounded-full bg-primary text-background-dark font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all outline-none"
            >
              Sign In
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              formAction={signup}
              className="w-full py-4 rounded-full bg-transparent border border-white/20 text-slate-300 font-bold uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all outline-none"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
