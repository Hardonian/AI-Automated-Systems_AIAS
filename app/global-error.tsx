"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "2rem",
              maxWidth: "28rem",
            }}
          >
            An unexpected error occurred. Please try again or contact us if the
            problem persists.
          </p>
          {process.env.NODE_ENV !== "production" && error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginBottom: "1rem",
              }}
            >
              Error digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
