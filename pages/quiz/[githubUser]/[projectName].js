import { ThemeProvider } from 'styled-components';
import db from '../../../db.json';
import BackLinkArrow from '../../../src/components/BackLinkArrow';
import QuizBackground from '../../../src/components/QuizBackground';
import QuizContainer from '../../../src/components/QuizContainer';
import QuizLogo from '../../../src/components/QuizLogo';
import Widget from '../../../src/components/Widget';
import Quiz from '..';

export default function QuizDaGalera({ externalDb, username }) {
    if (!externalDb) {
        return (
            <ThemeProvider theme={db.theme}>
                <QuizBackground $backgroundImage={db.bg}>
                    <QuizContainer>
                        <QuizLogo />
                        <Widget>
                            <Widget.Header>
                                <BackLinkArrow href="/" />
                                Não foi possível carregar este quiz.
                            </Widget.Header>
                        </Widget>
                    </QuizContainer>
                </QuizBackground>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={externalDb.theme}>
            <Quiz db={externalDb} username={username} />
        </ThemeProvider>
    );
}

export async function getServerSideProps(context) {
    const { githubUser, projectName, name } = context.query;
    const username = typeof name === 'string' ? name : '';

    if (typeof githubUser !== 'string' || typeof projectName !== 'string') {
        return {
            props: {
                externalDb: null,
                username,
            },
        };
    }

    const externalDb = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Falha em pegar os dados');
        })
        .then((response) => {
            return {
                questions: response.questions || [],
                bg: response.bg || '',
                theme: response.theme && response.theme.colors ? response.theme : db.theme,
            };
        })
        .catch((error) => {
            console.log(error);
            return null;
        });

    return {
        props: {
            externalDb,
            username,
        },
    };
}
