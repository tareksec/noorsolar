import { FileText, SlidersHorizontal, CheckSquare, Truck } from "lucide-react";
import Link from "next/link";
const steps = [
  { title: "Share your requirements", desc: "Choose your equipment and tell us the quantity and delivery location.", icon: FileText },
  { title: "Confirm the details", desc: "Discuss specifications, availability and any documents your project needs.", icon: SlidersHorizontal },
  { title: "Review your quotation", desc: "Review the proposed pricing, payment terms and delivery arrangements.", icon: CheckSquare },
  { title: "Agree and arrange", desc: "Confirm the order details with the sales team before proceeding.", icon: Truck },
];
export function OrderingSteps() {
  return (
    <section className="ordering-section section-space">
      <div className="page-shell">
        <div className="section-heading"><div><p className="eyebrow">From specification to quotation</p><h2>A clearer way to buy in bulk.</h2></div><Link href="/contact#quote-section" className="text-link">Start your enquiry ↗</Link></div>
        <ol className="ordering-grid">{steps.map((step, i) => <li key={step.title}>
          <div className="step-top"><span>0{i + 1}</span><step.icon size={21} /></div>
          <h3>{step.title}</h3><p>{step.desc}</p>
        </li>)}</ol>
      </div>
    </section>
  );
}

