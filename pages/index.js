import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import db from '../db.json';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Link from '../src/components/Link';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';

export default function Home() {
    const router = useRouter();
    const [name, setName] = React.useState('');

    const formValidation = (event) => {
        event.preventDefault();
        router.push(`/quiz?name=${name}`);
    };

    const handlerChange = (event) => setName(event.target.value.trim());

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                <Widget
                    as={motion.section}
                    transition={{ delay: 0, duration: 0.5 }}
                    variants={{
                        show: { opacity: 1, y: '0' },
                        hidden: { opacity: 0, y: '100%' },
                    }}
                    initial="hidden"
                    animate="show">
                    <Widget.Header>
                        <h1>{db.title}</h1>
                    </Widget.Header>
                    <Widget.Content>
                        <p>{db.description}</p>
                        <form onSubmit={formValidation}>
                            <Input
                                name="username"
                                onChange={handlerChange}
                                placeholder="Diz ai seu nome"
                                value={name}
                            />
                            <Button type="submit" disabled={name.trim().length === 0}>
                                {`Jogar ${name}`}
                            </Button>
                        </form>
                    </Widget.Content>
                </Widget>

                <Widget
                    as={motion.section}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    variants={{
                        show: { opacity: 1 },
                        hidden: { opacity: 0 },
                    }}
                    initial="hidden"
                    animate="show">
                    <Widget.Content>
                        <h1>Quizes da Galera</h1>

                        {(!!db.external && db.external.length && (
                            <ul>
                                {db.external.map((externalLink, index) => {
                                    const externalLinkId = `externalLink__${index}`;
                                    const [projectName, githubUsername] = externalLink
                                        .replace(/\//g, '')
                                        .replace(/http:|https:/g, '')
                                        .replace('.vercel.app', '')
                                        .split('.');
                                    return (
                                        <li key={externalLinkId}>
                                            <Widget.Topic
                                                as={Link}
                                                href={{
                                                    pathname: `/quiz/[githubUser]/[projectName]`,
                                                    query: {
                                                        githubUser: githubUsername,
                                                        projectName,
                                                        name,
                                                    },
                                                }}
                                                disabled={name.trim().length === 0}>
                                                {`${githubUsername}/${projectName}`}
                                            </Widget.Topic>
                                        </li>
                                    );
                                })}
                            </ul>
                        )) || <p>Nenhum por enquanto!</p>}
                    </Widget.Content>
                </Widget>
                <Footer
                    as={motion.footer}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    variants={{
                        show: { opacity: 1 },
                        hidden: { opacity: 0 },
                    }}
                    initial="hidden"
                    animate="show"
                />
            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/gustavoborgesc/devquiz-base" />
        </QuizBackground>
    );
}
