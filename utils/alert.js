import toast from "react-hot-toast";

export const pushErrorAlert = msg => toast.error(msg);
export const pushSuccessAlert = msg => toast.success(msg);
