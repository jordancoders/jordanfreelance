/**
 * MongoDB Atlas data layer (server-only).
 *
 * Uses the official `mongodb` driver. The client is cached in `globalThis` so
 * warm Vercel function instances reuse the same connection pool.
 *
 * Storage model — database `jordanpeters`, collections:
 *   - invoices
 *   - projects
 *   - reviews
 *   - clients
 *   - config        (single document, _id: "site-config")
 *
 * Every function throws on failure so callers can surface errors to the user.
 */

import "server-only";
import { MongoClient, ObjectId, type Collection, type Document } from "mongodb";
import type {
  Invoice,
  Project,
  ClientReview,
  ClientPortalAccount,
  SiteConfig,
} from "./types";

const URI = process.env.MONGODB_URI;
const DATABASE = "jordanpeters";

const COLLECTIONS = {
  invoices: "invoices",
  projects: "projects",
  reviews: "reviews",
  clients: "clients",
  config: "config",
} as const;

const CONFIG_ID = "site-config";

// ─── Connection ───────────────────────────────────────────────────────────────

const globalForMongo = globalThis as unknown as {
  _jordanMongoClient?: MongoClient;
};

const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

function newClient(): MongoClient {
  if (!URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  return new MongoClient(URI, CONNECT_OPTIONS);
}

/**
 * Return a collection, reconnecting from scratch on failure.
 *
 * Serverless instances reuse a cached client, but a transient connection
 * failure can leave that client's topology permanently closed. When that
 * happens we drop the cached client and retry with a fresh one instead of
 * surfacing `MongoTopologyClosedError` to every subsequent request.
 */
async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  if (!globalForMongo._jordanMongoClient) {
    globalForMongo._jordanMongoClient = newClient();
  }
  try {
    await globalForMongo._jordanMongoClient.connect();
  } catch (err) {
    globalForMongo._jordanMongoClient.close().catch(() => {});
    globalForMongo._jordanMongoClient = newClient();
    await globalForMongo._jordanMongoClient.connect();
  }
  return globalForMongo._jordanMongoClient.db(DATABASE).collection<T>(name);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip the MongoDB `_id` field from a document.
 * MongoDB returns `_id: ObjectId` on every document; our domain types don't
 * carry it. This removes it at the boundary so the rest of the app never sees it.
 */
function stripId<T extends { _id?: unknown }, R = Omit<T, "_id">>(doc: T): R {
  const { _id: _, ...rest } = doc;
  return rest as unknown as R;
}

function now(): string {
  return new Date().toISOString();
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function getInvoices(): Promise<Invoice[]> {
  const docs = await (await getCollection<Invoice>(COLLECTIONS.invoices))
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => { const { _id: _, ...rest } = d; return rest; });
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const doc = await (await getCollection<Invoice>(COLLECTIONS.invoices)).findOne({ id });
  return doc ? stripId<Invoice>(doc) : null;
}

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const doc = { ...invoice, createdAt: invoice.createdAt || now(), updatedAt: now() };
  await (await getCollection<Invoice>(COLLECTIONS.invoices)).insertOne(doc as Invoice);
  return doc;
}

export async function updateInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await (await getCollection<Invoice>(COLLECTIONS.invoices)).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<Invoice>(res)) : null;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const res = await (await getCollection<Invoice>(COLLECTIONS.invoices)).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const docs = await (await getCollection<Project>(COLLECTIONS.projects))
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<Project>(d));
}

export async function getPublishedProjects(): Promise<Project[]> {
  const docs = await (await getCollection<Project>(COLLECTIONS.projects))
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<Project>(d));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await (await getCollection<Project>(COLLECTIONS.projects)).findOne({ slug, status: "published" });
  return doc ? (stripId<Project>(doc)) : null;
}

export async function getProject(id: string): Promise<Project | null> {
  const doc = await (await getCollection<Project>(COLLECTIONS.projects)).findOne({ id });
  return doc ? (stripId<Project>(doc)) : null;
}

export async function createProject(project: Project): Promise<Project> {
  const doc = { ...project, createdAt: project.createdAt || now(), updatedAt: now() };
  await (await getCollection<Project>(COLLECTIONS.projects)).insertOne(doc as Project);
  return doc;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await (await getCollection<Project>(COLLECTIONS.projects)).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<Project>(res)) : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await (await getCollection<Project>(COLLECTIONS.projects)).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviews(): Promise<ClientReview[]> {
  const docs = await (await getCollection<ClientReview>(COLLECTIONS.reviews))
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientReview>(d));
}

export async function getPublishedReviews(): Promise<ClientReview[]> {
  const docs = await (await getCollection<ClientReview>(COLLECTIONS.reviews))
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientReview>(d));
}

