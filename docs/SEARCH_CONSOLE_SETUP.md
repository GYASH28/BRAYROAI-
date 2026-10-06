# BRAYRO AI — Google Search Console handoff

The website code is prepared for Search Console verification and sitemap discovery.

## One-time owner action

1. Open Google Search Console and add the URL-prefix property:
   `https://brayroai.vercel.app/`
2. Choose **HTML tag** verification.
3. Copy only the value inside the tag's `content="..."`.
4. In Vercel, add a Production environment variable named:
   `GOOGLE_SITE_VERIFICATION`
5. Set its value to the copied token and redeploy Production.
6. Return to Search Console and click **Verify**.
7. Open **Sitemaps** and submit:
   `https://brayroai.vercel.app/sitemap.xml`
8. Use **URL Inspection** on the homepage, Plans, Work and the FakhriMart case study and request indexing after the first successful deployment.

## Already implemented in code

- Build-generated `sitemap.xml`
- Build-generated `robots.txt`
- Canonical URLs
- `hreflang` alternates for India, UAE, Australia and `x-default`
- Route-specific titles/descriptions and social metadata
- Organization, WebSite, Service, CreativeWork and Breadcrumb JSON-LD where relevant
- Search Console verification meta support through `GOOGLE_SITE_VERIFICATION`
- Clean regional routes
- Vercel Web Analytics and Speed Insights

Do not hard-code the Search Console token in source control. Keep it in Vercel environment variables.
