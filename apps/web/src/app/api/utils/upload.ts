interface UploadInput {
  url?: string;
  buffer?: Buffer;
  base64?: string;
}

interface UploadResult {
  url?: string;
  mimeType: string | null;
  error?: string;
}

const FALLBACK_API_UPLOAD = '';

/**
 * Resolve the upload endpoint from UPLOAD_API_URL. GiDi does not call Create or
 * Anything hosts.
 */
function resolveUploadEndpoint(): string {
  return process.env.UPLOAD_API_URL || FALLBACK_API_UPLOAD;
}

async function upload({ url, buffer, base64 }: UploadInput): Promise<UploadResult> {
  const endpoint = resolveUploadEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': buffer ? 'application/octet-stream' : 'application/json',
    },
    body: buffer ? new Uint8Array(buffer) : JSON.stringify({ base64, url }),
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    // Bot challenge / HTML error pages arrive as text/html with 429/403.
    return {
      mimeType: null,
      error: `Upload failed (${response.status}): non-JSON response from upload service`,
    };
  }

  const data = (await response.json()) as {
    url?: string;
    mimeType?: string | null;
    error?: string;
  };

  if (!response.ok) {
    return {
      mimeType: null,
      error: data.error ?? `Upload failed (${response.status}): ${JSON.stringify(data)}`,
    };
  }

  if (!data.url) {
    return {
      mimeType: null,
      error: data.error ?? 'Upload failed: missing url in response',
    };
  }

  return {
    url: data.url,
    mimeType: data.mimeType || null,
  };
}

export { upload };
export default upload;
