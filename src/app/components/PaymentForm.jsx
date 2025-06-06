import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup
import Link from "next/link";

const PaymentForm = ({ setShowDonationPopup, selectedLanguage }) => {

  const { t, i18n } = useTranslation();
    useEffect(() => {
      i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage]);

  const [details, setDetails] = useState({
    targetAccount: "",
    currency: "EUR",
    amount: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [donationAmount, setDonationAmount] = useState("5");
  const [customAmount, setCustomAmount] = useState("");

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleContribute = async (e) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/createQuote", {
        targetAccount: details.targetAccount,
        amount: donationAmount,
        targetCurrency: details.currency,
        sourceCurrency: details.currency,
      });

      const data = await res.data;

      if (!data || data.error) throw new Error(data.error || "Payment failed");

      alert("Payment created successfully! Please fund it through your Wise dashboard.");
      window.open(`https://sandbox.transferwise.tech/transactions/activities/by-resource/TRANSFER/${data.transferId}`, "_blank");
    } catch (err) {
      setError(err.message);
      console.error("Payment failed", err.response?.data || err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={() => setShowDonationPopup(false)} // Close form when clicking outside
    >
      <div
        className="bg-[#f8f5f0] rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the form from closing it
      >
        <button
          onClick={() => setShowDonationPopup(false)}
          className="absolute top-4 right-4 text-[#8b4513] hover:text-[#2c1810] transition-colors"
        >
          <i className="fa fa-times text-xl"></i>
        </button>

        <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-6 text-center">
          {t('paymentForm.title')}
        </h2>

        <div className="space-y-4">
          {/* <button
            onClick={() => setPaymentMethod("sms")}
            className={`w-full p-4 rounded-lg flex items-center gap-3 transition ${
              paymentMethod === "sms"
                ? "bg-[#8b4513] text-white"
                : "bg-white border-2 border-[#8b4513] text-[#8b4513]"
            }`}
          >
            <i className="fa fa-comment-alt"></i>
            {t('paymentForm.options.sms.title')}
          </button> */}

          {/* <button
            onClick={() => setPaymentMethod("card")}
            className={`w-full p-4 rounded-lg flex items-center gap-3 transition ${
              paymentMethod === "card"
                ? "bg-[#8b4513] text-white"
                : "bg-white border-2 border-[#8b4513] text-[#8b4513]"
            }`}
          >
            <i className="fa fa-credit-card"></i>
            {t('paymentForm.options.card.title')}
          </button> */}
          <Link
          href={"https://buymeacoffee.com/sveto.rs"}
          target="_blank"
            onClick={() => setPaymentMethod("link")}
            className={`w-full p-4 rounded-lg flex items-center gap-3 transition ${
              !(paymentMethod === "link")
                ? "bg-[#8b4513] text-white"
                : "bg-white border-2 border-[#8b4513] text-[#8b4513]"
            }`}
          >
            <i className="fa-solid fa-handshake-angle"></i>
            {t('paymentForm.options.card.title')}
          </Link>

          <button
            onClick={() => setPaymentMethod("qrCode")}
            className={`w-full p-4 rounded-lg flex items-center gap-3 transition ${
              !(paymentMethod === "qrCode")
                ? "bg-[#8b4513] text-white"
                : "bg-white border-2 border-[#8b4513] text-[#8b4513]"
            }`}
          >
            <i className="fa fa-qrcode"></i>
            {t('paymentForm.options.qrCode')}
          </button>

          {paymentMethod === "qrCode" && (
            <img src="/images/qrCode.png" alt="Wise QR Code" className="mx-auto" />
          )}

          {paymentMethod === "sms" && (
            <input
              type="tel"
              placeholder={t('paymentForm.options.sms.placeholder')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
            />
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder={t('paymentForm.options.card.p1')}
                  className="w-full p-4 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
                />
                <input
                  type="text"
                  placeholder={t('paymentForm.options.card.p2')}
                  className="w-full p-4 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
                  maxLength="19"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('paymentForm.options.card.p3')}
                    className="w-full p-4 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
                    maxLength="5"
                  />
                  <input
                    type="text"
                    placeholder={t('paymentForm.options.card.p4')}
                    className="w-full p-4 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
                    maxLength="4"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#5c4030]">
                <i className="fa fa-lock"></i>
                <span className="text-sm font-crimson-text">{t('paymentForm.options.card.securePayment')}</span>
              </div>
            </div>
          )}

          {(paymentMethod === "sms" || paymentMethod === "card") && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["5", "10", "20", "50"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setDonationAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-lg transition-all ${
                      donationAmount === amount && !customAmount
                        ? "bg-[#8b4513] text-white"
                        : "bg-white border-2 border-[#8b4513] text-[#8b4513]"
                    }`}
                  >
                    €{amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8b4513]">
                  €
                </span>
                <input
                  type="number"
                  placeholder={t('paymentForm.customAmount')}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDonationAmount(e.target.value);
                  }}
                  min="1"
                  className="w-full p-4 pl-8 rounded-lg border-2 border-[#8b4513] bg-white font-crimson-text"
                />
              </div>

              <div className="text-sm text-[#5c4030] font-crimson-text text-center">
                {donationAmount && (
                  <p>
                    {t('paymentForm.selectedAmount')} €{customAmount || donationAmount}
                    {!customAmount && (
                      <span>
                        {" "}
                        -{" "}
                        {
                          {
                            5: "Supporter",
                            10: "Benefactor",
                            20: "Patron",
                            50: "Guardian",
                          }[donationAmount]
                        }
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          {(paymentMethod === "sms" || paymentMethod === "card") && (
            <button
              disabled={loading}
              onClick={handleContribute}
              className="w-full bg-[#8b4513] text-white font-crimson-text text-xl px-8 py-4 rounded-lg transform transition hover:scale-105 flex items-center justify-center gap-2"
            >
              <i className="fa fa-heart"></i>
              {loading ? "Processing..." : t('paymentForm.CTA')}
            </button>
          )}

          <button
            onClick={() => setShowDonationPopup(false)}
            className="w-full bg-[#fff] text-[#8b4513] font-crimson-text text-xl px-8 py-4 rounded-lg transform transition hover:scale-105 flex items-center justify-center gap-2 border-solid border-2 border-[#8b4513]"
          >
            {t('paymentForm.close')}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;