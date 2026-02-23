import Header from "../../components/home/Header"
import { Hero } from "../../components/home/Hero"
import Plans from "../../components/home/Plans"
import "../../style/App.css"

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">

            <Header />

            <main>
                <Hero />
                <Plans />
            </main>

        </div>
    )
}