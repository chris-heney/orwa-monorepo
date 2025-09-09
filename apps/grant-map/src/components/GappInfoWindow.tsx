import { useEffect, useRef } from "react";
import { useMapContext } from "../providers/MapContext";
import { formatCurrency } from "../helpers/formators";
import { getBalance, totalPaid } from "../helpers/finance";

const GappInfoWindow = () => {
  const { currentApplication, setCurrentApplication, mapRef } = useMapContext();
  const isSmall = window.innerWidth < 768;

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentApplication || !mapRef.current) return;

    // Ensure any existing popup is removed
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    const mapInstance = mapRef.current;

    // Create the HTML content with a custom arrow
    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.color = "black";
    popupContent.style.width = isSmall ? "300px" : "400px";
    popupContent.style.fontFamily = "Arial, sans-serif";
    popupContent.style.borderRadius = "8px";
    popupContent.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    popupContent.style.backgroundColor = "white";
    popupContent.style.zIndex = "1000";
    popupContent.style.pointerEvents = "none";

    //     <div class="tooltip">Hover over me
    //   <span class="tooltiptext">Tooltip text</span>
    // </div>

    popupContent.innerHTML = `
    <div style="pointer-events: auto; background-color: ${
      currentApplication.status.data.color
    }; padding: 10px; border-top-left-radius: 8px; border-top-right-radius: 8px; color: ${
      currentApplication.status.data.color === "#FFFFFF"
        ? "black"
        : "white"
    }; display: flex; justify-content: space-between; align-items: center;">
      <span 
        style="font-size: 16px; font-weight: bold; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; position: relative; curser: pointer;"
        title="${currentApplication.legal_entity_name}"
      >
        ${currentApplication.legal_entity_name}
        <span style="visibility: hidden;
          width: 120px;
          background-color: black;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          top: -30px; 
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          white-space: nowrap;">${currentApplication.legal_entity_name}</span>
      </span>
      <div style="display: flex; align-items: center;">
        <span style="font-size: 20px">${
          currentApplication.drinking_or_wastewater === "Wastewater"
            ? "💩"
            : "💧"
        }</span>
        <button style="padding: 0 8px; margin-left: 8px; background: none; border: none; color: white; cursor: pointer; font-size: 16px; pointer-events: auto;" onclick="document.dispatchEvent(new Event('popup-close'))">X</button>
      </div>
    </div>
  <div style="pointer-events: none; background: linear-gradient(to right, #3498db, #6bb9f0); display: flex; justify-content: space-around; padding: 10px 0; color: white;">
    <div style="text-align: center;">
      <div style="font-size: 14px; font-weight: bold;">Award</div>
      <div style="font-size: 14px; margin-top: 5px;">${formatCurrency(
        currentApplication.award_amount
      )}</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 14px; font-weight: bold;">Paid</div>
      <div style="font-size: 14px; margin-top: 5px;">${formatCurrency(
        totalPaid(currentApplication)
      )}</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 14px; font-weight: bold;">Balance</div>
      <div style="font-size: 14px; margin-top: 5px;">${formatCurrency(
        getBalance(currentApplication)
      )}</div>
    </div>
  </div>
  <ul style="pointer-events: none; list-style-type: none; padding: 10px; margin: 0;">
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #f7f7f7; border-radius: 4px; margin-bottom: 5px;">
      <strong>Address:</strong> <span>${
        currentApplication.physical_address_street
      }, ${currentApplication.physical_address_city}, ${
      currentApplication.physical_address_state ?? "Oklahoma"
    }, ${currentApplication.physical_address_zip}</span>
    </li>
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #ffffff; border-radius: 4px; margin-bottom: 5px;">
      <strong>County:</strong> <span>${currentApplication.county}</span>
    </li>
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #f7f7f7; border-radius: 4px; margin-bottom: 5px;">
      <strong>Population:</strong> <span>${
        currentApplication.population_served
      }</span>
    </li>
    ${
      currentApplication.status.data.name === "Change Order"
        ? `
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #ffffff; border-radius: 4px; margin-bottom: 5px;">
      <strong>Status:</strong> <span>Change Order Request</span>
    </li>
    `
        : ""
    }
    ${
      currentApplication.status.data.name === "Not Approved"
        ? `
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #f7f7f7; border-radius: 4px; margin-bottom: 5px;">
      <strong>Reason:</strong> <span>${
        currentApplication.sub_status.data
          ? currentApplication.sub_status.data.name
          : "Not Approved"
      }</span>
    </li>
    `
        : ""
    }
    ${
      currentApplication.status.data.name !== "Not Approved" &&
      currentApplication.status.data.name !== "Change Order" &&
      currentApplication.status.data.name !== "New Application"
        ? `
    <li style="display: flex; justify-content: space-between; padding: 10px; font-size: 14px; background-color: #ffffff; border-radius: 4px; margin-bottom: 5px;">
      <strong>Projects Approved:</strong>
      <div style="display: flex; flex-direction: column; text-align: right;">
        ${currentApplication.approved_projects.data.filter((project) => {
          return project.context !== "Project Status and Impact";
        })
          .map((project) => `<span>${project.name}</span>`)
          .join("")}
      </div>
    </li>
    `
        : ""
    }
  </ul>
  <div style="pointer-events: none; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white;"></div>
`;
    // Append the popup to the map container
    if (mapInstance) {
      mapInstance.getContainer().appendChild(popupContent);

      // Get the marker position and set the popup position above it
      const markerPosition = mapInstance.project([
        currentApplication.location.lng,
        currentApplication.location.lat,
      ]);
      popupContent.style.left = `${
        markerPosition.x - popupContent.offsetWidth / 2
      }px`;
      popupContent.style.top = `${
        markerPosition.y - popupContent.offsetHeight - 35
      }px`; // Higher placement, no gap

      // Update position on map move
      const updatePosition = () => {
        const markerPosition = mapInstance.project([
          currentApplication.location.lng,
          currentApplication.location.lat,
        ]);
        popupContent.style.left = `${
          markerPosition.x - popupContent.offsetWidth / 2
        }px`;
        popupContent.style.top = `${
          markerPosition.y - popupContent.offsetHeight - 35
        }px`;
      };

      mapInstance.on("move", updatePosition);
      mapInstance.on("moveend", updatePosition);

      // Cleanup
      popupRef.current = popupContent;
      const handleClose = () => {
        setCurrentApplication(null);
        popupContent.remove();
        popupRef.current = null;
      };

      document.addEventListener("popup-close", handleClose);

      return () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        mapInstance.off("move", updatePosition);
        mapInstance.off("moveend", updatePosition);
        document.removeEventListener("popup-close", handleClose);
      };
    }
  }, [currentApplication, mapRef]);

  if (!currentApplication) return null;

  return null; // No need to render anything in React
};

export default GappInfoWindow;
