import { useEffect, useRef } from "react";
import { useMapContext } from "../providers/MapContext";
import { formatCurrency } from "../helpers/formators";
import { getBalance, totalPaid } from "../helpers/finance";
import { stageColorForApplication } from "../helpers/stages";

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

    const stageColor = stageColorForApplication(currentApplication);

    // Create the HTML content with a custom arrow (ink-ledger styling)
    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.color = "#EAF3FA";
    popupContent.style.width = isSmall ? "300px" : "400px";
    popupContent.style.fontFamily =
      "'Barlow Semi Condensed', 'Roboto Condensed', sans-serif";
    popupContent.style.borderRadius = "14px";
    popupContent.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.45)";
    popupContent.style.backgroundColor = "#151F29";
    popupContent.style.border = "1px solid rgba(142, 176, 201, 0.2)";
    popupContent.style.zIndex = "1000";
    popupContent.style.pointerEvents = "none";
    popupContent.style.textAlign = "left";

    const detailRow = (label: string, value: string) => `
    <li style="display: flex; justify-content: space-between; gap: 12px; padding: 8px 10px; font-size: 13px; background-color: #1C2936; border-radius: 8px; margin-bottom: 5px;">
      <strong style="color: #8AA1B3; font-weight: 600;">${label}</strong> <span style="text-align: right;">${value}</span>
    </li>`;

    popupContent.innerHTML = `
    <div style="pointer-events: auto; background: linear-gradient(135deg, ${stageColor}33 0%, transparent 65%); padding: 10px 12px; border-top-left-radius: 14px; border-top-right-radius: 14px; border-bottom: 2px solid ${stageColor}; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
      <div style="overflow: hidden;">
        <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: ${stageColor};">
          ${currentApplication.status.name}
        </div>
        <span
          style="font-size: 16px; font-weight: 700; color: #EAF3FA; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; display: block;"
          title="${currentApplication.legal_entity_name}"
        >${currentApplication.legal_entity_name}</span>
      </div>
      <div style="display: flex; align-items: center; flex-shrink: 0;">
        <span style="font-size: 18px" title="${
          currentApplication.drinking_or_wastewater
        }">${
      currentApplication.drinking_or_wastewater === "Wastewater" ? "💩" : "💧"
    }</span>
        <button style="padding: 0 8px; margin-left: 6px; background: none; border: none; color: #8AA1B3; cursor: pointer; font-size: 16px; pointer-events: auto;" onclick="document.dispatchEvent(new Event('popup-close'))">✕</button>
      </div>
    </div>
  <div style="pointer-events: none; display: flex; justify-content: space-around; padding: 10px 0; border-bottom: 1px solid rgba(142, 176, 201, 0.14);">
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #F5B841;">Award</div>
      <div style="font-size: 15px; font-weight: 700; margin-top: 3px; font-variant-numeric: tabular-nums;">${formatCurrency(
        currentApplication.award_amount
      )}</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #43D18B;">Paid</div>
      <div style="font-size: 15px; font-weight: 700; margin-top: 3px; font-variant-numeric: tabular-nums;">${formatCurrency(
        totalPaid(currentApplication)
      )}</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #3FB3E4;">Balance</div>
      <div style="font-size: 15px; font-weight: 700; margin-top: 3px; font-variant-numeric: tabular-nums;">${formatCurrency(
        getBalance(currentApplication)
      )}</div>
    </div>
  </div>
  <ul style="pointer-events: none; list-style-type: none; padding: 10px; margin: 0;">
    ${detailRow(
      "Address",
      `${currentApplication.physical_address_street}, ${
        currentApplication.physical_address_city
      }, ${currentApplication.physical_address_state ?? "Oklahoma"}, ${
        currentApplication.physical_address_zip
      }`
    )}
    ${detailRow("County", currentApplication.county)}
    ${detailRow(
      "Population",
      String(currentApplication.population_served ?? "")
    )}
    ${
      currentApplication.status.name === "Change Order"
        ? detailRow("Status", "Change Order Request")
        : ""
    }
    ${
      currentApplication.status.name === "Not Approved"
        ? detailRow(
            "Reason",
            currentApplication.sub_status
              ? currentApplication.sub_status.name
              : "Not Approved"
          )
        : ""
    }
    ${
      currentApplication.status.name !== "Not Approved" &&
      currentApplication.status.name !== "Change Order" &&
      currentApplication.status.name !== "New Application"
        ? detailRow(
            "Projects Approved",
            `<div style="display: flex; flex-direction: column; text-align: right;">${(
              currentApplication.approved_projects ?? []
            )
              .filter(
                (project) => project.context !== "Project Status and Impact"
              )
              .map((project) => `<span>${project.name}</span>`)
              .join("")}</div>`
          )
        : ""
    }
  </ul>
  <div style="pointer-events: none; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #151F29;"></div>
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
