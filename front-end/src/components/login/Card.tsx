import { useState } from "react";
import { motion } from "framer-motion";
import "../../style/input.css"
import { loginAuth } from "../../_services/auth"
import { useAuth } from "../../_services/authContext"
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState("")

  const navigate = useNavigate()
  const { setLogged } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await loginAuth({
        email,
        password
      })

      setLogged(true)
      navigate("/dashboard")

    } catch (err) {
      setError(`Credenciais inválidas: ${err}`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-700">FluxoPay</h1>
            <p className="text-slate-500 mt-2">Acesse sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Lembrar de mim
              </label>
              <a href="#" className="text-blue-700 font-medium hover:underline">
                Esqueci a senha
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 shadow-lg shadow-blue-700/30 transition"
            >
              { loading ? "Entrando" : "Entrar" }
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-400">ou</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Secondary action */}
          <button onClick={() => {
            navigate("/signup")
          }} className="w-full rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50 transition">
            Criar conta grátis
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} FluxoPay — FinTech
        </p>
      </motion.div>
    </div>
  );
}
