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

## Algorand Integrasjonsplan

Vi har implementert en første versjon av Algorand-integrasjon:

- Ny `AlgorandService` for wallet-tilkobling og transaksjons-signering (mock)
- Fremtidig plan: Utstede Algorand Standard Assets (ASA) for hver eiendom
- Betalingsmetode "Crypto-lommebok" er tilgjengelig for KYC-verifiserte brukere (isKyc=true)

### Brukerflyt for Algorand-kjøp:

1. Velg eiendom fra porteføljen
2. Velg antall tokens
3. Velg betalingsmetode => "Algorand wallet"
4. Signer transaksjon (mock i denne versjonen)
5. Ved vellykket signering => ordre plassert => userHoldings oppdatert

## Teknisk Dokumentasjon

Se følgende filer for detaljert teknisk dokumentasjon:
- [Database Schema](docs/DATABASE.md)
- [Supabase Oppsett](docs/SUPABASE.md)
- [Teknisk Arkitektur](docs/ARCHITECTURE.md)

## Teknologier

- React med TypeScript
- Vite
- Tailwind CSS
- Supabase for backend
- React Query for datauthenting
- Framer Motion for animasjoner