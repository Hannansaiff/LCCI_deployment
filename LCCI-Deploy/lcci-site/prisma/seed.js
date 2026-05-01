/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: process.env.ADMIN_EMAIL || "admin@lcci.local",
      passwordHash: hash,
    },
  });

  await prisma.heroSection.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      title: "Empowering Layyah’s Business Community",
      titleUr: "لیہ کے کاروباری برادری کو بااختیار بنانا",
      subtitle:
        "Official chamber supporting trade, industry, and sustainable growth.",
      subtitleUr: "تجارت، صنعت اور پائیدار ترقی کی حمایت",
      imageUrl: "/images/hero-placeholder.svg",
      btn1Text: "Learn More",
      btn1TextUr: "مزید جانیں",
      btn2Text: "Become a Member",
      btn2TextUr: "رکن بنیں",
      learnMoreHref: "/about",
      memberHref: "/contact",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
    },
  });

  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      mission:
        "To represent and advance the interests of businesses in Layah through advocacy, networking, and services.",
      vision:
        "A thriving, connected business ecosystem driving regional prosperity.",
      history:
        "Layyah Chamber of Commerce & Industry has served the local business community for years, fostering partnerships and supporting economic development.",
    },
  });

  const services = [
    {
      title: "Business Registration Assistance",
      slug: "business-registration",
      description:
        "Guidance and facilitation for new business registration and compliance.",
      icon: "building",
      showOnHome: true,
      homeOrder: 1,
    },
    {
      title: "Certificate of Origin",
      slug: "certificate-of-origin",
      description:
        "Issuance and verification support for export documentation.",
      icon: "file-check",
      showOnHome: true,
      homeOrder: 2,
    },
    {
      title: "Document Attestation",
      slug: "document-attestation",
      description: "Attestation services for commercial and legal documents.",
      icon: "stamp",
      showOnHome: true,
      homeOrder: 3,
    },
    {
      title: "Trade Events & Training",
      slug: "trade-events-training",
      description:
        "Trade fairs, seminars, and skills training for members and SMEs.",
      icon: "users",
      showOnHome: true,
      homeOrder: 4,
    },
    {
      title: "Welfare & Awareness",
      slug: "welfare-awareness",
      description:
        "Community welfare initiatives including health awareness programs.",
      icon: "heart",
      showOnHome: false,
      homeOrder: 5,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  const bullets = [
    "Dedicated business support and advocacy",
    "Legal and documentation guidance",
    "Trade connections and networking",
    "Training programs and workshops",
  ];
  let order = 0;
  for (const text of bullets) {
    const existing = await prisma.whyChooseItem.findFirst({
      where: { text },
    });
    if (!existing) {
      await prisma.whyChooseItem.create({
        data: { text, sortOrder: order++ },
      });
    }
  }

  const leaders = [
    {
      name: "President Name",
      role: "President",
      bio: "Leads the chamber’s strategic direction and member engagement.",
      sortOrder: 1,
    },
    {
      name: "Vice President Name",
      role: "Vice President",
      bio: "Supports policy initiatives and member services.",
      sortOrder: 2,
    },
    {
      name: "Secretary Name",
      role: "Secretary",
      bio: "Oversees administration and communications.",
      sortOrder: 3,
    },
  ];
  const count = await prisma.leadership.count();
  if (count === 0) {
    for (const l of leaders) {
      await prisma.leadership.create({ data: l });
    }
  }

  const evCount = await prisma.event.count();
  if (evCount === 0) {
    const future = new Date();
    future.setDate(future.getDate() + 14);
    await prisma.event.create({
      data: {
        title: "SME Networking Breakfast",
        slug: "sme-networking-breakfast",
        excerpt: "Connect with local entrepreneurs and explore partnership opportunities.",
        description:
          "<p>Join us for a focused networking session aimed at SMEs and startups.</p><p>Registration is complimentary for members.</p>",
        category: "Networking",
        date: future,
        imageUrl: "/images/hero-placeholder.svg",
      },
    });
  }

  const actCount = await prisma.activity.count();
  if (actCount === 0) {
    await prisma.activity.create({
      data: {
        title: "Office hours for export documentation",
        slug: "office-hours-export-docs",
        description:
          "The documentation desk is open extended hours this week to assist exporters with certificates of origin.",
        date: new Date(),
        showOnHome: true,
        imageUrl: "/images/hero-placeholder.svg",
      },
    });
  }

  console.log("Seed complete. Admin user: admin / admin123 (change after first login)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
