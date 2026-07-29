import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import IContact, {
  DirectoryContextProvider,
  IApplicationScore,
  IGrantApplication,
  IScoringCriteria,
} from "../types";
import { useNavigate } from "react-router-dom";
import { useGetScore, useGetScoringCriterias } from "../../helpers/API";

export const DirectoryContext = createContext<DirectoryContextProvider>({
  user: {} as IContact,
  setUser: () => {},
  applications: [],
  setApplications: () => {},
  applicationIndex: 0,
  setApplicationIndex: () => {},
  score: {
    score: 0,
    approved: false,
  },
  setScore: () => {},
});

interface ScoringCriteriasContext {
  scoringCriterias: IScoringCriteria[];
  isScoringCriteriasLoading: boolean;
}

export const ScoringCriteriasProvider = createContext<ScoringCriteriasContext>({
  scoringCriterias: [],
  isScoringCriteriasLoading: false,
});

export const useScoringCriterias = () => useContext(ScoringCriteriasProvider);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IContact>({} as IContact);
  const [applications, setApplications] = useState<IGrantApplication[]>([]);
  const [applicationIndex, setApplicationIndex] = useState<number>(0);
  const [score, setScore] = useState<IApplicationScore>({
    score: 0,
    approved: false,
  });

  const [isScoringCriteriasLoading, setIsScoringCriteriasLoading] =
    useState<boolean>(true);
  const [scoringCriterias, setScoringCriterias] = useState<IScoringCriteria[]>(
    []
  );
  const getScoringCriterias = useGetScoringCriterias();

  useEffect(() => {
    getScoringCriterias().then((data) => {
      setScoringCriterias(data);
      setIsScoringCriteriasLoading(false);
    });
  }, []);

  const navigate = useNavigate();
  const getScore = useGetScore();

  useEffect(() => {
    if (applications.length === 0) {
      navigate("/");
    }
  }, [user, applications, applicationIndex]);

  useEffect(() => {
    if (applications.length === 0) return;

    getScore(applications[applicationIndex].id as number).then((score) => {
      setScore(score);
    });
  }, [applicationIndex]);

  return (
    <DirectoryContext.Provider
      value={{
        user,
        setUser,
        applications,
        setApplications,
        applicationIndex,
        setApplicationIndex,
        score,
        setScore,
      }}
    >
      <ScoringCriteriasProvider.Provider
        value={{
          scoringCriterias: scoringCriterias as unknown as IScoringCriteria[],
          isScoringCriteriasLoading: isScoringCriteriasLoading,
        }}
      >
        {children}
      </ScoringCriteriasProvider.Provider>
    </DirectoryContext.Provider>
  );
};

export default AppContextProvider;
