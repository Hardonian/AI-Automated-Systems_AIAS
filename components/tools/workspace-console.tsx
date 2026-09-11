"use client";

import { useCallback, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Hash,
  Mail,
  Share2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  decryptClientState,
  encryptClientState,
  generateDiagnosticMailto,
  generateSHA256Receipt,
  useBroadcastChannel,
  useLocalStorage,
  useWebShare,
  type EncryptedClientExport,
} from "@/lib/utils/client-engines";

type Status = "idle" | "copied" | "hashed" | "encrypted" | "error";

const download = (name: string, content: string, type = "application/json") => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function WorkspaceConsole() {
  const [notes, setNotes] = useLocalStorage(
    "aias_workspace_notes",
    "Objective:\nConstraints:\nFailure modes:\nNext decision:",
  );
  const [jiraHost, setJiraHost] = useLocalStorage("aias_jira_host", "");
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [receipt, setReceipt] = useState("");
  const { share } = useWebShare();
  const onRemoteNotes = useCallback(
    (message: { notes: string }) => {
      setNotes(message.notes);
    },
    [setNotes],
  );
  const { postMessage } = useBroadcastChannel<{ notes: string }>(
    "aias-workspace",
    onRemoteNotes,
  );

  const updateNotes = (value: string) => {
    setNotes(value.slice(0, 10_000));
    postMessage({ notes: value.slice(0, 10_000) });
  };

  const copyForSlack = async () => {
    await navigator.clipboard.writeText(
      `*AIAS Architecture Brief*\n\`\`\`\n${notes}\n\`\`\``,
    );
    setStatus("copied");
    window.open(
      "https://app.slack.com/client",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openJira = () => {
    const host = jiraHost
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    if (!/^[a-z0-9][a-z0-9.-]*\.atlassian\.net$/.test(host)) {
      setStatus("error");
      return;
    }
    const query = new URLSearchParams({
      summary: "AIAS architecture review",
      description: notes,
    });
    window.open(
      `https://${host}/secure/CreateIssueDetails!init.jspa?${query}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const makeReceipt = async () => {
    const result = await generateSHA256Receipt(notes);
    setReceipt(`${result.receipt}\n\nFull SHA-256: ${result.hash}`);
    setStatus("hashed");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const encryptedExport = async () => {
    try {
      const payload = await encryptClientState(
        { notes, exportedAt: new Date().toISOString() },
        passphrase,
      );
      download(
        "aias-workspace.encrypted.json",
        JSON.stringify(payload, null, 2),
      );
      setStatus("encrypted");
    } catch {
      setStatus("error");
    }
  };

  const encryptedImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const encrypted = JSON.parse(text) as EncryptedClientExport;
      const decrypted = await decryptClientState<{ notes: string }>(
        encrypted,
        passphrase,
      );
      if (decrypted && typeof decrypted.notes === "string") {
        updateNotes(decrypted.notes);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section
      aria-labelledby="workspace-title"
      className="border-2 border-border bg-card p-6 shadow-card md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Local-first workspace
          </p>
          <h2
            className="mt-1 font-mono text-xl font-black uppercase"
            id="workspace-title"
          >
            Architecture handoff console
          </h2>
          <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
            Saved only in this browser and synchronized across open AIAS tabs.
            Nothing is sent to a server.
          </p>
        </div>
        <span
          aria-live="polite"
          className="font-mono text-xs font-bold uppercase text-primary"
        >
          {status === "idle"
            ? "Local only"
            : status === "error"
              ? "Check input"
              : status}
        </span>
      </div>

      <label
        className="mt-5 block font-mono text-xs font-bold uppercase"
        htmlFor="workspace-notes"
      >
        Diagnostic brief
      </label>
      <textarea
        className="mt-2 min-h-44 w-full border-2 border-border bg-background p-3 font-mono text-xs focus:border-primary focus:outline-none"
        id="workspace-notes"
        maxLength={10_000}
        onChange={(event) => updateNotes(event.target.value)}
        value={notes}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button onClick={makeReceipt} type="button" variant="outline">
          <Hash className="mr-2 h-4 w-4" />
          SHA-256 receipt
        </Button>
        <Button
          onClick={() =>
            share({
              title: "AIAS architecture brief",
              text: notes,
              url: window.location.href,
            })
          }
          type="button"
          variant="outline"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          onClick={() => {
            window.location.href = generateDiagnosticMailto({
              diagnosticData: { brief: notes.slice(0, 1500) },
            });
          }}
          type="button"
          variant="outline"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email diagnostic
        </Button>
        <Button onClick={copyForSlack} type="button" variant="outline">
          {status === "copied" ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copy + open Slack
        </Button>
        <div className="flex">
          <input
            aria-label="Jira workspace hostname"
            className="min-w-0 flex-1 border-2 border-r-0 border-border bg-background px-2 font-mono text-xs"
            onChange={(event) => setJiraHost(event.target.value)}
            placeholder="team.atlassian.net"
            value={jiraHost}
          />
          <Button className="shrink-0" onClick={openJira} type="button">
            Open Jira
          </Button>
        </div>
        <Button
          onClick={() =>
            download("aias-architecture-brief.md", notes, "text/markdown")
          }
          type="button"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Download brief
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
        <input
          aria-label="Encryption passphrase"
          className="min-h-11 flex-1 border-2 border-border bg-background px-3 font-mono text-xs"
          minLength={12}
          onChange={(event) => setPassphrase(event.target.value)}
          placeholder="12+ character export passphrase"
          type="password"
          value={passphrase}
        />
        <Button onClick={encryptedExport} type="button">
          <Download className="mr-2 h-4 w-4" />
          Encrypted export
        </Button>
        <input
          accept=".json"
          aria-label="Upload encrypted workspace vault"
          className="hidden"
          onChange={encryptedImport}
          ref={fileInputRef}
          type="file"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Decrypt import
        </Button>
      </div>

      {receipt ? (
        <pre className="mt-4 overflow-x-auto border border-border bg-black p-3 text-[10px] text-green-400">
          {receipt}
        </pre>
      ) : null}
    </section>
  );
}
