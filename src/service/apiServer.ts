export async function apiServer<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, init)

  if (!data.ok) {
    return null
  }

  const result: T = await data.json()

  return result
}
