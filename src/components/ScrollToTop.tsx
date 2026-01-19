import { useLocation } from "@tanstack/react-router";
import { useLenis } from "lenis/react";
import { useEffect } from "react";

export function ScrollToTop() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const lenis = useLenis();

	useEffect(() => {
		if (lenis) {
			lenis.scrollTo(0, { immediate: true });
		} else {
			window.scrollTo(0, 0);
		}
	}, [pathname, lenis]);

	return null;
}
