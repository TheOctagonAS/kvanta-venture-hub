# Kvanta.ai

Velkommen til Kvanta.ai – Eiendomsinvestering for alle i Norden.

Dette er en konseptuell frontend-demo som viser hvordan tokenisert eiendomsinvestering kan fungere i praksis. Prosjektet er bygget som en prototype for å visualisere brukeropplevelsen og funksjonaliteten i en slik tjeneste.

## Test User Credentials

For testing purposes, you can use these credentials:
- Email: julian@example.com
- Password: password123

## Om Mock-funksjonalitet

Dette er en ren frontend-implementasjon hvor all funksjonalitet er simulert:
- Innlogging bruker lokal state management (ingen faktisk autentisering)
- "Kjøp tokens"-knapper er ikke koblet til noe betalings-API
- KYC-verifisering er simulert
- Eiendomsdata og token-beholdning lagres kun i minnet

## Integrering med Backend

For å gjøre denne prototypen til en fullverdig applikasjon, kan mock-endepunktene erstattes med reelle API-kall:

### REST API Integrasjon
```typescript
// Eksempel på hvordan kjøp av tokens kan implementeres med REST:
const purchaseTokens = async (propertyId: number, tokenCount: number) => {
  const response = await fetch('/api/tokens/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ propertyId, tokenCount }),
  });
  return response.json();
};
```

### GraphQL Integrasjon
```typescript
// Eksempel på hvordan samme funksjonalitet kan implementeres med GraphQL:
const PURCHASE_TOKENS = gql`
  mutation PurchaseTokens($propertyId: ID!, $tokenCount: Int!) {
    purchaseTokens(propertyId: $propertyId, tokenCount: $tokenCount) {
      success
      transaction {
        id
        status
      }
    }
  }
`;
```

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

