const CancellationAndRefundPolicy = () => {
  return (
    <section
      className="min-h-screen py-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Cancellation & Refund Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: March 21, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
          <p>
            This policy outlines the terms under which you may cancel your
            subscription and request refunds for services provided through our
            platform.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Subscription Cancellation
            </h2>
            <p>
              You may cancel your subscription at any time. Cancellation will
              take effect at the end of your current billing cycle, and you will
              continue to have access to the service until that time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Free Trial
            </h2>
            <p>
              If you are on a free trial, you may cancel at any time before the
              trial period ends without incurring any charges.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Refund Policy
            </h2>
            <p>
              Payments made for subscription plans are generally non-refundable.
              However, in exceptional cases, refund requests may be reviewed on
              a case-by-case basis at our sole discretion.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Billing & Charges
            </h2>
            <p>
              All fees are billed in advance based on your selected plan. You
              are responsible for managing your subscription and ensuring timely
              cancellation if you do not wish to continue.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy periodically. Continued use of the
              service after changes are made constitutes acceptance of the
              revised policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p>
              For any questions regarding cancellations or refunds, please
              contact us at: noreply@auditprorx.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CancellationAndRefundPolicy;
