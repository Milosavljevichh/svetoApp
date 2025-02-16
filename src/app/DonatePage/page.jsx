"use client";
import '../globals.css';
import React from "react";
import { useState, useEffect } from "react";import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUserPlus, faPaperPlane, faBell, faUsers, faPray } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";



function DonationPage() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize(); // Check on mount
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  const [showRegistration, setShowRegistration] = useState(false);
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
    <div className="min-h-screen bg-[#f8f5f0]">
        {!isMobile && <Header />}
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-crimson-text text-[#2c1810] mb-6">
            Join Our Orthodox Community
          </h1>
          <p className="text-xl font-crimson-text text-[#5c4030] mb-8">
            Your support helps spread the light of Orthodox Christianity
            worldwide
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
            <div className="flex-1">
              <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
                Support Without Registration
              </h2>
              <p className="text-[#5c4030] font-crimson-text mb-6">
                Make a direct contribution to support our mission without
                creating an account
              </p>
              <a
                href="/donate"
                className="inline-flex items-center bg-[#8b4513] text-white px-6 py-3 rounded-lg hover:bg-[#724011] transition-colors font-crimson-text"
              >
                <FontAwesomeIcon icon={faHeart} />
                Make a Donation
              </a>
            </div>

            <div className="text-4xl text-[#8b4513] font-crimson-text">OR</div>

            <div className="flex-1">
              <h2 className="text-2xl font-crimson-text text-[#2c1810] mb-4">
                Join Our Community
              </h2>
              <p className="text-[#5c4030] font-crimson-text mb-6">
                Register to receive updates and connect with our community
              </p>
              <button
                onClick={() => setShowRegistration(true)}
                className="inline-flex items-center bg-[#8b4513] text-white px-6 py-3 rounded-lg hover:bg-[#724011] transition-colors font-crimson-text"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Register Now
              </button>
            </div>
          </div>

          {showRegistration && (
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
          )}
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
            Why Join Our Community?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
            <FontAwesomeIcon icon={faBell} />
              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                Stay Updated
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                Receive notifications about new content and events
              </p>
            </div>
            <div className="p-6">
<FontAwesomeIcon icon={faUsers} />

              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                Connect
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                Join a community of Orthodox Christian supporters
              </p>
            </div>
            <div className="p-6">
            <FontAwesomeIcon icon={faPray} />
              <h4 className="text-xl font-crimson-text text-[#2c1810] mb-2">
                Spiritual Growth
              </h4>
              <p className="text-[#5c4030] font-crimson-text">
                Access exclusive spiritual content and resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;