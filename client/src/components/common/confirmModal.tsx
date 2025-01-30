import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

interface ConfirmModal {
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  title: string;
  message: string;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ConfirmModal: React.FC<ConfirmModal> = ({
  handleClose,
  open,
  title,
  handleSubmit,
  message,
}) => {

  return (

    <div>
      <Modal
       open
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="border-0"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          <div className="flex justify-end mt-4">
           <div className="mr-2">
           <button onClick={() => handleClose(!open)} className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200">
              Cancel
            </button>
           </div>
           <div>
           <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md border border-red-600 bg-white text-red-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(191,17,17)] transition duration-200"
            >
              Block
            </button>
           </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
