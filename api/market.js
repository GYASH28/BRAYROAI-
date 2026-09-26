const normalizeCountry=value=>String(value||'').trim().toUpperCase();

export default function handler(req,res){
  const country=normalizeCountry(
    req.headers['x-vercel-ip-country']||
    req.headers['cf-ipcountry']||
    req.headers['x-country-code']
  );
  const market=country==='AE'?'ae':country==='AU'?'au':'in';
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('Vary','X-Vercel-IP-Country');
  return res.status(200).json({
    country:country||null,
    market,
    language:'en',
    source:country?'edge-country':'fallback'
  });
}
