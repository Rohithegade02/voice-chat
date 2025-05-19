export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return Response.json({ error: 'No text provided' }, { status: 400 });
  }

  console.log(text);
  return Response.json({ hello: 'world' });
}
