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
- Vi har lagt til kolonner for on-chain token info og investor-limiter for prospektunntak
- Vi har opprettet DeFiService for on-chain deploy og orakel integrasjon

## Skatt (Norge) Feature

Skatteoversikten inkluderer:

- Collapsible "Fradragsoversikt" for enkel registrering av fradragsberettigede utgifter
- Forbedret eksportfunksjonalitet med valg mellom PDF og CSV format
- Månedlig oversiktsgraf som viser opptjent vs. uttatt leie
- Direkte tilgang fra "Min side" via "Se skatteoversikt"-lenke

### Viktige merknader

**Ansvarsfraskrivelse:**
- Kvanta.ai tilbyr ikke offisiell skatterådgivning
- Brukere må selv kontrollere lokale skatteregler og forskrifter
- Tallene som vises er veiledende og må verifiseres med skattemyndighetene
- Vi anbefaler å konsultere en autorisert regnskapsfører eller skatterådgiver

### Fremtidige utvidelser

Planlagte forbedringer inkluderer:
- Integrasjon med faktiske månedsdata for leieinntekter
- Støtte for delvis eierskapsendringer og skatteberegning
- Automatisk kategorisering av fradrag
- Integrasjon med Skatteetatens systemer (under utredning)
- Utvidet støtte for ulike eierstrukturer og selskapsformer

## Algorand Integrasjon

Vi har implementert en første versjon av Algorand-integrasjon:

- Ny `AlgorandService` for wallet-tilkobling og transaksjons-signering
- Algorand Standard Assets (ASA) for hver eiendom
- Betalingsmetode "Crypto-lommebok" er tilgjengelig for KYC-verifiserte brukere

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

## Deprecated Funksjonalitet

Følgende funksjoner er ikke lenger aktive i applikasjonen:
- Lån mot eiendom (property_loan_requests_deprecated)
