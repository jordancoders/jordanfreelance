"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { useProjects } from "@/hooks/useProjects";
import { useReviews } from "@/hooks/useReviews";
import { useClients } from "@/hooks/useClients";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { exportData, importData } from "@/app/actions/backup";
import type { Invoice, Project, ClientReview, ClientPortalAccount, ExpenseEntry, BackupPayload } from "@/lib/types";
import { SITE_CONFIG } from "@/data/portfolioData";

interface AdminDataContextType {
  invoices: Invoice[];
  invoicesLoading: boolean;
  projects: Project[];
  projectsLoading: boolean;
  reviews: ClientReview[];
  reviewsLoading: boolean;
  clients: ClientPortalAccount[];
  clientsLoading: boolean;
  expenses: ExpenseEntry[];
  expensesLoading: boolean;
  reloadExpenses: () => void;
  configLoading: boolean;
  googleFormUrl: string;
  logoUrl: string;
  socialLinks: {
    githubUrl: string;
    linkedinUrl: string;
    facebookUrl: string;
    discordUrl: string;
    repoUrl: string;
  };
  createInvoice: (invoice: Invoice) => Promise<Invoice>;
  updateInvoice: (id: string, patch: Partial<Invoice>) => Promise<Invoice | null>;
  deleteInvoice: (id: string) => Promise<boolean>;
  createProject: (project: Project) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  createReview: (review: ClientReview) => Promise<ClientReview>;
  updateReview: (id: string, patch: Partial<ClientReview>) => Promise<ClientReview | null>;
  deleteReview: (id: string) => Promise<boolean>;
  createClient: (client: ClientPortalAccount) => Promise<ClientPortalAccount>;
  updateClient: (id: string, patch: Partial<ClientPortalAccount>) => Promise<ClientPortalAccount | null>;
  deleteClient: (id: string) => Promise<boolean>;
  saveGoogleFormUrl: (url: string) => Promise<void>;
  saveLogoUrl: (url: string) => Promise<void>;
  saveSocialLinks: (links: { githubUrl: string; linkedinUrl: string; facebookUrl: string; discordUrl: string; repoUrl: string }) => Promise<void>;
  exportBackup: () => Promise<BackupPayload>;
  importBackup: (data: BackupPayload) => Promise<void>;
  reloadAll: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    documentType: "Invoice",
    invoiceNumber: "INV-2026-001",
    clientName: "Sipho Ndlovu",
    clientCompany: "Cape Logistics Operations",
    clientEmail: "sipho@capelogistics.co.za",
    clientPhone: "+27 82 123 4567",
    currency: "ZAR",
    issueDate: "2026-08-08",
    dueDate: "2026-08-22",
    status: "Sent",
    items: [
      { id: "item-1", description: "Custom Dispatch & Cargo Tracking Web App (6 Views)", quantity: 1, rate: 8500 },
      { id: "item-2", description: "WhatsApp Driver Notification Engine & Staging Link Setup", quantity: 1, rate: 1500 }
    ],
    depositPercent: 50,
    depositPaid: 6000,
    notes: "Bank: Capitec Business | Acc: 1234567890 | Ref: INV-2026-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "quot-002",
    documentType: "Quote",
    invoiceNumber: "QUO-2026-014",
    clientName: "Dr. Anelisa Botha",
    clientCompany: "Botha Allied Medical Practice",
    clientEmail: "drbotha@medicalpractice.co.za",
    clientPhone: "+27 83 987 6543",
    currency: "ZAR",
    issueDate: "2026-08-05",
    dueDate: "2026-08-19",
    status: "Accepted",
    items: [
      { id: "item-10", description: "Practice Medical Billing & Patient Quote Portal", quantity: 1, rate: 9500 }
    ],
    depositPercent: 50,
    depositPaid: 9500,
    notes: "Formal Quote accepted. 48-Hour Staging Guarantee applied.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const inv = useInvoices();
  const proj = useProjects();
  const rev = useReviews();
  const cli = useClients();
  const { config: cloudConfig, save: saveConfig } = useSiteConfig();

  // Expenses — fetched directly from API (no dedicated hook needed)
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const loadExpenses = useCallback(async () => {
    try {
      setExpensesLoading(true);
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const json = await res.json();
        setExpenses(json.expenses || []);
      }
    } catch { /* ignore */ }
    finally { setExpensesLoading(false); }
  }, []);
  // Load expenses on mount
  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  // Derive initial state from cloud config when available (no useEffect setState)
  const [googleFormUrl, setGoogleFormUrl] = useState(
    cloudConfig.googleFormUrl || SITE_CONFIG.googleFormUrl
  );
  const [logoUrl, setLogoUrl] = useState(cloudConfig.logoUrl || "");
  const [socialLinks, setSocialLinks] = useState({
    githubUrl: cloudConfig.githubUrl || SITE_CONFIG.githubUrl,
    linkedinUrl: cloudConfig.linkedinUrl || SITE_CONFIG.linkedinUrl,
    facebookUrl: cloudConfig.facebookUrl || SITE_CONFIG.facebookUrl,
    discordUrl: cloudConfig.discordUrl || SITE_CONFIG.discordUrl,
    repoUrl: cloudConfig.repoUrl || SITE_CONFIG.repoUrl,
  });

  const saveGoogleFormUrl = useCallback(async (url: string) => {
    setGoogleFormUrl(url);
    await saveConfig({ googleFormUrl: url });
  }, [saveConfig]);

  const saveLogoUrl = useCallback(async (url: string) => {
    setLogoUrl(url);
    await saveConfig({ logoUrl: url });
  }, [saveConfig]);

  const saveSocialLinks = useCallback(async (links: typeof socialLinks) => {
    setSocialLinks(links);
    await saveConfig({ socialLinks: links });
  }, [saveConfig]);

  const exportBackup = useCallback(async () => {
    return exportData();
  }, []);

  const importBackup = useCallback(async (data: BackupPayload) => {
    await importData(data);
    inv.reload();
    proj.reload();
    rev.reload();
    cli.reload();
    loadExpenses();
  }, [inv, proj, rev, cli, loadExpenses]);

  const reloadAll = useCallback(() => {
    inv.reload();
    proj.reload();
    rev.reload();
    cli.reload();
    loadExpenses();
  }, [inv, proj, rev, cli, loadExpenses]);

  return (
    <AdminDataContext.Provider
      value={{
        invoices: inv.invoices,
        invoicesLoading: inv.loading,
        projects: proj.projects,
        projectsLoading: proj.loading,
        reviews: rev.reviews,
        reviewsLoading: rev.loading,
        clients: cli.clients,
        clientsLoading: cli.loading,
        expenses,
        expensesLoading,
        reloadExpenses: loadExpenses,
        configLoading: cloudConfig.googleFormUrl === undefined,
        googleFormUrl,
        logoUrl,
        socialLinks,
        createInvoice: inv.create,
        updateInvoice: inv.update,
        deleteInvoice: inv.remove,
        createProject: proj.create,
        updateProject: proj.update,
        deleteProject: proj.remove,
        createReview: rev.create,
        updateReview: rev.update,
        deleteReview: rev.remove,
        createClient: cli.create,
        updateClient: cli.update,
        deleteClient: cli.remove,
        saveGoogleFormUrl,
        saveLogoUrl,
        saveSocialLinks,
        exportBackup,
        importBackup,
        reloadAll,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export { DEFAULT_INVOICES };
