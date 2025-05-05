import { useState, useCallback } from "react";

interface UseModalOptions {
  defaultOpen?: boolean;
}

export function useModal({ defaultOpen = false }: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
}
