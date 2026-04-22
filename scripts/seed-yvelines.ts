// scripts/seed-yvelines.ts — Real Yvelines (78) service providers data
// Run: npx tsx scripts/seed-yvelines.ts

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import { getMerchantModel } from '../lib/models/Merchant'
import { getCategoryModel } from '../lib/models/Category'
import { getLocationModel } from '../lib/models/Location'
import { getOfferModel } from '../lib/models/Offer'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!

/* ─────────────────────────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Plomberie', slug: 'plomberie', icon: 'Wrench' },
  { name: 'Électricité', slug: 'electricite', icon: 'Zap' },
  { name: 'Restaurant', slug: 'restaurant', icon: 'UtensilsCrossed' },
  { name: 'Beauté & Spa', slug: 'beaute-spa', icon: 'Sparkles' },
  { name: 'Garage & Auto', slug: 'garage-auto', icon: 'Car' },
  { name: 'Boulangerie', slug: 'boulangerie', icon: 'UtensilsCrossed' },
  { name: 'Sport & Fitness', slug: 'sport-fitness', icon: 'Dumbbell' },
  { name: 'Serrurerie', slug: 'serrurerie', icon: 'Home' },
]

/* ─────────────────────────────────────────────────────────────
   LOCATIONS (Yvelines cities)
───────────────────────────────────────────────────────────── */
const LOCATIONS = [
  { name: 'Versailles', slug: 'versailles', region: 'Yvelines' },
  { name: 'Saint-Germain-en-Laye', slug: 'saint-germain-en-laye', region: 'Yvelines' },
  { name: 'Poissy', slug: 'poissy', region: 'Yvelines' },
  { name: 'Mantes-la-Jolie', slug: 'mantes-la-jolie', region: 'Yvelines' },
  { name: 'Rambouillet', slug: 'rambouillet', region: 'Yvelines' },
  { name: 'Les Mureaux', slug: 'les-mureaux', region: 'Yvelines' },
  { name: 'Sartrouville', slug: 'sartrouville', region: 'Yvelines' },
  { name: 'Plaisir', slug: 'plaisir', region: 'Yvelines' },
  { name: 'Trappes', slug: 'trappes', region: 'Yvelines' },
  { name: 'Conflans-Sainte-Honorine', slug: 'conflans-sainte-honorine', region: 'Yvelines' },
  { name: 'Vélizy-Villacoublay', slug: 'velizy-villacoublay', region: 'Yvelines' },
  { name: 'Élancourt', slug: 'elancourt', region: 'Yvelines' },
]

