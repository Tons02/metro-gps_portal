import { LoadingButton } from "@mui/lab";
import {
  Button,
  Collapse,
  IconButton,
  Modal,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { memo } from "react";
import { useDeleteUserMutation } from "../../../api/metroApi";
import useToast from "../../../hook/useToast";
import TableAction from "../../table/TableAction";
import useDisclosure from "../../../hook/useDisclosure";
import ImageViewer from "../../table/ImageViewer";
import useQrCode from "../../../hook/useQrCode";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

const TableUsers = ({ item, columns }) => {
  // RTK QUERY
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [open, setOpen] = useState(false);

  // HOOKS
  const { isOpen, onClose, onToggle } = useDisclosure();
  const {
    isOpen: isOpenAction,
    onClose: onCloseAction,
    onToggle: onToggleAction,
  } = useDisclosure();
  const drawerDisclosure = useDisclosure();
  const { toast } = useToast();

  // FUNCTION

  const { handleDownloadQr, qr, a } = useQrCode(
    {
      username: item.username,
      password: item.password,
      first_name: `${item.first_name} ${item.last_name}`,
    },
    item.employee_id
  );

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ height: "10px" }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          if (column.id === "icon" && item?.permission?.length > 0) {
            return (
              <TableCell
                key={column.id}
                size="small"
                style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                align="center"
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            );
          }
          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
              align={column.id == "show_all_departments" ? "center" : "left"}
            >
              {column.id === "profile" && value != null ? (
                <Button onClick={onToggle}>View</Button>
              ) : column.id === "qrcode" ? (
                <>
                  {qr}
                  <Button onClick={handleDownloadQr}>{a}Download</Button>
                </>
              ) : column.id === "action" ? (
                <TableAction item={item} />
              ) : column.id === "createdAt" ? (
                value == null ? null : (
                  dayjs(value).format("MMM-DD-YYYY")
                )
              ) : column.id === "license_exp" ? (
                value == null ? null : (
                  dayjs(value).format("MMM-DD-YYYY")
                )
              ) : column.id === "department" ? (
                value?.label || value
              ) : column.id === "sub_unit" ? (
                value?.label || value
              ) : column.id === "location" ? (
                value?.label || value
              ) : column.id === "division" ? (
                value?.label || value
              ) : column.id === "division_category" ? (
                value?.label || value
              ) : column.id === "company" ? (
                value?.label || value
              ) : column.id === "show_all_departments" ? (
                <Box>{value === false ? "No" : "Yes"}</Box>
              ) : column.id === "username" ? (
                <Box sx={{ textTransform: "none" }}>{value}</Box>
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Permision
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.permission?.map((item, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{item.label}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={isOpen || isOpenAction} onClose={onClose}>
        <Box className="table__modal">
          {isOpen ? (
            <ImageViewer
              onClose={onClose}
              img={`${process.env.BASEURL}/${item.profile}`}
            />
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6">
                {` Are you sure you want to delete the " ${item.first_name} " record ? This action cannot be undone.`}
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button onClick={onCloseAction} color="customDanger">
                  Cancel
                </Button>
                <LoadingButton
                  onClick={() => {
                    deleteUser(item._id);
                    onCloseAction();
                    toast({
                      severity: "success",
                      message: `Success deleting user  ${item.first_name}`,
                    });
                  }}
                  variant="contained"
                  color="customDanger"
                  loading={isLoading}
                >
                  Delete
                </LoadingButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default memo(TableUsers);
