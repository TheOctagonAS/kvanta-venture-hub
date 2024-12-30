# Kvanta.ai

Velkommen til Kvanta.ai – Eiendomsinvestering for alle i Norden.

Dette er en frontend-applikasjon som demonstrerer tokenisert eiendomsinvestering i praksis. Prosjektet er integrert med Supabase for autentisering, datalagring og sanntidsoppdateringer.

**NB: Dette er en demonstrasjonsversjon/mock-up av konseptet. Alle tall, avkastninger og funksjoner er eksempler og ikke representative for faktiske investeringsmuligheter.**

## Test-bruker

For testing kan du bruke følgende påloggingsinformasjon:
- E-post: julian@example.com
- Passord: password123

## Hovedfunksjoner

- Tokenisert eiendomsinvestering
- APY-visning på eiendom
- Kalkulator på forsiden for investeringssummer
- Forbedret 'Min side' med DeFi-stil design, daily yield og claim-knapp
- KYC-verifisering av brukere
- Automatisk beregning av leieinntekter
- Porteføljeadministrasjon

## Database Schema

### Brukerautentisering og Profiler

#### auth.users (Supabase Auth)
Dette er hovedtabellen for brukerautentisering, håndtert av Supabase Auth.

#### profiles
En-til-en forhold med auth.users, deler samme ID.
- `id` UUID PRIMARY KEY (refererer til auth.users.id)
- `is_kyc` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ DEFAULT now()

#### kyc_data
Inneholder KYC-verifiseringsdata for brukere.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID (refererer til auth.users.id)
- `full_name` TEXT NOT NULL
- `address` TEXT NOT NULL
- `personal_number` TEXT NOT NULL
- `is_pep` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ DEFAULT now()

### Eiendomsdata

#### properties
Hovedtabell for eiendomsinformasjon.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` TEXT NOT NULL
- `location` TEXT NOT NULL
- `price_per_token` INTEGER NOT NULL
- `image_url` TEXT
- `yield` NUMERIC NOT NULL DEFAULT 5.0
- `max_tokens` BIGINT NOT NULL DEFAULT 1000
- `tokens_sold` BIGINT NOT NULL DEFAULT 0
- `launch_date` TIMESTAMPTZ
- `created_at` TIMESTAMPTZ DEFAULT now()

Constraints:
- launch_date må være i fremtiden når satt
- tokens_sold kan ikke overstige max_tokens

#### user_holdings
Kobler brukere til deres eiendomsinvesteringer.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL (refererer til auth.users.id)
- `property_id` UUID NOT NULL (refererer til properties.id)
- `token_count` INTEGER NOT NULL DEFAULT 0
- `accumulated_rent` NUMERIC NOT NULL DEFAULT 0
- `last_claim_at` TIMESTAMPTZ
- `created_at` TIMESTAMPTZ DEFAULT now()

Constraints:
- CHECK (token_count >= 0)
- CHECK (accumulated_rent >= 0)

#### orders
Håndterer kjøp og salg av tokens.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL (refererer til auth.users.id)
- `property_id` UUID NOT NULL (refererer til properties.id)
- `order_type` TEXT NOT NULL
- `token_count` INTEGER NOT NULL
- `price_per_token` INTEGER NOT NULL
- `status` TEXT NOT NULL DEFAULT 'OPEN'
- `buyer_id` UUID
- `on_chain_tx_id` TEXT
- `created_at` TIMESTAMPTZ DEFAULT now()
- `executed_at` TIMESTAMPTZ
- `cancelled_at` TIMESTAMPTZ

Noter:
- Når vi integrerer med EVM-lignende chain, on_chain_tx_id = txHash.

### Relasjoner og Referanser

1. **Bruker-Profil Relasjon**
   - `profiles.id` -> `auth.users.id` (1:1)
   - Sikrer at hver bruker har én profil

2. **KYC-Data Relasjon**
   - `kyc_data.user_id` -> `auth.users.id`
   - Lagrer verifiseringsdata for brukere

3. **Eiendomsinvesteringer**
   - `user_holdings.user_id` -> `auth.users.id`
   - `user_holdings.property_id` -> `properties.id`
   - Sporer hvilke tokens hver bruker eier i hvilke eiendommer

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
    max_tokens BIGINT NOT NULL DEFAULT 1000,
    tokens_sold BIGINT NOT NULL DEFAULT 0,
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

## Teknologier

- React med TypeScript
- Vite
- Tailwind CSS
- Supabase for backend
- React Query for datauthenting
- Framer Motion for animasjoner