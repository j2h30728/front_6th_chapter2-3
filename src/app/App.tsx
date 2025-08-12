import Footer from "@/components/Footer.tsx"
import Header from "@/components/Header.tsx"

import { AppProvider } from "./providers"
import { AppRouter } from "./routing/AppRouter"

const App = () => {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
