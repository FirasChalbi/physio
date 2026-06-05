import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Img,
} from '@react-email/components';

interface ReservationEmailProps {
  merchantName: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  selectedItems?: { name: string; price: number; type: string }[];
  totalPrice?: number;
  offerTitle?: string;
  offerImage?: string;
  merchantCover?: string;
  sessionId?: string;
  createdAt?: string;
}

const statusConfig = {
  pending: { label: 'En attente de confirmation', bg: '#FFF7ED', border: '#FB923C', text: '#9A3412' },
  confirmed: { label: 'Confirmée', bg: '#F0FDF4', border: '#4ADE80', text: '#166534' },
  cancelled: { label: 'Annulée', bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B' },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatCreatedAt = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const P = '#FF2D55';   // framboise
const C = '#FF4D7A';   // corail
const BD = '#8A1C3A';   // bordeaux
const RO = '#FF7FA3';   // rose
const DK = '#1a1a2e';   // dark
const TP = '#1a1a2e';   // text primary
const TS = '#6a6a8a';   // text secondary
const TT = '#9a9ab0';   // text tertiary
const SF = '#F8F8FA';   // surface
const WH = '#ffffff';   // white
const BL = '#EBEBF0';   // border light

export default function ReservationEmail(props: ReservationEmailProps) {
  const {
    merchantName, name, phone, date, time, status,
    selectedItems = [], totalPrice,
    offerTitle, offerImage, merchantCover,
    sessionId, createdAt,
  } = props;

  const st = statusConfig[status] ?? statusConfig.pending;
  const sid = sessionId ? sessionId.slice(0, 13) : '';
  const hero = merchantCover || offerImage;

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>Nouvelle réservation — {name} · {merchantName} · {formatDate(date)} à {time}</Preview>

      <Body style={{ backgroundColor: SF, fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", margin: 0, padding: '28px 16px' }}>
        <Container style={{ backgroundColor: WH, maxWidth: '580px', margin: '0 auto', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

          {/* ══ HERO — cover image with gradient overlay + text ══ */}
          <Section style={{
            backgroundImage: hero ? `url(${hero})` : `linear-gradient(135deg, ${P} 0%, ${C} 50%, ${BD} 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '36px 32px 28px',
            minHeight: '200px',
          }}>
            {/* LifeDeal badge */}
            <Text style={{ display: 'inline-block', backgroundColor: P, color: WH, fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '6px', padding: '4px 11px', margin: '0 0 14px 0' }}>
              LifeDeal
            </Text>

            {/* Title */}
            <Heading as="h1" style={{ color: WH, fontSize: '24px', fontWeight: '700', lineHeight: '1.2', margin: '0 0 5px 0', letterSpacing: '-0.4px', textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>
              Nouvelle Réservation
            </Heading>

            {/* Merchant · received date */}
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: '400', margin: 0, lineHeight: '1.4', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {merchantName}{createdAt ? ` · Reçu le ${formatCreatedAt(createdAt)}` : ''}
            </Text>
          </Section>

          {/* ══ BODY ══ */}
          <Section style={{ padding: '4px 28px 28px' }}>

            {/* — Status pill — */}
            {/* <Section style={{ marginBottom: '16px' }}>
              <Row>
                <Column>
                  <Text style={{ display: 'inline-block', backgroundColor: st.bg, border: `1.5px solid ${st.border}`, borderRadius: '100px', padding: '5px 14px', fontSize: '12px', fontWeight: '600', color: st.text, margin: 0 }}>
                    ● {st.label}
                  </Text>
                </Column>
                {sid && (
                  <Column>
                    <Text style={{ color: TT, fontSize: '11px', fontFamily: 'monospace', margin: 0, textAlign: 'right', lineHeight: '28px' }}>
                      {sid}…
                    </Text>
                  </Column>
                )}
              </Row>
            </Section> */}

            {/* ── Combined info card: 2×2 grid ── */}
            <Section style={{ backgroundColor: SF, border: `1px solid ${BL}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '0' }}>

              {/* Row 1 — Nom | Téléphone */}
              <Row>
                <Column width="50%" style={{ padding: '14px 18px 10px' }}>
                  <Text style={{ fontSize: '9px', color: TT, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0' }}>Nom</Text>
                  <Text style={{ fontSize: '14px', color: TP, fontWeight: '600', margin: 0 }}>{name}</Text>
                </Column>
                <Column width="50%" style={{ padding: '14px 18px 10px', borderLeft: `1px solid ${BL}` }}>
                  <Text style={{ fontSize: '9px', color: TT, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0' }}>Téléphone</Text>
                  <Link href={`tel:${phone}`} style={{ fontSize: '14px', color: P, fontWeight: '700', textDecoration: 'none' }}>{phone}</Link>
                </Column>
              </Row>

              {/* Inner divider */}
              <Section style={{ height: '1px', backgroundColor: BL, margin: 0 }} />

              {/* Row 2 — Date | Heure */}
              <Row>
                <Column width="50%" style={{ padding: '10px 18px 14px' }}>
                  <Text style={{ fontSize: '9px', color: TT, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0' }}>Date</Text>
                  <Text style={{ fontSize: '13px', color: TP, fontWeight: '600', margin: 0 }}>{formatDate(date)}</Text>
                </Column>
                <Column width="50%" style={{ padding: '10px 18px 14px', borderLeft: `1px solid ${BL}` }}>
                  <Text style={{ fontSize: '9px', color: TT, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0' }}>Heure</Text>
                  <Text style={{ fontSize: '20px', color: TP, fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>{time}</Text>
                </Column>
              </Row>
            </Section>

            {/* ── Offer (optional) ── */}
            {offerTitle && (
              <Section style={{ marginTop: '12px' }}>
                <Section style={{ backgroundColor: DK, borderRadius: '12px', overflow: 'hidden' }}>
                  {offerImage && (
                    <Img src={offerImage} alt={offerTitle} width="580"
                      style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                  )}
                  <Section style={{ padding: '14px 18px' }}>
                    <Text style={{ color: P, fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 5px 0' }}>Offre sélectionnée</Text>
                    <Text style={{ color: WH, fontSize: '15px', fontWeight: '600', lineHeight: '1.4', margin: 0 }}>{offerTitle}</Text>
                  </Section>
                </Section>
              </Section>
            )}

            {/* ── Items / commande ── */}
            {selectedItems.length > 0 && (
              <Section style={{ marginTop: '12px' }}>
                <Section style={{ backgroundColor: SF, border: `1px solid ${BL}`, borderRadius: '12px', overflow: 'hidden' }}>
                  {selectedItems.map((item, i) => (
                    <Section key={i} style={{ padding: '12px 18px', borderBottom: i < selectedItems.length - 1 ? `1px solid ${BL}` : 'none' }}>
                      <Row>
                        <Column>
                          <Text style={{ fontSize: '13px', color: TP, fontWeight: '500', margin: '0 0 2px 0' }}>{item.name}</Text>
                          <Text style={{ display: 'inline-block', fontSize: '9px', color: TT, border: `1px solid ${BL}`, borderRadius: '4px', padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500', margin: 0 }}>{item.type}</Text>
                        </Column>
                        <Column style={{ width: '65px' }}>
                          <Text style={{ fontSize: '14px', color: TP, fontWeight: '600', margin: 0, textAlign: 'right' }}>{item.price} €</Text>
                        </Column>
                      </Row>
                    </Section>
                  ))}
                  {totalPrice !== undefined && (
                    <Section style={{ background: `linear-gradient(135deg, ${P}, ${C})`, padding: '12px 18px' }}>
                      <Row>
                        <Column>
                          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>Total</Text>
                        </Column>
                        <Column>
                          <Text style={{ color: WH, fontSize: '20px', fontWeight: '700', margin: 0, textAlign: 'right' }}>{totalPrice} €</Text>
                        </Column>
                      </Row>
                    </Section>
                  )}
                </Section>
              </Section>
            )}

            {/* ── Action box ── */}
            <Section style={{ backgroundColor: '#FFF5F7', border: `1px solid ${RO}`, borderLeft: `4px solid ${P}`, borderRadius: '0 10px 10px 0', padding: '14px 18px', marginTop: '16px' }}>
              <Text style={{ fontSize: '12px', fontWeight: '700', color: BD, margin: '0 0 4px 0' }}>⚡ Action requise</Text>
              <Text style={{ fontSize: '12px', color: '#6b2140', lineHeight: '1.6', fontWeight: '400', margin: 0 }}>
                Connectez-vous à votre interface de gestion pour confirmer ou refuser cette réservation.
                Le client sera automatiquement notifié.
              </Text>
            </Section>

          </Section>

          {/* ══ FOOTER ══ */}
          <Section style={{ backgroundColor: DK, padding: '18px 28px', textAlign: 'center' }}>
            <Link href="https://life-app.fr/" style={{ textDecoration: 'none' }}>
              <Text style={{ color: P, fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>LifeDeal Yvelines</Text>
            </Link>
            <Text style={{ color: '#6a6a8a', fontSize: '11px', fontWeight: '400', margin: 0 }}>
              Plateforme de deals locaux · © 2026 Tous droits réservés
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
