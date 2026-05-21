import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt =
  "AuditProRx — Pharmacy Audit Software & PBM Compliance Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/l1.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="AuditProRx logo"
            width={72}
            height={72}
            style={{ borderRadius: 14 }}
          />
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            AuditProRx
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
            }}
          >
            Pharmacy Audit Software for Independent Pharmacies
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a3a3a3",
              lineHeight: 1.3,
              maxWidth: 1000,
            }}
          >
            Automate PBM audit defense, reconcile wholesaler invoices, and
            protect revenue — HIPAA compliant.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #262626",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 32,
              color: "#a3a3a3",
              fontSize: 22,
            }}
          >
            <span>PBM Audit Defense</span>
            <span>•</span>
            <span>Wholesaler Reconciliation</span>
            <span>•</span>
            <span>NDC Inventory Audits</span>
          </div>
          <div style={{ color: "#ffffff", fontSize: 24, fontWeight: 600 }}>
            auditprorx.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
