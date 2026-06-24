"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const useUnsavedChangesWarning = (isDirty: boolean) => {
  const router = useRouter();
  const bypassRef = useRef(false);
  const pendingActionRef = useRef<null | (() => void)>(null);
  const [warningOpen, setWarningOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || bypassRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty || bypassRef.current || event.defaultPrevented) return;

      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);

      if (nextUrl.origin !== window.location.origin) return;

      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;

      if (nextHref === currentUrl) return;

      event.preventDefault();
      pendingActionRef.current = () => router.push(nextHref);
      setWarningOpen(true);
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDirty, router]);

  const requestNavigation = useCallback(
    (href: string) => {
      if (!isDirty) {
        router.push(href);
        return;
      }

      pendingActionRef.current = () => router.push(href);
      setWarningOpen(true);
    },
    [isDirty, router],
  );

  const requestAction = useCallback(
    (action: () => void) => {
      if (!isDirty) {
        action();
        return;
      }

      pendingActionRef.current = action;
      setWarningOpen(true);
    },
    [isDirty],
  );

  const cancelNavigation = useCallback(() => {
    pendingActionRef.current = null;
    setWarningOpen(false);
  }, []);

  const confirmNavigation = useCallback(() => {
    const action = pendingActionRef.current;

    pendingActionRef.current = null;
    setWarningOpen(false);
    bypassRef.current = true;

    action?.();

    window.setTimeout(() => {
      bypassRef.current = false;
    }, 0);
  }, []);

  return {
    warningOpen,
    requestNavigation,
    requestAction,
    cancelNavigation,
    confirmNavigation,
  };
};
