import { supabase } from "@/integrations/supabase/client";

export const createLoanProperty = async (
  loanRequestId: string,
  userId: string,
  requestedAmount: number,
  interestRate: number
) => {
  const tokenCount = 500; // Fixed number of tokens
  const pricePerToken = Math.floor(requestedAmount / tokenCount);
  
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .insert({
      name: `Loan Property ${loanRequestId.slice(0, 8)}`,
      location: "Norway",
      price_per_token: pricePerToken,
      max_tokens: tokenCount,
      property_type: "loan",
      yield: interestRate,
    })
    .select()
    .single();

  if (propertyError) throw propertyError;

  const { error: holdingsError } = await supabase
    .from('user_holdings')
    .insert({
      user_id: userId,
      property_id: property.id,
      token_count: tokenCount,
    });

  if (holdingsError) throw holdingsError;

  return property;
};

export const submitLoanRequest = async (
  userId: string,
  formData: {
    propertyType: string;
    estimatedValue: string;
    requestedAmount: string;
    repaymentMonths: string;
    interestRate: number;
    ownershipDeclaration: boolean;
  }
) => {
  const { data: loanRequest, error } = await supabase
    .from('property_loan_requests')
    .insert({
      user_id: userId,
      property_type: formData.propertyType,
      estimated_value: parseFloat(formData.estimatedValue),
      requested_amount: parseFloat(formData.requestedAmount),
      repayment_months: parseInt(formData.repaymentMonths),
      interest_rate: formData.interestRate,
      ownership_declaration: formData.ownershipDeclaration,
    })
    .select()
    .single();

  if (error) throw error;
  return loanRequest;
};