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

  // Render PDF to responsive canvas
  useEffect(() => {
    if (!data || !id) return;
    let isMounted = true;

    const renderPDF = async () => {
      try {
        GlobalWorkerOptions.workerSrc = workerSrc;

        const res = await axios.get(`/books/${id}/stream`, {
          responseType: "arraybuffer",
        });

        const uint8 = new Uint8Array(res.data);
        const header = new TextDecoder("ascii").decode(uint8.slice(0, 4));
        if (header !== "%PDF") throw new Error("Invalid PDF stream");

        const pdf = await getDocument({ data: uint8 }).promise;
        const container = containerRef.current;
        if (!container || !isMounted) return;

        container.innerHTML = "";
        const containerWidth = container.clientWidth;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 16px auto";
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";

          // Disable right-click on canvas
          canvas.oncontextmenu = (e) => e.preventDefault();

          const ctx = canvas.getContext("2d", { alpha: false });
          await page.render({ canvasContext: ctx, viewport: scaledViewport })
            .promise;
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

  // Enhanced protection layer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent all default events
    const preventEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Block right-click globally
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Block keyboard shortcuts
    const preventShortcuts = (e) => {
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode || e.which;

      // F12 (keyCode 123)
      if (keyCode === 123 || e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("Developer tools are disabled");
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("Developer tools are disabled");
        return false;
      }

      // Ctrl+Shift+S (Save As)
      if (e.ctrlKey && e.shiftKey && key === "s") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("Save is disabled");
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && key === "u") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("View source is disabled");
        return false;
      }

      // Ctrl+S (Save), Ctrl+P (Print), Ctrl+C (Copy), Ctrl+A (Select All), Ctrl+X (Cut)
      if (e.ctrlKey && ["s", "p", "c", "a", "x"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("This action is disabled");
        return false;
      }

      // PrintScreen
      if (key === "printscreen" || keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("Screenshots are disabled");
        return false;
      }

      // Mac screenshots (Cmd+Shift+3/4/5)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        toast.error("Screenshots are disabled");
        return false;
      }

      return true;
    };

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        document.body.innerHTML =
          "<h1 style='text-align:center; margin-top:50px;'>Developer tools detected. Please close to continue.</h1>";
      }
    };

    // Check periodically for DevTools
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable drag events
    container.addEventListener("dragstart", preventEvent);
    container.addEventListener("drag", preventEvent);
    container.addEventListener("drop", preventEvent);

    // Disable selection
    container.style.userSelect = "none";
    container.style.webkitUserSelect = "none";
    container.style.msUserSelect = "none";
    container.style.mozUserSelect = "none";
    container.style.webkitTouchCallout = "none";

    // Disable pointer events for copying
    container.style.pointerEvents = "auto";

    // Add event listeners - capture phase to catch before any other handlers
    document.addEventListener("contextmenu", preventContextMenu, true);
    document.addEventListener("keydown", preventShortcuts, { capture: true });
    document.addEventListener("keyup", preventShortcuts, { capture: true });
    document.addEventListener("keypress", preventShortcuts, { capture: true });
    container.addEventListener("contextmenu", preventEvent);

    // Block copy event
    document.addEventListener("copy", preventEvent, true);
    document.addEventListener("cut", preventEvent, true);

    // Prevent image dragging
    const images = container.getElementsByTagName("img");
    Array.from(images).forEach((img) => {
      img.addEventListener("dragstart", preventEvent);
    });

    // Add CSS to prevent selection
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      canvas {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      clearInterval(devToolsInterval);
      container.removeEventListener("dragstart", preventEvent);
      container.removeEventListener("drag", preventEvent);
      container.removeEventListener("drop", preventEvent);
      document.removeEventListener("contextmenu", preventContextMenu, true);
      document.removeEventListener("keydown", preventShortcuts, {
        capture: true,
      });
      document.removeEventListener("keyup", preventShortcuts, {
        capture: true,
      });
      document.removeEventListener("keypress", preventShortcuts, {
        capture: true,
      });
      container.removeEventListener("contextmenu", preventEvent);
      document.removeEventListener("copy", preventEvent, true);
      document.removeEventListener("cut", preventEvent, true);
      document.head.removeChild(style);
    };
  }, []);

  // Blur detection to warn about screenshots
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn("Window lost focus - possible screenshot attempt");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
    <div
      className="p-6"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <h1 className="text-2xl font-bold">Teacher — Book Detail</h1>
      <p className="mt-4">
        Book ID: <strong>{id}</strong>
      </p>
      <p className="mt-2 text-gray-600">
        {data?.title ? `Title: ${data.title}` : "No title available"}
      </p>
      <div
        className="relative max-w-4xl mx-auto mt-6"
        ref={containerRef}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          position: "relative",
        }}
      >
        {/* Transparent overlay to prevent interactions */}
        <div
          className="absolute inset-0 z-10"
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <p className="text-sm text-gray-500 mt-4">
        ⚠️ Protected Content: Downloading, copying, printing, screenshots, and
        developer tools are disabled.
      </p>
    </div>
  );
}