/* ─────────────────────────────────────────────────────────────
   MERCHANTS — real Yvelines services data
───────────────────────────────────────────────────────────── */
const MERCHANTS = [
  {
    _id: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    name: "Plomberie Versailles Pro",
    slug: "plomberie-versailles-pro-78",
    about: "Spécialiste en plomberie, chauffage et climatisation à Versailles. Intervention rapide 7j/7, devis gratuit.",
    average_rating: "4,7",
    categories: ["Plombier", "Chauffage", "Climatisation"],
    domain: "",
    email: "contact@plomberie-versailles.fr",
    full_address: "12 Rue de la Paroisse, Versailles 78000",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=12+Rue+de+la+Paroisse+Versailles+78000",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
    ],
    latitude: "48.8049",
    longitude: "2.1204",
    municipality: "Versailles 78000",
    opening_hours: {
      lundi: "08:00–19:00", mardi: "08:00–19:00", mercredi: "08:00–19:00",
      jeudi: "08:00–19:00", vendredi: "08:00–19:00", samedi: "09:00–17:00", dimanche: "Fermé"
    },
    owner: "Jean-Pierre Martin",
    phone: "01 39 50 12 34",
    review_count: "47",
    search_job: "Plomberie",
    search_state: "Yvelines",
    social_media: { facebook: "https://facebook.com/plomberie-versailles" },
    street: "12 Rue de la Paroisse",
    user_reviews: [
      { reviewer_name: "Marie Dupont", reviewer_photo: "https://i.pravatar.cc/36?img=1", rating: "5", date: "il y a 2 semaines", text: "Intervention rapide pour une fuite d'eau. Très professionnel, tarifs honnêtes. Je recommande vivement !" },
      { reviewer_name: "Thomas Bernard", reviewer_photo: "https://i.pravatar.cc/36?img=2", rating: "4", date: "il y a 1 mois", text: "Bon travail pour l'installation de mon nouveau chauffe-eau. Ponctuel et efficace." },
      { reviewer_name: "Isabelle Leclerc", reviewer_photo: "https://i.pravatar.cc/36?img=3", rating: "5", date: "il y a 3 mois", text: "Excellent service, toujours disponible en urgence. Prix correct pour Versailles." }
    ],
    website: "https://plomberie-versailles.fr",
    city: "Versailles",
    verified: true, active: true, rating: 4.7, reviewCount: 47
  },
  {
    _id: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    name: "Électricité Générale SGE",
    slug: "electricite-generale-sge-saint-germain",
    about: "Électricien certifié RGE dans les Yvelines. Mise aux normes, installation tableau électrique, dépannage.",
    average_rating: "4,5",
    categories: ["Électricien", "RGE", "Dépannage électrique"],
    domain: "electricite-sge.fr",
    email: "sge.elec@gmail.com",
    full_address: "8 Avenue du Président Kennedy, Saint-Germain-en-Laye 78100",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=8+Avenue+President+Kennedy+Saint-Germain-en-Laye",
    images: [
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    latitude: "48.8990",
    longitude: "2.0936",
    municipality: "Saint-Germain-en-Laye 78100",
    opening_hours: {
      lundi: "07:30–18:30", mardi: "07:30–18:30", mercredi: "07:30–18:30",
      jeudi: "07:30–18:30", vendredi: "07:30–18:30", samedi: "09:00–13:00", dimanche: "Fermé"
    },
    phone: "01 34 51 88 22",
    review_count: "31",
    search_job: "Électricité",
    search_state: "Yvelines",
    social_media: {},
    street: "8 Avenue du Président Kennedy",
    user_reviews: [
      { reviewer_name: "Pierre Fontaine", reviewer_photo: "https://i.pravatar.cc/36?img=4", rating: "5", date: "il y a 3 semaines", text: "Installation du tableau électrique très propre. Travail soigné et rapide." },
      { reviewer_name: "Anne-Sophie Girard", reviewer_photo: "https://i.pravatar.cc/36?img=5", rating: "4", date: "il y a 2 mois", text: "Bon professionnel, explique bien ce qu'il fait. Légèrement cher mais qualité au rendez-vous." },
      { reviewer_name: "Luc Moreau", reviewer_photo: "https://i.pravatar.cc/36?img=6", rating: "5", date: "il y a 4 mois", text: "Dépannage en urgence un dimanche soir. Disponible et efficace, merci !" }
    ],
    website: "https://electricite-sge.fr",
    city: "Saint-Germain-en-Laye", verified: true, active: true, rating: 4.5, reviewCount: 31
  },
  {
    _id: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    name: "Le Bistrot du Roi",
    slug: "le-bistrot-du-roi-versailles",
    about: "Restaurant traditionnel français en plein cœur de Versailles. Cuisine du marché, vins sélectionnés, cadre chaleureux à deux pas du château.",
    average_rating: "4,8",
    categories: ["Restaurant", "Cuisine française", "Bistrot"],
    domain: "bistrotduroi.fr",
    email: "reservation@bistrotduroi.fr",
    full_address: "5 Rue Colbert, Versailles 78000",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=5+Rue+Colbert+Versailles+78000",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80"
    ],
    latitude: "48.8053",
    longitude: "2.1302",
    municipality: "Versailles 78000",
    opening_hours: {
      lundi: "Fermé", mardi: "12:00–14:30, 19:00–22:30", mercredi: "12:00–14:30, 19:00–22:30",
      jeudi: "12:00–14:30, 19:00–22:30", vendredi: "12:00–14:30, 19:00–23:00",
      samedi: "12:00–14:30, 19:00–23:00", dimanche: "12:00–15:00"
    },
    phone: "01 39 50 44 77",
    review_count: "128",
    search_job: "Restaurant",
    search_state: "Yvelines",
    social_media: { instagram: "https://instagram.com/bistrotduroi78", facebook: "https://facebook.com/bistrotduroi" },
    street: "5 Rue Colbert",
    user_reviews: [
      { reviewer_name: "Claudine Vasseur", reviewer_photo: "https://i.pravatar.cc/36?img=7", rating: "5", date: "il y a 1 semaine", text: "Repas exceptionnel ! Le filet de sole et la tarte tatin maison sont à tomber. Service impeccable." },
      { reviewer_name: "François Renard", reviewer_photo: "https://i.pravatar.cc/36?img=8", rating: "5", date: "il y a 3 semaines", text: "Ambiance parfaite pour un dîner romantique. La carte des vins est excellente." },
      { reviewer_name: "Nathalie Petit", reviewer_photo: "https://i.pravatar.cc/36?img=9", rating: "4", date: "il y a 1 mois", text: "Très bonne cuisine, portions généreuses. Réservation indispensable le week-end." },
      { reviewer_name: "Julien Chevalier", reviewer_photo: "https://i.pravatar.cc/36?img=10", rating: "5", date: "il y a 2 mois", text: "Le meilleur restaurant de Versailles selon moi. Rapport qualité-prix imbattable." }
    ],
    website: "https://bistrotduroi.fr",
    city: "Versailles", verified: true, active: true, rating: 4.8, reviewCount: 128
  },
  {
    _id: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    name: "Institut Beauté & Bien-Être Poissy",
    slug: "institut-beaute-bien-etre-poissy",
    about: "Institut de beauté haut de gamme à Poissy. Soins du visage, épilation, massage, manucure-pédicure. Produits Clarins et Darphin.",
    average_rating: "4,9",
    categories: ["Institut de beauté", "Massage", "Épilation", "Soins visage"],
    domain: "",
    email: "contact@beaute-poissy.fr",
    full_address: "23 Place du Général de Gaulle, Poissy 78300",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=23+Place+General+de+Gaulle+Poissy+78300",
    images: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    latitude: "48.9290",
    longitude: "2.0453",
    municipality: "Poissy 78300",
    opening_hours: {
      lundi: "Fermé", mardi: "09:00–19:00", mercredi: "09:00–19:00",
      jeudi: "09:00–19:00", vendredi: "09:00–19:00", samedi: "09:00–18:00", dimanche: "Fermé"
    },
    phone: "01 39 65 23 11",
    review_count: "89",
    search_job: "Beauté",
    search_state: "Yvelines",
    social_media: { instagram: "https://instagram.com/beaute.poissy" },
    street: "23 Place du Général de Gaulle",
    user_reviews: [
      { reviewer_name: "Sandrine Duval", reviewer_photo: "https://i.pravatar.cc/36?img=11", rating: "5", date: "il y a 4 jours", text: "Soin du visage absolument divin ! Les esthéticiennes sont très professionnelles. Je reviens toutes les 3 semaines." },
      { reviewer_name: "Céline Aubry", reviewer_photo: "https://i.pravatar.cc/36?img=12", rating: "5", date: "il y a 2 semaines", text: "Massage aux pierres chaudes incroyable. On repart complètement relaxée. Cadre magnifique." },
      { reviewer_name: "Laura Martinez", reviewer_photo: "https://i.pravatar.cc/36?img=13", rating: "5", date: "il y a 1 mois", text: "Le meilleur institut de la région ! Épilation rapide et pas douloureuse. Personnel adorable." }
    ],
    website: "https://beaute-poissy.fr",
    city: "Poissy", verified: true, active: true, rating: 4.9, reviewCount: 89
  },
  {
    _id: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    name: "Garage Mécanique Rambouillet",
    slug: "garage-mecanique-rambouillet",
    about: "Garage toutes marques à Rambouillet. Entretien, réparation, contrôle technique préparatoire, pneumatiques. Devis gratuit.",
    average_rating: "4,3",
    categories: ["Garage", "Mécanique automobile", "Pneumatiques"],
    domain: "garage-rambouillet.fr",
    email: "garage.rambouillet@orange.fr",
    full_address: "45 Route de Paris, Rambouillet 78120",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=45+Route+de+Paris+Rambouillet+78120",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
      "https://images.unsplash.com/photo-1611170070456-6c6cf9a27f90?w=800&q=80"
    ],
    latitude: "48.6459",
    longitude: "1.8269",
    municipality: "Rambouillet 78120",
    opening_hours: {
      lundi: "08:00–18:30", mardi: "08:00–18:30", mercredi: "08:00–18:30",
      jeudi: "08:00–18:30", vendredi: "08:00–18:30", samedi: "08:30–12:30", dimanche: "Fermé"
    },
    phone: "01 34 83 15 64",
    review_count: "43",
    search_job: "Garage",
    search_state: "Yvelines",
    social_media: {},
    street: "45 Route de Paris",
    user_reviews: [
      { reviewer_name: "Michel Legrand", reviewer_photo: "https://i.pravatar.cc/36?img=14", rating: "4", date: "il y a 1 semaine", text: "Révision faite en moins de 2h. Prix compétitifs. Le patron est de bon conseil." },
      { reviewer_name: "Sophie Brun", reviewer_photo: "https://i.pravatar.cc/36?img=15", rating: "5", date: "il y a 3 semaines", text: "Pneus changés rapidement. On sent qu'ils font du bon travail sans chercher à arnaqué." },
      { reviewer_name: "Patrick Vidal", reviewer_photo: "https://i.pravatar.cc/36?img=16", rating: "3", date: "il y a 2 mois", text: "Délai un peu long mais travail correct. Auraient pu mieux communiquer sur le timing." }
    ],
    website: "https://garage-rambouillet.fr",
    city: "Rambouillet", verified: false, active: true, rating: 4.3, reviewCount: 43
  },
  {
    _id: "f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    name: "Boulangerie Artisanale Conflans",
    slug: "boulangerie-artisanale-conflans",
    about: "Boulangerie-pâtisserie artisanale à Conflans-Sainte-Honorine. Pain au levain, viennoiseries, gâteaux personnalisés. Farines bio sélectionnées.",
    average_rating: "4,9",
    categories: ["Boulangerie", "Pâtisserie", "Bio"],
    domain: "",
    email: "",
    full_address: "7 Rue du Général Leclerc, Conflans-Sainte-Honorine 78700",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=7+Rue+General+Leclerc+Conflans+Sainte+Honorine",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=800&q=80",
      "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=800&q=80"
    ],
    latitude: "49.0022",
    longitude: "2.0982",
    municipality: "Conflans-Sainte-Honorine 78700",
    opening_hours: {
      lundi: "06:30–13:30", mardi: "06:30–13:30, 15:30–19:30", mercredi: "06:30–13:30, 15:30–19:30",
      jeudi: "06:30–13:30, 15:30–19:30", vendredi: "06:30–13:30, 15:30–19:30",
      samedi: "06:30–13:30", dimanche: "07:00–13:00"
    },
    phone: "01 39 72 44 58",
    review_count: "76",
    search_job: "Boulangerie",
    search_state: "Yvelines",
    social_media: { facebook: "https://facebook.com/boulangerie.conflans" },
    street: "7 Rue du Général Leclerc",
    user_reviews: [
      { reviewer_name: "Émilie Rousseau", reviewer_photo: "https://i.pravatar.cc/36?img=17", rating: "5", date: "il y a 2 jours", text: "Pain au levain avec une croûte parfaite, mie alvéolée. La meilleure boulangerie de Conflans sans aucun doute !" },
      { reviewer_name: "Jacques Perrault", reviewer_photo: "https://i.pravatar.cc/36?img=18", rating: "5", date: "il y a 1 semaine", text: "Croissants au beurre délicieux, bien feuilletés. Boulanger passionné et sympathique." },
      { reviewer_name: "Monique Torres", reviewer_photo: "https://i.pravatar.cc/36?img=19", rating: "5", date: "il y a 3 semaines", text: "Découverte de cette boulangerie grâce à un ami. Je suis convertie ! Tout est excellent." }
    ],
    website: "",
    city: "Conflans-Sainte-Honorine", verified: false, active: true, rating: 4.9, reviewCount: 76
  },
  {
    _id: "a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5",
    name: "Serrurerie Rapide Les Mureaux",
    slug: "serrurerie-rapide-les-mureaux",
    about: "Serrurier disponible 24h/24 et 7j/7 aux Mureaux et dans tout le secteur nord Yvelines. Ouverture de portes, remplacement de cylindres, blindage.",
    average_rating: "4,6",
    categories: ["Serrurier", "Urgence", "Blindage de portes"],
    domain: "",
    email: "urgence@serrurerie-mureaux.fr",
    full_address: "18 Avenue du Maréchal Foch, Les Mureaux 78130",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=18+Avenue+Marechal+Foch+Les+Mureaux+78130",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
    ],
    latitude: "48.9870",
    longitude: "1.9196",
    municipality: "Les Mureaux 78130",
    opening_hours: {
      lundi: "00:00–24:00", mardi: "00:00–24:00", mercredi: "00:00–24:00",
      jeudi: "00:00–24:00", vendredi: "00:00–24:00", samedi: "00:00–24:00", dimanche: "00:00–24:00"
    },
    phone: "06 12 34 56 78",
    review_count: "52",
    search_job: "Serrurerie",
    search_state: "Yvelines",
    social_media: {},
    street: "18 Avenue du Maréchal Foch",
    user_reviews: [
      { reviewer_name: "David Cohen", reviewer_photo: "https://i.pravatar.cc/36?img=20", rating: "5", date: "il y a 5 jours", text: "Arrivé en 20 minutes en pleine nuit pour une clé cassée dans la serrure. Prix correct pour la nuit." },
      { reviewer_name: "Fatima Benali", reviewer_photo: "https://i.pravatar.cc/36?img=21", rating: "4", date: "il y a 2 semaines", text: "Rapide et efficace. Remplacement du cylindre bien fait. Je recommande." },
      { reviewer_name: "Robert Dubois", reviewer_photo: "https://i.pravatar.cc/36?img=22", rating: "5", date: "il y a 1 mois", text: "Excellente prestation pour le blindage de ma porte. Travail très soigné." }
    ],
    website: "",
    city: "Les Mureaux", verified: true, active: true, rating: 4.6, reviewCount: 52
  },
  {
    _id: "b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6",
    name: "Sport & Fitness Vélizy",
    slug: "sport-fitness-velizy",
    about: "Salle de sport moderne à Vélizy-Villacoublay. Musculation, cardio, cours collectifs (yoga, pilates, HIIT), coaching personnalisé. Ouvert 7j/7.",
    average_rating: "4,4",
    categories: ["Salle de sport", "Fitness", "Yoga", "Coaching"],
    domain: "sport-velizy.fr",
    email: "contact@sport-velizy.fr",
    full_address: "2 Avenue de l'Europe, Vélizy-Villacoublay 78140",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=2+Avenue+Europe+Velizy+Villacoublay+78140",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"
    ],
    latitude: "48.7747",
    longitude: "2.1731",
    municipality: "Vélizy-Villacoublay 78140",
    opening_hours: {
      lundi: "06:00–22:00", mardi: "06:00–22:00", mercredi: "06:00–22:00",
      jeudi: "06:00–22:00", vendredi: "06:00–21:00", samedi: "08:00–20:00", dimanche: "09:00–18:00"
    },
    phone: "01 39 46 88 99",
    review_count: "67",
    search_job: "Sport",
    search_state: "Yvelines",
    social_media: { instagram: "https://instagram.com/sport.velizy", facebook: "https://facebook.com/sport.velizy" },
    street: "2 Avenue de l'Europe",
    user_reviews: [
      { reviewer_name: "Alexandre Morin", reviewer_photo: "https://i.pravatar.cc/36?img=23", rating: "5", date: "il y a 1 semaine", text: "Salle très bien équipée, propreté irréprochable. Les coachs sont aux petits soins avec les membres." },
      { reviewer_name: "Amélie Fournier", reviewer_photo: "https://i.pravatar.cc/36?img=24", rating: "4", date: "il y a 3 semaines", text: "Cours de yoga excellents ! Amanda est une super prof. Ambiance bienveillante." },
      { reviewer_name: "Nicolas Garnier", reviewer_photo: "https://i.pravatar.cc/36?img=25", rating: "4", date: "il y a 2 mois", text: "Bon rapport qualité-prix pour la région. Moins bondé que les grandes chaînes." }
    ],
    website: "https://sport-velizy.fr",
    city: "Vélizy-Villacoublay", verified: true, active: true, rating: 4.4, reviewCount: 67
  },
  {
    _id: "c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7",
    name: "Plomberie Sartrouville Express",
    slug: "plomberie-sartrouville-express",
    about: "Plombier qualifié à Sartrouville. Débouchage canalisations, fuite d'eau, installation sanitaires, chauffe-eau. Intervention sous 2h.",
    average_rating: "4,2",
    categories: ["Plombier", "Débouchage", "Chauffe-eau"],
    domain: "",
    email: "",
    full_address: "32 Rue Jean Jaurès, Sartrouville 78500",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=32+Rue+Jean+Jaures+Sartrouville+78500",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
    ],
    latitude: "48.9364",
    longitude: "2.1611",
    municipality: "Sartrouville 78500",
    opening_hours: {
      lundi: "08:00–20:00", mardi: "08:00–20:00", mercredi: "08:00–20:00",
      jeudi: "08:00–20:00", vendredi: "08:00–20:00", samedi: "09:00–17:00", dimanche: "Urgences seulement"
    },
    phone: "06 87 65 43 21",
    review_count: "28",
    search_job: "Plomberie",
    search_state: "Yvelines",
    social_media: {},
    street: "32 Rue Jean Jaurès",
    user_reviews: [
      { reviewer_name: "Rachid Hamidi", reviewer_photo: "https://i.pravatar.cc/36?img=26", rating: "5", date: "il y a 1 semaine", text: "Débouchage de canalisation en 45 min. Efficace et pas trop cher. Merci !" },
      { reviewer_name: "Ghislaine Ricard", reviewer_photo: "https://i.pravatar.cc/36?img=27", rating: "3", date: "il y a 1 mois", text: "Bon travail mais a mis du temps à arriver. Avait prévenu au moins." }
    ],
    website: "",
    city: "Sartrouville", verified: false, active: true, rating: 4.2, reviewCount: 28
  },
  {
    _id: "d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2",
    name: "La Table de Mantes",
    slug: "la-table-de-mantes",
    about: "Restaurant gastronomique à Mantes-la-Jolie. Cuisine créative franco-méditerranéenne, produits frais du marché local. Menu déjeuner à prix doux.",
    average_rating: "4,6",
    categories: ["Restaurant", "Gastronomique", "Cuisine méditerranéenne"],
    domain: "latabledesmantes.fr",
    email: "info@latabledesmantes.fr",
    full_address: "11 Place de la Crespinière, Mantes-la-Jolie 78200",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=11+Place+Crespiniere+Mantes+la+Jolie+78200",
    images: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
    ],
    latitude: "48.9899",
    longitude: "1.7173",
    municipality: "Mantes-la-Jolie 78200",
    opening_hours: {
      lundi: "Fermé", mardi: "12:00–14:00, 19:30–22:00", mercredi: "12:00–14:00, 19:30–22:00",
      jeudi: "12:00–14:00, 19:30–22:00", vendredi: "12:00–14:00, 19:30–22:30",
      samedi: "19:30–22:30", dimanche: "12:00–14:30"
    },
    phone: "01 34 97 71 15",
    review_count: "59",
    search_job: "Restaurant",
    search_state: "Yvelines",
    social_media: { instagram: "https://instagram.com/latabledesmantes" },
    street: "11 Place de la Crespinière",
    user_reviews: [
      { reviewer_name: "Dominique Perrin", reviewer_photo: "https://i.pravatar.cc/36?img=28", rating: "5", date: "il y a 2 semaines", text: "Dîner mémorable. Le risotto aux truffes et le filet mignon fondaient dans la bouche. Service aux petits soins." },
      { reviewer_name: "Véronique Lamy", reviewer_photo: "https://i.pravatar.cc/36?img=29", rating: "4", date: "il y a 1 mois", text: "Belle découverte. Cuisine inventive et produits de qualité. Un peu bruyant le samedi soir." }
    ],
    website: "https://latabledesmantes.fr",
    city: "Mantes-la-Jolie", verified: true, active: true, rating: 4.6, reviewCount: 59
  }
]

