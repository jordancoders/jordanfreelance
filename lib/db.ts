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

function getClient(): MongoClient {
  if (!URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!globalForMongo._jordanMongoClient) {
    globalForMongo._jordanMongoClient = new MongoClient(URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  }
  return globalForMongo._jordanMongoClient;
}

function db() {
  return getClient().db(DATABASE);
}

function coll<T extends Document>(name: string): Collection<T> {
  return db().collection<T>(name);
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
  const docs = await coll<Invoice>(COLLECTIONS.invoices)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => { const { _id: _, ...rest } = d; return rest; });
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const doc = await coll<Invoice>(COLLECTIONS.invoices).findOne({ id });
  return doc ? (doc ? (() => { const { _id: _, ...rest } = doc; return rest; })() : null) : null;
}

export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const doc = { ...invoice, createdAt: invoice.createdAt || now(), updatedAt: now() };
  await coll<Invoice>(COLLECTIONS.invoices).insertOne(doc as Invoice);
  return doc;
}

export async function updateInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await coll<Invoice>(COLLECTIONS.invoices).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<Invoice>(res)) : null;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const res = await coll<Invoice>(COLLECTIONS.invoices).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const docs = await coll<Project>(COLLECTIONS.projects)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<Project>(d));
}

export async function getPublishedProjects(): Promise<Project[]> {
  const docs = await coll<Project>(COLLECTIONS.projects)
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<Project>(d));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const doc = await coll<Project>(COLLECTIONS.projects).findOne({ slug, status: "published" });
  return doc ? (stripId<Project>(doc)) : null;
}

export async function getProject(id: string): Promise<Project | null> {
  const doc = await coll<Project>(COLLECTIONS.projects).findOne({ id });
  return doc ? (stripId<Project>(doc)) : null;
}

export async function createProject(project: Project): Promise<Project> {
  const doc = { ...project, createdAt: project.createdAt || now(), updatedAt: now() };
  await coll<Project>(COLLECTIONS.projects).insertOne(doc as Project);
  return doc;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await coll<Project>(COLLECTIONS.projects).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<Project>(res)) : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await coll<Project>(COLLECTIONS.projects).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getReviews(): Promise<ClientReview[]> {
  const docs = await coll<ClientReview>(COLLECTIONS.reviews)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientReview>(d));
}

export async function getPublishedReviews(): Promise<ClientReview[]> {
  const docs = await coll<ClientReview>(COLLECTIONS.reviews)
    .find({ status: "published" })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientReview>(d));
}

export async function getReview(id: string): Promise<ClientReview | null> {
  const doc = await coll<ClientReview>(COLLECTIONS.reviews).findOne({ id });
  return doc ? (stripId<ClientReview>(doc)) : null;
}

export async function createReview(review: ClientReview): Promise<ClientReview> {
  const doc = { ...review, createdAt: review.createdAt || now(), updatedAt: now() };
  await coll<ClientReview>(COLLECTIONS.reviews).insertOne(doc as ClientReview);
  return doc;
}

export async function updateReview(id: string, patch: Partial<ClientReview>): Promise<ClientReview | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await coll<ClientReview>(COLLECTIONS.reviews).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<ClientReview>(res)) : null;
}

export async function deleteReview(id: string): Promise<boolean> {
  const res = await coll<ClientReview>(COLLECTIONS.reviews).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Client Portals ───────────────────────────────────────────────────────────

export async function getClients(): Promise<ClientPortalAccount[]> {
  const docs = await coll<ClientPortalAccount>(COLLECTIONS.clients)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => stripId<ClientPortalAccount>(d));
}

export async function getClient(id: string): Promise<ClientPortalAccount | null> {
  const doc = await coll<ClientPortalAccount>(COLLECTIONS.clients).findOne({ id });
  return doc ? (stripId<ClientPortalAccount>(doc)) : null;
}

export async function getClientByUsername(username: string): Promise<ClientPortalAccount | null> {
  const doc = await coll<ClientPortalAccount>(COLLECTIONS.clients).findOne({
    username: { $regex: new RegExp(`^${username}$`, "i") },
  });
  return doc ? (stripId<ClientPortalAccount>(doc)) : null;
}

export async function createClient(client: ClientPortalAccount): Promise<ClientPortalAccount> {
  const doc = { ...client, createdAt: client.createdAt || now(), updatedAt: now() };
  await coll<ClientPortalAccount>(COLLECTIONS.clients).insertOne(doc as ClientPortalAccount);
  return doc;
}

export async function updateClient(id: string, patch: Partial<ClientPortalAccount>): Promise<ClientPortalAccount | null> {
  const updated = { ...patch, updatedAt: now() };
  const res = await coll<ClientPortalAccount>(COLLECTIONS.clients).findOneAndUpdate(
    { id },
    { $set: updated },
    { returnDocument: "after" }
  );
  return res ? (stripId<ClientPortalAccount>(res)) : null;
}

export async function deleteClient(id: string): Promise<boolean> {
  const res = await coll<ClientPortalAccount>(COLLECTIONS.clients).deleteOne({ id });
  return res.deletedCount === 1;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export async function getConfig(): Promise<SiteConfig | null> {
  const doc = await coll<SiteConfig>(COLLECTIONS.config).findOne({ _id: CONFIG_ID });
  if (!doc) return null;
  return stripId<SiteConfig>(doc);
}

export async function saveConfig(config: SiteConfig): Promise<SiteConfig> {
  const doc = { ...config, _id: CONFIG_ID, updatedAt: now() };
  await coll<SiteConfig>(COLLECTIONS.config).replaceOne(
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
    await coll<Invoice>(COLLECTIONS.invoices).deleteMany({});
    await coll<Invoice>(COLLECTIONS.invoices).insertMany(data.invoices as Invoice[]);
  }
  if (data.projects?.length) {
    await coll<Project>(COLLECTIONS.projects).deleteMany({});
    await coll<Project>(COLLECTIONS.projects).insertMany(data.projects as Project[]);
  }
  if (data.reviews?.length) {
    await coll<ClientReview>(COLLECTIONS.reviews).deleteMany({});
    await coll<ClientReview>(COLLECTIONS.reviews).insertMany(data.reviews as ClientReview[]);
  }
  if (data.clients?.length) {
    await coll<ClientPortalAccount>(COLLECTIONS.clients).deleteMany({});
    await coll<ClientPortalAccount>(COLLECTIONS.clients).insertMany(data.clients as ClientPortalAccount[]);
  }
  if (data.config) {
    await saveConfig(data.config);
  }
}
