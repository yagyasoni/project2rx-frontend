import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

import type { Metadata } from "next";

const SITE_URL = "https://www.auditprorx.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the AuditProRx Terms of Service governing use of our pharmacy audit software, PBM compliance platform, and wholesaler reconciliation tools.",
  alternates: { canonical: SITE_URL + "/terms-of-service" },
  openGraph: {
    type: "article",
    url: SITE_URL + "/terms-of-service",
    siteName: "AuditProRx",
    title: "Terms of Service | AuditProRx",
    description:
      "Terms governing use of the AuditProRx pharmacy audit & compliance platform.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | AuditProRx",
    description:
      "Terms governing use of the AuditProRx pharmacy audit & compliance platform.",
  },
  robots: { index: true, follow: true },
};

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <section
        className="min-h-screen py-24"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-6 text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            Last updated: June 3rd, 2026
          </p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-300">
            <p>
              These Terms govern your access to and use of our platform. By
              using our services, you agree to comply with these terms.
            </p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Use of Service
              </h2>
              <p>
                You agree to use the platform only for lawful purposes and in
                accordance with applicable regulations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Accounts
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and all activities under it.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Data & Compliance
              </h2>
              <p>
                You are responsible for ensuring that any data uploaded complies
                with applicable healthcare and privacy regulations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Intellectual Property
              </h2>
              <p>
                All platform content, features, and functionality are owned by
                us and are protected by applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Payments
              </h2>
              <p>
                Paid plans are billed according to the selected subscription.
                Fees are non-refundable unless otherwise stated.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                SMS Terms of Service
              </h2>
              <p>
                By opting into SMS from a web form or other medium, you are
                agreeing to receive SMS messages from AuditProRx. This includes
                SMS messages for customer care, account notifications, and
                marketing. The types of messages you can expect to receive
                include appointment reminders, order alerts, and account
                notifications.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Messaging frequency may vary.</li>
                <li>Message and data rates may apply.</li>
                <li>To opt out at any time, text STOP.</li>
                <li>
                  For assistance, text HELP or visit our website at{" "}
                  <a
                    href="https://www.auditprorx.com/"
                    className="text-blue-400 underline"
                  >
                    https://www.auditprorx.com/
                  </a>
                  .
                </li>
                <li>
                  Visit{" "}
                  <a
                    href="https://www.auditprorx.com/privacy-policy"
                    className="text-blue-400 underline"
                  >
                    https://www.auditprorx.com/privacy-policy
                  </a>{" "}
                  for our privacy policy and{" "}
                  <a
                    href="https://www.auditprorx.com/terms-of-service"
                    className="text-blue-400 underline"
                  >
                    https://www.auditprorx.com/terms-of-service
                  </a>{" "}
                  for Terms of Service.
                </li>
              </ul>
              <p className="mt-3">
                Message frequency varies. Message and data rates may apply. See
                privacy policy at{" "}
                <a
                  href="https://www.auditprorx.com/privacy-policy"
                  className="text-blue-400 underline"
                >
                  https://www.auditprorx.com/privacy-policy
                </a>
                . Message HELP for help. Reply STOP to any message to opt out.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Termination
              </h2>
              <p>
                We may suspend or terminate access if these terms are violated
                or if required by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Limitation of Liability
              </h2>
              <p>
                The service is provided “as is” without warranties. We are not
                liable for indirect or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Changes to Terms
              </h2>
              <p>
                We may update these terms from time to time. Continued use of
                the service indicates acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
              <p>For questions, contact us at: noreply@auditprorx.com</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TermsOfService;
