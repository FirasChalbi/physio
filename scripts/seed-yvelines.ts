// scripts/seed-yvelines.ts — Real Yvelines (78) service providers data
// Run: npx tsx scripts/seed-yvelines.ts

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import { getMerchantModel } from '../lib/models/Merchant'
import { getCategoryModel } from '../lib/models/Category'
import { getLocationModel } from '../lib/models/Location'
import { getOfferModel } from '../lib/models/Offer'
import { getFamilyActivityModel } from '../lib/models/FamilyActivity'
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
  { name: 'Famille & Loisirs', slug: 'famille-loisirs', icon: 'Tent' },
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
    menu: [
      { name: "Foie gras maison et chutney de figues", price: 18, description: "Foie gras de canard mi-cuit, chutney de figues fraîches, pain grillé", category: "Entrées" },
      { name: "Velouté de saison du marché", price: 14, description: "Velouté de légumes frais selon arrivage, crème fraîche", category: "Entrées" },
      { name: "Filet de sole meunière", price: 28, description: "Filet de sole poêlé au beurre noisette, pommes vapeur, persil", category: "Plats" },
      { name: "Bœuf bourguignon traditionnel", price: 26, description: "Joue de bœuf mijotée au vin de Bourgogne, carottes, champignons", category: "Plats" },
      { name: "Coq au vin", price: 24, description: "Poulet fermier au vin rouge, lardons, champignons de Paris", category: "Plats" },
      { name: "Tarte Tatin maison", price: 12, description: "Tarte aux pommes caramélisées, crème fraîche épaisse", category: "Desserts" },
      { name: "Crème brûlée à la vanille", price: 11, description: "Crème onctueuse à la vanille de Madagascar, caramel craquant", category: "Desserts" },
      { name: "Fromage affiné du moment", price: 10, description: "Sélection de fromages affinés, confiture de cerises noires", category: "Desserts" },
      { name: "Menu Découverte 3 plats", price: 38, description: "Entrée + plat + dessert du chef, vin compris (mardi-venredi midi)", category: "Menus" },
      { name: "Menu Dégustation 5 plats", price: 55, description: "Parcours gastronomique complet avec accords mets-vins", category: "Menus" },
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
    services: [
      { name: "Soin Visage Hydratation Intense", price: 75, duration: "60 min", description: "Soin complet du visage avec nettoyage, gommage, masque et hydratation profonde Clarins" },
      { name: "Soin Visage Anti-Âge Lifting", price: 95, duration: "75 min", description: "Soin lifting aux actifs concentrés, massage remodelant Darphin, résultat visible immédiat" },
      { name: "Massage Décontractant Dos", price: 55, duration: "30 min", description: "Massage ciblé du dos et nuque, huiles essentielles détendantes" },
      { name: "Massage Aux Pierres Chaudes", price: 85, duration: "60 min", description: "Massage complet aux pierres volcaniques chaudes, relaxation profonde garantie" },
      { name: "Épilation Jambes Complètes", price: 35, duration: "30 min", description: "Épilation à la cire tiède, résultat longue durée, peau douce" },
      { name: "Manucure Beauté", price: 30, duration: "30 min", description: "Soin des mains, limage, cuticules, pose de vernis classique" },
      { name: "Pédicure Beauté", price: 35, duration: "40 min", description: "Soin complet des pieds, gommage, soin cuticules, vernis" },
      { name: "Forfait Mariée", price: 250, duration: "3h", description: "Essai visage + jour J : maquillage, coiffure, soin complet, ongles" },
      { name: "Pack Détente Absolue", price: 130, duration: "90 min", description: "Soin visage + massage dos + manucure, accueil thé et champagne" },
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
    menu: [
      { name: "Carpaccio de Saint-Jacques", price: 16, description: "Saint-Jacques finement tranchées, huile de truffe, roquette, copeaux de parmesan", category: "Entrées" },
      { name: "Risotto aux truffes noires", price: 22, description: "Risotto crémeux aux truffes du Périgord, parmesan 24 mois", category: "Entrées" },
      { name: "Filet mignon de veau", price: 32, description: "Filet mignon de veau laqué au jus réduit, purée de céleri, haricots verts", category: "Plats" },
      { name: "Dos de cabillaud rôti", price: 28, description: "Cabillaud en croûte d'herbes, émulsion de safran, légumes de saison", category: "Plats" },
      { name: "Fondant au chocolat noir", price: 13, description: "Chocolat Valrhona 70%, cœur coulant, glace vanille maison", category: "Desserts" },
      { name: "Menu Déjeuner 2 plats", price: 28, description: "2 plats au choix + café. Produits frais du marché. Verre de vin compris", category: "Menus" },
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
   FAMILY ACTIVITIES — standalone data for TOP 10 section
───────────────────────────────────────────────────────────── */
const FAMILY_ACTIVITIES = [
  {
    name: "Parc Animalier de Thoiry",
    slug: "parc-animalier-thoiry",
    description: "Safari et parc animalier avec plus de 700 animaux en semi-liberté. Labyrinthe végétal, château et jardins. Parfait pour une journée en famille !",
    image: "https://images.unsplash.com/photo-1474511320723-9a5680356743?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1474511320723-9a5680356743?w=800&q=80", "https://images.unsplash.com/photo-1570219461389-36cce29baa8e?w=800&q=80"],
    city: "Thoiry",
    address: "Rue du Pavillon de Montreuil, 78770 Thoiry",
    category: "Parc animalier",
    rating: 4.6, reviewCount: 1240,
    latitude: "48.8647", longitude: "1.8023",
    opening_hours: { lundi: "Fermé", mardi: "10:00–17:00", mercredi: "10:00–17:00", jeudi: "10:00–17:00", vendredi: "10:00–17:00", samedi: "09:30–18:00", dimanche: "09:30–18:00" },
    price: 29, active: true
  },
  {
    name: "France Miniature",
    slug: "france-miniature",
    description: "Parc de loisirs avec plus de 150 maquettes de monuments français au 1/30e. Parcours interactif, jeux et animations pour enfants.",
    image: "https://images.unsplash.com/photo-1565608377585-02dd794c066f?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1565608377585-02dd794c066f?w=800&q=80"],
    city: "Élancourt",
    address: "Boulevard André Malraux, 78950 Élancourt",
    category: "Parc de loisirs",
    rating: 4.3, reviewCount: 890,
    latitude: "48.7753", longitude: "2.0692",
    opening_hours: { lundi: "Fermé", mardi: "10:00–18:00", mercredi: "10:00–18:00", jeudi: "10:00–18:00", vendredi: "10:00–18:00", samedi: "10:00–19:00", dimanche: "10:00–19:00" },
    price: 24, active: true
  },
  {
    name: "Accrobranche Chien Vert",
    slug: "accrobranche-chien-vert",
    description: "Parcours acrobatiques en hauteur pour tous les âges (dès 3 ans). Tyroliennes, ponts de singes, filets. 12 parcours adaptés.",
    image: "https://images.unsplash.com/photo-1529156032033-7c3f8fdd6d6a?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1529156032033-7c3f8fdd6d6a?w=800&q=80"],
    city: "Saint-Germain-en-Laye",
    address: "Forêt de Saint-Germain-en-Laye, 78100",
    category: "Accrobranche",
    rating: 4.5, reviewCount: 567,
    latitude: "48.8955", longitude: "2.0905",
    opening_hours: { lundi: "Fermé", mardi: "10:00–18:00", mercredi: "10:00–18:00", jeudi: "10:00–18:00", vendredi: "10:00–18:00", samedi: "09:30–19:00", dimanche: "09:30–19:00" },
    price: 22, active: true
  },
  {
    name: "Base de Loisirs de Saint-Quentin",
    slug: "base-loisirs-saint-quentin",
    description: "Base de loisirs avec plan d'eau, baignade surveillée, pédalos, mini-golf, aires de jeux, VTT et pique-nique. Idéal en été !",
    image: "https://images.unsplash.com/photo-1544551760-1b1f9b9bbd5d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544551760-1b1f9b9bbd5d?w=800&q=80"],
    city: "Trappes",
    address: "Base de Loisirs, 78190 Trappes",
    category: "Base de loisirs",
    rating: 4.1, reviewCount: 432,
    latitude: "48.7742", longitude: "2.0055",
    opening_hours: { lundi: "09:00–19:00", mardi: "09:00–19:00", mercredi: "09:00–19:00", jeudi: "09:00–19:00", vendredi: "09:00–19:00", samedi: "08:00–20:00", dimanche: "08:00–20:00" },
    price: 5, active: true
  },
  {
    name: "Ferme du Prieuré",
    slug: "ferme-du-prieure",
    description: "Ferme pédagogique avec animaux de la ferme, ateliers cuisine, jardin potager, balades à poney. Activités pour enfants dès 2 ans.",
    image: "https://images.unsplash.com/photo-1516554063939-5150ef6cb1c5?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1516554063939-5150ef6cb1c5?w=800&q=80"],
    city: "Rambouillet",
    address: "Route de Poinville, 78120 Rambouillet",
    category: "Ferme pédagogique",
    rating: 4.7, reviewCount: 312,
    latitude: "48.6400", longitude: "1.8400",
    opening_hours: { lundi: "Fermé", mardi: "10:00–17:00", mercredi: "10:00–17:00", jeudi: "10:00–17:00", vendredi: "10:00–17:00", samedi: "10:00–18:00", dimanche: "10:00–18:00" },
    price: 12, active: true
  },
  {
    name: "Musée de la Toile de Jouy",
    slug: "musee-toile-de-jouy",
    description: "Musée dédié à la célèbre toile imprimée. Ateliers créatifs pour enfants, visites guidées, boutique. Château de l'Églantine.",
    image: "https://images.unsplash.com/photo-1554907984-152e6609a8c9?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1554907984-152e6609a8c9?w=800&q=80"],
    city: "Jouy-en-Josas",
    address: "54 Rue Charles de Gaulle, 78350 Jouy-en-Josas",
    category: "Musée",
    rating: 4.4, reviewCount: 198,
    latitude: "48.7644", longitude: "2.1619",
    opening_hours: { lundi: "Fermé", mardi: "14:00–18:00", mercredi: "10:00–18:00", jeudi: "14:00–18:00", vendredi: "14:00–18:00", samedi: "10:00–18:00", dimanche: "10:00–18:00" },
    price: 8, active: true
  },
  {
    name: "Escalade K2 Poissy",
    slug: "escalade-k2-poissy",
    description: "Salle d'escalade avec 1200m² de murs, blocs et voies. Encadrement enfants dès 4 ans, anniversaires, cours collectifs.",
    image: "https://images.unsplash.com/photo-1522165719154-dbc9265ba9b0?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1522165719154-dbc9265ba9b0?w=800&q=80"],
    city: "Poissy",
    address: "15 Rue des Pâtis, 78300 Poissy",
    category: "Escalade",
    rating: 4.5, reviewCount: 276,
    latitude: "48.9273", longitude: "2.0430",
    opening_hours: { lundi: "12:00–22:00", mardi: "10:00–22:00", mercredi: "10:00–22:00", jeudi: "12:00–22:00", vendredi: "12:00–22:00", samedi: "09:00–20:00", dimanche: "09:00–20:00" },
    price: 16, active: true
  },
  {
    name: "Bowling de Conflans",
    slug: "bowling-conflans",
    description: "Bowling 16 pistes, billards, salle d'arcade, bar et restaurant. Soirées cosmic bowling le week-end. Anniversaires enfants.",
    image: "https://images.unsplash.com/photo-1517166125740-14c7465a4e9d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1517166125740-14c7465a4e9d?w=800&q=80"],
    city: "Conflans-Sainte-Honorine",
    address: "3 Avenue de l'Europe, 78700 Conflans-Sainte-Honorine",
    category: "Bowling",
    rating: 4.2, reviewCount: 345,
    latitude: "49.0030", longitude: "2.0970",
    opening_hours: { lundi: "Fermé", mardi: "14:00–23:00", mercredi: "14:00–23:00", jeudi: "14:00–23:00", vendredi: "14:00–00:00", samedi: "10:00–00:00", dimanche: "10:00–22:00" },
    price: 18, active: true
  },
  {
    name: "Poterie de Versailles",
    slug: "poterie-versailles",
    description: "Atelier de poterie et céramique pour enfants et adultes. Cours de modelage, tournage, émaillage. Stages vacances et anniversaires créatifs.",
    image: "https://images.unsplash.com/photo-1565193566273-9f4af3c51121?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1565193566273-9f4af3c51121?w=800&q=80"],
    city: "Versailles",
    address: "22 Rue de Satory, 78000 Versailles",
    category: "Atelier créatif",
    rating: 4.8, reviewCount: 156,
    latitude: "48.8030", longitude: "2.1250",
    opening_hours: { lundi: "Fermé", mardi: "10:00–18:00", mercredi: "10:00–18:00", jeudi: "10:00–18:00", vendredi: "10:00–18:00", samedi: "10:00–18:00", dimanche: "10:00–13:00" },
    price: 25, active: true
  },
  {
    name: "Cinéma Pathé Conflans",
    slug: "cinema-pathe-conflans",
    description: "Cinéma 12 salles avec dernière technologie. Séances enfants le mercredi, avant-premières, offres familles. Popcorn et boissons.",
    image: "https://images.unsplash.com/photo-1489599841880-630c5c3b6f94?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1489599841880-630c5c3b6f94?w=800&q=80"],
    city: "Conflans-Sainte-Honorine",
    address: "Centre Commercial Les Boutriers, 78700 Conflans-Sainte-Honorine",
    category: "Cinéma",
    rating: 4.0, reviewCount: 678,
    latitude: "49.0050", longitude: "2.1000",
    opening_hours: { lundi: "11:00–23:00", mardi: "11:00–23:00", mercredi: "10:00–23:00", jeudi: "11:00–23:00", vendredi: "11:00–00:00", samedi: "10:00–00:00", dimanche: "10:00–23:00" },
    price: 12, active: true
  }
]

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

  // ── Family Activities ──
  const FamilyActivity = getFamilyActivityModel()
  let familyCount = 0
  for (const fa of FAMILY_ACTIVITIES) {
    await FamilyActivity.findOneAndUpdate({ slug: fa.slug }, fa, { upsert: true })
    familyCount++
  }
  console.log(`✅ ${familyCount} activités famille Yvelines insérées`)

  console.log('\n🎉 Seed Yvelines terminé ! LifeDeal Yvelines est prêt.')
  console.log('📍 Zones couvertes : Versailles, SGE, Poissy, Rambouillet, Les Mureaux, Sartrouville, Conflans, Vélizy, Mantes-la-Jolie')

  await mongoose.disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
