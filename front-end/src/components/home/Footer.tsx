import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {

  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              FluxoPay
            </span>
            <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
              Transforme sua vida financeira com inteligência artificial. 
              Previsibilidade e controle para profissionais modernos.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Twitter size={18} className="text-zinc-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Linkedin size={18} className="text-zinc-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <Github size={18} className="text-zinc-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#beneficios" className="text-zinc-400 hover:text-white transition-colors">Benefícios</a></li>
              <li><a href="#planos" className="text-zinc-400 hover:text-white transition-colors">Planos</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Atualizações</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-zinc-400">
                <Mail size={16} />
                <span>contato@fluxopay.com</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <Phone size={16} />
                <span>+55 (11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <MapPin size={16} />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>© 2026 FluxoPay. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
