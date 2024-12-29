# Kvanta.ai

Velkommen til Kvanta.ai – Eiendomsinvestering for alle i Norden.

Dette er en konseptuell frontend-demo som viser hvordan tokenisert eiendomsinvestering kan fungere i praksis. Prosjektet er bygget som en prototype for å visualisere brukeropplevelsen og funksjonaliteten i en slik tjeneste.

## Test User Credentials

For testing purposes, you can use these credentials:
- Email: julian@example.com
- Password: password123

## Supabase Setup

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

-- Legg til eksempeldata
INSERT INTO public.properties (name, location, price_per_token, image_url) VALUES
('Sentrumsleilighet i Oslo', 'Grünerløkka, Oslo', 1000, 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Næringsbygg i Stockholm', 'Södermalm, Stockholm', 1500, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Hytte ved fjorden i Bergen', 'Nordnes, Bergen', 2000, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'),
('Kontorbygg i København', 'Indre By, København', 1200, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3');

-- Aktiver Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Tillat lesing for alle
CREATE POLICY "Allow public read access" ON public.properties
    FOR SELECT TO public USING (true);
```

## Om Mock-funksjonalitet

Dette er en ren frontend-implementasjon hvor noe funksjonalitet fortsatt er simulert:
- Innlogging bruker lokal state management (ingen faktisk autentisering)
- "Kjøp tokens"-knapper er ikke koblet til noe betalings-API
- KYC-verifisering er simulert
- Token-beholdning lagres kun i minnet

## Supabase Konfigurasjon

For å koble til Supabase, legg til følgende miljøvariabler i prosjektet:

- `VITE_SUPABASE_URL`: Din Supabase prosjekt URL
- `VITE_SUPABASE_ANON_KEY`: Din Supabase anonyme nøkkel

### Hvordan legge til miljøvariabler

1. I Lovable: Bruk Supabase-integrasjonen i topp høyre hjørne
2. Lokalt: Opprett en `.env`-fil i prosjektets rot med:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Kjøre prosjektet lokalt

For å kjøre prosjektet lokalt, følg disse stegene:

1. Åpne prosjektet i [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Klikk på "Code" knappen øverst til høyre
3. Følg instruksjonene for å klone og kjøre prosjektet lokalt

### Alternativt kan du:

```bash
# Klone prosjektet
git clone <prosjekt-url>

# Naviger til prosjektmappen
cd kvanta-ai

# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev
```

## Teknologier

Dette prosjektet er bygget med:
- React
- Vite
- Tailwind CSS
- TypeScript
- Supabase