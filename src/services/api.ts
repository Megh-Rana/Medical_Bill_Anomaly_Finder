export async function analyzeBill(items: any[]) {
  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  })

  if (!res.ok) {
    throw new Error("Analysis failed")
  }

  return res.json()
}