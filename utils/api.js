/**
 * Utility function to safely parse JSON responses
 */
export const safeJsonParse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Expected JSON but got ${contentType || "unknown"}. Response preview: ${text.substring(0, 200)}`
    );
  }
  return await response.json();
};

