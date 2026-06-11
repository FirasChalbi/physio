import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Img,
  Button,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

// ─── Design tokens ────────────────────────────────────────────────────────────
const t = {
  ink: "#1A1814",
  stone: "#EDEBE6",
  cream: "#F5F3EF",
  border: "#EDEAE4",
  muted: "#9A9590",
  bodyText: "#4A4741",
  subtle: "#7A7570",
  gold: "#C5973A",
  goldBg: "#FBF5ED",
  goldText: "#B07040",
  dark: "#161410",
  reviewBg: "#FAFAF8",
  contactBg: "#F8F6F2",
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'DM Sans', Helvetica, Arial, sans-serif",
};

// ─── SVG icons replaced with email-safe PNG icons ──────────────────────────
const IconCalendar = () => (
  <Img
    src="https://img.icons8.com/ios/50/6B6560/calendar.png"
    alt="Calendrier"
    width="18"
    height="18"
    style={{ display: 'block' }}
  />
);

const IconMenu = () => (
  <Img
    src="https://img.icons8.com/ios/50/6B6560/menu--v1.png"
    alt="Menu"
    width="18"
    height="18"
    style={{ display: 'block' }}
  />
);

const IconStar = () => (
  <Img
    src="https://img.icons8.com/ios/50/6B6560/star--v1.png"
    alt="Etoile"
    width="18"
    height="18"
    style={{ display: 'block' }}
  />
);

const IconPhoto = () => (
  <Img
    src="https://img.icons8.com/ios/50/6B6560/picture.png"
    alt="Photos"
    width="18"
    height="18"
    style={{ display: 'block' }}
  />
);

// ─── Feature list ─────────────────────────────────────────────────────────────
const features = [
  {
    icon: <IconCalendar />,
    title: "Réservations last minute",
    desc: "Vos clients réservent une table en quelques secondes, même le jour même. Vous recevez une notification instantanée à chaque réservation.",
    badge: "Disponible 24h/24",
  },
  {
    icon: <IconMenu />,
    title: "Menu intégré & commande en ligne",
    desc: "Votre carte complète, avec photos et descriptions. Vos clients peuvent commander directement depuis votre page, pour livraison ou à emporter.",
    badge: null,
  },
  {
    icon: <IconStar />,
    title: "Vos meilleurs avis clients",
    desc: "Les avis les mieux notés sont mis en avant automatiquement. Vos clients voient ce que les autres pensent de votre cuisine — avant même de franchir la porte.",
    badge: null,
  },
  {
    icon: <IconPhoto />,
    title: "Photos & vidéos",
    desc: "Une galerie soignée de vos plats et de votre salle. Les photos donnent envie — elles sont souvent ce qui déclenche la réservation.",
    badge: null,
  },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const sectionPad = { padding: "0 44px" };

const labelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: t.muted,
  margin: "36px 0 0",
  paddingBottom: "24px",
  borderBottom: `1px solid ${t.border}`,
};

// ─── Component ────────────────────────────────────────────────────────────────
interface WelcomeEmailClassicProps {
  restaurantName?: string;
  platform?: string;
  trialDays?: number;
  phone?: string;
  address?: string;
  hours?: string;
  ctaUrl?: string;
  heroImage?: string;
  gallery1?: string;
  gallery2?: string;
  gallery3?: string;
  reviewerImage?: string;
}

