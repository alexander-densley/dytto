export const runtime = 'edge'

import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs'

export async function POST(request: Request) {
  const { userId } = auth()
  const body = await request.json()
  const { long_link, short_link } = body
  const lowerCaseShortLink = short_link.toLowerCase()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  )
  const { data, error } = await supabase
    .from('links')
    .insert([
      {
        long_link,
        short_link: lowerCaseShortLink,
        user_id: userId,
      },
    ])
    .select('*')

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    })
  }

  if (!data?.length) {
    return new Response(JSON.stringify({ added: false }), {
      status: 200,
    })
  }

  return new Response(JSON.stringify({ added: true }), {
    status: 200,
  })
}