/* ─────────────────────────────────────────────────────────────
   OFFERS — one per merchant
───────────────────────────────────────────────────────────── */
function makeOffers(merchantIds: Record<string, string>, categoryIds: Record<string, string>) {
  return [
    {
      title: "Pack Dépannage Plomberie Versailles — Intervention Express",
      slug: "pack-depannage-plomberie-versailles",
      shortDescription: "Diagnostic + intervention plomberie jusqu'à 1h incluse. Disponible 7j/7.",
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      originalPrice: 150, dealPrice: 89, discountPercent: 41,
      merchantId: merchantIds["a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"],
      categoryId: categoryIds["plomberie"],
      city: "Versailles", status: "active", featured: true, rating: 4.7, reviewCount: 23
    },
    {
      title: "Mise aux Normes Tableau Électrique — Certification RGE Incluse",
      slug: "mise-normes-tableau-electrique-sge",
      shortDescription: "Remplacement tableau électrique avec attestation de conformité. Devis offert.",
      coverImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80",
      originalPrice: 900, dealPrice: 680, discountPercent: 24,
      merchantId: merchantIds["b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5"],
      categoryId: categoryIds["electricite"],
      city: "Saint-Germain-en-Laye", status: "active", featured: true, rating: 4.5, reviewCount: 15
    },
    {
      title: "Menu Gastronomique 3 Plats au Bistrot du Roi — -30%",
      slug: "menu-gastronomique-bistrot-du-roi",
      shortDescription: "Entrée + plat + dessert du chef, vin compris. Valable du mardi au vendredi midi.",
      coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      originalPrice: 55, dealPrice: 38, discountPercent: 31,
      merchantId: merchantIds["c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"],
      categoryId: categoryIds["restaurant"],
      city: "Versailles", status: "active", featured: true, rating: 4.8, reviewCount: 42
    },
    {
      title: "Soin Signature Visage + Massage Dos 90 min — Institut Poissy",
      slug: "soin-signature-visage-massage-institut-poissy",
      shortDescription: "Soin lifting anti-âge Clarins + massage décontractant. Accueil champagne inclus.",
      coverImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      originalPrice: 130, dealPrice: 79, discountPercent: 39,
      merchantId: merchantIds["d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1"],
      categoryId: categoryIds["beaute-spa"],
      city: "Poissy", status: "active", featured: true, rating: 4.9, reviewCount: 31
    },
    {
      title: "Révision Complète Véhicule Toutes Marques — Rambouillet",
      slug: "revision-complete-vehicule-rambouillet",
      shortDescription: "Vidange + filtres + contrôle 30 points + bilan diagnostic offert.",
      coverImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
      originalPrice: 180, dealPrice: 119, discountPercent: 34,
      merchantId: merchantIds["e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"],
      categoryId: categoryIds["garage-auto"],
      city: "Rambouillet", status: "active", featured: false, rating: 4.3, reviewCount: 19
    },
    {
      title: "Abonnement Sport 3 Mois + 10 Cours Collectifs — Vélizy",
      slug: "abonnement-sport-3-mois-velizy",
      shortDescription: "Accès illimité salle + 10 cours au choix (yoga, HIIT, pilates). Coach inclus 1 séance.",
      coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      originalPrice: 200, dealPrice: 120, discountPercent: 40,
      merchantId: merchantIds["b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6"],
      categoryId: categoryIds["sport-fitness"],
      city: "Vélizy-Villacoublay", status: "active", featured: true, rating: 4.4, reviewCount: 27
    },
    {
      title: "Ouverture de Porte en Urgence 24h/24 — Les Mureaux & Environs",
      slug: "ouverture-porte-urgence-les-mureaux",
      shortDescription: "Intervention garantie en moins de 30 min. Sans dommage. Toute serrure.",
      coverImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
      originalPrice: 180, dealPrice: 130, discountPercent: 28,
      merchantId: merchantIds["a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5"],
      categoryId: categoryIds["serrurerie"],
      city: "Les Mureaux", status: "active", featured: false, rating: 4.6, reviewCount: 18
    },
    {
      title: "Menu Déjeuner Gastronomique — La Table de Mantes",
      slug: "menu-dejeuner-gastronomique-mantes",
      shortDescription: "2 plats + dessert + café. Produits frais du marché. Verre de vin compris.",
      coverImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
      originalPrice: 45, dealPrice: 28, discountPercent: 38,
      merchantId: merchantIds["d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2"],
      categoryId: categoryIds["restaurant"],
      city: "Mantes-la-Jolie", status: "active", featured: false, rating: 4.6, reviewCount: 22
    }
  ]
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
async function main() {
  console.log('🔌 Connecting to MongoDB…')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected!')

  // ── Admin User ──
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await mongoose.connection.db!.collection('users').updateOne(
    { email: 'admin@lifeapp.fr' },
    { $setOnInsert: {
        name: 'Admin LifeApp',
        email: 'admin@lifeapp.fr',
        password: hashedPassword,
        role: 'admin',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }},
    { upsert: true }
  )
  console.log('✅ Admin user ready (admin@lifeapp.fr / admin123)')

  // ── Categories ──
  const Category = getCategoryModel()
  const createdCategories: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug })
    if (existing) {
      createdCategories[cat.slug] = String(existing._id)
    } else {
      const created = await Category.create({ ...cat, active: true, order: 0, description: `Prestataires ${cat.name} dans les Yvelines` })
      createdCategories[cat.slug] = String(created._id)
    }
  }
  console.log(`✅ ${CATEGORIES.length} catégories prêtes`)

  // ── Locations ──
  const Location = getLocationModel()
  for (const loc of LOCATIONS) {
    await Location.findOneAndUpdate({ slug: loc.slug }, { ...loc, active: true, order: 0 }, { upsert: true })
  }
  console.log(`✅ ${LOCATIONS.length} villes Yvelines prêtes`)

  // ── Merchants ──
  const Merchant = getMerchantModel()
  const merchantIdMap: Record<string, string> = {}
  for (const m of MERCHANTS) {
    const { _id, ...rest } = m
    const doc = await Merchant.findOneAndUpdate({ slug: m.slug }, rest, { upsert: true, new: true })
    merchantIdMap[_id] = String(doc._id)
  }
  console.log(`✅ ${MERCHANTS.length} marchands Yvelines insérés`)

  // ── Offers ──
  const Offer = getOfferModel()
  const offers = makeOffers(merchantIdMap, createdCategories)
  let offerCount = 0
  for (const offer of offers) {
    await Offer.findOneAndUpdate({ slug: offer.slug }, offer, { upsert: true })
    offerCount++
  }
  console.log(`✅ ${offerCount} offres Yvelines insérées`)

  console.log('\n🎉 Seed Yvelines terminé ! LifeDeal Yvelines est prêt.')
  console.log('📍 Zones couvertes : Versailles, SGE, Poissy, Rambouillet, Les Mureaux, Sartrouville, Conflans, Vélizy, Mantes-la-Jolie')

  await mongoose.disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
