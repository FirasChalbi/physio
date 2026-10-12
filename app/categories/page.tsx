import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import Logo from "@/components/Logo"
import connectDB from "@/lib/mongodb"
import { getCategoryModel } from "@/lib/models/Category"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Catégories — LifeDeal",
  description: "Découvrez toutes les catégories d'offres locales sur LifeDeal.",
  alternates: { canonical: "https://life-app.fr/categories" },
}

export default async function CategoriesPage() {
  await connectDB()
  const categories = await getCategoryModel()
    .find({ active: true }, { name: 1, slug: 1, description: 1 })
    .sort({ order: 1, name: 1 })
    .lean()

  return (
    <main className="min-h-screen" style={{ background: "var(--surface-0)" }}>
      <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--header-bg)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Logo size="lg" />
          <div className="flex-1" />
          <Link href="/" className="text-sm text-[#8888a0] hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Catégories</h1>
        <p className="text-[#8888a0] mb-8">Explorez les offres locales par catégorie.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${encodeURIComponent(category.slug)}`}
              className="rounded-2xl border p-5 transition-colors hover:border-[#FF2D55]"
              style={{ background: "var(--surface-1)", borderColor: "var(--card-border)" }}
            >
              <Tag className="w-6 h-6 text-[#FF2D55] mb-4" />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{category.name}</h2>
              {category.description && <p className="text-sm text-[#8888a0] mt-2">{category.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}