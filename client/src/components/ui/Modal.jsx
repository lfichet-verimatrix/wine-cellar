import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleMouseDown = useCallback((e) => {
    // Only drag from the header area (not from buttons inside it)
    if (e.target.closest('button')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className={styles.content}>
        <header
          className={`${styles.header} ${isDragging ? styles.dragging : ''}`}
          onMouseDown={handleMouseDown}
        >
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
