const TermsOfService = () => {
  return (
    <section
      className="min-h-screen py-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-white">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: March 21, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          <p>
            These Terms govern your access to and use of our platform. By using
            our services, you agree to comply with these terms.
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
            <h2 className="text-lg font-semibold text-white mb-2">Accounts</h2>
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
              All platform content, features, and functionality are owned by us
              and are protected by applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Payments</h2>
            <p>
              Paid plans are billed according to the selected subscription. Fees
              are non-refundable unless otherwise stated.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Termination
            </h2>
            <p>
              We may suspend or terminate access if these terms are violated or
              if required by law.
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
              We may update these terms from time to time. Continued use of the
              service indicates acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p>For questions, contact us at: noreply@auditprorx.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
