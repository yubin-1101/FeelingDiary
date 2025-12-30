export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({}), { status: 200, headers })
  }

  return new Response(
    JSON.stringify({ 
      status: 'ok', 
      message: 'Server is running',
      environment: process.env.NODE_ENV || 'development'
    }),
    { status: 200, headers }
  )
}
