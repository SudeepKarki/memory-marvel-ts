
"use client";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Card from "../../components/card";
import Modal from "../../components/modal";
import "./home.scss"

interface CardData {
    name: string;
    image: string;
    order: number;
    matched: boolean;
    flipped: boolean;
}

interface GameState {
    score: number;
    flips: number;
}

export default function Home(): JSX.Element {
    const initialState: GameState = {
        score: 0,
        flips: 0,
    };

    const images: Record<string, string> = {
        surf: "https://memory-marvel.vercel.app/assets/surf-ff039d28.svg",
        hotel: "https://memory-marvel.vercel.app/assets/hotel-028650fe.svg",
        plane: "https://memory-marvel.vercel.app/assets/airplane-638eed64.svg",
        bath: "https://memory-marvel.vercel.app/assets/bath-tub-fe3fc78f.svg",
        cocktail: "https://memory-marvel.vercel.app/assets/cocktail-398a7847.svg",
    };

    const initialCards = (): CardData[] =>
        Array(2)
            .fill(Object.keys(images))
            .flat()
            .map((k) => ({
                name: k,
                image: images[k],
                order: Math.random(),
                matched: false,
                flipped: false,
            }))
            .sort((a, b) => a.order - b.order);

    const [cards, setCards] = useState<CardData[]>(initialCards());
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [countdown, setCountdown] = useState<number>(60);
    const [countdownStatus, setCountDownStatus] = useState<string>("ready");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(true);

    const handleFlip = async (index: number): Promise<void> => {
        setCards(
            cards.map((card, i) => (index === i ? { ...card, flipped: true } : card))
        );
        if (!cards[index].flipped) {
            setGameState({ ...gameState, flips: gameState.flips + 1 });
        }
        setCountDownStatus("running");
    };

    useEffect(() => {
        let flipped = cards.filter((card) => card.flipped);
        let notMatched = cards.filter((card) => !card.matched).length;
        if (notMatched == 0) {
            setIsModalOpen(true);
            setCountdown(60);
            setCountDownStatus("ready");
            setSuccess(true);
        }
        if (flipped.length == 2) {
            if (flipped[0].name == flipped[1].name) {
                setCards(
                    cards.map((card) =>
                        card.flipped ? { ...card, flipped: false, matched: true } : card
                    )
                );
                setGameState({ ...gameState, score: gameState.score + 10 });
            } else {
                setTimeout(() => {
                    setCards(
                        cards.map((card) =>
                            card.flipped ? { ...card, flipped: false } : card
                        )
                    );
                }, 500);
                setGameState({ ...gameState, score: gameState.score - 5 });
            }
        }
    }, [cards]);

    useEffect(() => {
        if (countdownStatus === "running") {
            const timerId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [countdownStatus]);

    useEffect(() => {
        if (countdown === 0) {
            setCountDownStatus("done");
            setIsModalOpen(true);
            setSuccess(false);
        }
    }, [countdown]);

    const closeModal = (): void => {
        setIsModalOpen(false);
        setCountdown(60);
        setGameState({ flips: 0, score: 0 });
        setCards(initialCards());
        setCountDownStatus("ready");
    };
    return (
        <main>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <img
                    className="modal-top-img"
                    src="https://memory-marvel.vercel.app/assets/modal-icon-3ea61888.png"
                />
                { }
                <h2 className="result">
                    {success ? "You’re a Champ!" : "Next time, champ! Keep going!"}
                </h2>
                <img
                    className="star"
                    src={
                        success
                            ? "https://memory-marvel.vercel.app/assets/stars-filled-d04255a6.svg"
                            : "https://memory-marvel.vercel.app/assets/stars-empty-cca9408d.svg"
                    }
                />
                <div className="header">
                    <div className="header-card">
                        <div className="header-card-icon">
                            <img src="https://memory-marvel.vercel.app/assets/medal-351c41a3.svg" />
                        </div>
                        <div className="header-card-text">Score : {gameState.score}</div>
                    </div>
                    <div className="header-card">
                        <div className="header-card-icon">
                            <img src="https://memory-marvel.vercel.app/assets/flip-ba9e3ad1.svg" />
                        </div>
                        <div className="header-card-text">Flips : {gameState.flips}</div>
                    </div>
                </div>
            </Modal>
            <Header gameState={gameState} countdown={countdown} />
            <div className="wrapper">
                <div className="card-container">
                    {cards.map((card, i) => (
                        <Card key={i} handleFlip={() => handleFlip(i)} card={card} />
                    ))}
                </div>
            </div>
        </main>
    );
}
