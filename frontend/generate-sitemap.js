const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream'); // Import the Readable class
const fs = require('fs');

async function generateSitemap() {


const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/home', changefreq: 'monthly', priority: 0.8 },
    { url: '/why-zog-global', changefreq: 'monthly', priority: 0.8 },
    { url: '/industries', changefreq: 'monthly', priority: 0.8 },
    { url: '/digital-engineering', changefreq: 'monthly', priority: 0.8 },
    { url: '/quality-assurance', changefreq: 'monthly', priority: 0.8 },
    { url: '/future-tech-solutions', changefreq: 'monthly', priority: 0.8 },
    { url: '/insights', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact-us', changefreq: 'monthly', priority: 0.8 },
    { url: '/what-we-do', changefreq: 'monthly', priority: 0.8 },
    { url: '/transform-your-business', changefreq: 'monthly', priority: 0.8 },
    { url: '/protect-your-customers-data', changefreq: 'monthly', priority: 0.8 },
    { url: '/managed-it-services', changefreq: 'monthly', priority: 0.8 },
    { url: '/engagement-model', changefreq: 'monthly', priority: 0.8 },
    { url: '/it-outsourcing', changefreq: 'monthly', priority: 0.8 },
    { url: '/healthcare', changefreq: 'monthly', priority: 0.8 },
    { url: '/technology', changefreq: 'monthly', priority: 0.8 },
    { url: '/telecom', changefreq: 'monthly', priority: 0.8 },
    { url: '/education', changefreq: 'monthly', priority: 0.8 },
    { url: '/travel', changefreq: 'monthly', priority: 0.8 },
    { url: '/banking', changefreq: 'monthly', priority: 0.8 },
    { url: '/insurance', changefreq: 'monthly', priority: 0.8 },
    { url: '/legal', changefreq: 'monthly', priority: 0.8 },
    { url: '/media', changefreq: 'monthly', priority: 0.8 },
    
    { url: '/pharma', changefreq: 'monthly', priority: 0.8 },
    { url: '/automation', changefreq: 'monthly', priority: 0.8 },
    { url: '/devops', changefreq: 'monthly', priority: 0.8 },
    { url: '/advanced-networking-services', changefreq: 'monthly', priority: 0.8 },
    { url: '/devsecops', changefreq: 'monthly', priority: 0.8 },
    { url: '/cloud', changefreq: 'monthly', priority: 0.8 },
    { url: '/cybersecurity', changefreq: 'monthly', priority: 0.8 },
    { url: '/cybersecurity-2', changefreq: 'monthly', priority: 0.8 },
    { url: '/software-development', changefreq: 'monthly', priority: 0.8 },
    { url: '/testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/unified-communication', changefreq: 'monthly', priority: 0.8 },
    { url: '/automation-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/manual-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/penetration-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/perfomance-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/application-security-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/accessibility-testing', changefreq: 'monthly', priority: 0.8 },
    { url: '/artificial-intelligence', changefreq: 'monthly', priority: 0.8 },
    { url: '/rpa', changefreq: 'monthly', priority: 0.8 },
    { url: '/blog', changefreq: 'monthly', priority: 0.8 },
    { url: '/be-a-partner', changefreq: 'monthly', priority: 0.8 },
    { url: '/career', changefreq: 'monthly', priority: 0.8 },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.8 },
    { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.8 },
    { url: '/cookie-policy', changefreq: 'monthly', priority: 0.8 },
        
    
    { url: 'login', changefreq: 'monthly', priority: 0.8 },
    { url: 'sign-up', changefreq: 'monthly', priority: 0.8 },
    { url: 'confirm-mail', changefreq: 'monthly', priority: 0.8 },
    { url: 'mail-confirmed', changefreq: 'monthly', priority: 0.8 },
    { url: 'forgot-password', changefreq: 'monthly', priority: 0.8 },
    { url: 'reset-password', changefreq: 'monthly', priority: 0.8 },
    { url: 'password-changed', changefreq: 'monthly', priority: 0.8 },
    { url: 'authentication-privacy-policy', changefreq: 'monthly', priority: 0.8 },
    { url: 'landing-page', changefreq: 'monthly', priority: 0.8 },
    { url: 'landing-page-privacy-policy', changefreq: 'monthly', priority: 0.8 },
    
    
   
    // Add more routes here
  ];

  const sitemapStream = new SitemapStream({ hostname: 'https://zogglobal.com' });

  // Use the Readable class to create a stream from the links array
  const sitemap = await streamToPromise(
    Readable.from(links).pipe(sitemapStream)
  ).then((data) => data.toString());

  // Write the sitemap to the public folder
  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap().catch((error) => {
  console.error('Error generating sitemap:', error);
});
