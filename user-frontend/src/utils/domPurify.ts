import createDOMPurify from "dompurify";

// Create a DOMPurify instance for sanitizing input
export const DOMPurify = createDOMPurify(window);
