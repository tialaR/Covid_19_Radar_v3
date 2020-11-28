import React, { useEffect, useState, useCallback } from 'react';
import CrowdCard from '../../components/CrowdCard';
import { Container, StatesReportList } from './styles';
import SectionTitle from '../../components/SectionTitle';
import apiCrowd from '../../service/apiCrowd';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

export interface StateReportCrowd {
    state: string;
    UF: string;
    cases: number;
    death: number;
  }

const CrowdList: React.FC = () => {
    const [reportsCrowd, setReportsCrowd] = useState<Array<StateReportCrowd>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(() => {
        loadReportCrowd();
    }, []);

    const loadReportCrowd = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const response = await apiCrowd.get('/case');
            setReportsCrowd(response.data);
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }, [setReportsCrowd, setError, setLoading]);

    return(
        <Container>
            {loading && !error && <Loading />}

            {!loading && error && 
            <ErrorMessage
                errorMessage='Erro ao tentar carregar a lista dos estados.'
                onTryAgainPress={() => loadReportCrowd()}
            />
            }

            {!loading && !error &&
            <StatesReportList
                data={reportsCrowd}
                keyExtractor={stateReport => String(stateReport.state)}
                ListHeaderComponent={(
                    <SectionTitle
                      title={"Lista dos estados do crowd"}
                      sectionTitleStyles={{ marginLeft: 24 }}
                    />
                )}
                renderItem={({ item: stateReport }) => (
                    <CrowdCard 
                        uf={stateReport.UF}
                        state={stateReport.state}
                        cases={stateReport.cases}
                        deaths={stateReport.death}
                    />
                )}
            />}
        </Container>
    );
}

export default CrowdList;