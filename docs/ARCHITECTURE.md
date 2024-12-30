# Teknisk Arkitektur

## TradeController Design
All handelslogikk er sentralisert i TradeController for å sikre:
- Konsistent håndtering av ordre
- Enkel vedlikehold og oppdatering
- Sentralisert validering og feilhåndtering

## TokenService vs SmartContractIntegrationService
TokenService abstraherer token-operasjoner for å:
- Isolere token-logikk fra resten av applikasjonen
- Forenkle fremtidig integrasjon med smart contracts
- Muliggjøre enkel bytte mellom forskjellige blockchain-implementasjoner

## Handel og Ordrer

### Orders Table Design
- `on_chain_tx_id`: Felt for fremtidig blockchain-integrasjon (txHash)
- KYC-krav: Brukere må ha `isKyc=true` for å plassere eller utføre ordrer

### Handelsendepunkter
Manuell tilnærming til kjøp/salg:

```
POST /trade/placeOrder  => Plassere SELL ordre
POST /trade/executeOrder => Utføre kjøp (BUY)
POST /trade/cancelOrder  => Kansellere ordre
```

### Fremtidige Utvidelser
- Implementering av ordrebok
- Støtte for partial fill
- Automatisk matching av kjøps- og salgsordrer