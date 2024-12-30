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

## Algorand Standard Assets (ASA) Integration
Hver eiendom representeres som en ASA på Algorand-blockchain:
- Hver eiendom får tildelt en unik ASA ID (property_token_asa_id)
- ASA tokens representerer eierandeler i eiendommen
- Transaksjoner utføres som ASA-overføringer mellom kjøper og selger
- Fremtidig integrasjon med Algorand MainNet planlagt

## Handel og Ordrer

### Orders Table Design
- `on_chain_tx_id`: Lagrer Algorand transaksjons-ID for ASA overføringer
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