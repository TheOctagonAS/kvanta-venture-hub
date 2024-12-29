# Kvanta.ai

Velkommen til Kvanta.ai – Eiendomsinvestering for alle i Norden.

Dette er en frontend-applikasjon som demonstrerer tokenisert eiendomsinvestering i praksis. Prosjektet er integrert med Supabase for autentisering, datalagring og sanntidsoppdateringer.

## Test-bruker

For testing kan du bruke følgende påloggingsinformasjon:
- E-post: julian@example.com
- Passord: password123

## Supabase-oppsett

Prosjektet bruker Supabase for:
- Brukerautentisering
- Datalagring av eiendommer og tokens
- Håndtering av leieinntekter
- KYC-verifisering

For å sette opp databasen i Supabase, kjør følgende SQL-kommandoer:

```sql
-- Opprett properties-tabellen
CREATE TABLE public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price_per_token INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Opprett user_holdings-tabellen
CREATE TABLE public.user_holdings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    property_id UUID REFERENCES properties(id),
    token_count INTEGER DEFAULT 0,
    accumulated_rent NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Legg til eksempeldata
INSERT INTO public.properties (name, location, price_per_token, image_url) VALUES
('Sentrumsleilighet i Oslo', 'Grünerløkka, Oslo', 1000, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Næringsbygg i Stockholm', 'Södermalm, Stockholm', 1500, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Hytte ved fjorden i Bergen', 'Nordnes, Bergen', 2000, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Kontorbygg i København', 'Indre By, København', 1200, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3');

-- Aktiver Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_holdings ENABLE ROW LEVEL SECURITY;

-- Tillat lesing for alle
CREATE POLICY "Allow public read access" ON public.properties
    FOR SELECT TO public USING (true);

-- Tillat brukere å administrere egne holdings
CREATE POLICY "Users can manage own holdings" ON public.user_holdings
    FOR ALL TO public
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

## Miljøvariabler

For å koble til Supabase, legg til følgende miljøvariabler i prosjektet:

```
VITE_SUPABASE_URL=din_supabase_prosjekt_url
VITE_SUPABASE_ANON_KEY=din_supabase_anon_nøkkel
```

## Kjøre prosjektet lokalt

```bash
# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev
```

## Funksjonalitet

- Brukerautentisering via Supabase
- Visning av tilgjengelige eiendommer
- Kjøp av eiendomstokens
- Administrasjon av tokenportefølje
- Automatisk beregning og utbetaling av leieinntekter
- KYC-verifisering av brukere

## Teknologier

- React med TypeScript
- Vite
- Tailwind CSS
- Supabase for backend
- React Query for datauthenting
- Framer Motion for animasjoner