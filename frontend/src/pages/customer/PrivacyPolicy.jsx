import { useState } from "react";

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "Personal details (name, email, phone number, address).",
        "Payment details processed securely through third-party providers.",
        "Browsing and purchase history to improve user experience.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "To process orders and payments.",
        "To provide customer support.",
        "To improve our products and services.",
        "To send order updates and promotional offers (with your consent).",
      ],
    },
    {
      title: "3. Data Protection",
      content: [
        "We use secure encryption and industry-standard measures to protect your data.",
        "Your information will not be shared with third parties except for payment processing and delivery.",
      ],
    },
    {
      title: "4. Your Rights",
      content: [
        "You may request access, correction, or deletion of your personal data.",
        "You can opt out of promotional emails at any time.",
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-center mb-10">
          At <span className="font-semibold">BALLIN Wear</span>, we respect your
          privacy and are committed to protecting your personal information.
        </p>

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
                <div className="px-6 pb-4 text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-500 text-center">
          By using our services, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
