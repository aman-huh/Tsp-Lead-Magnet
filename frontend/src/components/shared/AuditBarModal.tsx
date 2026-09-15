"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AuditBar from "@/components/shared/AuditBar";
import { AuditBarData, LeadForm as LeadFormType } from "@/types";
import {
  DEFAULT_CALLBACK_FORM,
  DEFAULT_INSTANT_QUOTE_FORM,
  getFormBySlug,
} from "@/services/form";

const LeadFormModal = dynamic(() => import("@/components/shared/LeadFormModal"));
const CallbackModal = dynamic(() => import("@/components/shared/CallbackModal"));

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
  const [hasOpenedQuote, setHasOpenedQuote] = useState(false);
  const [hasOpenedCallback, setHasOpenedCallback] = useState(false);

  const [quoteForm, setQuoteForm] = useState<LeadFormType>(
    fallbackForm || DEFAULT_INSTANT_QUOTE_FORM
  );
  const [callbackForm, setCallbackForm] =
    useState<LeadFormType>(DEFAULT_CALLBACK_FORM);

  const openQuote = () => {
    setHasOpenedQuote(true);
    setQuoteModalOpen(true);
  };

  const openCallback = () => {
    setHasOpenedCallback(true);
    setCallbackModalOpen(true);
  };

  useEffect(() => {
    if (quoteModalOpen) {
      getFormBySlug("instant-quote")
        .then((form) => {
          if (form) setQuoteForm(form);
        })
        .catch(() => {});
    }
  }, [quoteModalOpen]);

  useEffect(() => {
    if (callbackModalOpen) {
      getFormBySlug("callback")
        .then((form) => {
          if (form) setCallbackForm(form);
        })
        .catch(() => {});
    }
  }, [callbackModalOpen]);

  useEffect(() => {
    const handleOpenQuote = () => openQuote();
    const handleOpenCallback = () => openCallback();

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
        onPrimaryClick={openQuote}
        onSecondaryClick={openCallback}
      />
      {hasOpenedQuote && (
        <LeadFormModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          data={quoteForm}
          source="instant_quote_modal"
        />
      )}
      {hasOpenedCallback && (
        <CallbackModal
          isOpen={callbackModalOpen}
          onClose={() => setCallbackModalOpen(false)}
          data={callbackForm}
        />
      )}
    </>
  );
}
