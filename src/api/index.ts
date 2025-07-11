// src/api/index.ts

const API_URL = import.meta.env.VITE_API_URL;

export async function getPresaleStatus() {
  try {
    const response = await fetch(`${API_URL}/api/presale`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching presale status:", error);
    throw error;
  }
}

export async function submitWalletAddress(address: string) {
  try {
    const response = await fetch(`${API_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) throw new Error("Submission failed");
    return await response.json();
  } catch (error) {
    console.error("Error submitting wallet address:", error);
    throw error;
  }
}
