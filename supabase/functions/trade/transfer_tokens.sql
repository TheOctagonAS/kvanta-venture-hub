CREATE OR REPLACE FUNCTION public.transfer_tokens(
  p_from_user_id UUID,
  p_to_user_id UUID,
  p_property_id UUID,
  p_token_count INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deduct tokens from seller
  UPDATE user_holdings
  SET token_count = token_count - p_token_count
  WHERE user_id = p_from_user_id
    AND property_id = p_property_id
    AND token_count >= p_token_count;

  -- Add tokens to buyer (create or update holding)
  INSERT INTO user_holdings (user_id, property_id, token_count)
  VALUES (p_to_user_id, p_property_id, p_token_count)
  ON CONFLICT (user_id, property_id)
  DO UPDATE SET token_count = user_holdings.token_count + p_token_count;
END;
$$;