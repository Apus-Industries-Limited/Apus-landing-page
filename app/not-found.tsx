import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-shell px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="eyebrow !justify-center">404</p>
      <h1 className="mt-4 font-display text-5xl font-black tracking-tight sm:text-6xl">
        Page <span className="hl">not found.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-md text-neutral-600">
        The page you are looking for does not exist or has moved. Try the links below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Back to Home</Link>
        <Link href="/services" className="rounded-full border border-ink px-6 py-3 text-sm font-semibold">View Services</Link>
        <Link href="/contact" className="rounded-full border border-ink px-6 py-3 text-sm font-semibold">Contact Us</Link>
      </div>
    </section>
  );
}
