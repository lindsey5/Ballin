import { useState } from "react";

const TermsAndConditions = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Introduction",
      content: (
        <p>
          Welcome to <strong>BALLIN Wear</strong>. By accessing and using our
          e-commerce system, you agree to comply with these Terms and
          Conditions. Please read them carefully.
        </p>
      ),
    },
    {
      title: "2. Use of the System",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            Users must provide accurate and complete information when creating
            an account or making a purchase.
          </li>
          <li>Unauthorized use of another person’s account is strictly prohibited.</li>
        </ul>
      ),
    },
    {
      title: "3. Orders and Payments",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>All orders are subject to availability.</li>
          <li>
            Payments must be made through the supported payment channels (GCash
            and Maya).
          </li>
          <li>Once payment is confirmed, orders will be processed.</li>
        </ul>
      ),
    },
    {
      title: "4. Shipping and Delivery",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            Delivery times may vary depending on location and courier service.
          </li>
          <li>Customers will be notified once orders are shipped.</li>
        </ul>
      ),
    },
    {
      title: "5. No Refund Policy",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>All sales are final.</li>
          <li>
            BALLIN Wear does not accept returns, exchanges, or refunds once an
            order has been placed and payment has been confirmed.
          </li>
          <li>Please review your order carefully before completing the purchase.</li>
        </ul>
      ),
    },
    {
      title: "6. Limitation of Liability",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>BALLIN Wear is not responsible for damages caused by misuse of products.</li>
          <li>
            System downtime or technical issues may occur but will be addressed
            immediately.
          </li>
        </ul>
      ),
    },
    {
      title: "7. Changes to Terms",
      content: (
        <p>
          We reserve the right to update these Terms and Conditions at any time.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Terms and Conditions
        </h1>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-gray-800 focus:outline-none"
              >
                {section.title}
                <span className="text-gray-500">
                  {openSection === index ? "−" : "+"}
                </span>
              </button>
              {openSection === index && (
                <div className="px-6 pb-4 text-gray-700">{section.content}</div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-500 text-center">
          By using our services, you agree to these Terms and Conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
