import { IScoringCriteria } from "../types/types";

export const  getSelectedCriterias = (selectedProjects: string[], scoringCriterias: IScoringCriteria[], drinking_or_wastewater: String) => {
    return scoringCriterias
      .filter((criteria) => {
        return (
          criteria.project_type.data &&
          criteria.project_type.data.classification ===
            drinking_or_wastewater
        );
      })
      .map((criteria) => {
        const included = () => {
          return (
            criteria.project_type.data &&
            selectedProjects.includes(criteria.project_type.data.id.toString())
          );
        };

        return [criteria.order, criteria.label, included()];
      });
  };
