import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-neutral-light dark:bg-gray-950 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-10">
        <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">{t('terms.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('terms.lastUpdated')}</p>

        {[
          { title: '1. Acceptance of Terms', body: 'By accessing and using the Hotel Reservation System (HRS), you agree to be bound by these Terms of Service. If you do not agree, please do not use this platform.' },
          { title: '2. Use of the Platform', body: 'HRS is a hotel reservation platform exclusively for accommodations within Uzbekistan. Users must be 18 years or older to make reservations. All booking information must be accurate and complete.' },
          { title: '3. Reservations & Payments', body: 'All prices are displayed in USD by default and may be converted to UZS or RUB for display purposes. Actual charges may vary based on payment processor exchange rates. Reservations are subject to availability and hotel confirmation.' },
          { title: '4. Cancellation Policy', body: 'Cancellation policies vary per hotel. Free cancellation is offered by hotels that explicitly indicate it. Please review individual hotel policies before booking.' },
          { title: '5. Privacy & Cookies', body: 'We collect minimal personal data necessary to process your reservation. We use essential session cookies for authentication. Analytics cookies are only set with your explicit consent. See our Privacy Policy for full details.' },
          { title: '6. Limitation of Liability', body: 'HRS acts as an intermediary between guests and hotel properties. We are not liable for acts or omissions of individual hotels, including overbooking, amenity changes, or service quality.' },
          { title: '7. Changes to Terms', body: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
          { title: '8. Contact', body: 'For questions about these terms, please contact us at support@hrs.uz' },
        ].map(({ title, body }) => (
          <div key={title} className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{body}</p>
          </div>
        ))}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link to="/" className="text-secondary hover:text-primary font-medium text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
