"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    // Focus the confirm button when modal opens
    useEffect(() => {
        if (isOpen && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.classList.add('modal-open');
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, onClose, isLoading]);

    // Close on backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    }, [onClose, isLoading]);

    const handleConfirm = useCallback(() => {
        if (!isLoading) {
            onConfirm();
        }
    }, [onConfirm, isLoading]);

    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: '#FEE2E2',
                    iconColor: '#DC2626',
                    icon: '🗑️',
                    buttonBg: '#DC2626',
                    buttonHoverBg: '#B91C1C',
                };
            case 'warning':
                return {
                    iconBg: '#FEF3C7',
                    iconColor: '#D97706',
                    icon: '⚠️',
                    buttonBg: '#D97706',
                    buttonHoverBg: '#B45309',
                };
            default:
                return {
                    iconBg: '#DBEAFE',
                    iconColor: '#2563EB',
                    icon: '❓',
                    buttonBg: '#2563EB',
                    buttonHoverBg: '#1D4ED8',
                };
        }
    };

    const styles = getVariantStyles();

    const modalContent = (
        <div
            className="confirm-modal-overlay"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '16px',
            }}
        >
            <div
                ref={modalRef}
                className="confirm-modal-container"
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    maxWidth: '420px',
                    width: '100%',
                    overflow: 'hidden',
                    animation: 'confirmModalSlideIn 0.2s ease-out',
                }}
            >
                {/* Header with icon */}
                <div
                    style={{
                        padding: '24px 24px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: styles.iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            fontSize: '24px',
                        }}
                    >
                        {styles.icon}
                    </div>
                    <h3
                        id="confirm-modal-title"
                        style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#111827',
                            margin: 0,
                            marginBottom: '8px',
                        }}
                    >
                        {title}
                    </h3>
                    <p
                        id="confirm-modal-message"
                        style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        {message}
                    </p>
                </div>

                {/* Footer with buttons */}
                <div
                    style={{
                        padding: '16px 24px 24px',
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#374151',
                            backgroundColor: 'white',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = '#F3F4F6';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'white',
                            backgroundColor: styles.buttonBg,
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = styles.buttonBg;
                        }}
                    >
                        {isLoading && (
                            <span
                                style={{
                                    width: '14px',
                                    height: '14px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'confirmModalSpin 0.6s linear infinite',
                                }}
                            />
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes confirmModalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes confirmModalSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );

    // Use portal to render modal at document body level
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }

    return null;
}
