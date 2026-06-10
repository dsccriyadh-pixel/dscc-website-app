// Passenger / "Setup Node.js App" entry. Loads the ESM server bundle.
import("./index.mjs").catch((err) => {
  console.error(err);
  process.exit(1);
});
