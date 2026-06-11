import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { render } from '@react-email/components'
import { Resend } from 'resend'
import WelcomeEmailClassic from '@/emails/WelcomeEmailClassic'
import WelcomeEmailModern from '@/emails/WelcomeEmailModern'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { template, recipientEmail, subject, data } = body

    if (!template || !recipientEmail || !subject) {
      return NextResponse.json(
        { error: 'Template, email destinataire et sujet sont requis' },
        { status: 400 }
      )
    }

    let emailComponent: React.ReactElement

    if (template === 'classic') {
      emailComponent = (
        <WelcomeEmailClassic
          restaurantName={data.restaurantName}
          platform={data.platform || 'LifeDeal'}
          trialDays={data.trialDays ? parseInt(data.trialDays) : 30}
          phone={data.phone}
          address={data.address}
          hours={data.hours}
          ctaUrl={data.ctaUrl || 'https://life-app.fr/admin'}
          heroImage={data.heroImage}
          gallery1={data.gallery1}
          gallery2={data.gallery2}
          gallery3={data.gallery3}
          reviewerImage={data.reviewerImage}
        />
      )
    } else if (template === 'modern') {
      emailComponent = (
        <WelcomeEmailModern
          restaurantName={data.restaurantName}
          ownerName={data.ownerName}
          heroImage={data.heroImage}
          dishImage={data.dishImage}
          interiorImage={data.interiorImage}
          chefImage={data.chefImage}
          phoneNumber={data.phoneNumber}
          address={data.address}
          email={data.email}
          websiteUrl={data.websiteUrl || 'https://life-app.fr/admin'}
          trialDays={data.trialDays ? parseInt(data.trialDays) : 30}
        />
      )
    } else {
      return NextResponse.json({ error: 'Template inconnu' }, { status: 400 })
    }

    const html = await render(emailComponent)

    const { data: resendData, error } = await resend.emails.send({
      from: 'LifeDeal <bienvenue@life-app.fr>',
      to: recipientEmail,
      subject,
      html,
    })

    if (error) {
      console.error('[send-merchant-email]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: resendData })
  } catch (err: any) {
    console.error('[send-merchant-email]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur interne' },
      { status: 500 }
    )
  }
}
