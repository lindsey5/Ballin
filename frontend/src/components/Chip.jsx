import Chip from "@mui/material/Chip";
import { statusColorMap } from "../contants/contants";

export const StatusChip = ({ status }) => {
  const config = statusColorMap[status];

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: config.bg,
        color: config.textColor,
        fontWeight: 500,
        borderRadius: "4px",
        fontSize: 18
      }}
    />
  );
};