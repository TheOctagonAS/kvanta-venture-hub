import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get user ID from request
    const { user_id, year } = await req.json()
    
    if (!user_id || !year) {
      throw new Error('Missing required parameters')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch rent earnings data
    const { data: rentEarnings, error: rentError } = await supabase
      .from('rent_earnings')
      .select(`
        earned_amount,
        property:properties(name),
        user_holdings(token_count)
      `)
      .eq('user_id', user_id)
      .eq('year', year)

    if (rentError) {
      throw rentError
    }

    // Generate CSV content
    const csvHeader = 'Eiendom,Antall tokens,Opptjent leie,Referanse\n'
    const csvRows = rentEarnings.map(earning => {
      const reference = `REF-${earning.property.name.substring(0, 3)}-${year}`
      return `"${earning.property.name}",${earning.user_holdings[0]?.token_count || 0},${earning.earned_amount},${reference}`
    }).join('\n')

    const csvContent = csvHeader + csvRows

    // Return CSV file
    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="kvanta_skatteoversikt_${year}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error generating tax report:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})