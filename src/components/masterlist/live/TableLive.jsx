import {
  Box,
  Button,
  Collapse,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { theme } from "../../../theme";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useDisclosure from "../../../hook/useDisclosure";
import dayjs from "dayjs";
import { getPathLength } from "geolib";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import TableAction from "../../table/TableAction";
import ImageViewer from "../../table/ImageViewer";

const TableLive = ({ item, columns }) => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    isOpen: isOpenAction,
    onClose: onCloseAction,
    onToggle: onToggleAction,
  } = useDisclosure();
  const {
    isOpen: isOpenDoneOdo,
    onClose: onCloseDoneOdo,
    onToggle: onToggleDoneOdo,
  } = useDisclosure();

  const { isOpen, onClose, onToggle } = useDisclosure();

  //   COMPUTE DURATION
  const newLocations = item.locations.filter(
    (location) => location.status == "left" || location.status == "arrived"
  );

  const startDate = dayjs(newLocations[0]?.date);
  const endDate = dayjs(newLocations[newLocations.length - 1]?.date);
  const duration = endDate.diff(startDate);
  const totalMinutes = Math.floor(duration / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const leftTime = 480 - totalMinutes;
  const leftHours = Math.floor(leftTime / 60);
  const leftMinutes = leftTime % 60;
  const leftHour = `${leftHours.toFixed(0)}.${
    leftMinutes == 0 ? "00" : leftMinutes
  }`;

  const totalKm = item?.odometer_done - item?.odometer;
  const estimatedTotalKm = getPathLength(item.points) / 1000;
  const km = item.points?.length > 0 && getPathLength(item.points) / 1000;
  const odo = item?.odometer;
  const estimatedOdo = odo + km;

  const estimatedOdoOver = estimatedTotalKm - totalKm > 1;

  const handleNavigate = () => {
    navigate(`/map/${item._id}/live`);
  };
  return (
    <>
      <StyledTableRow
        hover
        role="checkbox"
        tabIndex={-1}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        {columns.map((column) => {
          const value = item[column.id];
          if (column.id === "icon") {
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
                  {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
            );
          }

          return (
            <TableCell
              key={column.id}
              size="small"
              style={{ whiteSpace: "nowrap" }}
            >
              {column.id === "user_id" ? (
                <Tooltip
                  title={`NAME: ${value?.first_name} ${value?.last_name}`}
                >
                  <Box>{value?.employee_id}</Box>
                </Tooltip>
              ) : column.id === "vehicle_id" ? (
                value?.plate_no
              ) : column.id === "points" ? null : column.id === "createdAt" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY  h:mm a")
              ) : column.id === "trip_date" ? (
                value !== null && dayjs(value).format("MMM-DD-YYYY h:mm a")
              ) : column.id === "odometer_image_path" && value != null ? (
                <Button onClick={onToggle}>View</Button>
              ) : column.id === "odometer_done_image_path" && value != null ? (
                <Button onClick={onToggleDoneOdo}>View</Button>
              ) : column.id === "action" ? (
                <TableAction item={item} />
              ) : column.id === "others" ? (
                value !== "null" && value
              ) : column.id === "_id" ? (
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                  onClick={handleNavigate}
                >
                  {`${value.slice(20)}`}
                </Button>
              ) : column.id === "duration" ? (
                <Stack flexDirection="row">
                  {`${hours > 0 ? hours + " hours " : ""} 
              ${minutes > 0 ? minutes + " minutes " : ""}`}
                  {hours <= 0 && minutes <= 0 && "0"}
                </Stack>
              ) : column.id === "start" ? (
                dayjs(startDate).format("MMM-DD-YY hh:mm:ss a")
              ) : column.id === "end" ? (
                dayjs(endDate).format("MMM-DD-YY hh:mm:ss a")
              ) : column.id === "left_time" ? (
                <Stack flexDirection="row">
                  <Box>
                    {leftHours == 0 ? `${leftMinutes}` : `${leftHour}`}
                    &nbsp;
                  </Box>
                  <Box>
                    {leftHours >= 2 ? "hours." : leftHours == 0 ? "" : "hour."}
                    {leftMinutes > 1
                      ? "minutes"
                      : leftMinutes == 0
                      ? ""
                      : "minute"}
                  </Box>
                </Stack>
              ) : column.id === "department" ? (
                <Box>
                  {item?.user_id?.department?.label ||
                    item?.user_id?.department}
                </Box>
              ) : column.id === "estimated_odo" ? (
                <Box>{`${estimatedOdo} km`}</Box>
              ) : column.id === "estimated_total_km" ? (
                <Box
                  sx={{
                    color: estimatedOdoOver && theme.palette.custom.danger,
                    textAlign: "center",
                  }}
                >
                  {Math.round(estimatedTotalKm)?.toLocaleString()}
                </Box>
              ) : column.id === "total_km" ? (
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Math.round(totalKm)?.toLocaleString()}
                </Box>
              ) : (
                value
              )}
            </TableCell>
          );
        })}
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                fontWeight={"bold"}
              >
                Locations
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.locations?.map((loc, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell
                          sx={{
                            minWidth: "90px",
                            color:
                              loc.status === "left"
                                ? theme.palette.custom.danger
                                : loc.status === "arrived"
                                ? theme.palette.custom.success
                                : theme.palette.customBlue.main,
                            textTransform: "capitalize",
                          }}
                        >
                          {loc.status}
                        </TableCell>

                        <TableCell>{loc?.destination}</TableCell>

                        <TableCell sx={{ maxWidth: "200px" }}>
                          {`${loc?.address[0]?.name || "(No Name)"}  ${
                            loc?.address[0]?.district || "(No District)"
                          } ${loc?.address[0]?.city || "(No City)"}  ${
                            loc?.address[0]?.subregion || "(No Subregion)"
                          }`}
                        </TableCell>

                        <TableCell>
                          {dayjs(loc?.date).format("MMM-DD-YY h:mm a")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* DIESELS */}
              {item?.diesels?.length !== 0 && (
                <Box sx={{ marginTop: "16px" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    fontWeight={"bold"}
                  >
                    Diesels
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {item?.diesels?.map((loc, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell direction="row" gap={1}>
                              <Box
                                sx={{ minWidth: "140px" }}
                              >{`Gas Station: ${loc?.gas_station_name} `}</Box>
                              <Box
                                sx={{ minWidth: "100px" }}
                              >{`Odometer: ${loc?.odometer} `}</Box>
                              <Box
                                sx={{ minWidth: "60px" }}
                              >{`Liter: ${loc?.liter} `}</Box>
                              <Box>{`Amount: ${loc?.amount} `}</Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              )}
              {/* OTHERS */}
              {item?.others?.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ paddingTop: "15px" }}
                  >
                    Others
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableCell>{item?.others}</TableCell>
                    </TableBody>
                  </Table>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal
        open={isOpen || isOpenAction || isOpenDoneOdo}
        onClose={() => {
          onClose();
          onCloseDoneOdo();
        }}
      >
        <Box className="table__modal">
          {isOpen ? (
            <ImageViewer
              alt="Odometer Image"
              onClose={onClose}
              img={`${process.env.BASEURL}/${item.odometer_image_path}`}
            />
          ) : (
            isOpenDoneOdo && (
              <ImageViewer
                alt="Done Odometer Image"
                onClose={onCloseDoneOdo}
                img={`${process.env.BASEURL}/${item.odometer_done_image_path}`}
              />
            )
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TableLive;
