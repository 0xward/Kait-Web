// Realistic mock response payloads for the "Live on KAIT" demo cards.
// No third-party API keys involved -- this is a simulated call/response
// flow that demonstrates the pay-per-call UX without hitting a real
// backend.

export interface ApiSimSpec {
  key: string;
  name: string;
  tag: string;
  price: string;
  endpoint: string;
  requestBody: string;
  latencyMs: [number, number]; // randomized range for realism
  responseLines: string[]; // streamed line by line
}

export const API_SIMS: ApiSimSpec[] = [
  {
    key: "vision_ocr",
    name: "VISION_OCR",
    tag: "DOCUMENT PARSING",
    price: "$0.004",
    endpoint: "POST /v1/ocr/extract",
    requestBody: `{"image_url":"ipfs://bafy...4f2a","lang":"en"}`,
    latencyMs: [380, 740],
    responseLines: [
      "{",
      '  "status": 200,',
      '  "pages": 1,',
      '  "text": "INVOICE #KT-4471\\nDate: 2026-06-29\\nTotal: $182.40",',
      '  "confidence": 0.97,',
      '  "tx": "0x4f2a..d2a1"',
      "}",
    ],
  },
  {
    key: "weathermesh",
    name: "WEATHERMESH",
    tag: "REALTIME DATA",
    price: "$0.001",
    endpoint: "GET /v1/weather/current",
    requestBody: `{"lat":-6.9175,"lon":107.6191}`,
    latencyMs: [180, 420],
    responseLines: [
      "{",
      '  "status": 200,',
      '  "location": "Bandung, ID",',
      '  "temp_c": 24.1,',
      '  "condition": "partly_cloudy",',
      '  "tx": "0x7c91..a3e0"',
      "}",
    ],
  },
  {
    key: "img_forge",
    name: "IMG_FORGE",
    tag: "AI IMAGE GEN",
    price: "$0.006",
    endpoint: "POST /v1/image/generate",
    requestBody: `{"prompt":"isometric city block, lineart","steps":24}`,
    latencyMs: [620, 980],
    responseLines: [
      "{",
      '  "status": 200,',
      '  "image_url": "ipfs://bafy...91cd",',
      '  "width": 1024,',
      '  "height": 1024,',
      '  "tx": "0x2b6e..f019"',
      "}",
    ],
  },
  {
    key: "lingo_net",
    name: "LINGO_NET",
    tag: "TRANSLATION API",
    price: "$0.002",
    endpoint: "POST /v1/translate",
    requestBody: `{"text":"deploy your api","target":"id"}`,
    latencyMs: [220, 460],
    responseLines: [
      "{",
      '  "status": 200,',
      '  "translated": "sebarkan API Anda",',
      '  "source_lang": "en",',
      '  "target_lang": "id",',
      '  "tx": "0x9a3f..bb22"',
      "}",
    ],
  },
];
