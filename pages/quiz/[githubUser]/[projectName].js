import { ThemeProvider } from 'styled-components';
import Quiz from '..';

export default function QuizDaGalera({ externalDb, username }) {
    return (
        <ThemeProvider theme={externalDb.theme}>
            <Quiz db={externalDb} username={username} />
        </ThemeProvider>
    );
}

export async function getServerSideProps(context) {
    const { githubUser, projectName, name } = context.query;

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
                theme: response.theme || {},
            };
        })
        .catch((error) => {
            console.log(error);
        });

    return {
        props: {
            externalDb,
            username: name,
        },
    };
}
