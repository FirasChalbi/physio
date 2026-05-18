import * as React from 'react';
import {
  Body,
  Container,
  Head,
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
  Tailwind,
} from '@react-email/components';

interface CustomerConfirmationEmailProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guestCount?: string;
  restaurantName: string;
  restaurantImage?: string;
  reservationDate: string;
  reservationTime: string;
  reservationNumber: string;
  restaurantAddress?: string;
  specialInstructions?: string;
  totalAmount?: string;
  paymentMethod?: string;
  reservationUrl?: string;
}

export default function CustomerConfirmationEmail(props: CustomerConfirmationEmailProps) {
  const {
    customerName,
    customerPhone,
    customerEmail,
    guestCount,
    restaurantName,
    restaurantImage,
    reservationDate,
    reservationTime,
    reservationNumber,
    restaurantAddress,
    specialInstructions,
    totalAmount,
    paymentMethod,
    reservationUrl = 'https://yvelines.life',
  } = props;

  return (
    <Html lang="fr" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Votre réservation chez {restaurantName} a été confirmée !</Preview>
        <Body className="bg-[#F6F8FA] font-sans py-[40px]">
          <Container className="mx-auto bg-[#FFFFFF] max-w-[600px] rounded-[16px] overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>

            {/* Header */}
            <Section style={{ background: 'linear-gradient(135deg, #FF2D55 0%, #FF4D6D 100%)', padding: '40px 32px', textAlign: 'center' }}>
              <Img
                src="https://yvelines.life/logo3.png"
                alt="LifeDeal Yvelines"
                style={{ margin: '0 auto 24px', height: '48px', width: 'auto', display: 'block' }}
              />
              <Text style={{ color: '#ffffff', fontSize: '30px', fontWeight: '700', lineHeight: '36px', margin: '0 0 8px 0' }}>
                Merci pour votre réservation
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px', lineHeight: '24px', margin: '0' }}>
                Votre réservation a bien été confirmée.
              </Text>
            </Section>

            {/* Confirmation badge */}
            <Section style={{ padding: '32px 32px 0' }}>
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                <Text style={{ color: '#16a34a', fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0' }}>
                  ✅ Réservation confirmée !
                </Text>
                <Text style={{ color: '#15803d', fontSize: '15px', margin: '0' }}>
                  Votre table vous attend chez <strong>{restaurantName}</strong>
                </Text>
              </div>
            </Section>

            {/* Restaurant image */}
            {restaurantImage && (
              <Section style={{ padding: '0 32px' }}>
                <Img
                  src={restaurantImage}
                  alt={restaurantName}
                  style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }}
                />
              </Section>
            )}

            {/* Details card */}
            <Section style={{ padding: '24px 32px 32px' }}>
              <div style={{ background: '#F6F8FA', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB' }}>

                {/* Client info */}
                <Text style={{ color: '#020304', fontSize: '18px', fontWeight: '700', margin: '0 0 14px 0' }}>
                  Informations client
                </Text>
                <Row style={{ marginBottom: '14px' }}>
                  <Column>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Nom complet :</strong> {customerName}
                    </Text>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Téléphone :</strong> {customerPhone}
                    </Text>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Email :</strong> {customerEmail}
                    </Text>
                    {guestCount && (
                      <Text style={{ color: '#020304', fontSize: '14px', margin: '0' }}>
                        <strong>Nombre de personnes :</strong> {guestCount}
                      </Text>
                    )}
                  </Column>
                </Row>

                <Hr style={{ borderColor: '#E5E7EB', margin: '18px 0' }} />

                {/* Reservation details */}
                <Text style={{ color: '#020304', fontSize: '18px', fontWeight: '700', margin: '0 0 14px 0' }}>
                  Détails de la réservation
                </Text>
                <Row style={{ marginBottom: '14px' }}>
                  <Column>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Établissement :</strong> {restaurantName}
                    </Text>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Date :</strong> {reservationDate}
                    </Text>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Heure :</strong> {reservationTime}
                    </Text>
                    <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                      <strong>Numéro de réservation :</strong> #{reservationNumber}
                    </Text>
                    {restaurantAddress && (
                      <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                        <strong>Adresse :</strong> {restaurantAddress}
                      </Text>
                    )}
                    {specialInstructions && (
                      <Text style={{ color: '#020304', fontSize: '14px', margin: '0' }}>
                        <strong>Notes :</strong> {specialInstructions}
                      </Text>
                    )}
                  </Column>
                </Row>

                {(totalAmount || paymentMethod) && (
                  <>
                    <Hr style={{ borderColor: '#E5E7EB', margin: '18px 0' }} />
                    <Text style={{ color: '#020304', fontSize: '18px', fontWeight: '700', margin: '0 0 14px 0' }}>
                      Récapitulatif
                    </Text>
                    <Row>
                      <Column>
                        {totalAmount && (
                          <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                            <strong>Total :</strong> {totalAmount}
                          </Text>
                        )}
                        {paymentMethod && (
                          <Text style={{ color: '#020304', fontSize: '14px', margin: '0 0 4px 0' }}>
                            <strong>Moyen de paiement :</strong> {paymentMethod}
                          </Text>
                        )}
                        <Text style={{ color: '#FF2D55', fontSize: '14px', fontWeight: '700', margin: '0' }}>
                          <strong>Statut :</strong> Confirmé ✓
                        </Text>
                      </Column>
                    </Row>
                  </>
                )}
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={{ padding: '0 32px 32px', textAlign: 'center' }}>
              <Button
                href={reservationUrl}
                style={{ background: '#FF2D55', color: '#ffffff', padding: '16px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}
              >
                Voir ma réservation
              </Button>
            </Section>

            {/* Support section */}
            <Section style={{ padding: '24px 32px', background: '#F6F8FA', textAlign: 'center' }}>
              <Text style={{ color: '#020304', fontSize: '15px', fontWeight: '600', margin: '0 0 6px 0' }}>
                Une question ?
              </Text>
              <Text style={{ color: '#6b7280', fontSize: '13px', margin: '0' }}>
                Contactez notre équipe à{' '}
                <Link href="mailto:support@yvelines.life" style={{ color: '#FF2D55', textDecoration: 'none' }}>
                  support@yvelines.life
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section style={{ padding: '24px 32px', background: '#020304', textAlign: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: '13px', margin: '0 0 14px 0' }}>
                © LifeDeal Yvelines - Tous droits réservés
              </Text>

              <Row style={{ marginBottom: '14px' }}>
                <Column style={{ textAlign: 'center' }}>
                  <Link href="https://www.instagram.com/life.app.fr?igsh=MXdiMGs2ZzloMGdqZQ==" style={{ display: 'inline-block', margin: '0 8px' }}>
                    <Img
                      src="https://new.email/static/emails/social/social-instagram.png"
                      alt="Instagram"
                      style={{ width: '24px', height: '24px' }}
                    />
                  </Link>
                </Column>
              </Row>

              <Row style={{ marginBottom: '14px' }}>
                <Column style={{ textAlign: 'center' }}>
                  <Link href="https://yvelines.life/mentions-legales" style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none', margin: '0 8px' }}>
                    Mentions légales
                  </Link>
                  <Link href="https://yvelines.life/confidentialite" style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none', margin: '0 8px' }}>
                    Confidentialité
                  </Link>
                </Column>
              </Row>

              <Text style={{ color: '#9ca3af', fontSize: '11px', margin: '0' }}>
                Flyp by Copains Agency · Paris | France
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

CustomerConfirmationEmail.PreviewProps = {
  customerName: "Marie Dubois",
  customerPhone: "06 12 34 56 78",
  customerEmail: "marie.dubois@email.com",
  guestCount: "4 personnes",
  restaurantName: "Le Bistrot Parisien",
  restaurantImage: "https://new.email/static/app/placeholder.png",
  reservationDate: "Samedi 25 mai 2024",
  reservationTime: "20h00",
  reservationNumber: "YV240525001",
  restaurantAddress: "123 Rue de la Paix, 78000 Versailles",
  specialInstructions: "Table près de la fenêtre si possible",
  totalAmount: "89,90 €",
  paymentMethod: "Carte bancaire",
  reservationUrl: "https://yvelines.life/reservations/YV240525001",
};
