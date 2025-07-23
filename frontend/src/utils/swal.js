import Swal from 'sweetalert2';

export const confirmDialog = async (title, text, icon = 'warning', confirmText = 'Yes', cancelText = 'Cancel' ) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

  return result.isConfirmed === true;
};

export const successAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'success',
    title,
    text,
  });
};

export const errorAlert = async (title, text) => {
  return await Swal.fire({
    icon: 'error',
    title,
    text,
  });
};