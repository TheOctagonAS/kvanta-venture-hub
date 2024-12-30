import { Search, CreditCard, CalendarClock, Wallet2 } from "lucide-react";
import { Timeline } from "@/components/Timeline";

export const TimelineSection = () => {
  const timelineData = [
    {
      title: "Registrer deg",
      content: (
        <div className="flex items-start gap-4">
          <Search className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <p>Start din reise med Kvanta ved å registrere deg med Vipps. Det tar kun noen få sekunder, og du får umiddelbart tilgang til plattformen vår.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Utforsk eiendommer",
      content: (
        <div className="flex items-start gap-4">
          <CreditCard className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <p>Bla gjennom vårt utvalg av nøye utvalgte eiendommer. Hver eiendom kommer med detaljert informasjon om beliggenhet, avkastning og historisk ytelse.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Legg til betalingsmetode",
      content: (
        <div className="flex items-start gap-4">
          <CalendarClock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <p>Koble til din foretrukne betalingsmetode. Vi støtter flere betalingsalternativer for å gjøre det enkelt å investere.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Motta daglige utbetalinger",
      content: (
        <div className="flex items-start gap-4">
          <Wallet2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <p>Begynn å motta din andel av leieinntektene daglig. Følg med på inntektene dine i sanntid og reinvester automatisk for å øke avkastningen.</p>
          </div>
        </div>
      ),
    },
  ];

  return <Timeline data={timelineData} />;
};