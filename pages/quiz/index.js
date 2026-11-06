import React from 'react';
import AlternativesForm from '../../src/components/AlternativesForm';
import BackLinkArrow from '../../src/components/BackLinkArrow';
import Button from '../../src/components/Button';
import Footer from '../../src/components/Footer';
import GitHubCorner from '../../src/components/GitHubCorner';
import QuizBackground from '../../src/components/QuizBackground';
import QuizContainer from '../../src/components/QuizContainer';
import QuizLogo from '../../src/components/QuizLogo';
import Widget from '../../src/components/Widget';

function LoadingWidget() {
    return (
        <Widget>
            <Widget.Header>Carregando...</Widget.Header>

            <Widget.Content>[Desafio do Loading]</Widget.Content>
        </Widget>
    );
}

function ResultWidget({ results, username }) {
    const numberIsCorrect = results.filter((result) => result).length || 0;

    return (
        <Widget>
            <Widget.Header>
                <BackLinkArrow href="/" />
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                <p>{`${username},`}</p>
                <p>
                    {`Você acertou ${numberIsCorrect} ${
                        numberIsCorrect === 1 ? 'questão' : 'questões'
                    }, parabéns!`}
                </p>
                <ul>
                    {results.map((result, index) => {
                        const resultId = `result__${index}`;
                        return (
                            <li key={resultId}>
                                {`#${index + 1} Resultado: ${result ? 'Acertou' : 'Errou'}`}
                            </li>
                        );
                    })}
                </ul>
            </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({ question, questionIndex, totalQuestions, onSubmit, addResult }) {
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
    const [selectedAlternative, setSeletectedAlternative] = React.useState(undefined);
    const isCorrect = selectedAlternative === question.answer;
    const hasSelectedAlternative = selectedAlternative !== undefined;
    const questionId = `question__${questionIndex}`;

    const formValidation = (event) => {
        event.preventDefault();
        setIsQuestionSubmited(true);
        setTimeout(() => {
            addResult(isCorrect);
            onSubmit();
            setIsQuestionSubmited(false);
            setSeletectedAlternative(undefined);
        }, 3 * 1000);
    };

    return (
        <Widget>
            <Widget.Header>
                <BackLinkArrow href="/" />
                <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
            </Widget.Header>

            <img
                alt="Descrição"
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                }}
                src={question.image}
            />
            <Widget.Content>
                <h2>{question.title}</h2>
                <p>{question.description}</p>

                <AlternativesForm onSubmit={formValidation}>
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        const alternativeStatus =
                            isQuestionSubmited && isCorrect ? 'SUCCESS' : 'ERROR';
                        const isSelected =
                            isQuestionSubmited && selectedAlternative === alternativeIndex;
                        return (
                            <Widget.Topic
                                key={alternativeId}
                                as="label"
                                htmlFor={alternativeId}
                                data-selected={isSelected}
                                data-status={alternativeStatus}>
                                <input
                                    style={{ display: 'none' }}
                                    id={alternativeId}
                                    name={questionId}
                                    onChange={() => setSeletectedAlternative(alternativeIndex)}
                                    type="radio"
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    <Button type="submit" disabled={!hasSelectedAlternative}>
                        Confirmar
                    </Button>

                    {isQuestionSubmited &&
                        ((isCorrect && <p>Você Acertou!</p>) || (!isCorrect && <p>Você Errou!</p>))}
                </AlternativesForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
};

export default function Quiz({ db, username }) {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [results, setResults] = React.useState([]);
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const question = db.questions[currentQuestion];
    const totalQuestions = db.questions.length;

    const addResult = (result) => {
        setResults([...results, result]);
    };

    React.useEffect(() => {
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
    }, []);

    const handleSubmitQuiz = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    };

    return (
        <QuizBackground $backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && question && (
                    <QuestionWidget
                        question={question}
                        questionIndex={currentQuestion}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.QUIZ && !question && (
                    <Widget>
                        <Widget.Header>
                            <BackLinkArrow href="/" />
                            Não foi possível carregar as perguntas.
                        </Widget.Header>
                    </Widget>
                )}

                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT && (
                    <ResultWidget results={results} username={username} />
                )}
                <Footer />
            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/gustavoborgesc/devquiz-base" />
        </QuizBackground>
    );
}

function resolveOrigin(req) {
    const host = req.headers.host || 'localhost:3000';
    const forwardedProto = req.headers['x-forwarded-proto'];

    if (typeof forwardedProto === 'string' && forwardedProto.length > 0) {
        return `${forwardedProto.split(',')[0].trim()}://${host}`;
    }

    const { referer } = req.headers;
    if (typeof referer === 'string' && referer.includes('://')) {
        return `${referer.split('://')[0]}://${host}`;
    }

    return `http://${host}`;
}

export async function getServerSideProps(context) {
    const { req, query } = context;
    const url = `${resolveOrigin(req)}/api/db`;
    const { name } = query;
    const username = typeof name === 'string' ? name : '';
    const db = await fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Falha em pegar os dados');
        })
        .then((response) => {
            return { questions: response.questions || [], bg: response.bg || '' };
        })
        .catch((error) => {
            console.log(error);
            return { questions: [], bg: '' };
        });

    return {
        props: {
            db,
            username,
        },
    };
}