export default function WelcomeEmailClassic({
  restaurantName = "La Trattoria del Centro",
  platform = "LifeDeal",
  trialDays = 30,
  phone = "+33 1 23 45 67 89",
  address = "12 Rue des Abbesses\n75018 Paris",
  hours = "Mar–Dim · 12h–22h30",
  ctaUrl = "https://life-app.fr/admin",
  heroImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85",
  gallery1 = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80",
  gallery2 = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80",
  gallery3 = "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=500&q=80",
  reviewerImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
}: WelcomeEmailClassicProps) {
  // Parse address lines
  const addressLines = address.split('\n');

  return (
    <Html lang="fr">
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        `}</style>
      </Head>

      <Preview>Bienvenue sur {platform} — {restaurantName}</Preview>

      <Body
        style={{
          backgroundColor: t.stone,
          margin: 0,
          padding: "40px 0",
          fontFamily: t.sans,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
          }}
        >
          {/* ── HEADER ── */}
          <Section
            style={{
              padding: "22px 40px",
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <Row>
              <Column>
                <Text
                  style={{
                    fontFamily: t.serif,
                    fontSize: "17px",
                    fontWeight: 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: t.ink,
                    margin: 0,
                  }}
                >
                  {platform}
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: t.muted,
                    backgroundColor: t.cream,
                    padding: "5px 12px",
                    borderRadius: "100px",
                    margin: 0,
                  }}
                >
                  Période d'essai · {trialDays} jours
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── HERO ── */}
          <Section
            style={{
              backgroundImage: `url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: 0,
            }}
          >
            <Row>
              <Column
                style={{
                  padding: "200px 44px 48px",
                  background: "rgba(0,0,0,0.58)",
                  verticalAlign: "bottom",
                }}
              >
                <Text
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.65)",
                    margin: "0 0 12px",
                  }}
                >
                  Bienvenue sur votre espace
                </Text>
                <Text
                  style={{
                    fontFamily: t.serif,
                    fontSize: "52px",
                    lineHeight: "1.05",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "#ffffff",
                    margin: "0 0 10px",
                  }}
                >
                  {restaurantName}
                </Text>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: "1.6",
                    maxWidth: "360px",
                    margin: 0,
                  }}
                >
                  Votre restaurant est maintenant en ligne. Voici tout ce que
                  vos clients peuvent découvrir.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── INTRO ── */}
          <Section
            style={{
              padding: "48px 44px 40px",
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <Text
              style={{
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: "1.75",
                color: t.bodyText,
                maxWidth: "480px",
                margin: 0,
              }}
            >
              Nous avons préparé votre page sur{" "}
              <strong style={{ fontWeight: 500, color: t.ink }}>
                {platform}
              </strong>
              . Pendant{" "}
              <strong style={{ fontWeight: 500, color: t.ink }}>
                {trialDays} jours
              </strong>
              , vos clients peuvent découvrir votre menu, réserver une table et
              laisser leurs avis — le tout au même endroit.
            </Text>
          </Section>

          {/* ── FEATURES LABEL ── */}
          <Section style={sectionPad}>
            <Text style={labelStyle}>Ce que vos clients voient</Text>
          </Section>

          {/* ── FEATURES ── */}
          {features.map((feature, i) => (
            <Section key={i} style={sectionPad}>
              <Row
                style={{
                  paddingTop: "28px",
                  paddingBottom: "28px",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                {/* Icon box */}
                <Column style={{ width: "56px", verticalAlign: "top" }}>
                  <table
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: t.cream,
                      borderRadius: "10px",
                    }}
                    cellPadding={0}
                    cellSpacing={0}
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          valign="middle"
                          style={{ padding: "11px" }}
                        >
                          {feature.icon}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Column>

                {/* Text */}
                <Column style={{ verticalAlign: "top" }}>
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: t.ink,
                      margin: "0 0 5px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: 300,
                      color: t.subtle,
                      lineHeight: "1.6",
                      margin: feature.badge ? "0 0 10px" : 0,
                    }}
                  >
                    {feature.desc}
                  </Text>
                  {feature.badge && (
                    <Text
                      style={{
                        display: "inline-block",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: t.goldText,
                        backgroundColor: t.goldBg,
                        padding: "4px 10px",
                        borderRadius: "100px",
                        margin: 0,
                      }}
                    >
                      {feature.badge}
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>
          ))}

          {/* ── GALLERY LABEL ── */}
          <Section style={sectionPad}>
            <Text style={{ ...labelStyle, paddingBottom: "20px" }}>
              Galerie du restaurant
            </Text>
          </Section>

          {/* ── GALLERY ── */}
          <Section style={{ padding: "20px 44px 0" }}>
            <Row>
              {/* Tall left image */}
              <Column style={{ width: "50%", paddingRight: "4px" }}>
                <Img
                  src={gallery1}
                  alt="Salle du restaurant"
                  width="272"
                  style={{
                    width: "100%",
                    height: "368px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
              </Column>

              {/* Two stacked right images */}
              <Column style={{ width: "50%", paddingLeft: "4px" }}>
                <Img
                  src={gallery2}
                  alt="Plat de pâtes"
                  width="272"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                />
                <Img
                  src={gallery3}
                  alt="Pizza"
                  width="272"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
              </Column>
            </Row>
            <Text
              style={{
                fontSize: "12px",
                color: t.muted,
                textAlign: "center",
                fontWeight: 300,
                letterSpacing: "0.03em",
                margin: "12px 0 40px",
              }}
            >
              Photos personnalisables pour chaque restaurant
            </Text>
          </Section>

          {/* ── REVIEW ── */}
          <Section
            style={{
              padding: "40px 44px",
              backgroundColor: t.reviewBg,
              borderTop: `1px solid ${t.border}`,
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <Text
              style={{
                color: t.gold,
                fontSize: "16px",
                letterSpacing: "3px",
                margin: "0 0 14px",
              }}
            >
              ★★★★★
            </Text>
            <Text
              style={{
                fontFamily: t.serif,
                fontSize: "22px",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: "1.5",
                color: "#2A2724",
                margin: "0 0 18px",
              }}
            >
              "Un repas comme à Naples. Les pâtes fraîches, la bruschetta, le
              service chaleureux — on est revenus trois fois ce mois-ci."
            </Text>
            <Row>
              <Column style={{ width: "48px" }}>
                <Img
                  src={reviewerImage}
                  alt="Sophie M."
                  width="36"
                  height="36"
                  style={{ borderRadius: "50%", display: "block" }}
                />
              </Column>
              <Column>
                <Text
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: t.ink,
                    margin: "0 0 2px",
                  }}
                >
                  Sophie M.
                </Text>
                <Text
                  style={{ fontSize: "12px", color: t.muted, margin: 0 }}
                >
                  Client régulier · Il y a 2 semaines
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── CONTACT ── */}
          <Section
            style={{
              padding: "36px 44px",
              backgroundColor: t.contactBg,
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <Row>
              <Column style={{ textAlign: "center", padding: "16px 8px" }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: t.muted,
                    margin: "0 0 4px",
                  }}
                >
                  Téléphone
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    color: t.ink,
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  {phone}
                </Text>
              </Column>

              <Column
                style={{
                  textAlign: "center",
                  padding: "16px 8px",
                  borderLeft: `1px solid ${t.border}`,
                  borderRight: `1px solid ${t.border}`,
                }}
              >
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: t.muted,
                    margin: "0 0 4px",
                  }}
                >
                  Adresse
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    color: t.ink,
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </Text>
              </Column>

              <Column style={{ textAlign: "center", padding: "16px 8px" }}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: t.muted,
                    margin: "0 0 4px",
                  }}
                >
                  Horaires
                </Text>
                <Text
                  style={{
                    fontSize: "13px",
                    color: t.ink,
                    margin: 0,
                    lineHeight: "1.4",
                  }}
                >
                  {hours}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── TRIAL CTA ── */}
          <Section
            style={{
              backgroundColor: t.dark,
              padding: "52px 44px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 16px",
              }}
            >
              Offre de lancement
            </Text>
            <Text
              style={{
                fontFamily: t.serif,
                fontSize: "40px",
                fontWeight: 300,
                lineHeight: "1.1",
                margin: "0 0 8px",
              }}
            >
              <span style={{ fontStyle: "italic", color: t.gold }}>
                {trialDays} jours
              </span>
              <br />
              <span style={{ color: "#ffffff" }}>gratuits</span>
            </Text>
            <Text
              style={{
                fontSize: "14px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.55)",
                lineHeight: "1.6",
                margin: "0 auto 32px",
                maxWidth: "360px",
              }}
            >
              Sans engagement. Aucune carte requise. Découvrez ce que{" "}
              {platform} peut faire pour votre restaurant.
            </Text>
            <Button
              href={ctaUrl}
              style={{
                backgroundColor: t.gold,
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 32px",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Accéder à mon espace
            </Button>
          </Section>

          {/* ── FOOTER ── */}
          <Section
            style={{
              padding: "28px 44px",
              textAlign: "center",
              borderTop: `1px solid ${t.border}`,
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                color: "#B0ADA8",
                lineHeight: "1.7",
                fontWeight: 300,
                margin: "0 0 16px",
              }}
            >
              Vous recevez cet email car vous avez créé un compte sur{" "}
              {platform}.
              <br />
              <Link href="#" style={{ color: "#9A9590", textDecoration: "none" }}>
                Se désabonner
              </Link>
              {" · "}
              <Link href="#" style={{ color: "#9A9590", textDecoration: "none" }}>
                Politique de confidentialité
              </Link>
            </Text>
            <Hr
              style={{
                border: "none",
                borderTop: `1px solid #E0DDD8`,
                margin: "0 auto 16px",
                maxWidth: "32px",
              }}
            />
            <Text
              style={{
                fontSize: "11px",
                color: "#B0ADA8",
                lineHeight: "1.7",
                fontWeight: 300,
                margin: 0,
              }}
            >
              {platform} · 12 Rue du Commerce, 75015 Paris
              <br />© 2026 {platform}. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
