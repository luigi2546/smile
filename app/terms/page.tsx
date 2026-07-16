import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | Smile Center GH",
  description: "Terms governing Smile Center GH website use, bookings, sessions, payments, and dental services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Website agreement"
      title="Terms & Conditions"
      summary="These terms govern your use of the Smile Center GH website and online booking and payment services. Clinical treatment remains subject to professional assessment and informed consent."
      updated="16 July 2026"
    >
      <LegalSection title="1. Acceptance of these terms">
        <p>By using this website, submitting a booking, purchasing a session or package, or making an online payment, you agree to these Terms &amp; Conditions and our Privacy Policy. If you do not agree, please do not use the online services and contact us directly instead.</p>
      </LegalSection>

      <LegalSection title="2. About Smile Center GH">
        <p>Smile Center GH provides dental services in Accra, Ghana. Website and booking enquiries may be directed to <a className="font-semibold text-teal-darker underline" href="mailto:smilecentergh2@gmail.com">smilecentergh2@gmail.com</a>, <a className="font-semibold text-teal-darker underline" href="tel:+233245127775">+233 24 512 7775</a>, or WhatsApp at the same number.</p>
      </LegalSection>

      <LegalSection title="3. Website information is not a diagnosis">
        <p>Website content is general information and does not replace an examination, diagnosis, treatment plan, or emergency care from a qualified dental professional. Treatment suitability, expected results, risks, duration, and final cost may change after clinical assessment. If you have a dental emergency or severe symptoms, seek prompt professional care rather than relying on this website.</p>
      </LegalSection>

      <LegalSection title="4. Eligibility and accurate details">
        <p>You must provide complete and accurate booking, contact, and payment information. You must be legally able to enter this agreement. A parent or legal guardian must book or approve treatment for a child or another person who cannot provide valid consent.</p>
      </LegalSection>

      <LegalSection title="5. Appointments and confirmation">
        <p>An appointment is reserved after the required payment is successfully verified and the booking is recorded. We may contact you to confirm clinical details or adjust a time where operational or clinical circumstances require it. Please arrive on time and tell us promptly if you cannot attend.</p>
        <p>Submitting a booking does not guarantee that a particular treatment is clinically suitable. A dental professional may recommend a different treatment, postpone care, or decline a procedure where necessary for patient safety or professional standards.</p>
      </LegalSection>

      <LegalSection title="6. Sessions, duration, and pricing">
        <p>Each service displays a price and estimated duration per session. When you select more than one session, the treatment total is the displayed per-session price multiplied by the number of sessions selected. The booking summary shown before payment is the applicable online price snapshot for that booking.</p>
        <p>Selected sessions are recorded with your appointment. Unless expressly sold as a transferable package, sessions are for the named patient and may not be resold or transferred without our written approval. Clinical needs may affect how sessions are scheduled or delivered.</p>
      </LegalSection>

      <LegalSection title="7. Full payment and booking-fee options">
        <p>The checkout may allow you to pay the full treatment total or pay the displayed booking fee to secure the appointment. If you choose the booking-fee option, the remaining treatment balance is due at the clinic unless we agree otherwise in writing. A booking fee is not an additional charge when the full-payment option is selected.</p>
        <p>Payments are processed by Paystack and may be subject to Paystack&apos;s own terms, security checks, payment-method rules, and privacy policy. A payment is treated as completed only after successful verification.</p>
      </LegalSection>

      <LegalSection title="8. Rescheduling, cancellation, and refunds">
        <p>Please call or WhatsApp us at least 24 hours before your appointment if you need to reschedule or cancel. Timely requests may be rescheduled without a clinic rescheduling charge, subject to availability.</p>
        <p>Refund eligibility depends on the payment made, services already provided or reserved, notice given, payment-processing status, and applicable law. Approved refunds are returned through an appropriate method and may take time to appear. Nothing in these terms removes any right or remedy you have under applicable Ghanaian law.</p>
      </LegalSection>

      <LegalSection title="9. Packages and memberships">
        <p>Package or membership benefits, included sessions, validity, renewal, and price are those displayed or communicated at purchase. Benefits are subject to clinical suitability, appointment availability, and any plan-specific conditions. Used sessions and services already delivered are not reversible.</p>
      </LegalSection>

      <LegalSection title="10. Patient conduct and consent">
        <p>You agree to treat staff and other patients respectfully, follow reasonable clinic safety instructions, disclose relevant medical and dental information, and ask questions before consenting to treatment. We may refuse or stop service where conduct is abusive, unsafe, unlawful, or prevents appropriate clinical care.</p>
      </LegalSection>

      <LegalSection title="11. Acceptable website use">
        <p>You may not misuse the website, interfere with its operation, attempt unauthorised access, submit false bookings, use another person&apos;s payment method without permission, upload harmful content, scrape protected data, or use the service for unlawful or fraudulent purposes.</p>
      </LegalSection>

      <LegalSection title="12. Intellectual property">
        <p>The website, branding, text, graphics, layout, and original materials are owned by or licensed to Smile Center GH. You may view and use the site for personal booking and information purposes, but may not copy, publish, sell, or commercially exploit protected materials without permission.</p>
      </LegalSection>

      <LegalSection title="13. Availability and third-party services">
        <p>We aim to keep the website and payment flow available and accurate, but we do not guarantee uninterrupted or error-free operation. Maintenance, network issues, provider outages, or security events may affect access. Third-party services such as Paystack are governed by their own terms, and we are not responsible for matters solely within their systems or control.</p>
      </LegalSection>

      <LegalSection title="14. Responsibility and limitation">
        <p>Smile Center GH remains responsible for obligations that cannot lawfully be excluded. To the extent permitted by law, we are not responsible for indirect or consequential loss caused by website downtime, user error, unauthorised account or payment use, third-party systems, or reliance on general website information instead of professional advice.</p>
        <p>Nothing here excludes responsibility for fraud, wilful misconduct, professional duties owed during treatment, or any liability that applicable law does not permit us to limit.</p>
      </LegalSection>

      <LegalSection title="15. Privacy">
        <p>Our Privacy Policy explains how we collect and use personal, booking, payment, and clinical information. By using our services, you acknowledge that policy and the role of payment and technology providers involved in delivering the service.</p>
      </LegalSection>

      <LegalSection title="16. Ghana law and disputes">
        <p>These terms are governed by the laws of the Republic of Ghana, including applicable rules for electronic transactions, data protection, healthcare, and consumer rights. Please contact us first so we can try to resolve a concern promptly. If a dispute cannot be resolved informally, it may be submitted to a court or other competent dispute-resolution body in Ghana.</p>
      </LegalSection>

      <LegalSection title="17. Changes and severability">
        <p>We may update these terms when our services, prices, providers, or legal obligations change. The current version will be posted on this page with its updated date. If any provision is found unenforceable, the remaining provisions continue to apply.</p>
      </LegalSection>
    </LegalPage>
  );
}
