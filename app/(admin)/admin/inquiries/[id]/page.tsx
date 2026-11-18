import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Inquiry, InquiryNote, InquiryActivity } from "@/models/Crm";
import { User } from "@/models/User";
import { serialize } from "@/lib/api-helpers";
import InquiryDetail from "@/components/admin/InquiryDetail";

export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await connectDB();
  if (!db) return <p className="text-sm text-neutral-500">Database is not connected.</p>;
  const inquiry = await Inquiry.findById(id).populate("assignedTo", "name email").lean();
  if (!inquiry) notFound();
  const [notes, activity, users] = await Promise.all([
    InquiryNote.find({ inquiry: id }).populate("author", "name").sort({ createdAt: -1 }).lean(),
    InquiryActivity.find({ inquiry: id }).populate("actor", "name").sort({ createdAt: -1 }).limit(50).lean(),
    User.find({ active: true }).select("name email").sort({ name: 1 }).lean(),
  ]);
  return (
    <div>
      <Link href="/admin/inquiries" className="text-sm font-semibold text-apus-deep">← Back to inquiries</Link>
      <div className="mt-4">
        <InquiryDetail
          inquiry={serialize(inquiry) as never}
          notes={serialize(notes) as never}
          activity={serialize(activity) as never}
          users={serialize(users) as never}
        />
      </div>
    </div>
  );
}
