import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Smile Center GH",
  description: "How Smile Center GH collects, uses, protects, and shares personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your privacy"
      title="Privacy Policy"
      summary="This policy explains how Smile Center GH handles information when you browse our website, contact us, book treatment, make a payment, or receive dental care."
      updated="16 July 2026"
    >
      <LegalSection title="1. Who we are">
        <p>Smile Center GH provides dental services in Accra, Ghana. For personal data we decide how and why to use, Smile Center GH acts as the data controller.</p>
        <p>Privacy enquiries and requests may be sent to <a className="font-semibold text-teal-darker underline" href="mailto:smilecentergh2@gmail.com">smilecentergh2@gmail.com</a> or made by calling <a className="font-semibold text-teal-darker underline" href="tel:+233245127775">+233 24 512 7775</a>.</p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <ul className="list-disc space-y-2 pl-6">
          <li>Identity and contact details, including your name, phone number, email address, date of birth, and preferred branch.</li>
          <li>Booking details, including selected treatment, appointment date and time, branch, number of sessions, notes, and booking status.</li>
          <li>Payment records, including amount, payment status, payment reference, and whether you paid in full or paid a booking fee. We do not store your complete card or mobile-money credentials.</li>
          <li>Clinical and care information you provide or that our authorised staff record, such as treatment notes, consent, shade information, follow-up details, and before-and-after photographs where applicable.</li>
          <li>Membership or package information, including the plan purchased and sessions used or remaining.</li>
          <li>Messages, enquiries, feedback, and information you send through email, phone, WhatsApp, or our website.</li>
          <li>Basic technical and security information generated when you use the website, such as device, browser, IP address, and access logs, where our hosting and security providers make this available.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How and why we use information">
        <p>We use personal data to provide requested dental and booking services, verify and record payments, manage appointments and packages, communicate confirmations and follow-ups, maintain appropriate clinical and financial records, respond to enquiries, prevent fraud, secure the platform, improve our services, and meet legal or regulatory obligations.</p>
        <p>Depending on the circumstances, processing is based on your request for services or our contract with you, your consent, our legitimate interests in safely operating the clinic, protection of vital interests, and compliance with applicable legal obligations. Where we rely on consent, you may withdraw it, although this will not affect processing already carried out lawfully.</p>
      </LegalSection>

      <LegalSection title="4. Health information and treatment photographs">
        <p>Health and clinical information is sensitive. We restrict access to authorised staff who need it for treatment, safety, administration, or legal record-keeping. Treatment photographs are collected only where appropriate consent has been confirmed. We will seek separate permission before using an identifiable patient image for advertising, testimonials, or social media.</p>
      </LegalSection>

      <LegalSection title="5. Payments and Paystack">
        <p>Online payments are processed by Paystack. When you pay, Paystack receives payment and transaction information needed to authorise, verify, prevent fraud, and settle the payment. Paystack may process or store payment data in Ghana or other countries under its own privacy terms and applicable law. Smile Center GH receives transaction status, amount, and reference information rather than your complete payment credentials.</p>
      </LegalSection>

      <LegalSection title="6. When we share information">
        <p>We may share the minimum necessary information with authorised clinic staff, dental professionals involved in your care, payment processors, database and hosting providers, communications providers, professional advisers, insurers, and public authorities where required by law or necessary to protect a person, our patients, or our legal rights.</p>
        <p>Service providers are expected to use information only for agreed services and to apply appropriate confidentiality and security safeguards. We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection title="7. International processing">
        <p>Some technology and payment providers may process information outside Ghana. Where this occurs, we take reasonable steps to use reputable providers and require safeguards appropriate to the information and applicable Ghanaian data-protection requirements.</p>
      </LegalSection>

      <LegalSection title="8. Retention">
        <p>We keep information only for as long as reasonably necessary for treatment, booking, payment, accounting, fraud prevention, dispute handling, and legal or regulatory requirements. Different records may have different retention periods. When information is no longer required, we will delete, anonymise, or securely archive it as appropriate.</p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>We use reasonable administrative, technical, and organisational safeguards designed to protect personal data against loss, misuse, unauthorised access, alteration, or disclosure. No internet service is completely secure, so please contact us promptly if you believe your information or payment reference has been compromised.</p>
      </LegalSection>

      <LegalSection title="10. Your rights">
        <p>Subject to the Data Protection Act, 2012 (Act 843) and lawful limitations, you may request access to your personal data, correction of inaccurate or incomplete information, objection to certain processing, restriction or cessation of processing in appropriate cases, withdrawal of consent, or deletion where retention is no longer legally required.</p>
        <p>We may need to verify your identity before acting on a request. You may also raise a concern with Ghana&apos;s Data Protection Commission if you believe your data-protection rights have been infringed.</p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>A parent or legal guardian should make or approve bookings and provide required consents for a child who cannot legally provide valid consent. We process a child&apos;s information only as reasonably necessary to arrange and provide appropriate care.</p>
      </LegalSection>

      <LegalSection title="12. Cookies and links">
        <p>Our website may use essential cookies or similar storage needed for secure sessions, preferences, and site operation. Third-party services and websites linked from our pages have their own privacy practices, which you should review separately.</p>
      </LegalSection>

      <LegalSection title="13. Changes to this policy">
        <p>We may update this policy when our services, providers, or legal obligations change. The latest version will be posted here with a revised date. Material changes may also be communicated through the website or appropriate contact channels.</p>
      </LegalSection>
    </LegalPage>
  );
}
