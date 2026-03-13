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
    const collections = ['users', 'services', 'staffs', 'clients', 'products', 'bookings']
    for (const col of collections) {
        try { await db.dropCollection(col) } catch { }
    }
    console.log('🗑️  Cleared existing data')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await db.collection('users').insertOne({
        name: 'Admin Physio',
        email: 'admin@physio.tn',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
    })
    console.log('✅ Admin user created (admin@physio.tn / admin123)')

    // ============================================================
    // SERVICES — Real data from Institut Physio Fresha
    // ============================================================
    const services = await db.collection('services').insertMany([
        // ─── LASER ─────────────────────────────────────────────
        {
            name: 'Laser Carbon', nameFr: 'Laser Carbone',
            description: 'Carbon laser facial treatment', descriptionFr: 'Traitement laser carbone pour le visage',
            category: 'Laser', duration: 60, price: 150, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Laser Pack', nameFr: 'Pack Laser',
            description: 'Complete laser package: upper lip, underarms, intimate zone, carbon, full face',
            descriptionFr: 'Laser moustache, aisselles, zone intime, carbone, visage',
            category: 'Laser', duration: 60, price: 350, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: '3 Laser Underarms Sessions', nameFr: '03 Laser Aisselles',
            description: '3 underarm laser sessions', descriptionFr: '03 séances laser aisselles',
            category: 'Laser', duration: 15, price: 240, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Laser Hair Removal Promo', nameFr: 'Promo Laser Épilation Aisselles + Lèvre Supérieure',
            description: 'Promotional laser hair removal for underarms and upper lip',
            descriptionFr: 'Épilation laser définitive aisselles et lèvre supérieure',
            category: 'Laser', duration: 30, price: 150, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Full Body Laser', nameFr: 'Laser Corps Complet',
            description: 'Full body laser treatment - 600DT per session', descriptionFr: 'Laser corps complet 600dt par séance',
            category: 'Laser', duration: 120, price: 900, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Full Legs Laser', nameFr: 'Laser Jambes Complètes',
            description: 'Complete legs laser treatment', descriptionFr: 'Laser jambes complètes',
            category: 'Laser', duration: 30, price: 250, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Half Legs Laser', nameFr: 'Laser ½ Jambes ou Cuisses',
            description: 'Half legs or thighs laser', descriptionFr: 'Laser demi-jambes ou cuisses',
            category: 'Laser', duration: 30, price: 150, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Forearm Laser', nameFr: 'Laser Avant-bras',
            description: 'Forearm laser treatment', descriptionFr: 'Laser avant-bras',
            category: 'Laser', duration: 20, price: 150, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Underarm Laser', nameFr: 'Laser Aisselles',
            description: 'Underarm laser treatment', descriptionFr: 'Laser aisselles',
            category: 'Laser', duration: 20, price: 100, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Bikini Laser', nameFr: 'Laser Maillot Intégral',
            description: 'Full bikini laser treatment', descriptionFr: 'Laser maillot traditionnel à intégral',
            category: 'Laser', duration: 30, price: 250, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Face Laser', nameFr: 'Laser Visage',
            description: 'Full face laser treatment', descriptionFr: 'Laser visage',
            category: 'Laser', duration: 15, price: 120, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Upper Lip + Chin Laser', nameFr: 'Laser Lèvre Supérieure + Menton',
            description: 'Upper lip and chin laser', descriptionFr: 'Laser lèvre supérieure + menton',
            category: 'Laser', duration: 15, price: 70, icon: 'zap', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── SOINS VISAGE ──────────────────────────────────────
        {
            name: 'Glowy Face Pack', nameFr: 'Pack Glowy Face',
            description: 'Hydrafacial 10in1 + free oxygenio or mesotherapy',
            descriptionFr: 'Soin hydrafacial 10en1 + oxygénio ou mésothérapie gratuite',
            category: 'Soins Visage', duration: 60, price: 150, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hydrafacial 15 in 1', nameFr: 'Hydrafacial 15 en 1',
            description: 'Ultimate multi-step skin treatment: deep cleansing, exfoliation, extraction, intense hydration, antioxidant protection',
            descriptionFr: 'Traitement ultime multi-étapes : nettoyage en profondeur, exfoliation, extraction, hydratation intense, protection antioxydante',
            category: 'Soins Visage', duration: 120, price: 350, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Anti-Aging Pack', nameFr: 'Pack Anti-Âge',
            description: 'Age Reverse treatment with Protein Line + Mesotherapy + 3 RF sessions + 1 HIFU session',
            descriptionFr: 'Soin Âge Reverse - Protéine Line + Mésothérapie + 3 séances radiofréquence + 1 séance HIFU',
            category: 'Soins Visage', duration: 60, price: 450, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hydrafacial + Skin Booster Pack', nameFr: 'Pack Hydrafacial + Skin Booster',
            description: 'Deep cleansing, dermabrasion, scrubber, ultrasound, RF, meso cocktails, skin booster, peel off mask, LED mask',
            descriptionFr: 'Nettoyage en profondeur + Dermabrasion + Scrubber + Ultrasons + Radiofréquence + Méso cocktails + Skin Booster + Masque Peel Off + Masque LED',
            category: 'Soins Visage', duration: 60, price: 200, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Dermaplaning', nameFr: 'Dermaplaning Visage',
            description: 'Facial dermaplaning treatment', descriptionFr: 'Dermaplaning visage',
            category: 'Soins Visage', duration: 30, price: 25, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'HIFU Face', nameFr: 'Séance HIFU Visage',
            description: 'HIFU facial session', descriptionFr: '01 séance HIFU visage',
            category: 'Soins Visage', duration: 30, price: 350, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Facial Injection', nameFr: 'Injection Visage',
            description: 'Facial injection treatment', descriptionFr: 'Injection visage',
            category: 'Soins Visage', duration: 20, price: 200, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'PRP', nameFr: 'P.R.P',
            description: 'PRP (Platelet-Rich Plasma) treatment', descriptionFr: 'Traitement P.R.P',
            category: 'Soins Visage', duration: 30, price: 200, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Treatment Cure', nameFr: 'Cure Soin',
            description: 'Complete treatment cure', descriptionFr: 'Cure de soins complète',
            category: 'Soins Visage', duration: 60, price: 600, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hydrafacial 7 in 1', nameFr: 'Hydra Facial 7 en 1',
            description: '7-in-1 hydrafacial treatment', descriptionFr: 'Soin hydrafacial 7 en 1',
            category: 'Soins Visage', duration: 60, price: 150, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hydrafacial PRO 10 in 1', nameFr: 'Hydrafacial PRO 10 en 1',
            description: '10-in-1 PRO hydrafacial treatment', descriptionFr: 'Soin Hydrafacial PRO 10 en 1',
            category: 'Soins Visage', duration: 60, price: 200, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'RF Microneedling', nameFr: 'Radiofréquence Microneedling',
            description: 'Radiofrequency microneedling session', descriptionFr: 'Séance de radiofréquence microneedling',
            category: 'Soins Visage', duration: 25, price: 180, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Hydrafacial PRO + Oxygeneo', nameFr: 'Hydra Facial PRO + Oxygeneo',
            description: 'Hydrafacial PRO combined with Oxygeneo treatment', descriptionFr: 'Soin Hydrafacial PRO combiné avec Oxygeneo',
            category: 'Soins Visage', duration: 80, price: 380, icon: 'sparkles', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── MASSAGE & AMINCISSEMENT ────────────────────────────
        {
            name: 'Summer Body Dream Pack', nameFr: 'Summer Body Dream Pack',
            description: '3 injections, lymphatic drainage, 5 Tesla, maderotherapy, EMS, pressotherapy',
            descriptionFr: '3 injections + drainage lymphatique + 5 Tesla + madérothérapie + EMS + pressothérapie',
            category: 'Massage & Amincissement', duration: 60, price: 799, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Cellulite Promo Pack', nameFr: 'Pack Promo Cellulite',
            description: 'Anti-cellulite promotional pack', descriptionFr: 'Pack promotionnel anti-cellulite',
            category: 'Massage & Amincissement', duration: 60, price: 200, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Summer Body', nameFr: 'Summer Body',
            description: '5 Madero, 5 dynamic, 10 manual massages, 1 injection, 10 EMS, 5 Tesla',
            descriptionFr: '5 Madero + 5 dynamiques + 10 massages manuels + 1 injection + 10 EMS + 5 Tesla',
            category: 'Massage & Amincissement', duration: 60, price: 600, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Lymphatic Drainage', nameFr: 'Drainage Lymphatique',
            description: 'Lymphatic drainage session', descriptionFr: '01 séance de drainage lymphatique',
            category: 'Massage & Amincissement', duration: 50, price: 30, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── TESLA ──────────────────────────────────────────────
        {
            name: '1 Tesla Session', nameFr: '01 Séance Tesla',
            description: 'Single Tesla Sculpt session', descriptionFr: '01 séance Tesla Sculpt',
            category: 'Tesla Sculpt', duration: 30, price: 80, icon: 'dumbbell', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: '4 Tesla Sessions', nameFr: '04 Séances Tesla',
            description: '4 Tesla Sculpt sessions', descriptionFr: '04 séances Tesla Sculpt',
            category: 'Tesla Sculpt', duration: 30, price: 300, icon: 'dumbbell', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: '5 Tesla Sessions', nameFr: '05 Séances Tesla',
            description: '5 Tesla Sculpt sessions', descriptionFr: '05 séances Tesla Sculpt',
            category: 'Tesla Sculpt', duration: 30, price: 350, icon: 'dumbbell', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: '10 Tesla Sessions', nameFr: '10 Séances Tesla',
            description: '10 Tesla Sculpt sessions', descriptionFr: '10 séances Tesla Sculpt',
            category: 'Tesla Sculpt', duration: 30, price: 600, icon: 'dumbbell', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: '15 Tesla Sessions', nameFr: '15 Séances Tesla',
            description: '15 Tesla Sculpt sessions', descriptionFr: '15 séances Tesla Sculpt',
            category: 'Tesla Sculpt', duration: 30, price: 800, icon: 'dumbbell', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── HIFU ───────────────────────────────────────────────
        {
            name: 'HIFU Body Pack', nameFr: 'Pack HIFU Corps',
            description: 'HIFU body treatment pack', descriptionFr: 'Pack HIFU corps',
            category: 'HIFU', duration: 60, price: 400, icon: 'target', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'HIFU Complete Pack', nameFr: 'Pack HIFU Complet',
            description: 'HIFU face + hydrafacial + HIFU body', descriptionFr: 'HIFU visage + hydrafacial + HIFU corps',
            category: 'HIFU', duration: 60, price: 400, icon: 'target', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── MÉDICAL ────────────────────────────────────────────
        {
            name: 'Botox', nameFr: 'Botox',
            description: 'Botox injection treatment', descriptionFr: 'Traitement injection Botox',
            category: 'Médical', duration: 60, price: 300, icon: 'syringe', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Medical Massage', nameFr: 'Massage Médical',
            description: 'Therapeutic medical massage', descriptionFr: 'Massage médical thérapeutique',
            category: 'Médical', duration: 60, price: 10, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Cupping Therapy', nameFr: 'Cupping Thérapie',
            description: 'Therapeutic cupping session', descriptionFr: 'Séance de cupping thérapie',
            category: 'Médical', duration: 60, price: 35, icon: 'heart', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },

        // ─── PROMOTIONS ─────────────────────────────────────────
        {
            name: 'Body Boost Pack', nameFr: 'Body Boost - Hello Glow',
            description: '5 Tesla Sculpt + 10 Madero + 10 Electro + 10 Dynamic sessions',
            descriptionFr: '💪 5 séances Tesla Sculpt + 🌿 10 séances Madero + ⚡ 10 séances Electro + 💃 10 séances Dynamique',
            category: 'Promotions', duration: 60, price: 399, icon: 'flame', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Trio Lisse - Laser Pack', nameFr: 'Trio Lisse - Épilation Laser',
            description: 'Laser hair removal: half legs, underarms, upper lip',
            descriptionFr: 'Épilation laser : demi-jambes + aisselles + moustache',
            category: 'Promotions', duration: 60, price: 250, icon: 'flame', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Bye Bye Hair Pack', nameFr: 'Bye Bye Poils',
            description: '5 upper lip laser + 5 underarm laser sessions',
            descriptionFr: '5 séances laser moustache + 5 séances laser aisselles',
            category: 'Promotions', duration: 60, price: 599, icon: 'flame', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Remodeling Pack', nameFr: 'Pack Remodelage',
            description: 'Body assessment + 3 Tesla + 5 Madero + 3 RF + 5 manual massages + 10 electrostimulation',
            descriptionFr: 'Bilan morphologique + 3 séances Tesla + 5 séances Madéro + 3 séances Radiofréquence + 5 massages manuels + 10 séances Électrostimulation',
            category: 'Promotions', duration: 60, price: 499, icon: 'flame', isActive: true,
            createdAt: new Date(), updatedAt: new Date(),
        },
    ])
    console.log(`✅ ${Object.keys(services.insertedIds).length} services created`)

    // ============================================================
    // STAFF
    // ============================================================
    await db.collection('staffs').insertMany([
        {
            name: 'Dr. Physio', role: 'Médecin Esthétique', specialties: ['Botox', 'Injections', 'PRP'], avatar: '', services: [], isActive: true,
            schedule: {
                monday: { start: '09:00', end: '18:00', isOff: false },
                tuesday: { start: '09:00', end: '18:00', isOff: false },
                wednesday: { start: '09:00', end: '18:00', isOff: false },
                thursday: { start: '09:00', end: '18:00', isOff: false },
                friday: { start: '09:00', end: '18:00', isOff: false },
                saturday: { start: '09:00', end: '14:00', isOff: false },
                sunday: { start: '09:00', end: '14:00', isOff: true },
            },
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Sarah', role: 'Esthéticienne Senior', specialties: ['Hydrafacial', 'Soins Visage', 'Dermaplaning'], avatar: '', services: [], isActive: true,
            schedule: {
                monday: { start: '09:00', end: '18:00', isOff: false },
                tuesday: { start: '09:00', end: '18:00', isOff: false },
                wednesday: { start: '09:00', end: '18:00', isOff: false },
                thursday: { start: '09:00', end: '18:00', isOff: false },
                friday: { start: '09:00', end: '18:00', isOff: false },
                saturday: { start: '09:00', end: '14:00', isOff: false },
                sunday: { start: '09:00', end: '14:00', isOff: true },
            },
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Amira', role: 'Spécialiste Laser', specialties: ['Laser', 'Épilation', 'Carbone'], avatar: '', services: [], isActive: true,
            schedule: {
                monday: { start: '09:00', end: '18:00', isOff: false },
                tuesday: { start: '09:00', end: '18:00', isOff: false },
                wednesday: { start: '09:00', end: '18:00', isOff: true },
                thursday: { start: '09:00', end: '18:00', isOff: false },
                friday: { start: '09:00', end: '18:00', isOff: false },
                saturday: { start: '09:00', end: '14:00', isOff: false },
                sunday: { start: '09:00', end: '14:00', isOff: true },
            },
            createdAt: new Date(), updatedAt: new Date(),
        },
        {
            name: 'Nadia', role: 'Masseuse & Tesla', specialties: ['Tesla Sculpt', 'Massage', 'Madéro', 'Drainage'], avatar: '', services: [], isActive: true,
            schedule: {
                monday: { start: '09:00', end: '18:00', isOff: false },
                tuesday: { start: '09:00', end: '18:00', isOff: false },
                wednesday: { start: '09:00', end: '18:00', isOff: false },
                thursday: { start: '09:00', end: '18:00', isOff: false },
                friday: { start: '09:00', end: '18:00', isOff: false },
                saturday: { start: '09:00', end: '14:00', isOff: false },
                sunday: { start: '09:00', end: '14:00', isOff: true },
            },
            createdAt: new Date(), updatedAt: new Date(),
        },
    ])
    console.log('✅ 4 staff members created')

    // ============================================================
    // PRODUCTS
    // ============================================================
    await db.collection('products').insertMany([
        { name: 'Hyaluronic Acid Serum', nameFr: 'Sérum Acide Hyaluronique', description: 'Intense hydration serum', descriptionFr: 'Sérum hydratation intense', category: 'Visage', price: 45, stock: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Sunscreen SPF50', nameFr: 'Crème Solaire SPF50', description: 'High protection sunscreen', descriptionFr: 'Protection solaire haute protection', category: 'Visage', price: 35, stock: 30, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Anti-Aging Cream', nameFr: 'Crème Anti-Âge', description: 'Premium anti-aging cream', descriptionFr: 'Crème anti-âge premium', category: 'Visage', price: 65, stock: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Body Firming Cream', nameFr: 'Crème Raffermissante Corps', description: 'Body firming and toning cream', descriptionFr: 'Crème raffermissante et tonifiante', category: 'Corps', price: 40, stock: 25, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Post-Laser Soothing Gel', nameFr: 'Gel Apaisant Post-Laser', description: 'Soothing gel for after laser treatments', descriptionFr: 'Gel apaisant après traitements laser', category: 'Laser', price: 28, stock: 35, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { name: 'Vitamin C Serum', nameFr: 'Sérum Vitamine C', description: 'Brightening Vitamin C serum', descriptionFr: 'Sérum éclat à la vitamine C', category: 'Visage', price: 55, stock: 18, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ 6 products created')

    // ============================================================
    // SAMPLE CLIENTS
    // ============================================================
    await db.collection('clients').insertMany([
        { name: 'Fatma Ben Ali', phone: '+216 98 123 456', email: 'fatma.ba@email.com', notes: 'Peau sensible, éviter produits agressifs', tags: ['VIP', 'Fidèle'], totalSpent: 1200, totalVisits: 12, lastVisit: new Date('2026-03-10'), createdAt: new Date(), updatedAt: new Date() },
        { name: 'Salma Trabelsi', phone: '+216 55 789 012', email: 'salma.t@email.com', notes: '', tags: ['Fidèle'], totalSpent: 650, totalVisits: 6, lastVisit: new Date('2026-03-05'), createdAt: new Date(), updatedAt: new Date() },
        { name: 'Rania Gharbi', phone: '+216 22 345 678', email: '', notes: 'Intéressée par pack laser complet', tags: ['Nouveau'], totalSpent: 150, totalVisits: 1, lastVisit: new Date('2026-03-11'), createdAt: new Date(), updatedAt: new Date() },
        { name: 'Ines Hammami', phone: '+216 97 654 321', email: 'ines.h@email.com', notes: 'Allergie latex', tags: ['Fidèle'], totalSpent: 890, totalVisits: 8, lastVisit: new Date('2026-02-20'), createdAt: new Date(), updatedAt: new Date() },
        { name: 'Meriem Sfaxi', phone: '+216 50 111 222', email: '', notes: '', tags: [], totalSpent: 200, totalVisits: 2, lastVisit: new Date('2026-01-15'), createdAt: new Date(), updatedAt: new Date() },
    ])
    console.log('✅ 5 sample clients created')

    console.log('\n🎉 Seed complete! Institut Physio data loaded successfully.')
    console.log('📧 Admin login: admin@physio.tn / admin123')
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
})