export async function getReview(id: string): Promise<ClientReview | null> {
  const doc = await (await getCollection<ClientReview>(COLLECTIONS.reviews)).findOne({ id });
  return doc ? (stripId<ClientReview>(doc)) : null;
}

export async function createReview(review: ClientReview): Promise<ClientReview> {
  const doc = { ...review, createdAt: review.createdAt || now(), updatedAt: now() };
  await (await getCollection<ClientReview>(COLLECTIONS.reviews)).insertOne(doc as ClientReview);
  return doc;
}

export async function updateReview(id: string, patch: Partial<ClientReview>): Promise<ClientReview | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await (await getCollection<ClientReview>(COLLECTIONS.reviews)).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<ClientReview>(res)) : null;
}

export async function deleteReview(id: string): Promise<boolean> {
  const res = await (await getCollection<ClientReview>(COLLECTIONS.reviews)).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Client Portals ───────────────────────────────────────────────────────────

export async function getClients(): Promise<ClientPortalAccount[]> {
  const docs = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients))
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientPortalAccount>(d));
}

export async function getClient(id: string): Promise<ClientPortalAccount | null> {
  const doc = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).findOne({ id });
  return doc ? (stripId<ClientPortalAccount>(doc)) : null;
}

export async function getClientByUsername(username: string): Promise<ClientPortalAccount | null> {
  const doc = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).findOne({
    username: { $regex: new RegExp(`^${username}$`, "i") },
  });
  return doc ? (stripId<ClientPortalAccount>(doc)) : null;
}

export async function getClientByInvoiceId(invoiceId: string): Promise<ClientPortalAccount | null> {
  const doc = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).findOne({ invoiceId });
  return doc ? (stripId<ClientPortalAccount>(doc)) : null;
}

export async function createClient(client: ClientPortalAccount): Promise<ClientPortalAccount> {
  const doc = { ...client, createdAt: client.createdAt || now(), updatedAt: now() };
  await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).insertOne(doc as ClientPortalAccount);
  return doc;
}

export async function updateClient(id: string, patch: Partial<ClientPortalAccount>): Promise<ClientPortalAccount | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<ClientPortalAccount>(res)) : null;
}

export async function deleteClient(id: string): Promise<boolean> {
  const res = await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export async function getConfig(): Promise<SiteConfig | null> {
  const doc = await (await getCollection<SiteConfig>(COLLECTIONS.config)).findOne({ _id: CONFIG_ID });
  if (!doc) return null;
  return stripId<SiteConfig>(doc);
}

export async function saveConfig(config: SiteConfig): Promise<SiteConfig> {
  const doc = { ...config, _id: CONFIG_ID, updatedAt: now() };
  await (await getCollection<SiteConfig>(COLLECTIONS.config)).replaceOne(
    { _id: CONFIG_ID },
    doc,
    { upsert: true }
  );
  return doc;
}

// ─── Backup / Restore ─────────────────────────────────────────────────────────

export async function exportAll(): Promise<{
  invoices: Invoice[];
  projects: Project[];
  reviews: ClientReview[];
  clients: ClientPortalAccount[];
  config: SiteConfig | null;
}> {
  const [invoices, projects, reviews, clients, config] = await Promise.all([
    getInvoices(),
    getProjects(),
    getReviews(),
    getClients(),
    getConfig(),
  ]);
  return { invoices, projects, reviews, clients, config };
}

export async function importAll(data: {
  invoices?: Invoice[];
  projects?: Project[];
  reviews?: ClientReview[];
  clients?: ClientPortalAccount[];
  config?: SiteConfig | null;
}): Promise<void> {
  if (data.invoices?.length) {
    await (await getCollection<Invoice>(COLLECTIONS.invoices)).deleteMany({});
    await (await getCollection<Invoice>(COLLECTIONS.invoices)).insertMany(data.invoices as Invoice[]);
  }
  if (data.projects?.length) {
    await (await getCollection<Project>(COLLECTIONS.projects)).deleteMany({});
    await (await getCollection<Project>(COLLECTIONS.projects)).insertMany(data.projects as Project[]);
  }
  if (data.reviews?.length) {
    await (await getCollection<ClientReview>(COLLECTIONS.reviews)).deleteMany({});
    await (await getCollection<ClientReview>(COLLECTIONS.reviews)).insertMany(data.reviews as ClientReview[]);
  }
  if (data.clients?.length) {
    await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).deleteMany({});
    await (await getCollection<ClientPortalAccount>(COLLECTIONS.clients)).insertMany(data.clients as ClientPortalAccount[]);
  }
  if (data.config) {
    await saveConfig(data.config);
  }
}
