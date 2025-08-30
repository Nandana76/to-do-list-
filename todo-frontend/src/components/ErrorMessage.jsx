export default function ErrorMessage({ error }) {
  if (!error) return null;
  return <p style={{ color: "crimson" }}>{error}</p>;
}
