interface FAQSectionProps { items: Array<{ id?: string; question: string; answer: string }> }
export function FAQSection({ items }: FAQSectionProps) {
  if (!items.length) return null;
  return <section id="faq" className="section-space"><div className="page-shell faq-layout">
    <div className="faq-heading"><p className="eyebrow">Before you enquire</p><h2>A few useful answers.</h2><p className="mt-5 text-sm text-[#5C605C] leading-relaxed">Planning a purchase? Start here, or ask us about your specific requirements.</p></div>
    <div className="faq-list">{items.map((item, i) => <details key={item.id || i} name="procurement-faq"><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
  </div></section>;
}

