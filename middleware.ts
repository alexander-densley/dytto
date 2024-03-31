import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function middleware(request: NextRequest) {
  const lowerCaseLink = request.nextUrl.pathname.slice(1).toLowerCase()
  console.log(lowerCaseLink)
  if (lowerCaseLink.length > 0) {
    const { data, error } = await supabase
      .from('links')
      .select('long_link')
      .eq('short_link', lowerCaseLink)

    if (error) {
      return new NextResponse(JSON.stringify(error), {
        status: 500,
      })
    }
    if (data?.length && data[0].long_link) {
      return NextResponse.redirect(new URL(data[0].long_link))
    } else {
      return NextResponse.next()
    }
  }
  return NextResponse.next()
}
