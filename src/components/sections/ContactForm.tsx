// @ts-nocheck
import { useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { Field } from "@/components/primitives/Field";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { GlassCard } from "@/components/primitives/GlassCard";

const sanitize = (s) => s.replace(/<[^>]*>/g, '').trim();

export function ContactForm() {
  useLang();
  const [f, setF] = useState({ nom: "", email: "", service: "Import & Logistique", msg: "" });
  const [honey, setHoney] = useState("");
  const [isSending, setIsSending] = useState(false);

  const send = () => {
    if (isSending) return;
    if (honey) return;
    if (!f.nom || !f.email || !f.msg) {
      alert(t("form_required"));
      return;
    }
    setIsSending(true);
    const txt = `Bonjour Easy China,\n\nNom: ${sanitize(f.nom)}\nEmail: ${sanitize(f.email)}\nService concerné: ${f.service}\n\nMessage:\n${sanitize(f.msg)}`;
    window.open(waLink(WA_COMMERCIAL, txt));
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <GlassCard style={{ padding: "2.5rem", width: "100%", border: `1.5px solid var(--border)` }}>
      <input type="text" value={honey} onChange={e => setHoney(e.target.value)}
        style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      <Field label={t("form_name")} value={f.nom} onChange={v => setF(p => ({ ...p, nom: v }))} placeholder={t("form_ph_name")} />
      <Field label={t("form_email")} type="email" value={f.email} onChange={v => setF(p => ({ ...p, email: v }))} placeholder={t("form_ph_email")} />
      <Field label={t("form_service")} value={f.service} onChange={v => setF(p => ({ ...p, service: v }))}
        options={["Import & Logistique", "Université & Études", "Formation Professionnelle", "Assistance Visa", "Tourisme & Business"]} />
      <Field label={t("form_msg")} value={f.msg} onChange={v => setF(p => ({ ...p, msg: v }))} placeholder={t("form_ph_msg")} rows={4} />
      <GoldenBtn variant="solid" onClick={send} disabled={isSending} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
        {isSending ? <Clock size={18} style={{marginRight: 8}}/> : <MessageCircle size={18} style={{marginRight: 8}}/>}
        {isSending ? t("form_sending") : t("form_btn")}
      </GoldenBtn>
    </GlassCard>
  );
}
