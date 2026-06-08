"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", background: "#faf9f7" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", color: "#1a1410" }}>Une erreur est survenue</h2>
          <button
            type="button"
            onClick={reset}
            style={{ padding: "0.75rem 1.5rem", background: "#c9302c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
