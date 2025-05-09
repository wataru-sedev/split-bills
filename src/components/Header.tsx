import Link from "next/link"

export const Header = () => {
  return(
    <header className="bg-cyan-500 text-white px-6 py-4" >
      <nav className="flex flex-center gap-6" >
        <Link href="/" className="text-lg font-bold hover:underline" >Walica</Link>
      </nav>
    </header>
  )
}