import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Fade,
  Modal,
  Stack,
  useMediaQuery,
} from "@mui/material";

import { IAssociates } from "./AssociatesInterface";
import { Theme } from "@mui/material/styles";
import { usePDF, Resolution, Margin } from "react-to-pdf";
import { useSwipeable } from "react-swipeable";
import { swipeableConfig } from "../helpers/utilities";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsIcon from "@mui/icons-material/Directions";
import LinkIcon from "@mui/icons-material/Link";

interface AssociateShowProps {
  associate: IAssociates;
  closeCard: () => void;
  startingIndex: number;
  associates: IAssociates[];
}

const AssociateShow: React.FC<AssociateShowProps> = ({
  associate,
  closeCard,
  startingIndex,
  associates,
}) => {
  const [currentAssociate, setCurrentAssociate] = useState(associate);
  const { toPDF, targetRef } = usePDF({
    filename: `${currentAssociate.name}.pdf`,
    resolution: Resolution.HIGH,
    page: { margin: Margin.LARGE },
  });
  const [open, setOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(startingIndex);

  const swipableHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Next Associate
      console.log("User Swiped!", eventData);
      if (currentIndex !== associates.length - 1) {
        nextAssociate();
      }
    },
    onSwipedRight: (eventData) => {
      // Previous Associate
      console.log("User Swiped!", eventData);
      if (currentIndex !== 0) {
        previousAssociate();
      }
    },
    ...swipeableConfig,
  });

  const handleClose = () => {
    setOpen(false);
    closeCard();
  };

  const nextAssociate = () => {
    if (associates[currentIndex + 1]) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setCurrentAssociate(associates[currentIndex + 1]);
    }
  };

  const previousAssociate = () => {
    if (associates[currentIndex - 1]) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setCurrentAssociate(associates[currentIndex - 1]);
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${currentAssociate.phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${currentAssociate.email}`;
  };

  const handleMapClick = () => {
    // Assuming you want to open Google Maps with the address
    window.open(
      `https://www.google.com/maps?q=${currentAssociate.address_street}`
    );
  };

  const handleWebsiteClick = () => {
    window.open(`https://${currentAssociate.website}`);
  };
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const primaryAddress =
    `${currentAssociate.address_street}, ${currentAssociate.address_city}, ${currentAssociate.address_state} ${currentAssociate.address_zip}`.includes(
      "null"
    )
      ? null
      : `${currentAssociate.address_street}, ${currentAssociate.address_city}, ${currentAssociate.address_state} ${currentAssociate.address_zip}`;

  const secondaryAddress =
    `${currentAssociate.mailing_address_street}, ${currentAssociate.mailing_address_city}, ${currentAssociate.mailing_address_state} ${currentAssociate.mailing_address_zip}`.includes(
      "null"
    )
      ? null
      : `${currentAssociate.mailing_address_street}, ${currentAssociate.mailing_address_city}, ${currentAssociate.mailing_address_state} ${currentAssociate.mailing_address_zip}`;
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      {...swipableHandlers}
      className="flex items-center justify-center"
    >
      <Fade in={open}>
        <Card
          sx={{
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "80%", // Default width for small screens
            "@media (min-width:600px)": {
              width: "60%", // Adjust the width for medium screens
            },
            "@media (min-width:960px)": {
              width: "50%", // Adjust the width for large screens
            },
            "@media (min-width:1280px)": {
              width: "40%", // Adjust the width for extra-large screens
            },
          }}
          className="shadow-md p-4"
        >
          <div className="flex justify-between">
            <button
              className="text-sm mr-2 text-gray-500 hover:text-black"
              onClick={() => toPDF()}
            >
              <PrintIcon />
            </button>
            <button
              className="text-sm ml-2 text-gray-500 hover:text-black"
              onClick={handleClose}
            >
              <CloseIcon className="text-red-600 hover:text-red-500" />
            </button>
          </div>

          <Divider
            className="bg-gray-200"
            sx={{ height: 2, width: "100%", mt: 1 }}
          />

          {!isSmall ? (
            <div
              ref={targetRef}
              className="flex flex-col items-center text-center"
            >
              {/* LOGO */}
              <Box className="my-6">
                {currentAssociate.logo.data != null &&
                currentAssociate.logo.data[0].url !=
                  null &&
                currentAssociate.logo.data.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}${currentAssociate.logo.data[0].url}`}
                    className="mx-auto object-contain rounded"
                    style={{ width: "315px", height: "210px" }}
                    alt="Logo"
                  />
                ) : (
                  <img
                    src="https://placehold.co/315x210"
                    className="mx-auto w-full h-full object-cover rounded"
                    style={{ width: "315px", height: "210px" }}
                    alt="Logo"
                  />
                )}
              </Box>

              <Divider
                className="bg-gray-200"
                sx={{ height: 2, width: "100%", my: 1 }}
              />

              {/* ASSOCIATE NAME */}
              <Box className="text-center">
                <h2 className="text-xl font-bold">
                  {currentAssociate.name}
                </h2>
                {currentAssociate.category && (
                  <p className="italic text-gray-600">
                    {currentAssociate.category}
                  </p>
                )}
              </Box>

              {/* CONTACT INFO */}
              {currentAssociate.contact_primary.data && (
                <Box className="my-1 text-center">
                  <h3 className="font-semibold text-gray-700">
                    Primary Contact
                  </h3>
                  <p className="text-sm text-gray-600">
                    {`${currentAssociate.contact_primary.data.first} ${currentAssociate.contact_primary.data.last}`}
                  </p>
                </Box>
              )}

              {/* Mailing Address Section */}
              <Box >
                {/* Primary Address */}
                {primaryAddress && (
                  <Box my={1}  className={secondaryAddress ? "" : "text-center"}>
                    <h3 className="font-semibold text-gray-700">
                      Primary Mailing Address
                    </h3>
                    <p className="text-sm text-gray-600">{primaryAddress}</p>
                  </Box>
                )}

                {/* Secondary Address */}
                {secondaryAddress && (
                  <Box my={1} >
                    <h3 className="font-semibold text-gray-700">
                      Secondary Mailing Address
                    </h3>
                    <p className="text-sm text-gray-600">{secondaryAddress}</p>
                  </Box>
                )}
              </Box>

              <Divider className="my-2" />

              {/* Contact Methods */}
              <Box className="flex flex-wrap justify-center gap-6 py-2 text-center">
                {currentAssociate.phone && (
                  <Box>
                    <LocalPhoneIcon
                      fontSize="small"
                      className="mr-1 text-blue-500"
                    />
                    <a
                      href={`tel:${currentAssociate.phone}`}
                      className="text-blue-500 hover:underline"
                    >
                      {currentAssociate.phone}
                    </a>
                  </Box>
                )}

                {currentAssociate.email && (
                  <Box>
                    <EmailIcon
                      fontSize="small"
                      className="mr-1 text-blue-500"
                    />
                    <a
                      href={`mailto:${currentAssociate.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {currentAssociate.email}
                    </a>
                  </Box>
                )}

                {currentAssociate.website && (
                  <Box>
                    <LinkIcon fontSize="small" className="mr-1 text-blue-500" />
                    <a
                      href={`https://${currentAssociate.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {currentAssociate.website}
                    </a>
                  </Box>
                )}
              </Box>
            </div>
          ) : (
            <div
              ref={targetRef}
              className="flex flex-col items-center text-center"
            >
              <Box className="my-6">
                {currentAssociate.logo.data != null &&
                currentAssociate.logo.data[0].url !=
                  null &&
                currentAssociate.logo.data.length > 0 ? (
                  <img
                    // src={`https://data.orwa.org${currentAssociate.logo.data[0].url}`}
                    src={`${import.meta.env.VITE_API_ENDPOINT}${currentAssociate.logo.data[0].url}`}
                    className="mx-auto object-contain rounded"
                    style={{ width: "315px", height: "210px" }}
                    alt="Logo"
                  />
                ) : (
                  <img
                    src="https://placehold.co/315x210"
                    className="mx-auto w-full h-full object-cover rounded"
                    style={{ width: "315px", height: "210px" }}
                    alt="Logo"
                  />
                )}
              </Box>

              <Divider
                className="bg-gray-200"
                sx={{ height: 2, width: "100%", mb: 1 }}
              />

              <h2 className="text-lg font-bold">
                {currentAssociate.name}
              </h2>

              {/* CONTACT */}
              {currentAssociate.contact_primary.data
                 && (
                <Box className="mb-2">
                  <h2 className="text-lg">
                    Contact:{" "}
                    {currentAssociate.contact_primary.data.first !=
                    undefined
                      ? currentAssociate.contact_primary.data.first +
                        " " +
                        currentAssociate.contact_primary.data.last
                      : ""}
                  </h2>
                </Box>
              )}

              <Box className="mb-3">
                <h2 className="text-lg italic">
                  {currentAssociate.category}
                </h2>
              </Box>

              <Stack direction="row" className="my-2 w-full" useFlexGap gap={1}>
                <Button
                  className="transition-transform transform hover:scale-105"
                  onClick={handlePhoneClick}
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  <LocalPhoneIcon />
                </Button>
                <Button
                  className="transition-transform transform hover:scale-105"
                  onClick={handleEmailClick}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  <EmailIcon />
                </Button>
                <Button
                  className="transition-transform transform hover:scale-105"
                  onClick={handleMapClick}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  <DirectionsIcon />
                </Button>
                <Button
                  className="transition-transform transform hover:scale-105"
                  onClick={handleWebsiteClick}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  <LinkIcon />
                </Button>
              </Stack>
            </div>
          )}

          <Divider
            className="bg-gray-200"
            sx={{ height: 2, width: "100%", mt: 1 }}
          />

          <Box className="flex justify-between mt-4">
            {currentIndex !== 0 ? (
              <Button
                size="large"
                onClick={previousAssociate}
                className="white"
                variant="contained"
              >
                <KeyboardArrowLeftIcon />
              </Button>
            ) : (
              <span></span>
            )}
            {currentIndex !== associates.length - 1 ? (
              <Button
                size="large"
                onClick={nextAssociate}
                className="white"
                variant="contained"
              >
                <KeyboardArrowRightIcon />
              </Button>
            ) : (
              <span></span>
            )}
          </Box>
        </Card>
      </Fade>
    </Modal>
  );
};

export default AssociateShow;
