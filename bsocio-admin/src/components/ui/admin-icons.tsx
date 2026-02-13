/**
 * Shared Admin Icons
 * These icons output the EXACT same SVG code as used in admin pages
 * to avoid duplication while maintaining the same visual output
 */

import * as React from "react";

// ============================================
// ACTION ICONS (16x16)
// ============================================

export function EditIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DeleteIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6667 7.33333H3.33333C2.59695 7.33333 2 7.93029 2 8.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V8.66667C14 7.93029 13.403 7.33333 12.6667 7.33333Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.66699 7.33333V4.66667C4.66699 3.78261 5.01818 2.93477 5.64329 2.30964C6.26842 1.68452 7.11627 1.33333 8.00033 1.33333C8.88438 1.33333 9.73223 1.68452 10.3574 2.30964C10.9825 2.93477 11.3337 3.78261 11.3337 4.66667V7.33333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ViewIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.666992 8.00004C0.666992 8.00004 3.33366 2.66671 8.00033 2.66671C12.667 2.66671 15.3337 8.00004 15.3337 8.00004C15.3337 8.00004 12.667 13.3334 8.00033 13.3334C3.33366 13.3334 0.666992 8.00004 0.666992 8.00004Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.00033 10C9.10489 10 10.0003 9.10461 10.0003 8.00004C10.0003 6.89547 9.10489 6.00004 8.00033 6.00004C6.89576 6.00004 6.00033 6.89547 6.00033 8.00004C6.00033 9.10461 6.89576 10 8.00033 10Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArchiveIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 5.33333V14H2V5.33333M6.66667 8H9.33333M1.33333 2H14.6667V5.33333H1.33333V2Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ============================================
// BUTTON ICONS (20x20)
// ============================================

export function PlusIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.1667 6.66667L10 2.5L5.83333 6.66667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 2.5V12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
