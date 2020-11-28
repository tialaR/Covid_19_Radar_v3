import React, { useCallback, useEffect, useState } from 'react';
import ReportCard from '../../components/ReportCard';
import { parseISO, format } from 'date-fns';
import { Container, StatesReportList } from './styles';
import SectionTitle from '../../components/SectionTitle';
import api from '../../service/api';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

export interface StateReport {
    uid: number;
    uf: string;
    state: string;
    cases: number;
    deaths: number;
    suspects: number;
    refuses: number;
    datetime: string;
}

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<Array<StateReport>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = useCallback(async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await api.get('report/v1');
        setReports(response.data.data);
      } catch (err) {
          setError(true);
      }
      setLoading(false);
  }, [setReports, setError, setLoading]);

    const formatDate = useCallback((date: string) => {
        const dateISO = parseISO(date);
        const formattedDate = format(dateISO, "dd/MM/yyyy");
        const formattedHour = format(dateISO, "HH:mm");

        const formattedValues = { formattedDate, formattedHour };

        return formattedValues;
    }, []);

    return(
        <Container>
            {loading && !error && <Loading />}

            {!loading && error && 
            <ErrorMessage
                errorMessage='Erro ao tentar carregar a lista dos estados.'
                onTryAgainPress={() => loadReport()}
            />
            }

            {!loading && !error &&
            <StatesReportList
                data={reports}
                keyExtractor={stateReport => String(stateReport.uid)}
                ListHeaderComponent={(
                    <SectionTitle
                      title="Lista dos estados"
                      sectionTitleStyles={{ marginLeft: 24 }}
                    />
                )}
                renderItem={({ item: stateReport }) => (
                    <ReportCard 
                        uf={stateReport.uf}
                        state={stateReport.state}
                        cases={stateReport.cases}
                        deaths={stateReport.deaths}
                        suspects={stateReport.suspects}
                        refuses={stateReport.refuses}
                        date={formatDate(stateReport.datetime).formattedDate}
                        hour={formatDate(stateReport.datetime).formattedHour}
                    />
                )}
            />}
        </Container>
    );
}

export default Dashboard;