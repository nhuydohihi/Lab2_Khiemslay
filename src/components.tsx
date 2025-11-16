/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';

// src/components.tsx
// Part 3.2: Component Library

// --- Card Component ---

// TODO: Create a Card component
interface CardProps extends ComponentProps {
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card = ({ title, children, className = '', onClick }: CardProps) => {
  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #f8bbd0', // Viền hồng nhạt
    borderRadius: '12px', // Bo góc lớn hơn
    boxShadow: '0 4px 12px rgba(233, 30, 99, 0.05)', // Bóng mờ hồng
    padding: '20px', // Tăng padding
    margin: '10px 0',
  };
  
  const titleStyle = {
    margin: '0 0 16px 0',
    fontSize: '1.2em',
    fontWeight: '600',
    color: '#c2185b', // Màu hồng đậm cho tiêu đề
    borderBottom: '1px solid #fce4ec', // Kẻ dưới hồng nhạt
    paddingBottom: '10px',
  };

  return (
    <div className={`card ${className}`} style={cardStyle} onClick={onClick}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// --- Modal Component ---

// TODO: Create a Modal component
interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // TODO: Return null if not open
  if (!isOpen) {
    return null;
  }

  const overlayStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    minWidth: '300px',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    zIndex: '1001',
    border: '1px solid #f8bbd0'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #fce4ec', // Kẻ dưới hồng nhạt
    paddingBottom: '10px',
    marginBottom: '15px'
  };
  
  const titleStyle = { margin: 0, fontSize: '1.5em', color: '#c2185b' }; // Màu hồng đậm
  
  const closeButtonStyle = {
    border: 'none',
    background: 'transparent',
    fontSize: '1.5em',
    cursor: 'pointer',
    padding: '0 5px',
  };

  // TODO: Handle click outside to close
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={handleOverlayClick}>
      <div className="modal-content" style={contentStyle}>
        <div className="modal-header" style={headerStyle}>
          {title && <h2 style={titleStyle}>{title}</h2>}
          <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};


// --- Form Component ---

// TODO: Create a Form component
interface FormProps extends ComponentProps {
  onSubmit: (e: Event) => void;
  className?: string;
}

const Form = ({ onSubmit, children, className = '' }: FormProps) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

// --- Input Component ---

// TODO: Create an Input component
interface InputProps {
  type?: string;
  value: string | number;
  onInput: (e: Event) => void; // Sử dụng onInput để có real-time update
  placeholder?: string;
  className?: string;
  id?: string;
}

const Input = ({ type = 'text', value, onInput, placeholder, className = '', id }: InputProps) => {
  const inputStyle = {
    width: 'calc(100% - 24px)',
    padding: '12px',
    fontSize: '1em',
    border: '1px solid #f8bbd0', // Viền hồng
    borderRadius: '8px',
    margin: '5px 0',
    backgroundColor: '#fef7fa', // Nền hồng rất nhạt
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <input
      type={type}
      value={value}
      onInput={onInput}
      placeholder={placeholder}
      className={className}
      id={id}
      style={inputStyle}
    />
  );
};

export { Card, Modal, Form, Input };