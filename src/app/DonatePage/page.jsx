"use client";
import '../globals.css';
import React from "react";
import { useState, useEffect } from "react";import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUserPlus, faPaperPlane, faBell, faUsers, faPray } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
// import('@fortawesome/fontawesome-free/js/all.js');
import '@fortawesome/fontawesome-free/css/all.css';
import PaymentForm from '../components/PaymentForm';
import CommunityPrompt from '../components/CommunityPrompt';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // Import the i18n setup




function DonationPage() {

  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
    const { t, i18n } = useTranslation();

  function changeLanguage(lang){
    setSelectedLanguage(lang)
  }

    useEffect(() => {
      i18n.changeLanguage(selectedLanguage);
    }, [selectedLanguage]);
  
    useEffect(() => {
      // Dynamically load the Font Awesome JS script on the client side only
    }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    wantsUpdates: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setNotification({
        show: true,
        message: "Thank you for your interest in supporting our mission!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    } catch (error) {
      setNotification({
        show: true,
        message:
          "There was an error processing your request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]" id='donate'>
    <div className="fixed inset-0 z-0 w-full h-full">
      <img
        src="https://ucarecdn.com/2378599d-07bd-4033-851d-f94d7cb32508/-/format/auto/"
        alt="Orthodox background with religious imagery"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#f8f5f0] bg-opacity-90"></div>
    </div>
        {isDropdownOpen && <PaymentForm setShowDonationPopup={setIsDropdownOpen} selectedLanguage={selectedLanguage} />}
        {isCommunityPopupOpen && <CommunityPrompt setShowPopup={setIsCommunityPopupOpen} />}
        {!isMobile && <Header selectedLanguage={selectedLanguage} changeLanguage={changeLanguage} />}
      <div className="max-w-5xl mx-auto p-6 z-10 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-crimson-text text-[#8b4513] mb-6">
            {t('donationPage.title')}
          </h1>
          <p className="text-xl font-crimson-text text-[#5c4030] mb-8">
          {t('donationPage.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
            <div className="flex flex-col flex-1 items-center text-center justify-between">
              <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
              {t('donationPage.support.title')}
              </h2>
              <p className="text-[#5c4030] font-crimson-text mb-6">
              {t('donationPage.support.subtitle')}
              </p>
              <button
                className="inline-flex items-center bg-[#8b4513] text-white px-6 py-3 rounded-lg hover:bg-[#724011] transition-colors font-crimson-text"
                onClick={()=>setIsDropdownOpen(true)}
              >
                <i className="fas fa-heart mr-2"></i>
                {t('donationPage.support.CTA')}
              </button>
            </div>

            <div className="text-4xl text-[#8b4513] font-crimson-text">{t('donationPage.or')}</div>

            <div className="flex flex-col flex-1 items-center text-center justify-between">
              <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
              {t('donationPage.community.title')}
              </h2>
              <p className="text-[#5c4030] font-crimson-text mb-6">
              {t('donationPage.community.subtitle')}
              </p>
              <button
                onClick={() => setIsCommunityPopupOpen(true)}
                className="inline-flex items-center bg-[#8b4513] text-white px-6 py-3 rounded-lg hover:bg-[#724011] transition-colors font-crimson-text"
              >
                <i className="fas fa-user-plus mr-2"></i>
                {t('donationPage.community.CTA')}
              </button>
            </div>
          </div>

          {/* {showRegistration && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-[#8b4513] rounded-lg font-crimson-text"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-[#8b4513] rounded-lg font-crimson-text"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Share your message of support (optional)"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-[#8b4513] rounded-lg font-crimson-text h-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="wantsUpdates"
                  checked={formData.wantsUpdates}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-[#8b4513]"
                />
                <label className="font-crimson-text text-[#5c4030]">
                  Keep me updated about Orthodox Christian news and events
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8b4513] text-white py-4 rounded-lg font-crimson-text flex items-center justify-center space-x-2 hover:bg-[#724011] transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
<FontAwesomeIcon icon={faPaperPlane} />
                    <span>Submit Registration</span>
                  </>
                )}
              </button>
            </form>
          )} */}
        </div>

        {notification.show && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white font-crimson-text`}
          >
            {notification.message}
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
            {t('donationPage.whyJoin.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
            <i className="fas fa-bell text-3xl text-[#8b4513] mb-4"></i>
              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                {t('donationPage.whyJoin.reasonTitles.r1')}
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                {t('donationPage.whyJoin.reasonText.r1')}
              </p>
            </div>
            <div className="p-6">
            <i className="fas fa-users text-3xl text-[#8b4513] mb-4"></i>

              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                {t('donationPage.whyJoin.reasonTitles.r2')}
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                {t('donationPage.whyJoin.reasonText.r2')}
              </p>
            </div>
            <div className="p-6">
            <i className="fas fa-pray text-3xl text-[#8b4513] mb-4"></i>
              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                {t('donationPage.whyJoin.reasonTitles.r3')}
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                {t('donationPage.whyJoin.reasonText.r3')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;