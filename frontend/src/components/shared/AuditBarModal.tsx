"use client";

import React, { useState, useEffect } from "react";
import AuditBar from "@/components/shared/AuditBar";
import LeadFormModal from "@/components/shared/LeadFormModal";
import CallbackModal from "@/components/shared/CallbackModal";
import { AuditBarData, LeadForm as LeadFormType } from "@/types";
import {
  DEFAULT_CALLBACK_FORM,
  DEFAULT_INSTANT_QUOTE_FORM,
  getFormBySlug,
} from "@/services/form";

interface AuditBarModalProps {
  data?: AuditBarData;
  fallbackForm?: LeadFormType;
}

export default function AuditBarModal({
  data,
  fallbackForm,
}: AuditBarModalProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);

  const [quoteForm, setQuoteForm] = useState<LeadFormType>(
    fallbackForm || DEFAULT_INSTANT_QUOTE_FORM
  );
  const [callbackForm, setCallbackForm] =
    useState<LeadFormType>(DEFAULT_CALLBACK_FORM);

  useEffect(() => {
    getFormBySlug("instant-quote")
      .then((form) => {
        if (form) setQuoteForm(form);
      })
      .catch(() => {});

    getFormBySlug("callback")
      .then((form) => {
        if (form) setCallbackForm(form);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleOpenQuote = () => setQuoteModalOpen(true);
    const handleOpenCallback = () => setCallbackModalOpen(true);

    window.addEventListener("open-lead-modal", handleOpenQuote);
    window.addEventListener("open-quote-modal", handleOpenQuote);
    window.addEventListener("open-callback-modal", handleOpenCallback);

    return () => {
      window.removeEventListener("open-lead-modal", handleOpenQuote);
      window.removeEventListener("open-quote-modal", handleOpenQuote);
      window.removeEventListener("open-callback-modal", handleOpenCallback);
    };
  }, []);

  return (
    <>
      <AuditBar
        auditText={data?.auditText}
        primaryButtonText={data?.primaryButtonText}
        secondaryButtonText={data?.secondaryButtonText}
        onPrimaryClick={() => setQuoteModalOpen(true)}
        onSecondaryClick={() => setCallbackModalOpen(true)}
      />
      <LeadFormModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        data={quoteForm}
        source="instant_quote_modal"
      />
      <CallbackModal
        isOpen={callbackModalOpen}
        onClose={() => setCallbackModalOpen(false)}
        data={callbackForm}
      />
    </>
  );
}
