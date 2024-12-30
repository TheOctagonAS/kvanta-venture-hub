# Supabase-oppsett

Prosjektet bruker Supabase for:
- Brukerautentisering
- Datalagring av eiendommer og tokens
- Håndtering av leieinntekter
- KYC-verifisering

## Databasetabeller

### profiles
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    is_kyc BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, NOW())
);
```

### properties
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

### user_holdings
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

## Miljøvariabler

For å koble til Supabase, opprett en `.env` fil i prosjektets rotmappe med følgende variabler:

```
VITE_SUPABASE_URL=din_supabase_prosjekt_url
VITE_SUPABASE_ANON_KEY=din_supabase_anon_nøkkel
```

Du finner disse verdiene i Supabase-dashbordet under Project Settings > API.