// Read-only sanity check: enumerate databases and collections with counts.
// Prints counts only — never the URI.
const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const m = env.match(/^MONGODB_URI=(.+)$/m);
if (!m) {
  console.log("NO MONGODB_URI IN .env.local");
  process.exit(1);
}
const uri = m[1].trim().replace(/^["']|["']$/g, "");

const { MongoClient } = require("mongodb");

(async () => {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const admin = client.db("admin");
    const dbs = await admin.command({ listDatabases: 1 });
    for (const db of dbs.databases) {
      const colls = await client.db(db.name).listCollections().toArray();
      const parts = [];
      for (const c of colls) {
        let n;
        try {
          n = await client.db(db.name).collection(c.name).countDocuments();
        } catch {
          n = -1;
        }
        parts.push(`${c.name}:${n}`);
      }
      console.log(`${db.name} -> ${parts.join(", ") || "(no collections)"}`);
    }
  } catch (e) {
    console.log("MONGO CHECK FAILED:", e.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
})();
