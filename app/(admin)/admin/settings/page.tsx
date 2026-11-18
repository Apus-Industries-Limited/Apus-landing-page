import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Website Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">Company details, social links, SEO defaults, homepage hero and footer. Changes update the public site immediately.</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
