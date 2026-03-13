'use client'

import { useState, useEffect } from "react"
import { Calendar, Sparkles, MapPin, Phone, Mail, Instagram, Facebook, Package, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BottomMobileNav } from "@/components/bottom-mobile-nav"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import InstagramSwiper from "@/components/instagram-swiper"
import { TestimonialSlider } from "@/components/testimonial-slider"

// Static fallback data for the design
const servicesHighlights = [
  {
    category: "Signature",
    title: "Soin Signature Physio",
    features: [
      "Diagnostic de peau personnalisé",
      "Nettoyage profond Hydrafacial",
      "Infusion de sérums spécifiques",
      "Massage liftant manuel"
    ],
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "Lifting",
    title: "Rajeunissement & Anti-âge",
    features: [
      "HIFU 4D Rajeunissement global",
      "Radiofréquence fractionnée",
      "Stimulation du collagène",
      "Ovale du visage redessiné"
    ],
    image: "https://images.unsplash.com/photo-1570172619644-8d8f52818816?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "Remodelage",
    title: "Tesla Sculpt & Silhouette",
    features: [
      "Renforcement musculaire intense",
      "Élimination des graisses ciblées",
      "Traitement non invasif (30 min)",
      "Résultats visibles dès 4 séances"
    ],
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    category: "Laser",
    title: "Épilation Définitive",
    features: [
      "Technologie triple longueur d'onde",
      "Soin indolore et ultra-rapide",
      "Efficace sur tous les phototypes",
      "Peau lisse et nette durablement"
    ],
    image: "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
]

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/staff').then(r => r.json()),
    ]).then(([p]) => {
      setProducts(Array.isArray(p) ? p.filter((x: any) => x.isActive) : [])
    }).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 lg:pb-0 overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── Full-screen Pexels image background */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/6543666/pexels-photo-6543666.jpeg?_gl=1*64klfb*_ga*MTQ0NDU0NzUxMS4xNzczNDMzMzYy*_ga_8JE65Q40S6*czE3NzM0MzMzNjIkbzEkZzEkdDE3NzM0MzM3MTIkajU5JGwwJGgw')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay: dark-to-light so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75" />
        {/* Soft pink tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff2c92]/10 via-transparent to-[#ff77b9]/10" />

        {/* Floating blobs */}
        <div className="absolute top-1/4 left-[8%] w-48 h-48 rounded-full bg-[#ff2c92]/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-[10%] w-64 h-64 rounded-full bg-[#ff77b9]/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center pt-28 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/30 text-xs font-semibold uppercase tracking-widest text-white mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#ff77b9]" />
            Beauté & Bien-être Premium
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.05] text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Sublimez Votre{' '}
            <span
              className="italic font-light"
              style={{
                background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Beauté
            </span>
            <br />
            Naturelle
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            Découvrez des soins de beauté d'exception — traitements laser avancés, protocoles anti-âge et rituels bien-être sur mesure à l'Institut Physio Sfax.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#ff2c92]/30 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              <Calendar className="w-5 h-5" />
              Réserver une Séance
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white border border-white/40 hover:border-[#ff77b9] hover:text-[#ff77b9] transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Découvrir nos soins
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: '10+', label: "Années d'expérience" },
              { value: '5 000+', label: 'Clientes satisfaites' },
              { value: '30+', label: 'Soins disponibles' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-white/55 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── SERVICES ── White background */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 text-white"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              Nos Expertises
            </div>
            <h2
              className="text-3xl lg:text-5xl font-bold text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Soins & Protocoles
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed">
              L'Institut Physio lit avec finesse les flux et les équilibres du visage pour parfaire des lignes fermes et des textures claires et hydratées, dans un souci de détails minutieux.
            </p>
          </div>

          <div className="flex md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {servicesHighlights.map((service, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden min-w-[280px] snap-center flex-shrink-0 hover:border-[#ff2c92]/30 transition-all duration-300 shadow-lg hover:shadow-[#ff2c92]/10 hover:shadow-2xl"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div
                    className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                    style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                  >
                    {service.category}
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <h3
                    className="font-bold text-gray-900 text-base mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {service.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-500">
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-full text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[#ff2c92]/30"
              style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
            >
              Voir tous nos soins
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* ── AVANT / APRÈS ── Warm beige background like reference image */}
      <section className="py-24" style={{ background: '#f5ede6' }}>
        <div className="max-w-5xl mx-auto px-6">

          {/* Title: "Avant & Après" — black bold + pink bold, matching the image */}
          <div className="text-center mb-12">
            <h2 className="inline-flex items-baseline gap-3 text-4xl lg:text-5xl leading-tight">
              <span className="font-extrabold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Avant
              </span>
              <span className="font-bold text-gray-500 text-3xl lg:text-4xl">&amp;</span>
              <span className="font-extrabold" style={{ color: '#ff2c92', fontFamily: 'Inter, sans-serif' }}>
                Après
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Des résultats réels et tangibles grâce à des protocoles de soins adaptés et maîtrisés par notre équipe d'experts.
            </p>
          </div>

          {/* Two sliders side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Slider 1 — young woman */}
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90"
              afterImage="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90"
              beforeLabel="AVANT"
              afterLabel="APRÈS"
              beforeClass="filter contrast-110 saturate-50 brightness-90"
              afterClass="filter brightness-105 saturate-125 contrast-95"
            />
            {/* Slider 2 — mature woman */}
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90"
              afterImage="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90"
              beforeLabel="AVANT"
              afterLabel="APRÈS"
              beforeClass="filter contrast-125 saturate-40 brightness-85 sepia-[0.2]"
              afterClass="filter brightness-108 saturate-120"
            />
          </div>
        </div>
      </section>


      {/* ── INSTAGRAM SWIPER ── */}
      <section className="py-24 bg-white overflow-hidden">
        <InstagramSwiper />
      </section>

      {/* ── PRODUCTS ── White */}
      {products.length > 0 && (
        <section id="products" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-3">
                <div
                  className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                >
                  Boutique
                </div>
                <h2
                  className="text-3xl lg:text-4xl font-bold text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Nos Produits Premium
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#ff2c92] hover:text-[#ff77b9] transition-colors"
              >
                Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p: any) => (
                <div key={p._id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 group-hover:border-[#ff2c92]/30 group-hover:shadow-xl group-hover:shadow-[#ff2c92]/10 transition-all duration-300">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.nameFr}
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}>
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: '#ff2c92' }}>
                    {p.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm">{p.nameFr}</h3>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{
                      background: 'linear-gradient(135deg, #ff2c92, #ff77b9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {p.price} TND
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <TestimonialSlider />

      {/* ── FOOTER ── Dark footer (contrast needed) */}
      <footer id="contact" className="bg-gray-950 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="space-y-6">
              <div>
                <span
                  className="text-2xl font-bold tracking-widest uppercase text-white"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Institut Physio
                </span>
                <div
                  className="h-0.5 w-12 mt-2 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #ff2c92, #ff77b9)' }}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Le paradis du bien-être et de la beauté professionnelle. Des thérapies uniques conçues pour sublimer votre peau et votre corps.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#ff2c92] hover:bg-[#ff2c92]/10 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#ff2c92] hover:bg-[#ff2c92]/10 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold tracking-wider text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Horaires
              </h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Lundi – Vendredi</span>
                  <span className="text-white">09:00 – 18:00</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Samedi</span>
                  <span className="text-white">10:00 – 16:00</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Dimanche</span>
                  <span style={{ color: '#ff2c92' }}>Fermé</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6 lg:col-span-2">
              <h3 className="text-base font-semibold tracking-wider text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Contact
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <a href="tel:74633703" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#ff2c92]/20 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Téléphone</div>
                      <div className="font-medium">74 633 703</div>
                    </div>
                  </a>
                  <a href="mailto:contact@institutphysio.tn" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#ff2c92]/20 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Email</div>
                      <div className="font-medium">contact@institutphysio.tn</div>
                    </div>
                  </a>
                </div>
                <div className="flex items-start gap-4 text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Adresse</div>
                    <div className="font-medium leading-relaxed text-sm">
                      Route El Ain, km 2<br />
                      Immeuble Khadija,<br />
                      Sfax, Tunisie
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Institut Physio. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[#ff77b9] transition-colors">Politique de Confidentialité</Link>
              <Link href="#" className="hover:text-[#ff77b9] transition-colors">Conditions d'Utilisation</Link>
            </div>
          </div>
        </div>
      </footer>

      <BottomMobileNav />

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
