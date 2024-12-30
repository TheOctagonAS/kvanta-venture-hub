# Database Schema

## Brukerautentisering og Profiler

### auth.users (Supabase Auth)
Dette er hovedtabellen for brukerautentisering, håndtert av Supabase Auth.

### profiles
En-til-en forhold med auth.users, deler samme ID.
- `id` UUID PRIMARY KEY (refererer til auth.users.id)
- `is_kyc` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ DEFAULT now()

### kyc_data
Inneholder KYC-verifiseringsdata for brukere.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID (refererer til auth.users.id)
- `full_name` TEXT NOT NULL
- `address` TEXT NOT NULL
- `personal_number` TEXT NOT NULL
- `is_pep` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ DEFAULT now()

## Eiendomsdata

### properties
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

### user_holdings
Kobler brukere til deres eiendomsinvesteringer.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL (refererer til auth.users.id)
- `property_id` UUID NOT NULL (refererer til properties.id)
- `token_count` INTEGER NOT NULL DEFAULT 0
- `accumulated_rent` NUMERIC NOT NULL DEFAULT 0
- `last_claim_at` TIMESTAMPTZ
- `created_at` TIMESTAMPTZ DEFAULT now()

### orders
Håndterer kjøp og salg av tokens.
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL (refererer til auth.users.id)
- `property_id` UUID NOT NULL (refererer til properties.id)
- `order_type` TEXT NOT NULL
- `token_count` INTEGER NOT NULL
- `price_per_token` NUMERIC NOT NULL
- `status` TEXT NOT NULL DEFAULT 'OPEN'
- `buyer_id` UUID
- `on_chain_tx_id` TEXT
- `created_at` TIMESTAMPTZ DEFAULT now()
- `executed_at` TIMESTAMPTZ
- `cancelled_at` TIMESTAMPTZ