import { Mail } from 'lucide-react';
import Section from './components/Section';
import SubSection from './components/SubSection';
import List from './components/List';
import Header from '@/components/Header';


const DeleteAccount = () => {
  return (
    <>
        <Header />
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Delete Account & Data Request</h1>
            <p className="text-gray-600">
                <strong>App name:</strong> RMB Deals Mobile
            </p>
            <p className="text-gray-600">
                <strong>Developer:</strong> Clixma Supply Chain Ltd
            </p>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Intro */}
            <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
                We respect your privacy and your right to control your personal data. This page explains how users of
                <strong> RMB Deals Mobile</strong> can request deletion of their account and associated data.
            </p>
            </div>

            <hr className="my-8" />

            {/* How to Request Account Deletion */}
            <Section title="How to Request Account Deletion">
            <p className="mb-6">
                Users can request account deletion using <strong>any one</strong> of the following methods:
            </p>

            <SubSection title="Option 1: In‑App Request (Recommended)">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Open the <strong>RMB Deals Mobile</strong> app</li>
                <li>Go to <strong>Profile → Settings → Delete Account</strong></li>
                <li>Confirm your request</li>
                </ol>
            </SubSection>

            <SubSection title="Option 2: Email Request">
                <p className="mb-4">Send an email from your registered email address to:</p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <a href="mailto:contact@rmbdeals.com" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
                    <Mail size={18} />
                    contact@rmbdeals.com
                </a>
                </div>
                <p className="mb-4">Use the subject line:</p>
                <div className="bg-gray-100 p-4 rounded border-l-4 border-gray-400 mb-4 text-gray-800">
                <strong>Account Deletion Request – RMB Deals Mobile</strong>
                </div>
                <p className="mb-3">Include:</p>
                <List
                items={[
                    'Your full name',
                    'Registered email or phone number',
                    'Reason for deletion (optional)',
                ]}
                />
            </SubSection>
            </Section>

            <hr className="my-8" />

            {/* What Data Is Deleted */}
            <Section title="What Data Is Deleted">
            <p className="mb-4">
                When your account deletion request is processed, the following data will be <strong>permanently deleted:</strong>
            </p>
            <List
                items={[
                'User profile information (name, email, phone number)',
                'Login credentials and authentication tokens',
                'Shipment history linked to your account',
                'Saved addresses and preferences',
                'Uploaded documents or images',
                ]}
            />
            </Section>

            <hr className="my-8" />

            {/* Data That May Be Retained */}
            <Section title="Data That May Be Retained">
            <p className="mb-4">
                Some data may be retained <strong>only where legally required</strong> or for legitimate business purposes:
            </p>
            <List
                items={[
                'Transaction records (for accounting, tax, or legal compliance)',
                'Audit logs related to fraud prevention or security',
                ]}
            />
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded">
                <p className="font-semibold text-amber-900 mb-2">This retained data is:</p>
                <ul className="list-disc list-inside space-y-2 text-amber-800">
                <li>Access‑restricted</li>
                <li>Not used for marketing</li>
                <li>Automatically deleted after the required retention period</li>
                </ul>
            </div>
            </Section>

            <hr className="my-8" />

            {/* Retention Period */}
            <Section title="Retention Period">
            <List
                items={[
                'Account deletion requests are processed within 7–14 business days',
                'Legally required records may be retained for up to 6 years, after which they are permanently deleted',
                ]}
            />
            </Section>

            <hr className="my-8" />

            {/* Confirmation */}
            <Section title="Confirmation">
            <p className="mb-4">Once your deletion request is completed, you will receive a confirmation email. After deletion:</p>
            <List
                items={[
                'Your account cannot be recovered',
                'You will no longer be able to access the app using the deleted account',
                ]}
            />
            </Section>

            <hr className="my-8" />

            {/* Contact Us */}
            <Section title="Contact Us">
            <p className="mb-4">If you have questions about data deletion or privacy, contact us at:</p>
            <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <a
                href="mailto:contact@rmbdeals.com"
                className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                contact@rmbdeals.com
                </a>
            </div>
            </Section>

        

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
            <p>Last updated: January 2026</p>
            </div>
        </div>
        </div>
    </>
  );
};

export default DeleteAccount;
