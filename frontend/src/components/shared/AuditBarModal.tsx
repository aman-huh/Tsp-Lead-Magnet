"use client";

import React, { useState, useEffect } from "react";
import AuditBar from "@/components/shared/AuditBar";
import LeadFormModal from "@/components/shared/LeadFormModal";
import { AuditBarData, LeadForm as LeadFormType } from "@/types";

interface AuditBarModalProps {
  data?: AuditBarData;
  fallbackForm?: LeadFormType;
}

export default function AuditBarModal({
  data,
  fallbackForm,
}: AuditBarModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener("open-lead-modal", handleOpen);
    return () => window.removeEventListener("open-lead-modal", handleOpen);
  }, []);

  const modalFormData = data?.leadForm || fallbackForm;

  return (
    <>
      <AuditBar
        auditText={data?.auditText}
        primaryButtonText={data?.primaryButtonText}
        secondaryButtonText={data?.secondaryButtonText}
        onPrimaryClick={() => setIsModalOpen(true)}
      />
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalFormData}
      />
    </>
  );
}
