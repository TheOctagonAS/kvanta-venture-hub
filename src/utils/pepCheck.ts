interface PepCheckResult {
  isClean: boolean;
  message?: string;
}

export const doPepCheck = async (isPep: boolean): Promise<PepCheckResult> => {
  // Mock PEP check - in reality, this would call an external API
  return {
    isClean: !isPep,
    message: isPep ? "Vennligst kontakt kundeservice for videre prosess." : undefined
  };
};