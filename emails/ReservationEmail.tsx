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
  Row,
  Column,
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
  sessionId?: string;
  createdAt?: string;
}

const statusConfig = {
  pending:   { label: 'En attente de confirmation', bg: '#FEF3C7', border: '#F59E0B', dot: '#F59E0B', text: '#92400E' },
  confirmed: { label: 'Confirmée',                  bg: '#D1FAE5', border: '#10B981', dot: '#10B981', text: '#065F46' },
  cancelled: { label: 'Annulée',                    bg: '#FEE2E2', border: '#EF4444', dot: '#EF4444', text: '#991B1B' },
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCreatedAt = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function ReservationEmail(props: ReservationEmailProps) {
  const {
    merchantName,
    name,
    phone,
    date,
    time,
    status,
    selectedItems = [],
    totalPrice,
    offerTitle,
    offerImage,
    sessionId,
    createdAt,
  } = props;

  const st = statusConfig[status] ?? statusConfig.pending;
  const shortSession = sessionId ? sessionId.slice(0, 13) : '';

  const s: Record<string, React.CSSProperties> = {
    body: {
      backgroundColor: '#F0EDE6',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      margin: 0,
      padding: '48px 16px',
    },
    container: {
      backgroundColor: '#ffffff',
      maxWidth: '600px',
      margin: '0 auto',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #E0DBD0',
    },
    header: {
      backgroundColor: '#1C1C1C',
      padding: '40px 48px 36px',
      textAlign: 'center',
    },
    logoBadge: {
      display: 'inline-block',
      border: '1.5px solid #C9A84C',
      borderRadius: '8px',
      padding: '8px 20px',
      color: '#C9A84C',
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginBottom: '28px',
    },
    headerTitle: {
      color: '#ffffff',
      fontSize: '34px',
      fontWeight: '400',
      lineHeight: '1.2',
      margin: '0 0 6px 0',
      fontFamily: 'Georgia, "Times New Roman", serif',
    },
    headerSub: {
      color: '#9A9A8A',
      fontSize: '13px',
      fontWeight: '300',
      letterSpacing: '0.5px',
      margin: 0,
    },
    statusBar: {
      backgroundColor: '#F8F6F1',
      padding: '14px 48px',
      borderBottom: '1px solid #E8E4DA',
    },
    statusPill: {
      display: 'inline-block',
      backgroundColor: st.bg,
      border: `1px solid ${st.border}`,
      borderRadius: '100px',
      padding: '6px 16px',
      fontSize: '12px',
      fontWeight: '500',
      color: st.text,
      letterSpacing: '0.3px',
    },
    sessionText: {
      color: '#A09A8E',
      fontSize: '11px',
      fontFamily: 'monospace',
      margin: 0,
      textAlign: 'right',
    },
    bodyPad: {
      padding: '40px 48px',
    },
    sectionLabel: {
      fontSize: '10px',
      fontWeight: '500',
      color: '#A09A8E',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      margin: '0 0 16px 0',
    },
    card: {
      backgroundColor: '#FAFAF7',
      border: '1px solid #E8E4DA',
      borderRadius: '12px',
      padding: '24px',
    },
    infoKey: {
      fontSize: '10px',
      color: '#A09A8E',
      fontWeight: '400',
      margin: '0 0 4px 0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    infoVal: {
      fontSize: '16px',
      color: '#1C1C1C',
      fontWeight: '500',
      margin: 0,
    },
    infoValAccent: {
      fontSize: '20px',
      color: '#C9A84C',
      fontWeight: '600',
      fontFamily: 'Georgia, serif',
      margin: 0,
    },
    offerCard: {
      backgroundColor: '#1C1C1C',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    offerImg: {
      width: '100%',
      height: '140px',
      objectFit: 'cover',
      display: 'block',
    },
    offerInner: {
      padding: '20px 24px',
    },
    offerTitle: {
      color: '#ffffff',
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      fontWeight: '600',
      lineHeight: '1.35',
      margin: 0,
    },
    offerAccent: {
      color: '#C9A84C',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      margin: '0 0 8px 0',
    },
    itemsCard: {
      backgroundColor: '#FAFAF7',
      border: '1px solid #E8E4DA',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    itemRow: {
      padding: '14px 20px',
      borderBottom: '1px solid #E8E4DA',
    },
    itemName: {
      fontSize: '14px',
      color: '#1C1C1C',
      fontWeight: '400',
      margin: '0 0 4px 0',
      lineHeight: '1.4',
    },
    itemTypeBadge: {
      display: 'inline-block',
      fontSize: '10px',
      color: '#A09A8E',
      border: '1px solid #E0DBD0',
      borderRadius: '4px',
      padding: '2px 8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    itemPrice: {
      fontSize: '16px',
      color: '#1C1C1C',
      fontWeight: '500',
      margin: 0,
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },
    totalRow: {
      backgroundColor: '#1C1C1C',
      padding: '16px 20px',
    },
    totalLabel: {
      color: '#9A9A8A',
      fontSize: '12px',
      fontWeight: '300',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      margin: 0,
    },
    totalAmount: {
      color: '#C9A84C',
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      fontWeight: '600',
      margin: 0,
      textAlign: 'right',
    },
    actionBox: {
      backgroundColor: '#FFFBEB',
      border: '1px solid #F59E0B',
      borderLeft: '3px solid #C9A84C',
      borderRadius: '0 10px 10px 0',
      padding: '20px 24px',
      marginTop: '32px',
    },
    actionTitle: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#92400E',
      margin: '0 0 6px 0',
    },
    actionText: {
      fontSize: '13px',
      color: '#A06030',
      lineHeight: '1.6',
      fontWeight: '300',
      margin: 0,
    },
    footer: {
      backgroundColor: '#1C1C1C',
      padding: '28px 48px',
      textAlign: 'center',
    },
    footerBrand: {
      color: '#C9A84C',
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      fontWeight: '600',
      letterSpacing: '1px',
      margin: '0 0 6px 0',
    },
    footerSub: {
      color: '#6A6A5A',
      fontSize: '11px',
      fontWeight: '300',
      letterSpacing: '0.3px',
      margin: 0,
    },
  };

  return (
    <Html lang="fr" dir="ltr">
      <Head />
      <Preview>
        Nouvelle réservation — {name} · {merchantName} · {formatDate(date)} à {time}
      </Preview>

      <Body style={s.body}>
        <Container style={s.container}>

          <Section style={s.header}>
            <Text style={s.logoBadge}>LifeDeal</Text>
            <Heading as="h1" style={s.headerTitle}>Nouvelle Réservation</Heading>
            <Text style={s.headerSub}>
              {merchantName}{createdAt ? ` · Reçu le ${formatCreatedAt(createdAt)}` : ''}
            </Text>
          </Section>

          <Section style={s.statusBar}>
            <Row>
              <Column>
                <Text style={s.statusPill}>● {st.label}</Text>
              </Column>
              {shortSession && (
                <Column>
                  <Text style={s.sessionText}>{shortSession}…</Text>
                </Column>
              )}
            </Row>
          </Section>

          <Section style={s.bodyPad}>

            <Text style={s.sectionLabel}>Client</Text>
            <Section style={s.card}>
              <Row>
                <Column width="50%">
                  <Text style={s.infoKey}>Nom</Text>
                  <Text style={s.infoVal}>{name}</Text>
                </Column>
                <Column width="50%">
                  <Text style={s.infoKey}>Téléphone</Text>
                  <Link href={`tel:${phone}`} style={s.infoValAccent}>{phone}</Link>
                </Column>
              </Row>
            </Section>

            <Section style={{ marginTop: '32px' }}>
              <Text style={s.sectionLabel}>Réservation</Text>
              <Section style={s.card}>
                <Row>
                  <Column width="50%">
                    <Text style={s.infoKey}>Date</Text>
                    <Text style={s.infoVal}>{formatDate(date)}</Text>
                  </Column>
                  <Column width="50%">
                    <Text style={s.infoKey}>Heure</Text>
                    <Text style={s.infoVal}>{time}</Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {offerTitle && (
              <Section style={{ marginTop: '32px' }}>
                <Text style={s.sectionLabel}>Offre</Text>
                <Section style={s.offerCard}>
                  {offerImage && (
                    <Img
                      src={offerImage}
                      alt={offerTitle}
                      width="600"
                      style={s.offerImg}
                    />
                  )}
                  <Section style={s.offerInner}>
                    <Text style={s.offerAccent}>Offre sélectionnée</Text>
                    <Text style={s.offerTitle}>{offerTitle}</Text>
                  </Section>
                </Section>
              </Section>
            )}

            {selectedItems.length > 0 && (
              <Section style={{ marginTop: '32px' }}>
                <Text style={s.sectionLabel}>Commande</Text>
                <Section style={s.itemsCard}>
                  {selectedItems.map((item, i) => (
                    <Section key={i} style={{
                      ...s.itemRow,
                      borderBottom: i < selectedItems.length - 1 ? '1px solid #E8E4DA' : 'none',
                    }}>
                      <Row>
                        <Column>
                          <Text style={s.itemName}>{item.name}</Text>
                          <Text style={s.itemTypeBadge}>{item.type}</Text>
                        </Column>
                        <Column style={{ width: '80px' }}>
                          <Text style={s.itemPrice}>{item.price} €</Text>
                        </Column>
                      </Row>
                    </Section>
                  ))}

                  {totalPrice !== undefined && (
                    <Section style={s.totalRow}>
                      <Row>
                        <Column>
                          <Text style={s.totalLabel}>Total</Text>
                        </Column>
                        <Column>
                          <Text style={s.totalAmount}>{totalPrice} €</Text>
                        </Column>
                      </Row>
                    </Section>
                  )}
                </Section>
              </Section>
            )}

            <Section style={s.actionBox}>
              <Text style={s.actionTitle}>Action requise</Text>
              <Text style={s.actionText}>
                Connectez-vous à votre interface de gestion pour confirmer ou refuser
                cette réservation. Le client sera automatiquement notifié de votre décision.
              </Text>
            </Section>

          </Section>

          <Section style={s.footer}>
            <Link href="https://yvelines.life/" style={{ textDecoration: 'none' }}>
              <Text style={s.footerBrand}>LifeDeal Yvelines</Text>
            </Link>
            <Text style={s.footerSub}>
              Plateforme de deals locaux · © 2026 Tous droits réservés
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
