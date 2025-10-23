import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import axios from "axios";
import { getOneBookQuery } from "@/lib/reaactquery/bookQuery";

export default function BookDetail() {
  const { id } = useParams();
  const containerRef = useRef(null);

  const { data, isLoading, error } = useQuery({ ...getOneBookQuery(id) });

  useEffect(() => {
    if (!data || !id) return;

    let isMounted = true;
    const renderPDF = async () => {
      try {
        GlobalWorkerOptions.workerSrc = workerSrc;

        const res = await axios.get(`/api/books/${id}/stream`, {
          responseType: "arraybuffer",
        });

        const uint8 = new Uint8Array(res.data);
        const header = new TextDecoder("ascii").decode(uint8.slice(0, 4));
        if (header !== "%PDF") throw new Error("Invalid PDF stream");

        const pdf = await getDocument({ data: uint8 }).promise;
        const container = containerRef.current;
        if (!container || !isMounted) return;

        container.innerHTML = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.3 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 16px auto";
          const ctx = canvas.getContext("2d", { alpha: false });
          await page.render({ canvasContext: ctx, viewport }).promise;
          container.appendChild(canvas);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to render PDF");
      }
    };

    renderPDF();
    return () => {
      isMounted = false;
    };
  }, [data, id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-96 mb-12 mt-5" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error) {
    toast.error("Error loading book");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher — Book Detail</h1>
      <p className="mt-4">
        Book ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        {data?.title ? `Title: ${data.title}` : "No title available"}
      </p>
      <div ref={containerRef} className="max-w-4xl mx-auto mt-6" />
      <p className="text-sm text-gray-500 mt-4">
        Viewing only. Downloading, copying, printing, and selection are
        disabled.
      </p>
    </div>
  );
}
