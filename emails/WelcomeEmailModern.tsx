import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Row,
  Column,
  Hr,
} from '@react-email/components';
interface WelcomeEmailModernProps {
  restaurantName?: string;
  platform?: string;
  heroImage?: string;
  dishImage?: string;
  interiorImage?: string;
  chefImage?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  websiteUrl?: string;
  trialDays?: number;
}

export default function WelcomeEmailModern({
  restaurantName = "Trattoria Bella Vista",
  platform = "LifeDeal",
  heroImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop",
  dishImage = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
  interiorImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  chefImage = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop",
  phoneNumber = "+33 1 42 86 75 23",
  address = "15 Rue de Rivoli, 75001 Paris",
  email = "contact@life-app.fr",
  websiteUrl = "https://life-app.fr/admin",
  trialDays = 30,
}: WelcomeEmailModernProps) {
  // Inline styles (no Tailwind - pure inline for email compatibility)
  const colors = {
    bg: '#fafaf9',
    white: '#ffffff',
    dark: '#171717',
    muted: '#737373',
    amber50: '#fffbeb',
    amber400: '#fbbf24',
    amber700: '#b45309',
    blue950: '#172554',
    green600: '#16a34a',
    green700: '#15803d',
    emerald700: '#047857',
    neutral50: '#fafaf9',
    neutral400: '#a3a3a3',
    neutral500: '#737373',
    neutral600: '#525252',
    neutral900: '#171717',
  };

  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>Découvrez votre nouvelle expérience digitale - {restaurantName}</Preview>
      <Body style={{ backgroundColor: colors.bg, fontFamily, margin: 0, padding: '28px 16px' }}>
        <Container style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: colors.white, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          
          {/* Hero Section with Background Image */}
          <Section 
            style={{
              height: '320px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`,
              padding: '0 24px',
              textAlign: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', marginTop: '120px' }}>
              Bienvenue
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '36px', fontWeight: 300, marginBottom: '12px', margin: '0 0 12px', lineHeight: '1.1' }}>
              {restaurantName}
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0, fontWeight: 300 }}>
              Votre nouvelle expérience digitale commence ici
            </Text>
          </Section>

          {/* Welcome Message */}
          <Section style={{ padding: '48px 32px' }}>
            <Text style={{ fontSize: '15px', color: colors.neutral600, lineHeight: '1.75', margin: 0 }}>
              Nous avons préparé votre page sur{" "}
              <strong style={{ fontWeight: 500, color: colors.neutral900 }}>
                {platform}
              </strong>
              . Pendant{" "}
              <strong style={{ fontWeight: 500, color: colors.neutral900 }}>
                {trialDays} jours
              </strong>
              , vos clients peuvent découvrir votre menu, réserver une table et
              laisser leurs avis — le tout au même endroit.
            </Text>
          </Section>

          {/* Features Section */}
          <Section style={{ padding: '0 32px 32px' }}>
            
            {/* Reservations Feature */}
            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
                <Section style={{ backgroundColor: colors.neutral900, padding: '32px', borderRadius: '4px' }}>
                  <Text style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', margin: '0 0 8px', color: 'rgba(255,255,255,0.7)' }}>
                    Réservations
                  </Text>
                  <Heading style={{ fontSize: '20px', fontWeight: 300, marginBottom: '12px', margin: '0 0 12px', color: '#ffffff' }}>
                    Last Minute
                  </Heading>
                  <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>
                    Vos clients peuvent désormais réserver instantanément, 
                    même quelques minutes avant leur arrivée.
                  </Text>
                </Section>
              </Column>
              <Column style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
                <Img
                  src={interiorImage}
                  alt="Intérieur restaurant"
                  width="280"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                />
              </Column>
            </Row>

            {/* Menu Feature */}
            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
                <Img
                  src={dishImage}
                  alt="Plat signature"
                  width="280"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                />
              </Column>
              <Column style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
                <Section style={{ backgroundColor: colors.amber50, padding: '32px', borderRadius: '4px' }}>
                  <Text style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', margin: '0 0 8px', color: colors.amber700 }}>
                    Menu Digital
                  </Text>
                  <Heading style={{ fontSize: '20px', fontWeight: 300, marginBottom: '12px', margin: '0 0 12px', color: colors.neutral900 }}>
                    Commande Intégrée
                  </Heading>
                  <Text style={{ fontSize: '14px', color: colors.neutral600, margin: 0, lineHeight: '1.6' }}>
                    Votre carte interactive avec système de commande 
                    directement intégré pour une expérience fluide.
                  </Text>
                </Section>
              </Column>
            </Row>

            {/* Reviews Feature */}
            <Row style={{ marginBottom: '16px' }}>
              <Column style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
                <Section style={{ backgroundColor: colors.blue950, padding: '32px', borderRadius: '4px' }}>
                  <Text style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', margin: '0 0 8px', color: 'rgba(255,255,255,0.7)' }}>
                    Avis Clients
                  </Text>
                  <Heading style={{ fontSize: '20px', fontWeight: 300, marginBottom: '12px', margin: '0 0 12px', color: '#ffffff' }}>
                    5 Étoiles
                  </Heading>
                  <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>
                    Mettez en valeur vos meilleurs avis pour 
                    attirer et rassurer vos futurs clients.
                  </Text>
                </Section>
              </Column>
              <Column style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
                <Img
                  src={chefImage}
                  alt="Chef en cuisine"
                  width="280"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                />
              </Column>
            </Row>
          </Section>

          {/* Customer Review Example */}
          <Section style={{ padding: '32px', backgroundColor: colors.neutral50 }}>
            <Section style={{ borderLeft: `3px solid ${colors.amber400}`, paddingLeft: '24px' }}>
              <Text style={{ fontSize: '16px', color: '#404040', fontStyle: 'italic', marginBottom: '16px', margin: '0 0 16px', lineHeight: '1.6' }}>
                "Une expérience culinaire exceptionnelle. L'ambiance chaleureuse, 
                les saveurs authentiques et le service impeccable font de ce lieu 
                notre restaurant italien préféré à Paris."
              </Text>
              <Text style={{ margin: 0 }}>
                <span style={{ fontSize: '14px', color: colors.amber400, marginRight: '8px' }}>★★★★★</span>
                <span style={{ fontSize: '14px', color: colors.neutral500 }}>Sophie L. • Google Reviews</span>
              </Text>
            </Section>
          </Section>

          {/* Contact Information */}
          <Section style={{ padding: '40px 32px' }}>
            <Row>
              <Column style={{ width: '50%', paddingRight: '24px', verticalAlign: 'top' }}>
                <Heading style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', margin: '0 0 20px', color: colors.neutral900 }}>
                  Informations de Contact
                </Heading>
                
                <Section style={{ marginBottom: '12px' }}>
                  <Text style={{ fontSize: '14px', color: colors.neutral500, marginBottom: '4px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Téléphone
                  </Text>
                  <Link 
                    href={`tel:${phoneNumber}`} 
                    style={{ fontSize: '16px', color: colors.neutral900, textDecoration: 'none', fontWeight: 500 }}
                  >
                    {phoneNumber}
                  </Link>
                </Section>

                <Section style={{ marginBottom: '12px' }}>
                  <Text style={{ fontSize: '14px', color: colors.neutral500, marginBottom: '4px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Email
                  </Text>
                  <Link 
                    href={`mailto:${email}`} 
                    style={{ fontSize: '16px', color: colors.neutral900, textDecoration: 'none', fontWeight: 500 }}
                  >
                    {email}
                  </Link>
                </Section>

                <Section>
                  <Text style={{ fontSize: '14px', color: colors.neutral500, marginBottom: '4px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Adresse
                  </Text>
                  <Text style={{ fontSize: '16px', color: colors.neutral900, margin: 0, fontWeight: 500 }}>
                    {address}
                  </Text>
                </Section>
              </Column>

              <Column style={{ width: '50%', paddingLeft: '24px', verticalAlign: 'top' }}>
                <Section style={{ background: `linear-gradient(135deg, ${colors.green600}, ${colors.emerald700})`, padding: '24px', borderRadius: '4px' }}>
                  <Text style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', margin: '0 0 8px', color: 'rgba(255,255,255,0.9)' }}>
                    Offre Spéciale
                  </Text>
                  <Heading style={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px', margin: '0 0 12px', color: '#ffffff' }}>
                    {trialDays > 0 ? `${trialDays} Jours Gratuits` : '1 Mois Gratuit'}
                  </Heading>
                  <Text style={{ fontSize: '14px', marginBottom: '20px', margin: '0 0 20px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                    Découvrez toutes nos fonctionnalités sans engagement pendant {trialDays} jours.
                  </Text>
                  <Button
                    href={websiteUrl}
                    style={{
                      backgroundColor: '#ffffff',
                      color: colors.green700,
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Commencer l'essai
                  </Button>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={{ padding: '24px 32px', backgroundColor: colors.neutral900, textAlign: 'center' }}>
            <Text style={{ fontSize: '12px', color: colors.neutral400, margin: '0 0 8px' }}>
              © 2026 LifeDeal · Yvelines, France
            </Text>
            <Section>
              <Link href="#" style={{ fontSize: '12px', color: colors.neutral500, textDecoration: 'none', marginRight: '16px' }}>
                Se désabonner
              </Link>
              <Link href="#" style={{ fontSize: '12px', color: colors.neutral500, textDecoration: 'none' }}>
                Politique de confidentialité
              </Link>
            </Section>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
