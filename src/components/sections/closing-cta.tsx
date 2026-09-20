"use client";
import { useActionState, useId, useRef, useEffect, useState } from "react";
import Link from "next/link";
import { submitQuoteRequest, type QuoteActionResult } from "@/app/actions/quote";
import { ArrowUpRight, Check, Phone, MessageCircle } from "lucide-react";

interface ClosingCTAProps {
  phoneDisplay: string; whatsappNumber: string; headline?: string; subheadline?: string;
  selectedProduct?: { id: string; name: string; slug: string };
}
const initialState: QuoteActionResult = { success: false };
const fields = [
  { name: "name", label: "Your name", type: "text", placeholder: "Contact person", required: true, autoComplete: "name", max: 100 },
  { name: "phone", label: "Phone number", type: "tel", placeholder: "+880 or local mobile number", required: true, autoComplete: "tel", max: 20 },
  { name: "company", label: "Company", type: "text", placeholder: "Company or project name", autoComplete: "organization", max: 120 },
  { name: "email", label: "Email", type: "email", placeholder: "you@company.com", autoComplete: "email", max: 254 },
  { name: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 100 panels or 50 kW", autoComplete: "off", max: 100 },
  { name: "location", label: "Delivery location", type: "text", placeholder: "City or district", autoComplete: "address-level2", max: 150 },
];

export function ClosingCTA({ phoneDisplay, whatsappNumber, selectedProduct, headline = "Let's talk about your next order.", subheadline = "Share the equipment, quantity and delivery location you have in mind. We'll discuss the details with you." }: ClosingCTAProps) {
  const [state, action, pending] = useActionState(submitQuoteRequest, initialState);
  const [phone, setPhone] = useState("");
  const prefix = useId();
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.success || state.error) resultRef.current?.focus(); }, [state]);
  const whatsapp = "https://wa.me/" + whatsappNumber.replace(/[^0-9]/g, "");
  return (
    <section id="quote-section" className="section-space">
      <div className="page-shell quote-layout">
        <div className="quote-heading">
          <p className="eyebrow">Your next step</p><h2>{headline}</h2><p>{subheadline}</p>
          <div className="quote-contact">
            <a href={"tel:" + phoneDisplay.replace(/[^+0-9]/g, "")}><Phone size={18} />{phoneDisplay}</a>
            <a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={19} />Discuss your order on WhatsApp <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="quote-card">
          {state.success ? (
            <div className="quote-success" ref={resultRef} tabIndex={-1} role="status">
              <span className="inline-flex rounded-full bg-[#CEF23E] p-4"><Check size={28} /></span>
              <h3>Request received.</h3><p>{state.message}</p>
              <a href={whatsapp + "?text=" + encodeURIComponent("Hello, I submitted a quote request on your website. My phone number is " + phone + ".")} target="_blank" rel="noreferrer" className="button button-dark">Follow up on WhatsApp <ArrowUpRight size={16} /></a>
            </div>
          ) : (
            <form action={action} aria-label="Request a quote" aria-busy={pending}>
              <div className="flex items-center justify-between gap-3 mb-6"><h3 className="text-xl font-semibold tracking-tight">Request a quote</h3><span className="text-xs text-[#5C605C]">* Required</span></div>
              {selectedProduct && <div className="quote-selected"><span>You're enquiring about</span><strong>{selectedProduct.name}</strong><Link href={"/product/" + selectedProduct.slug}>View specifications</Link><input type="hidden" name="productId" value={selectedProduct.id} /></div>}
              {state.error && <div ref={resultRef} tabIndex={-1} role="alert" className="p-4 mb-5 rounded-xl bg-red-50 text-red-800 text-sm">{state.error}</div>}
              <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="quote-fields">{fields.map(field => {
                const error = state.errors?.[field.name]?.[0];
                return <label key={field.name} className="quote-field" htmlFor={prefix + field.name}>
                  <span>{field.label}{field.required ? " *" : ""}</span>
                  <input id={prefix + field.name} name={field.name} type={field.type} required={field.required} maxLength={field.max}
                    autoComplete={field.autoComplete} placeholder={field.placeholder} aria-invalid={!!error} aria-describedby={error ? prefix + field.name + "-error" : undefined}
                    onChange={field.name === "phone" ? e => setPhone(e.target.value) : undefined} />
                  {error && <span id={prefix + field.name + "-error"} className="field-error">{error}</span>}
                </label>;
              })}</div>
              <label className="quote-field mt-5" htmlFor={prefix + "message"}><span>Equipment or project requirements</span><textarea id={prefix + "message"} name="message" rows={3} maxLength={1000} placeholder="Models, quantities, target specifications or questions…" aria-invalid={!!state.errors?.message} />{state.errors?.message && <span className="field-error">{state.errors.message[0]}</span>}</label>
              <button type="submit" disabled={pending} className="button button-lime w-full mt-6">{pending ? "Sending your request…" : "Send quote request"}<ArrowUpRight size={17} /></button>
              <p className="text-center text-xs text-[#5C605C] leading-relaxed mt-4">An enquiry only. Pricing and order terms are confirmed with you.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

