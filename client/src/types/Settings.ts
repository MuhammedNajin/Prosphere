export interface TagProps {
    caption: string;
    onRemove?: () => void;
  }
  
  export interface DropdownProps {
    label: string;
    placeholder: string;
    value?: string;
  }
  
  export interface TechStackTag {
    name: string;
  }
  
  export interface Location {
    name: string;
  }