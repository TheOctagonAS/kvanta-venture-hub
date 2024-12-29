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

### Databasetabeller

Prosjektet bruker følgende tabeller i Supabase:

#### profiles
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    is_kyc BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW())
);
```

#### properties
```sql
CREATE TABLE public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price_per_token INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW())
);
```

#### user_holdings
```sql
CREATE TABLE public.user_holdings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    property_id UUID REFERENCES properties(id),
    token_count INTEGER DEFAULT 0,
    accumulated_rent NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW())
);
```

### Miljøvariabler

For å koble til Supabase, opprett en `.env` fil i prosjektets rotmappe med følgende variabler:

```
VITE_SUPABASE_URL=din_supabase_prosjekt_url
VITE_SUPABASE_ANON_KEY=din_supabase_anon_nøkkel
```

Du finner disse verdiene i Supabase-dashbordet under Project Settings > API.

### Autentisering

For å bruke applikasjonen må du ha en bruker i Supabase Auth. Du kan enten:
1. Bruke test-brukeren nevnt over
2. Opprette en ny bruker via Supabase Auth Dashboard
3. Implementere registreringsfunksjonalitet i applikasjonen

## Kjøre prosjektet

### Utvikling
```bash
npm install
npm run dev
```

### Produksjonstest
```bash
npm run build
npm run preview
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