import React, { useEffect, useState } from "react";
import TableWrapper from "../../../components/table/TableWrapper";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import SearchField from "../../../components/table/SearchField";
import { useForm } from "react-hook-form";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  setSearch,
  setSearchBy,
} from "../../../redux-toolkit/counter/featuresCounter";
import { useDispatch, useSelector } from "react-redux";
import {
  columns,
  dropData,
} from "../../../utility/table-columns/TripHaulingColumns";
import dayjs from "dayjs";
import useExcel from "../../../hook/useExcel";
import useDisclosure from "../../../hook/useDisclosure";
import ExportModal from "../../../components/features/ExportModal";
import { useGetAllTripsHaulingQuery } from "../../../api/metroApi";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import TableError from "../../../components/error/TableError";
import TableUI from "../../../components/table/TableUI";
import TableHauling from "../../../components/masterlist/depot/TableHauling";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchSchema } from "../../../utility/schema";
import { getPathLength } from "geolib";
import HaulingDrawer from "../../../components/masterlist/depot/HaulingDrawer";

const TripDepot = () => {
  // STATE
  const [date, setDate] = useState();
  const [obj, setObj] = useState([]);

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  // RTK QUERY
  const { data, isLoading, isError, isFetching } = useGetAllTripsHaulingQuery(
    {
      page: page,
      limit: limit,
      search: search,
      searchBy: searchBy,
      date: date,
    },
    { refetchOnMountOrArgChange: true }
  );

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "_id",
        label: "Id",
      },
      date: dayjs(),
    },
    resolver: yupResolver(searchSchema),
    mode: "onChange",
  });

  // COMPUTE ALL DURATION
  useEffect(() => {
    let users = {};

    data?.data.forEach((trip, index) => {
      const newLocations = trip?.locations.filter(
        (location) => location.status == "left" || location.status == "arrived"
      );
      let user = trip.user_id._id;
      if (!users[user]) {
        users[user] = {
          totalDuration: 0,
          user_id: user,
          department: trip?.user_id?.department,
          name: trip.user_id.first_name,
          employee_id: trip.user_id.employee_id,
        };
      }

      const startDate = dayjs(newLocations[0].date);
      const endDate = dayjs(newLocations[newLocations.length - 1].date);
      const duration = endDate.diff(startDate);
      users[user].totalDuration += duration;
    });

    setObj(Object.values(users));

    return () => {
      null;
    };
  }, [data?.data]);

  //   HOOKS
  const dispatch = useDispatch();

  const { excelExport } = useExcel();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  const handleSearch = (data) => {
    setDate(dayjs(data.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    let newReports = [];

    const newObj = await data?.data?.map((item) => {
      // const newLocations = item?.locations?.filter(
      //   (location) => location.status == "left" || location.status == "arrived"
      // );

      const newLocations = item?.locations
        ?.filter(
          (location) =>
            location.status == "left" || location.status == "arrived"
        )
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      const destination = newLocations?.map((loc, i) => {
        if (loc.status == "left") {
          return `Left → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else if (loc.status == "arrived") {
          return `Arrived → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else {
          return `Interval → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        }
      });

      let counter = 1;
      const perStatus = newLocations.map((loc, i) => {
        const title = `${loc.status.toUpperCase().at(0)}${loc.status.slice(
          1
        )} ${i % 2 === 0 ? counter : [Math.floor(i / 2) + 1]}`;
        i % 2 !== 0 && counter++;
        return {
          [title]:
            loc?.destination ||
            `${loc?.address[0]?.name || "(No Name)"}  ${
              loc?.address[0]?.district || "(No District)"
            } ${loc?.address[0]?.city || "(No City)"}  ${
              loc?.address[0]?.subregion || "(No Subregion)"
            }`,
        };
      });

      const gas = item?.diesels?.map((diesel, i) => {
        return `Gas Station: ${diesel?.gas_station_name} Odometer: ${diesel?.odometer} Liter: ${diesel?.liter} Amount: ${diesel?.amount}`;
      });

      const companion = item?.companion?.map((com, i) => {
        return `${Object.values(com)[0]}`;
      });

      const startDate = dayjs(newLocations[0].date);
      const endDate = dayjs(newLocations[newLocations.length - 1].date);
      const duration = endDate.diff(startDate);
      const totalMinutes = Math.floor(duration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const totalKm = item?.odometer_done - item?.odometer;
      const estimatedTotalKm = getPathLength(item.points) / 1000;

      newLocations.map((location, i) => {
        if (i % 2 == 0) {
          newReports.push({
            "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
            "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY  h:mm a"),
            Id: item._id.slice(20),
            User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
            Department: item?.user_id.department,
            Vehicle: item?.vehicle_id?.plate_no,
            Duration: `${
              hours > 0 && hours != 1
                ? hours + " hours"
                : hours == 1
                ? hours + " hour"
                : ""
            } ${minutes > 0 ? minutes + " minutes" : ""}${
              hours <= 0 && minutes <= 0 ? "0" : ""
            }`,
            Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
            End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
            "Estimated Total KM": Math.round(estimatedTotalKm),
            "Total KM": Math.round(totalKm),
            Odmeter: item?.odometer,
            "Odmeter Done": item?.odometer_done,
            Companion: companion.join("\n"),
            Others: item?.others !== "null" ? item?.others : "",
            Charging: item?.charging,
            Diesels: gas.join("\n"),
            "Form Destination": item?.destination,
            "Tare Weight": item?.tare_weight,
            "Net Weight": item?.net_weight,
            "Gross Weight": item?.gross_weight,
            "Item Count": item?.item_count,
            "DOA Count": item?.doa_count,
            Origin:
              i === 0
                ? "Depot"
                : newLocations[i - 1]?.destination ||
                  `${location?.address[0]?.name || "(No Name)"}  ${
                    location?.address[0]?.district || "(No District)"
                  } ${location?.address[0]?.city || "(No City)"}  ${
                    location?.address[0]?.subregion || "(No Subregion)"
                  }`,
            Destination:
              newLocations.length - 1 === i + 1
                ? "Depot"
                : newLocations[i + 1]?.destination ||
                  `${newLocations[i + 1].address[0]?.name || "(No Name)"}  ${
                    newLocations[i + 1].address[0]?.district || "(No District)"
                  } ${newLocations[i + 1].address[0]?.city || "(No City)"}  ${
                    newLocations[i + 1].address[0]?.subregion ||
                    "(No Subregion)"
                  }`,
          });
        }
      });

      // return {
      //   "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
      //   "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY  h:mm a"),
      //   Id: item._id.slice(20),
      //   User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
      //   Department: item?.user_id?.department,
      //   Vehicle: item?.vehicle_id?.plate_no,
      //   Duration: `${
      //     hours > 0 && hours != 1
      //       ? hours + " hours"
      //       : hours == 1
      //       ? hours + " hour"
      //       : ""
      //   } ${minutes > 0 ? minutes + " minutes" : ""}${
      //     hours <= 0 && minutes <= 0 ? "0" : ""
      //   }`,
      //   Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
      //   End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
      //   // Locations: destination.join("\n"),
      //   Diesels: gas.join("\n"),
      //   "Estimated Total KM": Math.round(estimatedTotalKm),
      //   "Total KM": Math.round(totalKm),
      //   Destination: item?.destination,
      //   Temperature: item?.temperature,
      //   "Tare Weight": item?.tare_weight,
      //   "Net Weight": item?.net_weight,
      //   "Gross Weight": item?.gross_weight,
      //   "Item Count": item?.item_count,
      //   "DOA Count": item?.doa_count,
      //   Odmeter: item?.odometer,
      //   "Odmeter Done": item?.odometer_done,
      //   Companion: companion.join("\n"),
      //   Others: item?.others !== "null" ? item?.others : "",
      //   Charging: item?.charging,
      //   ...Object.assign({}, ...perStatus),
      // };
    });

    const dailyDuration = obj.map((item) => {
      const totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return {
        "Employee Id": item.employee_id,
        Name: item.name,
        Department: item?.department,
        "Total Duration": `${
          hours > 0 && hours != 1
            ? hours + " hours"
            : hours == 1
            ? hours + " hour"
            : ""
        } ${minutes > 0 ? minutes + " minutes" : ""}${
          hours <= 0 && minutes <= 0 ? "0" : ""
        }`,
      };
    });

    await excelExport(newReports, "METRO-HAULING-REPORT");
    await excelExport(dailyDuration, "METRO-HAULING-USER-DURATION-REPORT");

    onCloseExport();
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }
  return (
    <Box>
      <TableWrapper sx={{ margin: "0 auto" }}>
        <Stack direction="row" className="table__header">
          <SearchField
            onSubmit={handleSubmit(handleSearch)}
            control={control}
            errors={errors}
            register={register}
            options={dropData}
            watch={watch}
            isFetching={null}
          />

          <Box>
            <Tooltip title="Refresh">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={() => {
                  dispatch(setSearch(""));
                  dispatch(setSearchBy("_id"));
                  reset();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={handleToggleExport}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        {/* TABLE  */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data.data.map((item, i) => {
            return <TableHauling key={i} item={item} columns={columns} />;
          })}
        />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />

        {/* DRAWER */}
        <HaulingDrawer />
      </TableWrapper>
    </Box>
  );
};

export default TripDepot;
