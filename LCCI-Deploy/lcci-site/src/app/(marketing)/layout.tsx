import { TopBar } from "@/components/layout/top-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSiteSettings } from "@/lib/api-client";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const s = settings || {};

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        phone={s.topBarPhone}
        email={s.topBarEmail}
        facebookUrl={s.facebookUrl || undefined}
        twitterUrl={s.twitterUrl || undefined}
        linkedinUrl={s.linkedinUrl || undefined}
        youtubeUrl={s.youtubeUrl || undefined}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={s.address}
        phone={s.topBarPhone}
        email={s.topBarEmail}
        mapEmbedUrl={s.mapEmbedUrl}
        footerText={s.footerText}
      />
    </div>
  );
}
