const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const BASE_URL =
  "https://smpn20konsel.github.io/WEB.SMPN20KONSEL/";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value) {
  if (!value) return null;

  let date;

  if (value.toDate) {
    date = value.toDate();
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return null;

  return date.toISOString().split("T")[0];
}

async function generateSitemap() {
  const beritaSnapshot = await db
    .collection("berita")
    .orderBy("tanggal", "desc")
    .get();

  const staticPages = [
    "",
    "profil.html",
    "profil_guru.html",
    "galeri.html",
    "berita.html",
    "kurikulum.html",
    "kontak.html"
  ];

  const urls = [];

  // Halaman utama dan halaman statis
  staticPages.forEach((page) => {
    urls.push(`
  <url>
    <loc>${escapeXml(BASE_URL + page)}</loc>
  </url>`);
  });

  // Berita dari Firestore
  beritaSnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    const lastmod = formatDate(data.tanggal);

    urls.push(`
  <url>
    <loc>${escapeXml(
      `${BASE_URL}detail-berita.html?id=${encodeURIComponent(id)}`
    )}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  </url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>
`;

  fs.writeFileSync("sitemap.xml", sitemap, "utf8");

  console.log(
    `Sitemap berhasil dibuat dengan ${beritaSnapshot.size} berita.`
  );
}

generateSitemap()
  .then(() => {
    console.log("Selesai membuat sitemap.");
  })
  .catch((error) => {
    console.error("Gagal membuat sitemap:", error);
    process.exit(1);
  });
