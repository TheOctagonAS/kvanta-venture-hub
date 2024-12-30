# Kvanta.ai

Velkommen til Kvanta.ai – Eiendomsinvestering for alle i Norden.

Dette er en frontend-applikasjon som demonstrerer tokenisert eiendomsinvestering i praksis. Prosjektet er integrert med Supabase for autentisering, datalagring og sanntidsoppdateringer.

**NB: Dette er en demonstrasjonsversjon/mock-up av konseptet. Alle tall, avkastninger og funksjoner er eksempler og ikke representative for faktiske investeringsmuligheter.**

## Test-bruker

For testing kan du bruke følgende påloggingsinformasjon:
- E-post: julian@example.com
- Passord: password123

## Hovedfunksjoner

### Min Side Oversikt
Inspirert av Lofty's "Assets Overview", tilbyr vi en omfattende oversikt over din portefølje:
- **Kontraverdi**: Total verdi av dine eiendomstokens
- **Tilgjengelig Saldo**: Din nåværende saldo for kjøp/salg
- **Leiesaldo**: Akkumulert leieinntekt fra dine eiendommer

### Innskudd/Uttak
Enkel håndtering av din saldo:
- Innskudd via Vipps eller bankkonto
- Uttak til registrert bankkonto
- Sanntidsoppdatering av saldo
- Transaksjonsoversikt

### Mine Eiendeler
Detaljert oversikt over dine investeringer:
- Tabell med alle user_holdings
- Verdi per eiendom
- Antall tokens
- Akkumulert leieinntekt
- Daglig estimert avkastning

### Rent & Earn
Transparent inntektsoversikt:
- Daily rent breakdown per eiendom
- Estimert årlig yield
- Claim-funksjonalitet for leieinntekter
- Historisk oversikt over utbetalinger

### Skatt
Forenklet skatterapportering:
- Automatisk beregning av skattepliktig inntekt
- Årsoversikt over leieinntekter
- PDF-eksport av skattegrunnlag
- Integrert med norske skatteregler (22% sats)

## Algorand Integrasjon

Vi har implementert en første versjon av Algorand-integrasjon:
- Ny `AlgorandService` for wallet-tilkobling og transaksjons-signering
- Fremtidig plan: Utstede Algorand Standard Assets (ASA) for hver eiendom
- Betalingsmetode "Crypto-lommebok" tilgjengelig for KYC-verifiserte brukere

### Brukerflyt for Algorand-kjøp:
1. Velg eiendom fra porteføljen
2. Velg antall tokens
3. Velg betalingsmetode => "Algorand wallet"
4. Signer transaksjon
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