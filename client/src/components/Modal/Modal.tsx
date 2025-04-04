import React from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
   
  } from '@/components/ui/dialog';
 

  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, className }) => {
    return (
      <Dialog  open={isOpen}  onOpenChange={onClose} >
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
           
          </DialogHeader>
          <div className="py-4">
            {children}
          </div>
          {footer && (
            <div className=" flex flex-row">
              {footer}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };
export default Modal;