// scripts/seed.ts
// Run with: npx tsx scripts/seed.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local')
    process.exit(1)
}

async function seed() {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db!

    // Clear existing data
    const collections = ['users', 'categories', 'merchants', 'offers', 'locations', 'orders', 'reviews', 'favorites', 'banners']
    for (const col of collections) {
        try { await db.dropCollection(col) } catch { }
    }
    console.log('🗑️  Cleared existing data')

    // ============================================================
    // ADMIN USER
    // ============================================================
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await db.collection('users').insertMany([
        {
            name: 'Admin DealFlow',
            email: 'admin@dealflow.tn',
            password: hashedPassword,
            role: 'admin',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Fatma Ben Ali',
            email: 'fatma@email.com',
            password: await bcrypt.hash('client123', 12),
            role: 'client',
            phone: '+216 98 123 456',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Ahmed Merchant',
            email: 'ahmed@restaurant.tn',
            password: await bcrypt.hash('merchant123', 12),
            role: 'merchant',
            phone: '+216 55 789 012',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Salma Trabelsi',
            email: 'salma@email.com',
            role: 'client',
            provider: 'google',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Rania Gharbi',
            email: 'rania@email.com',
            role: 'client',
            phone: '+216 22 345 678',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ])
    console.log('✅ 5 users created (admin@dealflow.tn / admin123)')

    // ============================================================
    // LOCATIONS
    // ============================================================
    const locations = await db.collection('locations').insertMany([
        { name: 'Tunis', slug: 'tunis', region: 'Grand Tunis', active: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Sfax', slug: 'sfax', region: 'Sud', active: true, order: 2, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Sousse', slug: 'sousse', region: 'Sahel', active: true, order: 3, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Hammamet', slug: 'hammamet', region: 'Cap Bon', active: true, order: 4, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Djerba', slug: 'djerba', region: 'Sud', active: true, order: 5, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Monastir', slug: 'monastir', region: 'Sahel', active: true, order: 6, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log(`✅ ${Object.keys(locations.insertedIds).length} locations created`)

    // ============================================================
    // CATEGORIES
    // ============================================================
    const categories = await db.collection('categories').insertMany([
        { name: 'Restaurants', slug: 'restaurants', icon: 'UtensilsCrossed', order: 1, active: true, description: 'Les meilleurs restaurants et offres gastronomiques', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Hôtels', slug: 'hotels', icon: 'Building2', order: 2, active: true, description: 'Séjours et nuitées à prix réduits', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Spa', slug: 'spa', icon: 'Waves', order: 3, active: true, description: 'Détente, hammam et soins bien-être', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Beauté', slug: 'beaute', icon: 'Sparkles', order: 4, active: true, description: 'Coiffure, esthétique et soins beauté', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Sport', slug: 'sport', icon: 'Dumbbell', order: 5, active: true, description: 'Salles de sport, cours et activités sportives', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Services maison', slug: 'services-maison', icon: 'Home', order: 6, active: true, description: 'Plomberie, électricité, nettoyage et plus', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Transport', slug: 'transport', icon: 'Car', order: 7, active: true, description: 'Location de voitures, navettes et transport', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Événements', slug: 'evenements', icon: 'PartyPopper', order: 8, active: true, description: 'Spectacles, concerts et sorties', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Animaux', slug: 'animaux', icon: 'PawPrint', order: 9, active: true, description: 'Toilettage, vétérinaire et accessoires', createdAt: new Date(), updatedAt: new Date() },
    ])
    const catIds = Object.values(categories.insertedIds).map(id => id.toString())
    console.log(`✅ ${catIds.length} categories created`)

    // ============================================================
    // MERCHANTS
    // ============================================================
    const merchants = await db.collection('merchants').insertMany([
        {
            name: 'Le Baroque Restaurant', slug: 'le-baroque', description: 'Restaurant gastronomique au cœur de Tunis, spécialisé en cuisine méditerranéenne fusion.',
            city: 'Tunis', address: 'Avenue Habib Bourguiba, Tunis', phone: '+216 71 123 456', email: 'contact@lebaroque.tn',
            logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
            verified: true, active: true, rating: 4.7, reviewCount: 124,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Spa Royal Hammamet', slug: 'spa-royal-hammamet', description: 'Centre de bien-être 5 étoiles avec hammam traditionnel, piscine et soins premium.',
            city: 'Hammamet', address: 'Zone Touristique Yasmine, Hammamet', phone: '+216 72 456 789', email: 'info@sparoyal.tn',
            logo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop',
            verified: true, active: true, rating: 4.9, reviewCount: 89,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'FitZone Sfax', slug: 'fitzone-sfax', description: 'Salle de sport moderne avec équipements dernière génération, coaching et cours collectifs.',
            city: 'Sfax', address: 'Route de Tunis km 5, Sfax', phone: '+216 74 321 654', email: 'fitzone@sfax.tn',
            logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
            verified: true, active: true, rating: 4.5, reviewCount: 67,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hôtel Dar El Marsa', slug: 'dar-el-marsa', description: 'Hôtel boutique de charme à La Marsa avec vue sur mer, restaurant gastronomique et terrasse.',
            city: 'Tunis', address: 'La Marsa, Tunis', phone: '+216 71 987 654', email: 'reservation@darelmarsa.tn',
            logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
            verified: true, active: true, rating: 4.8, reviewCount: 156,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Beauté Plus Sousse', slug: 'beaute-plus-sousse', description: 'Institut de beauté premium, soins visage, manucure, pédicure et maquillage professionnel.',
            city: 'Sousse', address: 'Rue de la République, Sousse', phone: '+216 73 111 222', email: 'contact@beauteplus.tn',
            logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
            verified: false, active: true, rating: 4.3, reviewCount: 42,
            createdAt: new Date(), updatedAt: new Date(),
        },
    ])
    const merchantIds = Object.values(merchants.insertedIds).map(id => id.toString())
    console.log(`✅ ${merchantIds.length} merchants created`)

    // ============================================================
    // OFFERS
    // ============================================================
    const offers = await db.collection('offers').insertMany([
        {
            title: 'Menu Dégustation pour 2 personnes', slug: 'menu-degustation-baroque',
            shortDescription: 'Entrée + Plat + Dessert pour 2 avec boisson incluse',
            description: 'Découvrez un menu dégustation exceptionnel composé d\'une entrée au choix, d\'un plat signature du chef et d\'un dessert raffiné. Boissons soft incluses. Valable du lundi au jeudi.',
            categoryId: catIds[0], merchantId: merchantIds[0], city: 'Tunis', address: 'Avenue Habib Bourguiba, Tunis',
            coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
            galleryImages: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600'],
            originalPrice: 180, dealPrice: 99, discountPercent: 45, rating: 4.6, reviewCount: 34,
            featured: true, status: 'active', tags: ['couple', 'gastronomie', 'dîner'],
            soldCount: 156, viewCount: 2340,
            startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Journée Spa Complète + Hammam', slug: 'journee-spa-royal',
            shortDescription: 'Accès spa, hammam, piscine + massage 30min',
            description: 'Profitez d\'une journée de relaxation totale avec accès illimité au spa, hammam traditionnel, piscine chauffée et un massage relaxant de 30 minutes. Serviettes et peignoirs fournis.',
            categoryId: catIds[2], merchantId: merchantIds[1], city: 'Hammamet', address: 'Zone Touristique Yasmine',
            coverImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
            galleryImages: ['https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600'],
            originalPrice: 250, dealPrice: 129, discountPercent: 48, rating: 4.9, reviewCount: 67,
            featured: true, status: 'active', tags: ['spa', 'hammam', 'détente', 'massage'],
            soldCount: 234, viewCount: 4560,
            startDate: new Date(), endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Abonnement 3 mois Fitness', slug: 'abonnement-fitzone-3mois',
            shortDescription: '3 mois d\'accès illimité + séance coaching offerte',
            description: 'Abonnement fitness 3 mois avec accès illimité à toutes les machines, cours collectifs (Zumba, CrossFit, Yoga) et une séance de coaching personnalisée offerte.',
            categoryId: catIds[4], merchantId: merchantIds[2], city: 'Sfax', address: 'Route de Tunis km 5',
            coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
            originalPrice: 450, dealPrice: 249, discountPercent: 45, rating: 4.5, reviewCount: 28,
            featured: true, status: 'active', tags: ['sport', 'fitness', 'musculation'],
            soldCount: 89, viewCount: 1890,
            startDate: new Date(), endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Nuit + Petit-déjeuner vue mer', slug: 'nuit-dar-el-marsa',
            shortDescription: '1 nuit en chambre double + petit-déjeuner buffet',
            description: 'Offrez-vous une nuit de luxe dans notre chambre double avec vue sur la Méditerranée. Petit-déjeuner buffet inclus avec produits frais et locaux. Late checkout à 14h.',
            categoryId: catIds[1], merchantId: merchantIds[3], city: 'Tunis', address: 'La Marsa',
            coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
            galleryImages: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'],
            originalPrice: 350, dealPrice: 199, discountPercent: 43, rating: 4.8, reviewCount: 45,
            featured: true, status: 'active', tags: ['hôtel', 'vue mer', 'romantique'],
            soldCount: 112, viewCount: 3200,
            startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Soin Visage Complet + Manucure', slug: 'soin-visage-beaute-plus',
            shortDescription: 'Nettoyage + soin hydratant + manucure semi-permanent',
            description: 'Un soin visage complet incluant nettoyage en profondeur, gommage, masque hydratant et une manucure semi-permanent avec vernis au choix.',
            categoryId: catIds[3], merchantId: merchantIds[4], city: 'Sousse', address: 'Rue de la République',
            coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
            originalPrice: 120, dealPrice: 59, discountPercent: 51, rating: 4.3, reviewCount: 19,
            featured: false, status: 'active', tags: ['beauté', 'soin visage', 'manucure'],
            soldCount: 45, viewCount: 890,
            startDate: new Date(), endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Brunch Weekend All-You-Can-Eat', slug: 'brunch-weekend-baroque',
            shortDescription: 'Brunch à volonté chaque samedi et dimanche',
            description: 'Brunch illimité avec viennoiseries, œufs Benedict, pancakes, fruits frais, jus naturels et boissons chaudes. Ambiance jazz live chaque dimanche.',
            categoryId: catIds[0], merchantId: merchantIds[0], city: 'Tunis', address: 'Avenue Habib Bourguiba',
            coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
            originalPrice: 85, dealPrice: 49, discountPercent: 42, rating: 4.4, reviewCount: 56,
            featured: false, status: 'active', tags: ['brunch', 'weekend', 'buffet'],
            soldCount: 198, viewCount: 2100,
            startDate: new Date(), endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Massage aux Huiles Essentielles 60min', slug: 'massage-huiles-spa-royal',
            shortDescription: 'Massage relaxant corps complet aux huiles bio',
            description: 'Un massage relaxant de 60 minutes aux huiles essentielles biologiques. Choix entre massage suédois, aux pierres chaudes ou aromathérapie. Thé et fruits offerts après le soin.',
            categoryId: catIds[2], merchantId: merchantIds[1], city: 'Hammamet',
            coverImage: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop',
            originalPrice: 150, dealPrice: 79, discountPercent: 47, rating: 4.8, reviewCount: 38,
            featured: false, status: 'active', tags: ['massage', 'relaxation', 'huiles essentielles'],
            soldCount: 167, viewCount: 1950,
            startDate: new Date(), endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Pack Épilation Laser 3 Zones', slug: 'epilation-laser-beaute-plus',
            shortDescription: '3 zones au choix : aisselles, maillot, jambes',
            description: 'Épilation laser définitive pour 3 zones au choix. Technologie de dernière génération, séance indolore et résultats dès la 2e séance.',
            categoryId: catIds[3], merchantId: merchantIds[4], city: 'Sousse',
            coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
            originalPrice: 300, dealPrice: 149, discountPercent: 50, rating: 4.1, reviewCount: 15,
            featured: false, status: 'active', tags: ['laser', 'épilation', 'beauté'],
            soldCount: 34, viewCount: 780,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Séance CrossFit + Nutrition', slug: 'crossfit-nutrition-fitzone',
            shortDescription: '10 séances CrossFit + plan nutritionnel personnalisé',
            description: '10 séances de CrossFit encadrées par un coach certifié plus un plan nutritionnel personnalisé établi par notre diététicienne.',
            categoryId: catIds[4], merchantId: merchantIds[2], city: 'Sfax',
            coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop',
            originalPrice: 200, dealPrice: 119, discountPercent: 41, rating: 4.6, reviewCount: 22,
            featured: false, status: 'active', tags: ['crossfit', 'nutrition', 'coaching'],
            soldCount: 56, viewCount: 1230,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Suite Romantique + Dîner', slug: 'suite-romantique-dar-el-marsa',
            shortDescription: 'Suite vue mer + dîner gastronomique pour 2',
            description: 'Package romantique incluant une nuit en suite avec vue mer panoramique, dîner gastronomique pour 2 avec une bouteille de vin, petit-déjeuner en chambre et late checkout à 16h.',
            categoryId: catIds[1], merchantId: merchantIds[3], city: 'Tunis',
            coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
            originalPrice: 600, dealPrice: 349, discountPercent: 42, rating: 4.9, reviewCount: 31,
            featured: true, status: 'active', tags: ['romantique', 'suite', 'dîner', 'vue mer'],
            soldCount: 78, viewCount: 2800,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Draft — Cours de Yoga en Plein Air', slug: 'yoga-plein-air',
            shortDescription: '8 séances de yoga en plein air le matin',
            description: 'Cours de yoga matinal en plein air, face à la mer. 8 séances de 90 minutes avec un professeur certifié.',
            categoryId: catIds[4], merchantId: merchantIds[2], city: 'Sfax',
            coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
            originalPrice: 160, dealPrice: 89, discountPercent: 44, rating: 0, reviewCount: 0,
            featured: false, status: 'draft', tags: ['yoga', 'plein air'],
            soldCount: 0, viewCount: 0,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            title: 'Archived — Pack Bien-être Été 2025', slug: 'bien-etre-ete-2025',
            shortDescription: 'Pack spa + massage + hammam été',
            description: 'Offre estivale 2025 expirée.',
            categoryId: catIds[2], merchantId: merchantIds[1], city: 'Hammamet',
            coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6e?w=600&h=400&fit=crop',
            originalPrice: 200, dealPrice: 99, discountPercent: 51, rating: 4.7, reviewCount: 89,
            featured: false, status: 'archived', tags: ['été', 'spa'],
            soldCount: 345, viewCount: 5600,
            createdAt: new Date('2025-06-01'), updatedAt: new Date('2025-09-01'),
        },
    ])
    console.log(`✅ ${Object.keys(offers.insertedIds).length} offers created`)

    // ============================================================
    // ORDERS
    // ============================================================
    const offerIds = Object.values(offers.insertedIds).map(id => id.toString())
    await db.collection('orders').insertMany([
        { userId: 'user1', offerId: offerIds[0], merchantId: merchantIds[0], quantity: 1, unitPrice: 99, totalPrice: 99, status: 'confirmed', customerName: 'Fatma Ben Ali', customerEmail: 'fatma@email.com', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user2', offerId: offerIds[1], merchantId: merchantIds[1], quantity: 2, unitPrice: 129, totalPrice: 258, status: 'paid', customerName: 'Salma Trabelsi', customerEmail: 'salma@email.com', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user3', offerId: offerIds[3], merchantId: merchantIds[3], quantity: 1, unitPrice: 199, totalPrice: 199, status: 'pending', customerName: 'Rania Gharbi', customerEmail: 'rania@email.com', createdAt: new Date(), updatedAt: new Date() },
        { userId: 'user1', offerId: offerIds[5], merchantId: merchantIds[0], quantity: 3, unitPrice: 49, totalPrice: 147, status: 'confirmed', customerName: 'Fatma Ben Ali', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user2', offerId: offerIds[2], merchantId: merchantIds[2], quantity: 1, unitPrice: 249, totalPrice: 249, status: 'cancelled', customerName: 'Salma Trabelsi', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user3', offerId: offerIds[6], merchantId: merchantIds[1], quantity: 1, unitPrice: 79, totalPrice: 79, status: 'confirmed', customerName: 'Rania Gharbi', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user1', offerId: offerIds[4], merchantId: merchantIds[4], quantity: 1, unitPrice: 59, totalPrice: 59, status: 'paid', customerName: 'Fatma Ben Ali', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
    ])
    console.log('✅ 7 sample orders created')

    // ============================================================
    // REVIEWS
    // ============================================================
    await db.collection('reviews').insertMany([
        { userId: 'user1', offerId: offerIds[0], merchantId: merchantIds[0], userName: 'Fatma B.', rating: 5, comment: 'Menu exceptionnel ! Le chef a été très attentif. Je recommande vivement.', approved: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user2', offerId: offerIds[1], merchantId: merchantIds[1], userName: 'Salma T.', rating: 5, comment: 'Le spa est magnifique, le hammam est authentique. Personnel très professionnel.', approved: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user3', offerId: offerIds[3], merchantId: merchantIds[3], userName: 'Rania G.', rating: 4, comment: 'Très bel hôtel avec une vue superbe. Petit-déjeuner varié. Seul bémol: le parking est petit.', approved: true, createdAt: new Date(), updatedAt: new Date() },
        { userId: 'user1', offerId: offerIds[5], merchantId: merchantIds[0], userName: 'Fatma B.', rating: 4, comment: 'Brunch copieux et délicieux ! L\'ambiance jazz du dimanche est un vrai plus.', approved: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
        { userId: 'user2', offerId: offerIds[6], merchantId: merchantIds[1], userName: 'Salma T.', rating: 5, comment: 'Massage divin ! Les huiles étaient parfaites. Je reviendrai sans hésiter.', approved: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), updatedAt: new Date() },
    ])
    console.log('✅ 5 reviews created')

    // ============================================================
    // BANNERS
    // ============================================================
    await db.collection('banners').insertMany([
        { title: 'Jusqu\'à -50% sur les Spas', subtitle: 'Offres limitées sur les meilleurs spas de Tunisie', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=400&fit=crop', link: '/categories/spa', position: 'hero', order: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
        { title: 'Nouveaux Restaurants', subtitle: 'Découvrez les dernières offres gastronomiques', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop', link: '/categories/restaurants', position: 'hero', order: 2, active: true, createdAt: new Date(), updatedAt: new Date() },
        { title: 'Escapades Romantiques', subtitle: 'Hôtels & suites à prix réduits', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=400&fit=crop', link: '/categories/hotels', position: 'hero', order: 3, active: true, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ 3 banners created')

    console.log('\n🎉 Seed complete! DealFlow data loaded successfully.')
    console.log('📧 Admin login: admin@dealflow.tn / admin123')
    console.log('📧 Merchant login: ahmed@restaurant.tn / merchant123')
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})
