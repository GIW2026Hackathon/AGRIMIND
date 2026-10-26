const AGROVISION_URL = (process.env.AGROVISION_API_URL || "https://agrovision-ai-x0pk.onrender.com").replace(/\/+$/, "");
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  try {
    const response = await fetch(AGROVISION_URL + "/api/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ error: "Leaf analysis service is unavailable." }, { status: 502 });
  }
}

export async function POST(request) {
  let image;
  try {
    image = (await request.formData()).get("image");
  } catch {
    return Response.json({ error: "Upload a valid image file." }, { status: 400 });
  }

  if (!(image instanceof File)) {
    return Response.json({ error: "Choose a leaf image to analyze." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(image.type)) {
    return Response.json({ error: "Use a JPG, PNG, or WEBP image." }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return Response.json({ error: "Image must be 10 MB or smaller." }, { status: 400 });
  }

  const body = new FormData();
  body.append("image", image, image.name);

  try {
    const response = await fetch(AGROVISION_URL + "/api/diagnose", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(120000),
    });
    const data = await response.json().catch(() => ({ error: "The diagnosis service returned an invalid response." }));
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ error: "Could not reach the leaf analysis service. Try again shortly." }, { status: 502 });
  }
}