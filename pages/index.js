import React from 'react';
import { useRouter } from 'next/router';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';

export default function Home() {
    const router = useRouter();

    const [name, setName] = React.useState('');

    function formValidation(event) {
        event.preventDefault();

        router.push(`/quiz?name=${name}`);
    }

    function handlerChange(event) {
        setName(event.target.value.trim());
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                <Widget>
                    <Widget.Header>
                        <h1>{db.title}</h1>
                    </Widget.Header>
                    <Widget.Content>
                        <p>{db.description}</p>
                        <form onSubmit={formValidation}>
                            <input placeholder="Diz ai seu nome" onChange={handlerChange} />
                            <button type="submit" disabled={name.trim().length === 0}>
                                Jogar
                                {` ${name}`}
                            </button>
                        </form>
                    </Widget.Content>
                </Widget>

                <Widget>
                    <Widget.Content>
                        <h1>Quizes da Galera</h1>

                        <p>lorem ipsum dolor sit amet...</p>
                    </Widget.Content>
                </Widget>
                <Footer />
            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/gustavoborgesc/devquiz-base" />
        </QuizBackground>
    );
}
