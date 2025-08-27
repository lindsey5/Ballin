import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Simply click the Sign Up button, provide your details, and verify your email.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept payments through GCash and Maya.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Orders usually take 3–5 business days within Metro Manila and 5–7 business days for provincial areas.",
    },
    {
      question: "Can I return or exchange an item?",
      answer:
        "Currently, we do not offer returns or exchanges unless otherwise stated in special cases.",
    },
    {
      question: "Is my payment information safe?",
      answer:
        "Absolutely. All payments are processed through secure third-party providers, and we do not store your card details.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within the Philippines, but we are working to expand our service internationally.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Frequently Asked Questions (FAQ)
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium hover:bg-gray-50"
              >
                {faq.question}
                <span className="ml-2 text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 text-gray-600 border-t bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Still have questions? Contact our support team anytime.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
