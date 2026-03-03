import { STATUS_STEPS } from "../constants/constants";

export const getStatusIndex = (status) => {
    const index = STATUS_STEPS.findIndex(s => s.statusKey === status);
    return index !== -1 ? index : 0;
};