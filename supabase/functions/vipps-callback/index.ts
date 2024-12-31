import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VippsProfile {
  sub: string;
  email?: string;
  phone_number?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization code from query params
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Authorization code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received Vipps authorization code:', code);

    // Mock Vipps callback handling (replace with actual Vipps API call)
    const vippsProfile: VippsProfile = {
      sub: 'mock-vipps-id-' + Math.random().toString(36).substr(2, 9),
      email: 'mock.user@example.com',
      phone_number: '+4712345678',
      name: 'Mock Vipps User',
      given_name: 'Mock',
      family_name: 'User',
      email_verified: true,
      phone_number_verified: true
    };

    console.log('Retrieved Vipps profile:', vippsProfile);

    if (!vippsProfile.email) {
      return new Response(
        JSON.stringify({ error: 'Email is required from Vipps profile' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user exists
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
      filters: {
        email: vippsProfile.email
      }
    });

    if (getUserError) throw getUserError;

    let userId: string;
    let session;

    if (users && users.length > 0) {
      // User exists, create session
      console.log('Existing user found:', users[0].id);
      userId = users[0].id;
      const { data: sessionData, error: signInError } = await supabase.auth.admin.createSession({
        user_id: userId
      });

      if (signInError) throw signInError;
      session = sessionData;
    } else {
      // Create new user
      console.log('Creating new user with email:', vippsProfile.email);
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: vippsProfile.email,
        phone: vippsProfile.phone_number,
        email_confirmed: true,
        phone_confirmed: true,
        user_metadata: {
          full_name: vippsProfile.name,
          phone: vippsProfile.phone_number
        }
      });

      if (createUserError) throw createUserError;
      userId = newUser.user.id;

      // Create session for new user
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
        user_id: userId
      });

      if (sessionError) throw sessionError;
      session = sessionData;

      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            is_kyc: false
          }
        ]);

      if (profileError) throw profileError;
    }

    // Redirect to KYC page with pre-populated data and session
    const redirectUrl = new URL('/kyc', url.origin);
    redirectUrl.searchParams.set('from', 'vipps');
    redirectUrl.searchParams.set('name', vippsProfile.name || '');
    redirectUrl.searchParams.set('phone', vippsProfile.phone_number || '');
    redirectUrl.searchParams.set('email', vippsProfile.email);
    
    // Include session data in the response
    return new Response(
      JSON.stringify({ 
        session,
        redirectUrl: redirectUrl.toString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in Vipps callback:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});