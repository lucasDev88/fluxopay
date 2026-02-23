import { Menu, X } from "lucide-react";
import "../../style/App.css"
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [ isOpen, setIsOpen ] = useState(false);

    const navigate = useNavigate()

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between h-16 items-center">
                    
                    <div className="shrink-0 flex items-center">

                        <span className="text-2xl font-bold text-blue-800">
                          FluxoPay
                        </span>

                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#hero" className="text-gray-700 font-medium text-xl hover:text-blue-800 transition-colors">
                            Início
                        </a>

                        <a href="#beneficios" className="text-gray-700 font-medium text-xl hover:text-blue-800 transition-colors">
                            Benefícios
                        </a>

                        <a href="#depoimentos" className="text-gray-700 font-medium text-xl hover:text-blue-800 transition-colors">
                            Depoimentos
                        </a>

                        <a href="#planos" className="text-gray-700 font-medium text-xl hover:text-blue-800 transition-colors">
                            Planos
                        </a>

                        <button onClick={
                          () => {
                            navigate("/login")
                          }
                        } className="bg-blue-800 text-white px-5 py-2 rounded-full font-semibold hover:bg-bule-500 transition-colors shadow-lg shadow-blue-700/30 cursor-pointer">
                            Entrar
                        </button>

                    </div>

                    <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#hero" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Início</a>
              <a href="#benefits" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Benefícios</a>
              <a href="#social-proof" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Depoimentos</a>
              <a href="#pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Planos</a>
              <div className="pt-4">
                <button className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Entrar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
