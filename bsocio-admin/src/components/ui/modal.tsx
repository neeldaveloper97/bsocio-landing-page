"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'default' | 'lg' | 'xl';
    title?: string;
    subtitle?: string;
}

export function Modal({ 
    isOpen, 
    onClose, 
    children, 
    size = 'default',
    title,
    subtitle
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClass = size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';

    const modalContent = (
        <div 
            className="modal-overlay"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div 
                ref={modalRef}
                className={`modal-dialog ${sizeClass}`}
            >
                {(title || subtitle) && (
                    <div className="modal-header">
                        <div style={{ flex: 1 }}>
                            {title && <h2 id="modal-title">{title}</h2>}
                            {subtitle && (
                                <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        <button 
                            className="modal-close" 
                            onClick={onClose}
                            aria-label="Close modal"
                            type="button"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );

    // Use portal to render modal at document body level
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
}

// For backwards compatibility with existing code
export function ModalContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`modal-body ${className}`}>
            {children}
        </div>
    );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
}
