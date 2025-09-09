import { useEffect, useRef } from 'react';
import IGrantApplication from '../types/IGrantApplication';
import { useMapContext } from '../providers/MapContext';
import { formatCurrency } from '../helpers/formators';

interface GappApplicationListProps {
  applications: IGrantApplication[];
  onClose: () => void;
}

const GappApplicationList = ({ applications, onClose }: GappApplicationListProps) => {
  const { setCurrentApplication, mapRef } = useMapContext();
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || !applications.length) return;

    const mapInstance = mapRef.current.getMap();

    // Get the cluster marker's position on the map
    const markerPosition = mapInstance.project([applications[0].location.lng, applications[0].location.lat]);

    // Create the list container
    const listContainer = document.createElement('div');
    listContainer.style.position = 'absolute';
    listContainer.style.color = 'black';
    listContainer.style.width = '300px';
    listContainer.style.fontFamily = 'Arial, sans-serif';
    listContainer.style.borderRadius = '8px';
    listContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    listContainer.style.backgroundColor = 'white';
    listContainer.style.zIndex = '1000';

    // Create the list content
    listContainer.innerHTML = `
    <div style="position: relative; background-color: #f7f7f7; border-radius: 8px; max-height: 400px; overflow: hidden; display: flex; flex-direction: column;">
      <div style="position: relative; padding: 10px; border-bottom: 1px solid #ccc; font-weight: bold; font-size: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Select an Application</span>
          <button style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #e74c3c; color: white; border: none; cursor: pointer;">X</button>
        </div>
      </div>
      <ul style="list-style-type: none; margin: 0; padding: 0; flex-grow: 1; overflow-y: auto;">
        ${applications
          .map(
            (app) => `
            <li style="background-color:${app.status.data.color}; padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;" data-id="${app.id}">
              <div style="font-size: 14px; font-weight: bold;">${app.legal_entity_name}</div>
              <div style="font-size: 12px; color: #666;">${formatCurrency(app.award_amount)}</div>
            </li>
          `
          )
          .join('')}
      </ul>
    </div>
    `;
    document.body.appendChild(listContainer);
    listRef.current = listContainer;

    // Position the list above the marker
    listContainer.style.left = `${markerPosition.x - listContainer.offsetWidth / 2}px`; // Center horizontally
    listContainer.style.top = `${markerPosition.y - listContainer.offsetHeight - 10}px`; // Position above marker

    // Handle clicking on an application
    listContainer.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        const appId = (li as HTMLElement).getAttribute('data-id'); // Use the 'li' element directly
        const selectedApp = applications.find((app: IGrantApplication) => app.id.toString() === appId);
        if (selectedApp) {
          setCurrentApplication(selectedApp);
          onClose(); // Close the modal when an application is selected
        }
      });
    });

    // Add hover effect
    listContainer.querySelectorAll('li').forEach((li) => {
      li.addEventListener('mouseover', () => {
        li.style.opacity = '0.75';
      });
      li.addEventListener('mouseout', () => {
        li.style.opacity = '1';
      });
    });

    // Handle close button click
    listContainer.querySelector('button')?.addEventListener('click', () => {
      onClose();
    });

    return () => {
      if (listRef.current) {
        document.body.removeChild(listRef.current);
        listRef.current = null;
      }
    };
  }, [applications, mapRef, setCurrentApplication, onClose]);

  return null; // No need to render anything in React
};

export default GappApplicationList;