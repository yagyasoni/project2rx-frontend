const PrivacyPolicy = () => {
  return (
    <section
      className="min-h-screen py-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: March 21, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          <p>
            This Privacy Policy describes how we collect, use, and protect your
            information when you use our platform. By accessing our services,
            you agree to the practices outlined below.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly, including account
              details, audit data, and communications. We may also collect usage
              data automatically to improve our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              How We Use Information
            </h2>
            <p>
              Your data is used to operate, improve, and secure our platform,
              provide audit insights, and support your workflows.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures, including
              encryption and access controls, to protect sensitive information.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Compliance
            </h2>
            <p>
              We follow applicable healthcare data protection standards,
              including HIPAA-aligned practices where required.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Third-Party Services
            </h2>
            <p>
              Our platform may integrate with third-party tools. These services
              have their own privacy policies, and we are not responsible for
              their practices.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Your Rights
            </h2>
            <p>
              You may request access, correction, or deletion of your personal
              data by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy periodically. Continued use of the
              service constitutes acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Contact Us
            </h2>
            <p>
              For questions regarding this policy, please contact us at:
              noreply@auditprorx.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
