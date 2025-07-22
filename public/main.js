document.getElementById("form-url").addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = document.getElementById("url").value.trim();

  try {
    const res = await fetch("/api/shorturl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_url: url }),
    });

    const data = await res.json();

    if (data.error) {
      window.location.href = `/api/shorturl?error=${encodeURIComponent(data.error)}`;
    } else {
      window.location.href = `/api/shorturl?id=${data.short_url}`;
    }
  } catch (err) {
    window.location.href = `/api/shorturl?error=${encodeURIComponent("Oops! Something went wrong")}`;
  }
});